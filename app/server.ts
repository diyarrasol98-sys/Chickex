/**
 * ChickeX — vertical slice v2 (Bun + bun:sqlite)
 *   Farm world (multi-species livestock) + a live livestock EXCHANGE.
 *
 * Money unit: milliclucks (mclk). 1 CLK = 1000 mclk. NEVER floats for money.
 * Invariant: SUM(all account balances) === 0 (double-entry).
 *
 * Still P1/play-coins only: no real money, no cash-out, no crypto.
 */
import { Database } from "bun:sqlite";

// ---------------- config ----------------
const PORT = Number(process.env.CHICKEX_PORT ?? 5666);
const CLK = 1000;
const DAY_MS = Number(process.env.CHICKEX_DAY_MS ?? 9000); // 1 game-day
const STARTER_GRANT = 2000 * CLK;
const FEED_COST = 2 * CLK;
const FEED_REFILL = 70;
const FULLNESS_DECAY_PER_DAY = 50;
const TRADE_FEE_BPS = 150; // 1.5% to HOUSE — the revenue line

// lifecycle (game-days), scaled per species by lifeMult
const MATURE_DAY = 3, PEAK_END = 40, DECLINE_END = 60, DEATH = 66;
const PEAK_YIELD = 1.0, FLOOR_YIELD = 0.4;

type Species = { sym: string; emoji: string; name: string; produce: string | null; yieldMult: number; lifeMult: number; };
const SPECIES: Record<string, Species> = {
  HEN:     { sym: "HEN",     emoji: "🐔", name: "Hen",     produce: "EGG",  yieldMult: 1.0, lifeMult: 1.0 },
  ROOSTER: { sym: "ROOSTER", emoji: "🐓", name: "Rooster", produce: null,   yieldMult: 0,   lifeMult: 1.1 },
  DUCK:    { sym: "DUCK",    emoji: "🦆", name: "Duck",    produce: "EGG",  yieldMult: 1.3, lifeMult: 1.1 },
  GOAT:    { sym: "GOAT",    emoji: "🐐", name: "Goat",    produce: "MILK", yieldMult: 0.8, lifeMult: 1.6 },
};
const PRODUCE: Record<string, { emoji: string; name: string }> = {
  EGG:  { emoji: "🥚", name: "Egg" },
  MILK: { emoji: "🥛", name: "Milk" },
};

// market instruments (livestock spawn/remove on farm; produce trades from inventory)
type Inst = { sym: string; emoji: string; name: string; kind: "livestock" | "produce"; base: number; vol: number };
const INSTRUMENTS: Inst[] = [
  { sym: "HEN",     emoji: "🐔", name: "Hen",     kind: "livestock", base: 120 * CLK, vol: 0.010 },
  { sym: "ROOSTER", emoji: "🐓", name: "Rooster", kind: "livestock", base: 90  * CLK, vol: 0.013 },
  { sym: "DUCK",    emoji: "🦆", name: "Duck",    kind: "livestock", base: 165 * CLK, vol: 0.012 },
  { sym: "GOAT",    emoji: "🐐", name: "Goat",    kind: "livestock", base: 430 * CLK, vol: 0.016 },
  { sym: "EGG",     emoji: "🥚", name: "Egg",     kind: "produce",   base: 4   * CLK, vol: 0.020 },
  { sym: "MILK",    emoji: "🥛", name: "Milk",    kind: "produce",   base: 9   * CLK, vol: 0.018 },
];
const INST = Object.fromEntries(INSTRUMENTS.map(i => [i.sym, i]));

const now = () => Date.now();
const clampInt = (n: number) => Math.max(1, Math.round(n));

// ---------------- db ----------------
const db = new Database(`${import.meta.dir}/chickex.db`);
db.run("PRAGMA journal_mode = WAL;");
db.run(`CREATE TABLE IF NOT EXISTS players(id TEXT PRIMARY KEY, name TEXT, created_ms INTEGER);`);
db.run(`CREATE TABLE IF NOT EXISTS accounts(id TEXT PRIMARY KEY, balance_mclk INTEGER NOT NULL DEFAULT 0);`);
db.run(`CREATE TABLE IF NOT EXISTS journal(seq INTEGER PRIMARY KEY AUTOINCREMENT, ts INTEGER, memo TEXT, legs TEXT);`);
db.run(`CREATE TABLE IF NOT EXISTS animals(id TEXT PRIMARY KEY, player_id TEXT, species TEXT, name TEXT,
  born_ms INTEGER, fullness REAL, eggs_ready REAL, alive INTEGER, last_tick_ms INTEGER);`);
db.run(`CREATE TABLE IF NOT EXISTS inventory(player_id TEXT, good TEXT, qty INTEGER, PRIMARY KEY(player_id,good));`);
db.run(`CREATE TABLE IF NOT EXISTS positions(player_id TEXT, sym TEXT, qty INTEGER, cost_mclk INTEGER, PRIMARY KEY(player_id,sym));`);
db.run(`CREATE TABLE IF NOT EXISTS orders(id TEXT PRIMARY KEY, player_id TEXT, sym TEXT, side TEXT, qty INTEGER, price_mclk INTEGER, ts INTEGER);`);

// ---------------- ledger ----------------
function ensureAccount(id: string){ db.query("INSERT OR IGNORE INTO accounts(id,balance_mclk) VALUES(?,0)").run(id); }
function balance(id: string){ const r = db.query("SELECT balance_mclk FROM accounts WHERE id=?").get(id) as any; return r?r.balance_mclk:0; }
function postTx(memo: string, legs: {account:string;delta:number}[]) {
  const sum = legs.reduce((a,l)=>a+l.delta,0);
  if (sum !== 0) throw new Error(`unbalanced tx ${memo}: ${sum}`);
  const tx = db.transaction(()=>{
    for (const l of legs){ ensureAccount(l.account); db.query("UPDATE accounts SET balance_mclk=balance_mclk+? WHERE id=?").run(l.delta,l.account); }
    db.query("INSERT INTO journal(ts,memo,legs) VALUES(?,?,?)").run(now(),memo,JSON.stringify(legs));
  });
  tx();
  const s = (db.query("SELECT COALESCE(SUM(balance_mclk),0) s FROM accounts").get() as any).s;
  if (s !== 0) throw new Error(`LEDGER BROKEN sum=${s}`);
}

// ---------------- animals / farm ----------------
let SEQ = 0;
const newId = (p: string) => `${p}_${now().toString(36)}_${(SEQ++).toString(36)}`;
const NAMES = ["Clucky","Henrietta","Nugget","Pecky","Goldie","Dotty","Margo","Beaky","Sunny","Roxy","Pip","Daisy","Coco","Olive","Biscuit"];
const rname = () => NAMES[Math.floor(Math.random()*NAMES.length)];

function spawnAnimal(playerId: string, species: string, name?: string){
  const id = newId("an");
  db.query(`INSERT INTO animals(id,player_id,species,name,born_ms,fullness,eggs_ready,alive,last_tick_ms)
            VALUES(?,?,?,?,?,?,?,1,?)`).run(id,playerId,species,name||rname(),now(),100,0,now());
  return id;
}
function lifeDays(species: string){ return DEATH * SPECIES[species].lifeMult; }
function ageDays(born: number){ return (now()-born)/DAY_MS; }
function yieldPerDay(species: string, age: number){
  const sp = SPECIES[species]; if (!sp.produce || sp.yieldMult===0) return 0;
  const m = sp.lifeMult, mat=MATURE_DAY*m, pk=PEAK_END*m, dec=DECLINE_END*m, dth=DEATH*m;
  let y;
  if (age<mat) y=0; else if (age<=pk) y=PEAK_YIELD; else if (age>=dth) y=0;
  else if (age<=dec) y=PEAK_YIELD+(FLOOR_YIELD-PEAK_YIELD)*((age-pk)/(dec-pk));
  else y=FLOOR_YIELD*(1-((age-dec)/(dth-dec)));
  return y * sp.yieldMult;
}
function tickAnimals(playerId: string){
  const list = db.query("SELECT * FROM animals WHERE player_id=? AND alive=1").all(playerId) as any[];
  for (const h of list){
    const days = (now()-h.last_tick_ms)/DAY_MS; if (days<=0) continue;
    const age = ageDays(h.born_ms);
    let eggs = h.eggs_ready, full = h.fullness;
    if (full>0) eggs += yieldPerDay(h.species, age)*days;
    full = Math.max(0, full - FULLNESS_DECAY_PER_DAY*days);
    const alive = age >= lifeDays(h.species) ? 0 : 1;
    db.query("UPDATE animals SET fullness=?, eggs_ready=?, alive=?, last_tick_ms=? WHERE id=?").run(full,eggs,alive,now(),h.id);
  }
}
function getInv(p: string, g: string){ const r=db.query("SELECT qty FROM inventory WHERE player_id=? AND good=?").get(p,g) as any; return r?r.qty:0; }
function addInv(p: string, g: string, d: number){ db.query("INSERT INTO inventory(player_id,good,qty) VALUES(?,?,?) ON CONFLICT(player_id,good) DO UPDATE SET qty=qty+?").run(p,g,d,d); }

// ---------------- positions (portfolio + P&L) ----------------
function getPos(p: string, sym: string){ const r=db.query("SELECT qty,cost_mclk FROM positions WHERE player_id=? AND sym=?").get(p,sym) as any; return r||{qty:0,cost_mclk:0}; }
function setPos(p: string, sym: string, qty: number, cost: number){
  db.query(`INSERT INTO positions(player_id,sym,qty,cost_mclk) VALUES(?,?,?,?)
            ON CONFLICT(player_id,sym) DO UPDATE SET qty=?, cost_mclk=?`).run(p,sym,qty,cost,qty,cost);
}
function reconcileLivestock(p: string){ // keep livestock position qty == live farm count
  for (const sp of Object.keys(SPECIES)){
    const real = (db.query("SELECT COUNT(*) c FROM animals WHERE player_id=? AND species=? AND alive=1").get(p,sp) as any).c;
    const pos = getPos(p,sp);
    if (pos.qty !== real){
      const newCost = pos.qty>0 ? Math.round(pos.cost_mclk * (real/pos.qty)) : 0;
      setPos(p,sp,real,real>0?newCost:0);
    }
  }
}

// ---------------- player bootstrap ----------------
function ensurePlayer(id: string, name: string){
  if (db.query("SELECT id FROM players WHERE id=?").get(id)) return;
  db.query("INSERT INTO players(id,name,created_ms) VALUES(?,?,?)").run(id,name,now());
  ensureAccount(`player:${id}`);
  postTx(`grant:${id}`, [{account:`player:${id}`,delta:STARTER_GRANT},{account:"MINT",delta:-STARTER_GRANT}]);
  spawnAnimal(id,"HEN"); spawnAnimal(id,"HEN"); spawnAnimal(id,"DUCK");
}

// ---------------- MARKET ENGINE ----------------
type MState = { fair: number; last: number; impact: number; candles: {t:number;o:number;h:number;l:number;c:number}[]; tape: {ts:number;price:number;qty:number;side:string}[]; prevDay: number; };
const M: Record<string, MState> = {};
for (const i of INSTRUMENTS) M[i.sym] = { fair: i.base, last: i.base, impact: 0, candles: [], tape: [], prevDay: i.base };
const NEWS: {ts:number;text:string;sym:string}[] = [];
const EVENTS = [
  { sym:"HEN", text:"🦠 Avian-flu scare — hens dumped", f:0.86 },
  { sym:"EGG", text:"🎉 Eid demand surge — eggs spike", f:1.22 },
  { sym:"GOAT",text:"🌧️ Drought hits pastures — goats up", f:1.15 },
  { sym:"MILK",text:"🥛 Dairy glut — milk slides", f:0.85 },
  { sym:"DUCK",text:"📈 Export deal signed — ducks rally", f:1.18 },
  { sym:"EGG", text:"🌽 Cheap feed glut — eggs soften", f:0.88 },
  { sym:"HEN", text:"🛒 Bulk buyer enters — hens bid up", f:1.14 },
  { sym:"GOAT",text:"⚖️ New tax on livestock — goats dip", f:0.9 },
];
const CANDLE_MS = 6000;
function gauss(){ let u=0,v=0; while(!u)u=Math.random(); while(!v)v=Math.random(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); }
let lastEvent = now();
function marketTick(){
  const t = now();
  // occasional news event
  if (t - lastEvent > 14000 && Math.random()<0.5){
    const e = EVENTS[Math.floor(Math.random()*EVENTS.length)];
    M[e.sym].fair *= e.f; lastEvent = t;
    NEWS.unshift({ts:t,text:e.text,sym:e.sym}); if(NEWS.length>12) NEWS.pop();
  }
  for (const i of INSTRUMENTS){
    const s = M[i.sym];
    // fair value: mean-revert to base + noise
    const revert = 0.02*(i.base - s.fair)/i.base;
    s.fair *= (1 + revert + i.vol*gauss());
    s.fair = Math.max(i.base*0.3, Math.min(i.base*3.5, s.fair));
    // last follows fair + decaying order-flow impact
    s.last = clampInt(s.last + (s.fair - s.last)*0.25 + s.impact);
    s.impact *= 0.5;
    // background tape prints (liquidity feel)
    const n = Math.floor(Math.random()*3);
    for (let k=0;k<n;k++){
      const side = Math.random()<0.5?"buy":"sell";
      const px = clampInt(s.last*(1+(Math.random()-0.5)*0.004));
      const qty = 1+Math.floor(Math.random()* (i.kind==="produce"?40:4));
      s.tape.unshift({ts:t,price:px,qty,side}); if(s.tape.length>30) s.tape.pop();
    }
    // candles (wall-clock buckets)
    const bucket = Math.floor(t/CANDLE_MS)*CANDLE_MS;
    const cur = s.candles[s.candles.length-1];
    if (!cur || cur.t !== bucket){ s.candles.push({t:bucket,o:s.last,h:s.last,l:s.last,c:s.last}); if(s.candles.length>60)s.candles.shift(); }
    else { cur.c=s.last; cur.h=Math.max(cur.h,s.last); cur.l=Math.min(cur.l,s.last); }
  }
  // fill resting limit orders that the market crossed
  const ords = db.query("SELECT * FROM orders").all() as any[];
  for (const o of ords){
    const s = M[o.sym]; if(!s) continue;
    const cross = (o.side==="buy" && s.last<=o.price_mclk) || (o.side==="sell" && s.last>=o.price_mclk);
    if (cross){ try{ settleTrade(o.player_id, o.sym, o.side, o.qty, o.price_mclk, "limit"); }catch(e){} db.query("DELETE FROM orders WHERE id=?").run(o.id); }
  }
}
setInterval(marketTick, 1500);
// snapshot a "prevDay" reference every ~45s for % change
setInterval(()=>{ for(const i of INSTRUMENTS) M[i.sym].prevDay = M[i.sym].last; }, 45000);

function bookFor(sym: string, playerId?: string){
  const s = M[sym]; const spread = Math.max(1, Math.round(s.last*0.004));
  const bids:any[]=[], asks:any[]=[];
  for (let n=1;n<=6;n++){
    bids.push({ price:s.last-spread*n, qty: 2+Math.floor(Math.random()*30) });
    asks.push({ price:s.last+spread*n, qty: 2+Math.floor(Math.random()*30) });
  }
  return {bids, asks};
}

// settle a market/limit trade — money-correct via ledger; spawn/remove farm assets
function settleTrade(playerId: string, sym: string, side: "buy"|"sell", qty: number, price_mclk: number, type: string){
  const inst = INST[sym]; if(!inst) throw new Error("bad symbol");
  qty = Math.floor(qty); if (qty<=0) throw new Error("qty must be > 0");
  const notional = price_mclk*qty;
  const fee = Math.floor(notional*TRADE_FEE_BPS/10000);
  const acct = `player:${playerId}`;
  if (side==="buy"){
    if (balance(acct) < notional+fee) throw new Error("not enough CLK");
    postTx(`buy:${sym}:${playerId}`,[{account:acct,delta:-(notional+fee)},{account:"MARKET",delta:notional},{account:"HOUSE",delta:fee}]);
    if (inst.kind==="livestock"){ for(let k=0;k<qty;k++) spawnAnimal(playerId,sym); }
    else addInv(playerId, sym, qty);
    const p=getPos(playerId,sym); setPos(playerId,sym,p.qty+qty,p.cost_mclk+notional);
    // price impact up
    M[sym].impact += Math.round(M[sym].last*0.002*qty);
  } else {
    // ensure the player actually holds it
    if (inst.kind==="livestock"){
      const live = db.query("SELECT id FROM animals WHERE player_id=? AND species=? AND alive=1 ORDER BY born_ms LIMIT ?").all(playerId,sym,qty) as any[];
      if (live.length < qty) throw new Error(`you only own ${live.length} ${sym}`);
      for (const a of live) db.query("UPDATE animals SET alive=0 WHERE id=?").run(a.id);
    } else {
      if (getInv(playerId,sym) < qty) throw new Error(`you only have ${getInv(playerId,sym)} ${sym}`);
      addInv(playerId, sym, -qty);
    }
    postTx(`sell:${sym}:${playerId}`,[{account:acct,delta:notional-fee},{account:"MARKET",delta:-notional},{account:"HOUSE",delta:fee}]);
    const p=getPos(playerId,sym); const avg = p.qty>0?p.cost_mclk/p.qty:0;
    setPos(playerId,sym, Math.max(0,p.qty-qty), Math.max(0, Math.round(p.cost_mclk-avg*qty)));
    M[sym].impact -= Math.round(M[sym].last*0.002*qty);
  }
}

// ---------------- snapshots ----------------
function farmState(playerId: string){
  tickAnimals(playerId); reconcileLivestock(playerId);
  const animals = (db.query("SELECT * FROM animals WHERE player_id=? ORDER BY born_ms").all(playerId) as any[]).map(h=>{
    const sp=SPECIES[h.species]; const age=ageDays(h.born_ms); const life=lifeDays(h.species);
    return { id:h.id, species:h.species, emoji:sp.emoji, name:h.name, alive:!!h.alive,
      ageDays:+age.toFixed(2), stage: !h.alive?"dead": age<MATURE_DAY*sp.lifeMult?"young": age<=PEAK_END*sp.lifeMult?"prime": age<=DECLINE_END*sp.lifeMult?"aging":"elder",
      fullness:Math.round(h.fullness), eggsReady:Math.floor(h.eggs_ready), produce:sp.produce,
      yieldPerDay:+yieldPerDay(h.species,age).toFixed(2), lifePct:Math.min(100,Math.round(age/life*100)) };
  });
  const inv = Object.keys(PRODUCE).map(g=>({good:g, emoji:PRODUCE[g].emoji, name:PRODUCE[g].name, qty:getInv(playerId,g)}));
  return { balanceCLK:+(balance(`player:${playerId}`)/CLK).toFixed(2), animals, inventory:inv,
           feedCostCLK:FEED_COST/CLK, config:{dayMs:DAY_MS}, ts:now() };
}
function marketList(){
  return INSTRUMENTS.map(i=>{ const s=M[i.sym]; const chg=(s.last-s.prevDay)/s.prevDay*100;
    return { sym:i.sym, emoji:i.emoji, name:i.name, kind:i.kind, last:+(s.last/CLK).toFixed(2),
             changePct:+chg.toFixed(2), spark:s.candles.slice(-24).map(c=>+(c.c/CLK).toFixed(2)) }; });
}
function marketDetail(sym: string, playerId: string){
  const s=M[sym]; const inst=INST[sym]; if(!s) throw new Error("bad symbol");
  const pos=getPos(playerId,sym); const avg = pos.qty>0?pos.cost_mclk/pos.qty:0;
  const pnl = pos.qty>0 ? (s.last-avg)*pos.qty : 0;
  const ords = db.query("SELECT id,side,qty,price_mclk FROM orders WHERE player_id=? AND sym=?").all(playerId,sym) as any[];
  return {
    sym, emoji:inst.emoji, name:inst.name, kind:inst.kind,
    last:+(s.last/CLK).toFixed(2), changePct:+((s.last-s.prevDay)/s.prevDay*100).toFixed(2),
    candles: s.candles.map(c=>({t:c.t,o:+(c.o/CLK).toFixed(2),h:+(c.h/CLK).toFixed(2),l:+(c.l/CLK).toFixed(2),c:+(c.c/CLK).toFixed(2)})),
    book: { bids: bookFor(sym).bids.map(b=>({price:+(b.price/CLK).toFixed(2),qty:b.qty})),
            asks: bookFor(sym).asks.map(a=>({price:+(a.price/CLK).toFixed(2),qty:a.qty})) },
    tape: s.tape.map(t=>({price:+(t.price/CLK).toFixed(2),qty:t.qty,side:t.side})),
    position:{ qty:pos.qty, avg:+(avg/CLK).toFixed(2), pnl:+(pnl/CLK).toFixed(2) },
    orders: ords.map(o=>({id:o.id,side:o.side,qty:o.qty,price:+(o.price_mclk/CLK).toFixed(2)})),
    feeBps: TRADE_FEE_BPS,
  };
}

// ---------------- farm actions ----------------
function feed(playerId:string, id:string){ tickAnimals(playerId);
  const h=db.query("SELECT * FROM animals WHERE id=? AND player_id=? AND alive=1").get(id,playerId) as any; if(!h) throw new Error("no live animal");
  if (balance(`player:${playerId}`)<FEED_COST) throw new Error("not enough CLK for feed");
  postTx(`feed:${id}`,[{account:`player:${playerId}`,delta:-FEED_COST},{account:"SINK",delta:FEED_COST}]);
  db.query("UPDATE animals SET fullness=? WHERE id=?").run(Math.min(100,h.fullness+FEED_REFILL),id); return `Fed ${h.name}`; }
function feedAll(playerId:string){ tickAnimals(playerId);
  const list=db.query("SELECT * FROM animals WHERE player_id=? AND alive=1 AND fullness<100").all(playerId) as any[];
  const cost=FEED_COST*list.length; if(cost===0) return "All animals already full";
  if (balance(`player:${playerId}`)<cost) throw new Error("not enough CLK to feed all");
  postTx(`feedall:${playerId}`,[{account:`player:${playerId}`,delta:-cost},{account:"SINK",delta:cost}]);
  for(const h of list) db.query("UPDATE animals SET fullness=? WHERE id=?").run(Math.min(100,h.fullness+FEED_REFILL),h.id);
  return `Fed ${list.length} animals`; }
function collectAll(playerId:string){ tickAnimals(playerId);
  const list=db.query("SELECT * FROM animals WHERE player_id=? AND alive=1 AND eggs_ready>=1").all(playerId) as any[];
  const got:Record<string,number>={};
  for(const h of list){ const sp=SPECIES[h.species]; if(!sp.produce) continue; const n=Math.floor(h.eggs_ready); if(n<=0) continue;
    db.query("UPDATE animals SET eggs_ready=eggs_ready-? WHERE id=?").run(n,h.id); addInv(playerId,sp.produce,n); got[sp.produce]=(got[sp.produce]||0)+n; }
  const parts=Object.entries(got).map(([g,n])=>`${n} ${PRODUCE[g].emoji}`); return parts.length?`Collected ${parts.join(" + ")}`:"Nothing ready yet"; }

// ---------------- http ----------------
const json=(d:any,s=200)=>new Response(JSON.stringify(d),{status:s,headers:{"content-type":"application/json"}});
const INDEX=Bun.file(`${import.meta.dir}/public/index.html`);
Bun.serve({ port:PORT, async fetch(req){
  const url=new URL(req.url); const p=url.pathname;
  try{
    if(p==="/"||p==="/index.html") return new Response(INDEX,{headers:{"content-type":"text/html; charset=utf-8"}});
    const uid=url.searchParams.get("uid")||"dev"; const name=url.searchParams.get("name")||"Farmer";
    ensurePlayer(uid,name);
    if(p==="/api/state") return json(farmState(uid));
    if(p==="/api/market") { const sym=url.searchParams.get("symbol"); return json(sym? {detail:marketDetail(sym,uid), news:NEWS}:{list:marketList(), news:NEWS}); }
    if(req.method==="POST"){
      let b:any={}; try{ b=await req.json(); }catch{}
      let msg="";
      if(p==="/api/feed") msg=feed(uid,b.id);
      else if(p==="/api/feed-all") msg=feedAll(uid);
      else if(p==="/api/collect-all") msg=collectAll(uid);
      else if(p==="/api/order"){
        const {symbol,side,type,qty,price}=b;
        if(type==="limit"){ const id=newId("ord"); db.query("INSERT INTO orders(id,player_id,sym,side,qty,price_mclk,ts) VALUES(?,?,?,?,?,?,?)").run(id,uid,symbol,side,Math.floor(qty),Math.round(price*CLK),now()); msg=`Limit ${side} ${qty} ${symbol} @ ${price} resting`; }
        else { const px=M[symbol].last; settleTrade(uid,symbol,side,qty,px,"market"); msg=`${side==="buy"?"Bought":"Sold"} ${qty} ${symbol} @ ${(px/CLK).toFixed(2)}`; }
        return json({ok:true,msg,detail:marketDetail(symbol,uid),state:farmState(uid)});
      }
      else if(p==="/api/cancel"){ db.query("DELETE FROM orders WHERE id=? AND player_id=?").run(b.id,uid); msg="Order cancelled"; }
      else return json({error:"unknown action"},404);
      return json({ok:true,msg,state:farmState(uid)});
    }
    return json({error:"not found"},404);
  }catch(e:any){ return json({error:String(e?.message??e)},400); }
}});
console.log(`🐔 ChickeX v2 up → http://localhost:${PORT}  (1 game-day=${DAY_MS}ms, fee=${TRADE_FEE_BPS}bps)`);
