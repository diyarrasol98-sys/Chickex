# ChickeX — Build-Ready Master Plan

**A livestock-farming game fused with a live, player-driven exchange. Local Iraqi rails first (with one inverted-sequencing caveat resolved up front), crypto later. Built solo with AI coding agents.**

*Version 2.0 — execution-ready. Every number below is a tunable strawman, not a law of physics; instrument and adjust to keep the economy's net coin flow negative. Where v1 asserted a number, v2 derives it from a lifetime model — and where v1's principle and its numbers contradicted, v2 fixes the number, not the principle.*

---

## 1. Executive Summary

ChickeX is a mobile farming game where you own livestock, feed and breed them, and **buy/sell animals + produce on a live exchange whose prices move on real player supply and demand**. The "X" is the exchange — trading is the endgame, not a side feature. You earn from yield (husbandry skill) and from timing (market skill), never from chance. The house makes money on a trade fee, store/feed margin, breeding sinks, and — later — deposit/withdraw spread. Distribution is a Telegram Mini-App seeded from the founder's existing crypto/trading audience, monetized through three phases: **P1** prove the loop with play-coins only (no cash-out), **P2** turn on cash-IN via FIB/ZainCash, **P3** add cash-OUT and a USDT bridge. The entire product is engineered to be a *skill-and-production marketplace* so Iraqi payment processors keep the merchant accounts open.

**Single biggest risk:** regulatory/payment-processor kill — a CBI-licensed wallet (ZainCash's terms explicitly ban "gambling, or **profit-making platforms**") flags ChickeX as a profit-making exchange and freezes funds. This is existential, defended in the *mechanics*, not just the marketing. **Critically, this risk begins in P2, not P3:** the moment users pay real money for coins on a priced secondary market the house taxes, a processor can read it as a profit-making platform *without any cash-out existing*. The plan now gates written processor + lawyer sign-off on the exact P2 mechanics before any P2 code (§7.7).

**Single biggest edge:** the founder is a crypto/markets-native operator in Kurdistan with a warm, market-literate audience and direct fluency in local rails — so the exchange (the hardest, most defensible part) is the part he understands best, and he can seed real two-sided liquidity from day one where a generic farm-game clone cannot.

**One inverted premise resolved up front (see §6.7, §7.7):** "local rails first, crypto later" assumes a working *local* cash-out. FIB's public docs show **collection only, no documented payout/disbursement API**, and CBI wallets are unlikely to disburse "winnings." If the VERIFY emails confirm no local payout rail, **cash-out is crypto-first by necessity (USDT-TRC20 via Kurdcoin/P2P)** — which pulls the crypto/AML/sanctions legal review forward into P3 planning rather than deferring it. We resolve this VERIFY *before* committing engineering to either path.

---

## 2. The Game

### 2.1 Core loop

```
   FEED ──► GROW ──► PRODUCE ──► (BREED for better stock) ──► TRADE on the exchange ──► reinvest
     ▲                                                                                    │
     └────────────────────────────── coins / better animals ◄────────────────────────────┘
```

The loop is the proven Hay Day / Township engine (a $1.2B+ revenue pattern), with the **live exchange grafted on as the endgame** — the RuneScape Grand Exchange model, the most successful game market ever built.

### 2.2 Animals, produce, lifecycle

Start with **one productive animal and its produce** for the MVP; the architecture supports many.

| Tier | Animal | Produce | Notes |
|---|---|---|---|
| P1 (MVP) | **Basic Hen** | Egg | The anchor unit. Everything is priced relative to it. |
| P1.5 | **Rooster** | (enables breeding) | Needed for the breeding loop; gate behind a few days of play. |
| P2 | **Premium breeds** (Golden Hen, etc.) | Premium eggs | Higher yield, require a catalyst item (cash-or-rare). |
| Later | Ducks, rabbits, goats… | Milk, etc. | Each is one new config row + art. Don't build until P1 retention proves out. |

**Lifecycle creates natural scarcity and sinks.** An animal matures → peaks → declines in yield → dies. A basic hen is productive ~60 days, with yield falling after day 40 (the decline curve is modeled explicitly in §4.5, not hand-waved). Because animals are finite and produce daily, there is always sustainable demand for fresh stock — demand that does **not** depend on user growth (the Axie killer).

### 2.3 Yield is deterministic-with-skill (the legal and design heart)

```
egg_yield = base_yield × health × happiness × genetics × husbandry_skill
```

Every multiplier is something the player *works*: feeding correctly, treating illness, managing coop density, timing breeding. **No payout is ever resolved by RNG.** Randomness exists only in *which traits* an offspring inherits — never in *whether you keep the asset*. Feeding a hen for N days always yields produce; breeding always yields offspring. The player can always say "I produced this," never "I got lucky." (Contrast the Stake-style "chicken" gamble where the outcome is pure RNG — ChickeX is explicitly *not* that.)

### 2.4 The live market as the heart

For each tradeable good (egg, hen, premium breed) there is a **continuous player↔player order book** sandwiched between two NPC quotes (floor + ceiling) — details in §4.2. **Honesty about early scale:** at P1 (founding cohort, one animal), two-sided player flow is thin, so most volume hits the NPC band and the chart mostly renders the EMA-trailed NPC quotes plus a handful of real trades. We ship the surface that *grows into* discovery; we do not market a deep order book we cannot yet populate. The UI surfaces what makes markets addictive and defensible:

- **Live price chart + volume + "market movers"** per good (Grand Exchange model) — labeled honestly as NPC-band-anchored until player liquidity is real.
- **Order book / depth** — real bids and asks from real players (shown when depth exists; collapsed to "best bid/ask + recent trades" when thin).
- **A public real-time trade ticker:** *"Player X sold a Golden Hen for 12,400 CLK"* — manufactured social proof, envy, aspiration, with zero gambling exposure (the crash-game *feel* applied to a non-chance surface).

### 2.5 Minute-to-minute vs day-to-day

| Horizon | What the player does | The hook |
|---|---|---|
| **Minute-to-minute** | Collect eggs, refill feed, treat a sick hen, check prices, place/cancel orders, snipe a cheap hen, react to the ticker. | Trading micro-decisions + collection dopamine. |
| **Session (5–15 min)** | Sell the day's produce (to players, not NPC, for better price), rebalance the coop, start a breed, flip an underpriced animal. | "One more trade." |
| **Day-to-day** | Login streak + first-egg bonus, feed cycle, breed cooldowns resolve, market swings overnight, co-op goals, leaderboard standing. | Appointment mechanics + social ties. |

### 2.6 Social / multiplayer hooks

- **Co-ops / neighborhoods (~30 players):** shared goals, mutual help, group chat. The strongest D30 lever Supercell has, and the cheapest viral surface (members recruit members).
- **Live social trading feed:** the ticker above, plus auto-generated shareable "big flip / rare breed hatched" cards players post to their own channels.
- **Leaderboards & seasons:** richest trader, top breeder, biggest single flip — weekly/seasonal, **cosmetic + small-coin prizes only** (never power).

---

## 3. Addictive-Loop & Retention Design

### 3.1 Mechanics adopted (and why)

| # | Mechanic | Source precedent | Why it works | Revenue link |
|---|---|---|---|---|
| 1 | **Feed/growth timers + appointment push** ("Eggs ready," "Spoiling in 1h") | Hay Day | Creates return appointments → D1/D7; seeds the impatience hard currency monetizes | Speed-up sales |
| 2 | **Breeding anticipation reveal** (traits rolled on a *bounded, input-shifted* distribution) | CryptoKitties | The dopamine "reveal" moment; **skill-weighted, not pure chance** = also the legal shield | Premium breed/egg sales |
| 3 | **Live market FOMO** (price charts, movers, volume, scarcity spikes) | Grand Exchange / EVE | Players check prices compulsively; highest-retention *and* most defensible | Trade-fee volume |
| 4 | **Co-ops / neighborhoods (~30)** | Hay Day / Township | Social ties = top D30 lever; people don't quit on friends | Retention → LTV |
| 5 | **Live social trading feed** | Crash games | Public social proof of others winning/timing, no gambling exposure | Spectator virality |
| 6 | **Daily login streak** (escalating, reset-on-miss; soft currency/feed only) | RPG playbook | Cheap, proven D1→D7 booster | Daily sessions |
| 7 | **Leaderboards & seasons** | Township / EVE | Competitive identity = "one more trade"; whale status without breaking economy | Cosmetic sinks |

### 3.2 Deliberately avoided — so it never *feels* (or *reads*) like gambling

- **No crash rounds, no spin-the-wheel, no slot mechanic.** The crash-game *feel* is borrowed only for the ticker/reveal, never the format.
- **No paid random "pulls" / loot boxes whose only point is the random outcome.** Randomness only varies *quality* of an asset you definitely keep, and is always wrapped in a productive process the player worked.
- **No "wager X, by chance get 0 or 2X"** anywhere.
- **No house counterparty** — ChickeX matches a buyer to a seller and takes a fee; it never "wins when you lose."
- **No leverage, no shorting, no derivatives, no bonding curve / AMM** (a bonding curve / constant-product AMM is literally the ponzi shape regulators recognize *and* leaks value to arbitrageurs — banned even as an MVP shortcut; see §4.2 / §8.4).
- **No pay-to-win.** Sell time, cosmetics, convenience, access — never market edge. The moment cash = guaranteed market wins, both free and paying players churn.

---

## 4. Economy Design (the make-or-break)

**One-line thesis:** the currency holds value only if **tradeable coins entering per day ≤ what leaves per day**, and animal value comes from **production + skill**, not the next buyer. Every collapse precedent (Axie, StepN, Hay Day inflation) is the same disease: an **uncapped faucet** plus value that depends on **growth instead of yield**. ChickeX structurally forbids both — and v2 closes the two faucets v1 *believed* it had closed but hadn't (the free starter grant, and the uncapped NPC-floor mint).

### 4.0 The non-negotiable architecture: two ledgers, three balance classes

**Play-coins (soft, sinkable) must NEVER be the same unit as real-money balance.** Real money buys coins at the cashier; coins are earned/burned/traded inside the game; cash-out (P3) converts coins back at a controlled, throttled rate. This separation is what lets you tune inflation aggressively *and* keep processors calm *and* sit in the "game" bucket not the "financial-services" bucket as long as possible.

**Within the soft coin, three balance classes (this is the fix for the free-faucet leak):**

| Class | Source | Can buy feed / NPC? | Tradeable to players? | Cashable (P3)? | Counts toward circulating CLK? |
|---|---|---|---|---|---|
| **Tutorial CLK** | starter grant | ✅ | ❌ | ❌ | ❌ |
| **Earned CLK** | capped faucets + NPC-floor sales of produce | ✅ | ✅ | ✅ (P3, throttled) | ✅ |
| **Deposited CLK** | 1:1 real-money deposit (P2), after maturity hold | ✅ | ✅ | ✅ (P3) | ✅ |

> **Hard invariant (assert + alarm on drift):**
> `tradeable_CLK_minted == capped_faucet_emissions + npc_floor_purchases(within daily budget) + deposits`
> Tutorial CLK is a separate ledger sub-account and is **never** part of this sum. This single rule means 1,000 Sybil signups mint **zero tradeable supply** — the v1 leak (≈810,000 free CLK + 2,000 free hens from signups) is closed by construction.

### 4.1 The master equation: faucets vs sinks

```
NetCoinFlow(day) = Σ TradeableFaucets(day) − Σ Sinks(day)
TARGET: rolling_7d(NetCoinFlow) ≤ 0   (mild deflation bias, ~−2% to −5% of circulating tradeable supply/week sunk net)
```

Persistently positive → you are Axie/StepN and you die. Wildly negative → new players can't get a foothold and churn. Manage to a **slightly negative band.**

**Faucets — keep few, capped, and (critically) the NPC floor is budgeted:**

| Faucet | Role | Cap mechanism |
|---|---|---|
| Daily login / first-egg-of-day | Onboarding hook | Hard daily cap per account; decays to 0 by day 30 |
| **Starter grant** | First-session hook | **Tutorial CLK only** — non-tradeable, non-cashable, off-ledger (see §4.0). Tradeable balance starts at 0. |
| **NPC wholesale buyer (floor)** | Floor price *and* the main mint path | NPC buys at a **low floor** *and* under a **per-good daily purchase budget** with a **declining marginal floor** (see below) — this is the fix that turns the floor from an uncapped printer into a throttled faucet **you** control |
| Quest / achievement payouts | Retention | One-time, finite list |
| Real-money deposit (P2) | The *real* faucet | Backed 1:1 by cash in — not free inflation; subject to maturity hold (§4.7) |

> **Critical design decision (corrected):** raw yield (eggs appearing) is **not** a coin faucet. Eggs are *assets*, not coins. Coins enter only when an asset is **sold to the NPC at the floor** (now budget-capped) or **bought from another player** (coin-neutral). But v1's claim that this alone bounds inflation was wrong: **there was no cap on how many eggs the NPC would buy**, so a large enough herd (Sybil or legit) made the NPC floor an on-demand money printer. v2 fixes this with a **per-good daily NPC purchase budget** and a **declining marginal floor**: as cumulative NPC-bought volume for a good rises within a day, the price the NPC pays steps down toward a hard ceiling on total daily mint. The herd can no longer mint unbounded coins; the throttle is the operator's, not the player's.

**Sinks — these MUST dominate. A livestock game is blessed with natural sinks:**

| Rank | Sink | Type | Target share of all sinks |
|---|---|---|---|
| 1 | **Feed** — every animal eats per tick; bigger animals eat more | Involuntary, continuous | **35–45%** |
| 2 | **Vet / disease treatment** — density-driven illness; ignore → animal dies (asset destruction) | Semi-voluntary | ~10–15% |
| 3 | **Breeding fees** — escalating, base set *above* offspring lifetime mint (§4.4) | Voluntary | ~10–15% |
| 4 | **Land / coop upgrades** — capacity gates, diminishing returns | Voluntary | ~10% |
| 5 | **Listing fee + trade fee** | Per-action | ~10–15% |
| 6 | **Spoilage / aging** — eggs rot in N days; animals age out | Involuntary anti-hoard valve | ~5% |
| 7 | **Vet-care subscription** (was "insurance" — renamed; deterministic, no probabilistic payout) | Voluntary | ~3% |
| 8 | **Cosmetics / naming / coop skins** — zero power | Voluntary | ~3% |

> **Design law (corrected, now with an upper bound):** a new animal's *expected lifetime feed+vet cost* must sit in a **band of 45–70%** of its *expected lifetime produce revenue at floor*. The **lower** bound (≥45%) makes animals productive-but-never-money-printers and makes idle hoarding bleed coins (the mechanic Axie lacked). The **upper** bound (≤70%) is the constraint v1 omitted entirely: a *diligent* player must still clear enough margin to stay engaged. The §4.5 strawman is rebuilt to land inside this band — v1's accidental 85% feed+vet ratio (see §4.5) would have failed the upper bound and quietly churned good players.

### 4.2 Price formation — RECOMMENDED PICK: deterministic NPC-bounded order book (no AMM, no bonding curve, ever)

**Verdict: a continuous double-auction order book for player↔player, sandwiched between two NPC quotes acting as a soft floor and soft ceiling** — the RuneScape Grand Exchange model.

**Implementation correction vs v1:** v1 proposed shipping the MVP market as an "AMM-style always-quotes mechanism" and upgrading later. **Cut entirely.** An AMM *is* a constant-product bonding curve — the exact value-leaking, ponzi-shaped mechanism this same section condemns. Shipping it as a shortcut would contradict the legal spine. Instead:

- **MVP market = deterministic EMA-trailed NPC band + a simple price-time-priority order list.** The NPC floor/ceiling are computed from the trailing median (no constant-product math, no curve, no arbitrage leak), and player orders match on price-time priority inside the band. This *is* the §8.4 implementation path — there is no AMM stage.
- **Upgrade to a single-threaded CLOB *per market*** once liquidity is real; the economic design (NPC-bounded book) is identical at both stages.

Why not the alternatives:

| Model | Verdict | Reason |
|---|---|---|
| Pure order book (EVE) | Core, but never naked | Best discovery, but thin early books are trivially manipulated by one whale; brutal for new players |
| AMM / bonding curve | **Banned outright** | Constant-product leaks value to arbitrageurs; "price rises as supply mints" is *literally the ponzi shape* — an own-goal on the not-gambling framing. Not even allowed as an MVP shortcut. |
| **Deterministic NPC band + order list → CLOB (chosen)** | ✅ | Real player discovery inside an NPC band that bounds manipulation, with zero curve math at any stage |

**How the NPC band works (per good):**
- **NPC bid (floor):** wholesale buyer always buys at `floor` ≈ **60–70%** of the trailing 7-day median player price — **but only up to a per-good daily purchase budget**, after which the marginal floor steps down (declining marginal floor). Guarantees produce is never worthless (kills "my eggs are unsellable" rage-quit) but is the *worst* exit, so players prefer each other — and can no longer be used to mint unbounded coins.
- **NPC ask (ceiling):** NPC store sells the *basic* version at `ceiling` ≈ **130–150%** of median. Caps squeeze/corner attacks — a whale buying every hen just subsidizes players buying cheap from the NPC.
- The **player book lives inside the band**; NPC quotes **trail** the median slowly (EMA over days) so the band moves with genuine supply/demand but can't be whipsawed in one session.

**Anti-manipulation, build in v1:**
- Floor = wholesale (worst exit) so nothing is ever stuck but players still prefer each other.
- **Per-good NPC daily purchase budget + declining marginal floor** → caps total daily mint (also ties to the asset-side solvency model, §4.3 commitment 5 and §4.6 row 4).
- **Per-good circuit breaker:** cap NPC band drift to ±10%/day; if player median moves >X% in an hour, widen spread / throttle.
- **Listing fee + minimum order life** (can't cancel for N minutes) → makes spoofing/wash trading expensive.
- **Counterparty-graph + velocity analysis** (not the fee — see threat-model note below): flag coin round-trips and value-shunting between linked or colluding accounts; same-name-wallet cash-out rule is the real laundering barrier.
- **Spot only. No leverage, no shorting, no derivatives** in MVP — load-bearing for the not-gambling framing.

> **Threat-model honesty on wash trading:** the per-fill trade fee does **not** deter the dangerous attack. The attack that matters in P2+ is *"A deposits real money → sham trades shunt value to B → B cashes out"* (laundering/collusion). A 5% fee is a *cost of laundering a launderer happily pays*, not a barrier; and device/IP/funding clustering is defeated by cheap in-region VPNs/SIMs. The real controls are: **(1) same-name-wallet-only cash-out**, **(2) velocity + holding limits + deposit maturity hold**, and **(3) counterparty-graph analysis** flagging buy-high/sell-low value transfers. The fee is a tax, not a defense — we don't let it carry weight it can't bear.

### 4.3 Anti-inflation & anti-ponzi guardrails (the five commitments)

1. **No uncapped mint, ever.** Tradeable coins enter only via (a) capped/decaying faucets, (b) **budget-capped** NPC floor purchases of real produce, (c) real-money deposits backed 1:1. The starter grant is **tutorial-class, off-ledger, non-tradeable**. There is **no mechanism where playing longer (or signing up more accounts) mints unlimited tradeable currency** (the exact SLP/GST and Sybil failure). *Assert `tradeable_CLK_minted == faucet_emissions + budgeted_npc_floor + deposits` as a code invariant; alarm on drift.*
2. **Sinks scale with wealth & supply.** Feed/breeding/land costs rise with how much you own and (optionally) with total circulating supply → an algorithmic thermostat tied to the `NetCoinFlow` rolling average.
3. **Value is yield-anchored, not entry-anchored.** Because assets produce, late players buy *cash-flowing* hens at fair DCF value — a business, not exit liquidity. **No referral-to-earn, no deposit-yield, no staking-for-emissions** — those are the ponzi tells; omit them entirely.
4. **Faucet decays as the player matures; sinks grow.** New player: generous (tutorial) faucet, light sinks. Veteran: faucet ≈ 0, lives off market + yield. Early adopters get **no permanent minting advantage** — their edge is skill and inventory, which late players can also build.
5. **Cash-out is throttled, reserve-backed, AND asset-aware (P3).** Withdrawals paid from a real reserve (deposits − operating margin + fees), with daily/weekly caps and a **dynamic withdraw spread that widens under stress**. The solvency model includes **outstanding tradeable-asset value at the NPC floor** (the max coins the herd can mint on a coordinated dump), not just circulating CLK — because a run can come through the *asset* side. The NPC daily purchase budget (§4.2) bounds this. Never promise fixed returns. Cash-out liquidity comes from real deposits + fees, **never from new-player money paying old players.**

### 4.4 Fee model (fees that double as sinks)

All percentages are strawman starting points — instrument and tune to keep `NetCoinFlow ≤ 0`.

| Fee | Rate (MVP) | Function | Sink or revenue |
|---|---|---|---|
| **House trade fee** | **5%** per filled trade (3% buyer / 2% seller) | Core market revenue; minor wash-trade tax (NOT the laundering barrier — see §4.2); scales with volume | **Burned coins = sink** *and* booked as house revenue |
| **Listing fee** | **0.5–1%** of order value (or flat), non-refundable | Kills spoofing/spam orders | Pure sink |
| **Breeding fee** | `base × 1.5^(parent_breed_count)`, **base set above offspring lifetime NPC-floor mint** (≈ **80 CLK**, see §4.5) | Biggest voluntary sink; gates new-animal supply; **net-deflationary by construction** | Pure sink |
| **NPC store margin** | sells feed/items at price, buys produce at floor → spread is the house's | Continuous, involuntary | Sink (feed coins destroyed) |
| **Deposit spread (P2)** | buy coins at **~3–5% over fair** | Cash-in revenue | Revenue (real money) |
| **Withdraw spread (P3)** | **~5–8%, dynamic** (widens under reserve/flow stress) | Cash-out revenue + solvency valve | Revenue + guardrail |
| **Vet-care subscription** | recurring coin fee, **deterministic prepaid treatment** (no probabilistic payout) | Optional convenience; replaces "insurance" | Sink |
| **Cosmetics** | flat cash or coin, zero power | Pure margin | Sink/revenue |

> **Net-flow guard on fees:** if `NetCoinFlow` trends positive 7 days, automated lever order = (1) **tighten the NPC daily purchase budget / lower the marginal floor**, (2) raise feed price, (3) raise breeding escalation, (4) lower new-player faucet, (5) widen NPC spread. **Do not** fix inflation by raising the trade fee first — that kills the volume you want.

### 4.5 Strawman MVP starting parameters (rebuilt from a lifetime model)

Currency: **Cluck (CLK)** — soft coin, integer minor-units (**milliclucks**, 1 CLK = 1,000 mCLK) so fee splits and median-based floors never need floats (§8.5). Real-money peg set at the cashier (e.g. 1,000 CLK ≈ a small local-currency amount; tune to ZainCash/FIB minimums). Tradeable CLK is **mint-on-deposit + budgeted-NPC-floor + capped faucets**, no global pre-mint; track circulating tradeable supply live.

**Supply & onboarding**
| Param | Value |
|---|---|
| Starter grant | **500 Tutorial-CLK** (non-tradeable, non-cashable, off-ledger) + 2 starter hens (non-tradeable until phone+device-unique verification) + 3 days feed |
| Tradeable balance at signup | **0** — earned only via capped faucet + NPC-floor produce sales, or unlocked by deposit (P2) |
| Daily login faucet | **20 CLK/day** (earned-class), decaying to 0 by day 30; hard per-account daily cap |
| Mint model | mint-on-deposit + budgeted-NPC-floor + capped faucets; no fixed-cap pre-mint |

**Animal economics — basic hen (the anchor), full lifetime model**

The v1 headline "3 − 2 = +1 CLK/day" was wrong: it ignored the **yield decline after day 40** and the **expected vet cost** the same doc mandates. Rebuilt:

| Param | Value |
|---|---|
| Feed cost | **2 CLK / hen / day** (the heartbeat sink), all 60 days |
| Yield (full health) | **1 egg/day** days 1–40; **declining linearly to ~0.4 egg/day** by day 60 (decline curve explicit) |
| Egg NPC floor | **3 CLK** (within daily budget); player median target **~4–5 CLK** |
| Expected vet events | ~**5%/week** baseline → ≈ **0.43 events over 60 days** at low density; treatment **15 CLK** → ≈ **6.5 CLK expected lifetime vet cost** |
| **Lifetime eggs** | ≈ **40 (days 1–40) + 14 (days 41–60 declining) = ~54 eggs** |
| **Lifetime revenue at floor** | ≈ 54 × 3 = **~162 CLK** |
| **Lifetime feed cost** | 60 × 2 = **120 CLK** |
| **Lifetime feed + vet** | ≈ **126.5 CLK** |
| **Feed+vet / revenue ratio** | **≈ 78% at floor** — fails the ≤70% upper bound, so the strawman is **tuned**: either floor → **3.5 CLK** (revenue ≈189, ratio ≈67%) or feed → **1.7 CLK/day** (feed+vet ≈108.5, ratio ≈67%). **Recommended:** floor 3.5 CLK. |
| **Tuned lifetime net at floor** | ≈ 189 − 126.5 = **+62.5 CLK over 60 days ≈ +1.04 CLK/day** — but a *diligent* player selling to **players** at ~4.5 CLK clears materially more; a *neglectful* one (skipped feed/vet) goes **negative**. Thin-on-purpose preserved, now actually true. |
| Hen lifespan | **~60 days** productive; yield declines after day 40 |
| Hen NPC floor (as livestock) | **30 CLK**; player market higher for good genetics |

> **Why this matters:** v1's "+1 CLK/day / 50–66% ratio" understated the leak by ~2.7× and would have made the pre-launch sim flash a **false green light**. invariant #2's *lower* bound passed trivially at 78%; the binding constraint was always the *upper* bound (does a diligent player still profit?), which v1 never stated. v2 states it and tunes to it.

**Breeding (repriced — was a hidden faucet)**

v1 listed breeding as a sink, but a bred hen whose eggs are sold to the NPC mints **new coins** over its life. Offspring lifetime NPC-floor mint ≈ **162–189 CLK** (same as a hen). v1's 40-CLK base breed fee left early breeding **net-positive** (a faucet), not a sink. Fix: **base breed fee set above offspring expected lifetime NPC-floor mint contribution**, and offspring eggs draw from the *same per-good NPC daily budget* (so they can't expand total mint).

| Param | Value |
|---|---|
| Base breed fee | **80 CLK** (≈ offspring lifetime floor-mint after the budget cap discount), escalates `80 × 1.5^(breeds_done)` per parent |
| Cooldown | **48h** |
| Lifetime cap | **5 breeds/hen** |
| Net effect | breeding is **net-neutral-to-deflationary by construction**, not a faucet; modeled in the sim, not asserted |
| Premium breed | requires a **catalyst item** (cash or rare drop) |

**Land / coop**
| Param | Value |
|---|---|
| Start slots | 5 |
| Upgrade curve | **100, 250, 600, 1,400 CLK …** (≈ ×2.3 each) — a perpetual sink |

**Market & fees**
| Param | Value |
|---|---|
| Trade fee | **5%** |
| Listing fee | **1%** |
| NPC band | floor **65%** / ceiling **140%** of trailing 7-day median |
| NPC daily purchase budget | **per-good cap on total floor-bought volume/day**; marginal floor steps down past the budget |
| Deposit spread | **4%** |
| Withdraw spread (P3) | **5–8% dynamic** |
| Egg spoilage | **4 days** unsold → rots (forces flow, prevents hoarding); **offline-grace applies, §4.7** |
| Rounding | integer **milliclucks**; fee rounding **always to the house**, ledger asserted to sum to zero *after* rounding (§8.5) |

> **Day-1 gate:** simulate **1,000 synthetic players for 90 days BEFORE launch** — including Sybil-cluster, herd-growth, and coordinated-dump scenarios — and confirm `rolling_7d(NetCoinFlow) ≤ 0` **with the corrected lifetime model, the budgeted NPC floor, and the repriced breed fee.** **Do not ship without this sim** — and do not trust it if it's fed v1's understated params (that's the false green light Axie/StepN effectively gave themselves).

**The invariants to assert in code (if you build nothing else):**
1. `rolling_7d(NetCoinFlow) ≤ 0` — alarm + auto-throttle if violated.
2. `tradeable_CLK_minted == capped_faucet_emissions + budgeted_npc_floor_purchases + deposits` — Sybil/uncapped-mint guard; tutorial CLK excluded.
3. `0.45 ≤ expected_lifetime_feed_vet_cost / expected_lifetime_yield_revenue ≤ 0.70` for every animal type — productive but profitable-for-the-diligent.
4. `total_cashout_paid ≤ deposits + fees − operating_margin` **AND** reserve ≥ a stress-buffer against `outstanding_asset_value_at_NPC_floor` (asset-side run, bounded by the NPC daily budget) — solvency, always.

### 4.6 Top 5 ways the economy dies + guardrail for each

| # | Collapse mode | What it looks like | Guardrail |
|---|---|---|---|
| 1 | **Faucet > sink → hyperinflation** (Axie SLP / StepN GST) | Tradeable coins flood in faster than burned via free starter grants, Sybil signups, and unbounded NPC-floor minting; CLK + asset prices crater | **No uncapped mint, no free grant, budgeted NPC floor.** Tutorial-class starter grant (off-ledger); capped/decaying faucets; per-good NPC daily purchase budget + declining marginal floor; live NetCoinFlow dashboard + auto sink-thermostat; mint-conservation invariant #2; pre-launch 90-day sim with Sybil + herd-growth scenarios must show net ≤ 0. |
| 2 | **Growth-dependent ponzi / late-player bag-hold** (StepN) | Prices rise only while users pour in; growth stalls → death spiral | **Yield-anchored (DCF) value.** Animals produce daily → late buyers buy a business. **No referral-to-earn, no staking-emissions, no deposit-yield.** Cash-out from real reserve only. |
| 3 | **Whale / bot / launderer manipulation** | One actor corners hens, spoofs the book, wash-trades, bot-farms yield, or shunts deposited value to a cash-out mule | **NPC floor+ceiling band** caps corners; **listing fee + min order life** kills spoofing; **breed caps + density illness + NPC daily budget** cap bot/herd yield-farming; **same-name-wallet cash-out + velocity/holding limits + counterparty-graph analysis** (NOT the trade fee) stop value-shunting; spot-only. |
| 4 | **Reserve insolvency / bank run — coin AND asset side (P3)** | Withdrawal demand > reserve; OR everyone dumps inventory to the NPC floor at once, minting coins that demand reserve backing | **Asset-aware reserve model:** `cashout ≤ deposits + fees − margin`; reserve buffered against `outstanding_asset_value_at_NPC_floor`; **NPC daily purchase budget caps the max dump-mint**; daily/weekly caps; dynamic widening withdraw spread; segregated funds; published reserve ratio. |
| 5 | **Regulatory / processor kill — begins in P2, not P3** | ZainCash/FIB flag a real-money-funded, house-taxed priced secondary market as a "profit-making platform" — *before any cash-out exists* | **Defend framing in mechanics** (skill/labor-deterministic yield, no RNG payouts, no house counterparty, no leverage); two-ledger separation; cosmetics never sell power; **written processor + lawyer sign-off on the exact P2 mechanics — real-money coin purchase + secondary market + 5% house fee — BEFORE any P2 code** (§7.7); KYC/AML program (vendor-backed, §6.5) staged for P3 cash-out. |

---

## 5. Monetization & Unit Economics

### 5.1 Revenue lines

| Line | Phase | Mechanism |
|---|---|---|
| **Trade fee** | P1 (in coins) → real value P2+ | 5% on every filled trade — monetizes the **95% who never pay an IAP** |
| **Hard-currency IAP** | P1 cosmetic / P2 real | Speed-ups, premium breeds, catalysts, cosmetics |
| **NPC store / feed margin** | P1+ | Continuous, involuntary coin sink booked as house revenue |
| **Deposit spread** | P2 | ~3–5% over fair on cash-in |
| **Withdraw spread** | P3 | ~5–8% dynamic on cash-out |
| **Breeding sinks** | P1+ | Whale-facing voluntary sink |
| **Vet subscription / cosmetics** | P1+ | Margin |

### 5.2 Assumptions (regional reality — do NOT model on Western/East-Asian ARPU)

| Metric | Benchmark | ChickeX planning band |
|---|---|---|
| Payer conversion (F2P casual) | 2–5% (casual), 5–10% (mid-core) | **~2–5%** |
| ARPPU vs ARPU | ARPPU ≈ 10–20× ARPU | few payers carry revenue |
| Genre ARPU | hypercasual ~$0.86; match ~$2.99; party ~$4.90 | **~$2–5 ARPU early band** |
| Regional spend | Iraq runs *low* per-user | win on **volume + trade-fee throughput + near-zero CAC** |

### 5.3 Worked example — UNVALIDATED ILLUSTRATION (do NOT plan spend against this)

> **Read this first.** Every figure below is a placeholder for *structure*, not a forecast. The trade-fee per-active assumptions ($0.15–0.25 traded/day) have **no empirical basis yet**, and the IAP band assumes ~3% payers × $30 ARPPU in a market this very doc calls "low per-user." **These numbers are decorative until rebuilt from the §4.5 economy-sim outputs and real founding-cohort telemetry.** Do not size hiring, UA, or runway against them. The *only* load-bearing claim here is the **shape**: the trade fee earns from the whole base, not just payers.

**At 1,000 MAU** *(illustrative)*
| Source | Assumption | Monthly |
|---|---|---|
| IAP + spread | 1,000 × ~3% payers × ~$30 ARPPU | ≈ **$900** |
| Trade fee | 1,000 actives × ~$0.15 traded/day × 5% × 30 | ≈ **$225** |
| Store/feed margin | continuous coin sink (booked in coin terms) | (sustains economy, modest cash value pre-P3) |
| **Total (cash-relevant, P2)** | | **≈ $1,000–1,200/mo** |

**At 10,000 MAU** *(illustrative)*
| Source | Assumption | Monthly |
|---|---|---|
| IAP + spread | 10,000 × ~3.5% payers × ~$30 ARPPU | ≈ **$10,500** |
| Trade fee | 10,000 × ~$0.25 traded/day × 5% × 30 | ≈ **$3,750** |
| Deposit/withdraw spread (P3) | grows with cash velocity | (additive, scales with float) |
| **Total (cash-relevant)** | | **≈ $14,000–16,000/mo** |

> The point isn't the figure — it's the **structure**: the trade fee earns from the entire base, not just payers, which is what makes ChickeX viable in a low-ARPU market where a pure casual-IAP game wouldn't be. **Replace these tables with sim + telemetry outputs before any financial decision.**

### 5.4 How the house stays profitable without killing the economy

The elegant part: **the trade fee and store margin are revenue AND primary coin sinks simultaneously — the house gets paid by destroying coins.** Revenue stack at scale: trade fee (volume) + deposit/withdraw spread (cash flow) + feed/store margin (continuous) + breeding (whale sink) + cosmetics (margin). Never raise the trade fee to fight inflation (kills volume); use the §4.4 lever order (tighten the NPC budget first) instead.

---

## 6. Payments Strategy

**Local Iraqi rails first for cash-IN; cash-OUT path is VERIFY-gated and may be crypto-first by necessity (§6.7 #1).** All API specifics from official docs where cited; commercial terms flagged **VERIFY**.

### 6.1 Integration order

| Order | Provider | Why | Phase |
|---|---|---|---|
| **1st** | **FIB (First Iraqi Bank)** ⭐ | Best public API; official SDKs (Node/PHP/Laravel/Python/iOS/Flutter); OAuth2; QR + dynamic-link checkout. Most "Stripe-like" → easiest for AI-built stack. **Collection only — no documented payout API (gates P3, §6.7).** | P2 (cash-IN) |
| **2nd** | **ZainCash** ⭐ | Largest mobile-wallet reach; official v2 API; hosted redirect (minimal PCI); covers users without a bank. | P2 (cash-IN) |
| Defer | **Qi Card** | Widest card reach, but heavier card-acquiring onboarding + highest MCC/gambling-classification risk. | later |
| Defer | **AsiaHawala** | Asiacell wallet reach; thinner public API. | later |
| Defer | **NassPay** | Good SDK + prepaid-Visa (interesting for *payouts*); smaller base. | later |
| P3 bridge | **Kurdcoin + Binance P2P** | USDT off-ramp; **likely the primary cash-out rail if no local payout API exists** — see §6.7. | P3 |

### 6.2 Cash-IN flow (P2)

```
User taps "Buy CLK" → choose FIB or ZainCash
  → server creates payment (idempotency key) via PaymentProvider adapter
  → FIB: returns QR + dynamic link  /  ZainCash: redirect to hosted checkout (JWT result back)
  → provider webhook (signed, idempotent) → reconcile (pull-confirm) → credit CLK at deposit spread (~4%)
  → double-entry ledger: debit house_cash, credit user_coins (sums to zero)
  → credited CLK enters a MATURITY HOLD (§4.7) before it is tradeable/withdrawable (chargeback-clawback safety)
```

**FIB specifics:** REST, OAuth2 client-credentials, base `https://api.fibpayment.com`; create → QR + dynamic link → check status → cancel. **ZainCash specifics:** `POST /oauth2/token` → `POST /api/v2/payment-gateway/transaction/init` → redirect to `redirectUrl` → JWT result to your success/failure URL; webhooks; refunds supported.

### 6.3 Cash-OUT flow (P3) — path depends on §6.7 #1

```
KYC-verified user requests withdrawal (to own same-name wallet only)
  → AML checks (velocity, limits, pattern, counterparty-graph) → manual review (HUMAN) if flagged
  → pay from RESERVE (deposits − margin + fees), dynamic withdraw spread 5–8%
  → ROUTE:
     (a) IF a local payout API is confirmed (VERIFY) → disburse to same-name local wallet
     (b) ELSE (likely) → USDT-TRC20 via Kurdcoin / Binance P2P  ← crypto-first cash-out
  → Either route keeps regulated rails on the un-controversial cash-IN side
```

> **Sequencing consequence:** if (b) is the only working route, "local rails first, crypto later" is **inverted for cash-out** — P3 is a crypto-first off-ramp, and the crypto/AML/sanctions legal review (§7.7) moves into P3 planning rather than being deferred. Resolve §6.7 #1 before committing P3 engineering.

### 6.4 Fees / spread (published where available; else VERIFY)

| Item | Figure | Status |
|---|---|---|
| FIB gateway commission | ~1–5%/txn (negotiated); "receiver bears the e-payment commission" | **VERIFY exact merchant rate** |
| FIB bank transfers | P2P 0.1%, clearing 0.2% IQD/0.3% USD, RTGS 0.3–0.4% | published |
| **FIB payout/disbursement** | **no documented API** | **VERIFY — gates all of P3 cash-out** |
| ZainCash merchant cash-withdrawal | 0.75%; cash-in via agent ~0.3%; internal transfer 0.25% | published |
| ZainCash **per-txn acceptance %** (customer-pays-you) | not cleanly published | **VERIFY — this is the number that drives unit economics** |
| Deposit spread (your markup) | 3–5% | your lever |
| Withdraw spread (your markup) | 5–8% dynamic | your lever |

### 6.5 KYC / AML for cash-out (P3) — this is a COMPLIANCE PROGRAM + VENDORS + A HUMAN, not "plumbing"

> **Scope correction:** v1 called this "plumbing built during P1–P2." It is not a code module a solo founder ships in an adapter file. **SAR-style escalation requires a named human reviewer; KYC/liveness and sanctions/PEP screening require paid third-party vendors; the whole thing is an operational obligation with legal liability.** Plan and budget accordingly. The cleanest path is to **operate cash-out through or under a licensed EPSP / partner that performs KYC/AML for you** (see §7.7), rather than building a money-services compliance function solo.

- **Buy, don't build, identity:** integrate a **paid KYC/liveness vendor** (document + selfie/liveness) and a **sanctions/PEP screening feed**. Do not hand-roll these.
- **KYC before first withdrawal:** real name, national ID/passport, phone, liveness. Every withdrawable account tied to a **verified identity + a same-name wallet** — no third-party payouts.
- **CDD + risk tiering:** light KYC for small in-game-only users; **full KYC for anyone cashing out or above a threshold**; enhanced DD for high-volume/unusual.
- **Limits & holds:** daily/monthly deposit + withdrawal caps per tier; velocity limits; **deposit maturity hold** (§4.7) and hold periods on new accounts and large first withdrawals.
- **Transaction monitoring + SAR-style escalation:** flag structuring, rapid in→out, buy-high/sell-low collusive trades, mismatched parties, counterparty-graph anomalies. **A named human reviews flagged cases** and files where required. Be able to produce records on demand (CBI's 2025 regime is AML/CFT-first).
- **Segregated user funds** (never run payouts from operating float); **sanctions/PEP screening** at onboarding + withdrawal.
- **Staffing reality:** as volume grows, this is a part-time-to-full-time compliance role (or an outsourced provider), not a side-effect of the codebase.

### 6.6 Crypto / USDT upgrade path (P3) — possibly the *primary* cash-out, not just an upgrade

- **Don't build a native on/off-ramp first.** Lean on **Kurdcoin** (Iraq's established exchange since 2017; most extensive branch network incl. Kurdistan; **accepts FIB, ZainCash, FastPay, cash**; requires gov ID + KYC) + **Binance P2P (IQD)** (active FIB/cash merchants; ~1–2% off mid).
- **House holds USDT;** users redeem in-game balance → USDT → off-ramp via Kurdcoin/P2P. **Build for USDT-TRC20 (Tron) first** — it dominates locally (low fees).
- **If §6.7 #1 confirms no local payout API, this becomes the main cash-out rail** — re-introducing crypto/AML/sanctions exposure that the "local rails first" strategy was meant to defer, **plus** US-Treasury-scrutiny risk on some Iraqi banks' card-based crypto buys. Stick to wallet/cash rails. **Sanctions posture shifts — VERIFY with counsel before launch.**

### 6.7 VERIFY list (priority order — gate these before building)

1. **FIB disbursement/payout API existence + fee** — public docs show *collection only*, no documented payout API. **This gates the entire P3 cash-out design AND the "local rails first" sequencing premise.** Email `support@fib-payment.com`; if none, **P3 is planned crypto-first** (USDT/Kurdcoin) with the crypto legal review pulled forward. Resolve this *before* P3 engineering.
2. **Exact per-txn acceptance %** for FIB (negotiated) and ZainCash gateway — the only number that moves unit economics.
3. **Provider sign-off on the EXACT P2 mechanics** — not just "a farming game," but specifically **real-money coin purchase + a priced player↔player secondary market + a 5% house fee, with no cash-out**. Get FIB + ZainCash compliance to confirm *in writing, before any P2 code*, that this is not a "profit-making platform" under their terms. (See §7.7 — this is the moved-forward gate.)
4. **Kurdistan-registered entity acceptance** (federal vs. KRG trade registration) for each provider.
5. **ZainCash "profit-making platforms" clause** — get explicit confirmation your P2 model is acceptable, or keep ZainCash on **cash-IN only** (and assume it may still bite on the secondary-market reading, not only on cash-out).

---

## 7. Legal & Positioning

**Goal:** keep ChickeX classified as a **farming + trading game with a virtual marketplace, NOT gambling or a profit-making exchange**, so merchant accounts stay open. *Practical risk-reduction, not legal advice.*

### 7.1 The one fact to internalize

Iraq bans **all** gambling under the 1969 Penal Code (player fines/jail; operators up to 1 year); Kurdish police have physically raided/arrested on gambling charges. **There is no online-gambling licence to buy.** The only safe position is to **not be gambling at all, by design, and prove it on demand.** ZainCash's terms force every customer to "undertake not to use the Wallet or Card for any Prohibited Activities, **gambling, or profit-making platforms**." **The lethal phrase here is "profit-making platforms," and it does not require cash-out to trigger** — a wallet-funded, house-taxed market where prices move is a profit-making platform on its face. This is why the regulatory gate moves to **P2** (§7.7), not P3.

### 7.2 Skill-not-chance: the test you're defending

Gambling = **Prize + Consideration + Chance**, all three present. Remove any one → not gambling. ChickeX removes **chance** from all real-value payouts. **Assume Iraq uses the strict "any chance" test** — so design that **no real-money-convertible payout is ever resolved by RNG.** The six hard rules the economy must obey:

1. **No pure-RNG payouts, ever** — no wheels, slots, "open this crate and maybe get a 100× chicken." Randomness only varies *quality/variation*, never *whether you keep the asset*, and never as a standalone paid "pull."
2. **Value from production + timing + skill**, not a draw.
3. **Transparent visible prices + open order book** — a matching venue, **never a house counterparty** ("no house = not a wager").
4. **No "wager and maybe lose it all"** mechanic. Trading losses from a bad *sell decision* are fine (skill); randomized stake-and-multiply is not.
5. **Outcomes deterministic given player action** — feeding N days always yields; breeding always yields offspring (only traits vary).
6. **Asset, not a ticket** — every tradable thing has in-game utility, not a cash-payout-only function.

> **Separate from the gambling test:** even a *fully skill-based* priced market funded by real money and taxed by the house can be read as a **"profit-making platform"** under a processor's terms. The §7.2 rules defend the *gambling* classification; the §7.7 P2 gate defends the *profit-making-platform* classification. Both must hold.

### 7.3 What freezes accounts → concrete avoidance

| Freeze trigger | Avoidance |
|---|---|
| Reads as "gambling / **profit-making platform**" (the latter can bite in P2, no cash-out needed) | Operate + describe as **farming game + virtual-goods marketplace with a service fee**. Never use *bet, wager, odds, jackpot, cash prize, win money, casino, lottery, "exchange where you win"*. Use *buy/sell, market, yield, produce, trade fee*. **Get the processor to bless the exact P2 mechanics in writing (§7.7).** |
| Misrepresentation at onboarding | Describe **truthfully + consistently**: a *game with IAP + a P2P marketplace with a service fee*. Volunteer the marketplace AND the real-money coin purchase + house fee; don't let them discover it. Match your stated MCC to actual activity. |
| High chargeback ratio (gaming is structurally bad: currency consumed before chargeback lands) | Strong **KYC + receipts**; **"virtual goods non-refundable once delivered"** ToS; **deposit maturity hold + clawback design (§4.7)**; purchase history; friction on first large top-ups; keep dispute rate visibly low. |
| AML red flags (rapid in→out, structuring, third-party funding, P2P value transfer) | **Transaction monitoring + velocity limits + counterparty-graph from day one of P2.** Pre-empt the "A funds → sham trade → B withdraws" pattern with **same-name-wallet cash-out + holds**, not the trade fee. |
| Cash-out turns virtual currency into real money → money-transmission territory | The no-cash-out defense **collapses the instant P3 ships.** In Iraq, do cash-out **only through licensed EPSPs**, likely as a licensed/partnered arrangement — **local-lawyer sign-off before P3, not after.** |

**Two structural safeguards:** (a) **separate game from money** — keep play-coins internal/non-cashable as long as possible; (b) **don't let the marketplace become a fiat-transfer rail** — trade value moves in *coins/assets*; cash-out is platform → KYC'd same-name wallet only, **never user-to-user fiat** (that's unlicensed remittance + textbook ML).

### 7.4 DO / DON'T

**DO** — derive value from production + timing + skill · make outcomes deterministic (randomness varies *quality* only) · run an open transparent P2P book (venue + fee, never counterparty) · call it a farming/trading game + virtual-goods marketplace *identically everywhere* · keep P1 coins internal/non-cashable · **get written processor sign-off on the exact P2 real-money-market mechanics before P2 code** · build KYC/AML via paid vendors + a named human reviewer early · restrict P3 cash-out to KYC'd same-name wallets · add deposit maturity holds + clawback · gate to **18+** · emphasize husbandry + trade + transparency (halal-by-design).

**DON'T** — build any randomized cash-convertible payout (wheels/slots/crash/stake-and-multiply/jackpots) · sell paid random pulls/loot boxes standalone · ship any AMM/bonding-curve market (even as MVP) · let any mechanic "wager X → 0 or 2X by chance" · act as house/counterparty · let the marketplace become a fiat rail · sell "insurance" with a probabilistic payout (use a deterministic vet subscription) · use *bet/wager/odds/jackpot/lottery/casino/"win money"/"get lucky"* anywhere · misdescribe or hide the real-money market or the house fee · commingle user + operating funds · add interest/riba without sharia structuring · **assume the marketing word-swap survives a processor reading the actual mechanics** · ship P2 real-money market before written processor + lawyer sign-off · ship P3 cash-out before a local lawyer confirms money-transmission posture.

### 7.5 ToS must-haves

Nature of product ("entertainment game + virtual-goods marketplace; coins/items are virtual goods/licenses, **no inherent monetary value, not deposits/securities/e-money/a wager**") · explicit **no-gambling clause** · skill/market framing (venue, not counterparty; transparent service fee) · **virtual goods non-refundable once delivered** · **deposit maturity hold + clawback-on-chargeback rights** · **18+** eligibility + lawful-funds warranty · KYC/AML consent + right to freeze for fraud/AML/sanctions · **PII-handling + data-retention notice (§9)** · P3 cash-out only to own verified account · right to suspend for collusion/manipulation/wash-trading · governing law + a clause mirroring the processor's prohibited-use terms (back-to-back compliance).

### 7.6 Islamic-finance sensitivity (Iraq/KRG — drives real enforcement & reputation)

- **Maysir (gambling) is the red line and cannot be cured by contracts** — "profit without corresponding effort, resolved by luck" is haram and non-fixable. Maps 1:1 onto the no-RNG-payouts rule. Keep crash/binary-option/stake-and-multiply/gacha loot boxes **out**.
- **Gharar (excessive uncertainty) CAN be mitigated** by clarity — transparent prices, known fees, deterministic outcomes, no hidden odds (gharar yasir = tolerated).
- **Value from real production/effort = the halal anchor** — a chicken you fed and raised, an asset you bought and resold with skill = trade + effort (legitimate), not luck.
- Market it as "**raise, grow, trade**," never "win big / get lucky / jackpot." Consider an explicit **"no gambling, halal-by-design"** stance + (P2/P3) a **sharia-advisor sign-off** — a compliance asset *and* a powerful trust/marketing signal here.
- **Riba:** avoid interest/staking-with-yield mechanics; the renamed **deterministic vet subscription** (not "insurance") also sidesteps the gharar/maysir surface that a probabilistic-payout insurance product would raise.

### 7.7 Where a local professional sign-off is genuinely required (not optional)

1. **BEFORE ANY P2 CODE (moved forward — was "before P2"):** a Kurdistan/Iraq-licensed lawyer confirms, and FIB + ZainCash compliance confirm **in writing**, that **a real-money coin purchase + a priced player↔player secondary market + a 5% house fee, even with no cash-out**, is (a) not caught by the 1969 Penal Code, and (b) not a prohibited "profit-making platform" under each EPSP's terms. **Do not write P2 payment code on the assumption that "no cash-out = safe."** This is the single highest-leverage legal step and it gates P2, not P3.
2. **Before P3:** lawyer + fintech specialist confirm whether paying user balances out triggers **money-transmission / e-money / exchange licensing** under the 2024 E-Payment Law + 2025 CBI regs, whether you must operate **through/under a licensed EPSP**, and — given §6.7 #1 — whether cash-out is **crypto-first** and what that implies for sanctions/AML. **Don't ship cash-out on assumptions.**
3. **AML program review** against CBI's current AML/CFT instructions, including the **vendor + named-human-reviewer** model (§6.5).
4. **Tax/withholding:** local accountant on trade-fee revenue, spreads, and any withholding on user payouts.
5. **Sharia review (P2/P3)** — signs off no-maysir / gharar-minimized / no-riba; doubles as marketing trust.

---

## 8. Technical Architecture

### 8.1 Stack (chosen for solo + AI-fluency: boring, well-documented, AI-trained-on)

| Layer | Choice | Why |
|---|---|---|
| Language | **TypeScript (Node)** | One language client+server; densest AI training data |
| DB | **Postgres** | Transactions, `SELECT … FOR UPDATE`, serializable isolation — correct money handling |
| Cache / realtime fan-out | **Redis** | Pub/sub, rate limits, hot price/orderbook state |
| Realtime transport | **Socket.IO** | Live prices, ticker, order updates over flaky mobile |
| Client | **React PWA** (delivered as Telegram Mini-App) | No app-store friction/fees; native to the Telegram chat graph |
| Money type | **integer minor-units (milliclucks), NEVER floats** | Floats silently lose money — banned from line one |
| KYC / sanctions (P3) | **third-party vendor**, not in-house | Compliance liability + accuracy; never hand-roll (§6.5) |

### 8.2 Two load-bearing rules to never retrofit

1. **Floats are banned** for any money/quantity. All money is integer milliclucks; **rounding policy is defined (fee rounds to the house) and the ledger is asserted to sum to zero *after* rounding** (§8.5).
2. **The server is the sole authority** on state, price, matching, and any RNG — simultaneously the anti-cheat foundation *and* the regulatory shield (auditable, supply-and-skill-driven, not chance).

### 8.3 Text architecture diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                      React PWA (Telegram Mini-App)                    │
│   farm view · market (chart/book/ticker) · wallet · co-op chat        │
└───────────────┬───────────────────────────────┬─────────────────────┘
                │ REST (idempotency-key)         │ Socket.IO (prices, ticker, orders)
                ▼                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       Node / TypeScript API                          │
│  ┌───────────┐ ┌───────────────┐ ┌──────────────┐ ┌───────────────┐  │
│  │ Game svc  │ │ Market/Match  │ │ Ledger (2x   │ │ Payments +    │  │
│  │ feed/grow │ │ engine        │ │ entry, =0,   │ │ KYC/AML       │  │
│  │ breed/vet │ │ EMA NPC band  │ │ 3 balance    │ │ adapters +    │  │
│  │           │ │ → CLOB        │ │ classes,     │ │ vendor (KYC,  │  │
│  │           │ │ FOR UPDATE    │ │ maturity     │ │ sanctions),  │  │
│  │           │ │ NPC daily-    │ │ holds,       │ │ ZC/FIB/USDT, │  │
│  │           │ │ budget cap    │ │ clawback)    │ │ HUMAN review  │  │
│  └───────────┘ └───────────────┘ └──────────────┘ └───────┬───────┘  │
│        server = sole authority on state, price, RNG               │   │
│        mint-conservation invariant enforced at ledger boundary    │   │
└───────────────┬──────────────────────────────┬───────────────────┼──┘
                ▼                               ▼                   ▼
        ┌──────────────┐               ┌──────────────┐   ┌──────────────────┐
        │  Postgres    │               │   Redis      │   │ Payment providers│
        │ ledger/state │               │ cache/pubsub │   │ + KYC/sanctions  │
        │ serializable │               │ hot orderbook│   │ vendors (signed  │
        │ encrypted PII│               │              │   │ webhooks, recon) │
        └──────────────┘               └──────────────┘   └──────────────────┘
```

### 8.4 Market / matching engine

- **Start as a deterministic EMA-trailed NPC band + price-time-priority order list — NOT an AMM.** v1's "AMM-style always-quotes" stage is removed: a constant-product AMM is a bonding curve, which §4.2 bans for leaking value and reading as ponzi-shaped. The NPC floor/ceiling are computed from the trailing median (plain arithmetic, no curve), and player orders match on price-time priority inside the band. There is always a price (the NPC quotes) without any curve math.
- **Upgrade to a single-threaded CLOB *per market*** once liquidity is real. The economic design (NPC-bounded book) is identical at both stages.
- **NPC daily purchase budget + declining marginal floor** enforced in the match/mint path (the §4.1/§4.2 faucet cap).
- Trades protected by `SELECT … FOR UPDATE` locks, **serializable isolation**, **escrow on open orders**, and **client-supplied idempotency keys** (critical on flaky Iraqi mobile — a retried request must never double-execute).
- One CLOB thread per market avoids cross-market lock contention and makes matching deterministic/auditable.

### 8.5 Double-entry ledger for coins (three balance classes, rounding, holds, clawback)

- **Append-only.** Every transaction is a set of entries that **sums to zero** (debit house_cash / credit user_coins; debit buyer_coins / credit seller_coins + fee-burn; etc.), asserted **after rounding**.
- **Integer milliclucks only**; balances are *derived* from the ledger, never stored as a mutable float. **Rounding: fees round to the house; sum-to-zero asserted post-rounding** so rounding is neither a silent leak nor a faucet.
- **Three balance classes** (tutorial / earned / deposited, §4.0) tracked as ledger sub-accounts; **mint-conservation invariant #2** enforced at the ledger boundary; **tutorial CLK excluded from circulating supply and from cash-out**.
- **Deposit maturity hold + chargeback clawback (§4.7):** deposited CLK is non-tradeable/non-withdrawable until a hold window passes; a chargeback inside the window is unwound cleanly; a chargeback after the holder has already traded the coins triggers **quarantine on the deposit's downstream value**, never confiscation of an innocent third party's assets.
- This is the substrate for solvency invariant #4 and for "produce records on demand" (AML).

### 8.6 Payments adapter interface

One interface, one new file per rail (ZainCash → FIB → Nass → USDT); KYC/sanctions are *separate vendor adapters*, not part of the payment rail:

```ts
interface PaymentProvider {
  createDeposit(userId, amount, idempotencyKey): { redirectUrl?, qr?, providerRef }
  verifyWebhook(headers, rawBody): VerifiedEvent      // signature-checked
  reconcile(providerRef): SettlementStatus            // pull-confirm, don't trust webhook alone
  createPayout?(userId, amount, dest, idempotencyKey): PayoutResult  // P3; FIB support VERIFY (§6.7 #1)
}
interface ComplianceProvider {                        // P3 — third-party vendor, not hand-rolled
  verifyIdentity(userId, docs): KycResult             // doc + liveness
  screenSanctionsPEP(identity): ScreeningResult
  // SAR escalation routes to a HUMAN reviewer queue, not an auto-decision
}
```

Webhooks are **signed, idempotent, and reconciled** (always pull-confirm against the provider, never trust a single inbound webhook — Iraqi mobile networks drop and retry).

### 8.7 Anti-cheat / anti-fraud / anti-bot / anti-launder

- **Server owns all RNG + state** → client can't fabricate yield, price, or trades.
- **Idempotency keys + escrow** → no double-spends on retries.
- **Mint-conservation invariant + budgeted NPC floor** → no Sybil/herd money-printing.
- **Same-name-wallet cash-out + velocity/holding limits + deposit maturity hold + counterparty-graph analysis** → the actual laundering/collusion defense (the trade fee is *not* this defense; §4.2).
- **Listing fee + min order life** → spoofing/wash-trading is expensive.
- **Breed caps + density-scaled illness + NPC daily budget** → caps bot yield-farming.
- **Velocity limits + transaction monitoring + human review** (also the AML layer, §6.5).

### 8.8 Hosting — cheap start → scale path

| Stage | Setup |
|---|---|
| MVP (P1) | Single small VPS: Node + Postgres + Redis on one box. Managed Postgres backups. Cheap, boring. |
| P2 | Split managed Postgres + Redis; API on 1–2 app instances behind a load balancer; payment webhooks on a hardened endpoint; **encrypted PII store + access logging** stood up. |
| P3 / scale | Read replicas; dedicated match-engine process per hot market; isolated payments/ledger service; KYC/sanctions vendor integration + human-review queue; reserve-tracking dashboards; on-call alerting on NetCoinFlow + reserve ratio + mint-conservation drift. |

---

## 9. Security & Trust

| Domain | Controls |
|---|---|
| **Money correctness** | Append-only double-entry ledger summing to zero **after rounding**; integer milliclucks only (no floats); **fee-rounds-to-house policy**; `FOR UPDATE` + serializable isolation on all trades; escrow on open orders; **balances derived from the ledger**, never a mutable field; **mint-conservation invariant** (`tradeable_minted == faucets + budgeted_npc_floor + deposits`). |
| **Solvency / reserves** | Enforce `total_cashout_paid ≤ deposits + fees − margin`; **asset-aware reserve buffer** against outstanding asset value at NPC floor (bounded by the NPC daily purchase budget); **segregated user funds vs operating funds**; published reserve ratio; dynamic withdraw spread that widens under stress. |
| **Account security** | Telegram-native auth + verified phone; phone+device-unique verification to unlock tradeable balance; KYC binding (vendor) for any withdrawable account (P3); no third-party payouts; session/device tracking. |
| **Market manipulation / collusion / laundering** | NPC floor/ceiling band caps corners; **NPC daily budget caps mint + dump-runs**; circuit breakers on band drift + intraday moves; listing fee + min order life kills spoofing; **same-name-wallet cash-out + velocity/holding limits + counterparty-graph analysis** (the real laundering control); spot-only (no leverage). |
| **Payments integrity** | Signed + idempotent webhooks; **reconcile (pull-confirm) every settlement**; idempotency keys end-to-end; **deposit maturity hold + chargeback clawback/quarantine** so a reversed deposit can't confiscate a third party's assets. |
| **AML / records** | Vendor KYC + sanctions/PEP screening; velocity limits, transaction monitoring, **SAR-style escalation to a named human reviewer**; complete auditable records "on demand". |
| **PII / data protection (KYC)** | National IDs, selfies/liveness, phone numbers stored **encrypted at rest**, in an access-logged store, under a **defined retention + deletion policy**, with a **breach-response plan** and least-privilege access. Table stakes for the AML posture and a regulated area in its own right. |
| **Audits** | Pre-launch 90-day economy sim (with Sybil + herd-growth + coordinated-dump scenarios); periodic reconciliation of ledger vs. provider settlements vs. reserve; **mint-conservation drift alarm**; (P3) external review of AML controls + money-transmission posture by local counsel. |

---

## 10. Phased Roadmap

| Phase | Scope (IN) | Scope (OUT) | Exit criteria | Revenue unlocked |
|---|---|---|---|---|
| **P1 — Hook** | feed→grow→sell loop; hen + rooster; **play-coins only, NO cash-out**; **tutorial-class starter grant (off-ledger)**; deterministic EMA NPC floor/ceiling band **+ NPC daily purchase budget**; basic live market + ticker (honestly NPC-anchored at thin liquidity); breeding (**base fee above offspring mint**); timers + push; login streak; co-ops; **offline-grace on spoilage/death**; Telegram Mini-App; **double-entry ledger (3 balance classes, rounding, holds) + server-authority + mint-conservation invariant + 90-day sim** | cash-IN, cash-out, crypto, premium IAP-for-real-money, advanced CLOB, multiple rails, AMM (never) | **D7 retention strong** + visible market price movement on founding cohort. *Prove addiction before a dinar of real money.* | $0 cash (coin-economy only) — proves the loop |
| **P2 — Cash-IN** | player↔player trading w/ **5% trade fee**; premium breeds; **FIB + ZainCash cash-IN** (buy coins, deposit spread ~4%, **maturity hold**); KYC/AML *vendor selection + light-tier plumbing*; **WRITTEN processor + lawyer sign-off on the exact real-money-market mechanics (gate, §7.7 #1)** | **cash-OUT**, crypto, third-party transfers, full KYC | positive **trade-fee + ARPU** signal; **processors + lawyer confirmed the priced-secondary-market-with-house-fee framing in writing BEFORE any P2 code** | **trade fee + deposit spread + premium IAP + store margin** |
| **P3 — Cash-OUT + crypto** | **reserve-backed, asset-aware, throttled cash-OUT** — **route depends on §6.7 #1** (local same-name wallet if a payout API exists, else **USDT-TRC20 via Kurdcoin/P2P, crypto-first**); full KYC/AML via **vendor + named human reviewer**; dynamic withdraw spread 5–8%; CLOB upgrade for hot markets | leverage/derivatives (never), AMM (never) | lawyer + fintech **money-transmission sign-off**; **FIB payout API resolved (§6.7 #1) — sequencing premise confirmed**; reserve + solvency dashboards live | **withdraw spread + full exchange flywheel** |

---

## 11. MVP Definition (P1)

**The smallest thing that proves the loop is addictive.** Ship as a Telegram Mini-App.

**IN scope (v1):**
1. Telegram-native account + onboarding (**starter grant: 500 Tutorial-CLK off-ledger + 2 hens [non-tradeable until phone+device verification] + 3 days feed; tradeable balance starts at 0**).
2. **One animal (Basic Hen) + Egg** with the full lifecycle: feed (2 CLK/day) → health/happiness → yield (1 egg/day to day 40, declining to ~0.4 by day 60) → aging/decline → death.
3. Vet/illness events (~5%/week, density-scaled) + treatment (15 CLK) + optional **deterministic vet-care subscription** (not "insurance").
4. **Buy feed + sell produce/animals to the NPC** at the floor **within a per-good daily purchase budget** (the budgeted price-floor faucet).
5. **Live market v1:** player↔player buy/sell inside a **deterministic EMA-trailed NPC floor/ceiling band** (no AMM), with a **price chart + live trade ticker** (labeled NPC-anchored while thin), price-time-priority order list.
6. **Breeding** (basic genetics/traits) with **base fee above offspring lifetime mint**, escalation, 48h cooldown, 5-breed cap — the reveal moment.
7. Coop slots + a couple of upgrade tiers (the perpetual sink).
8. **Retention hooks:** feed/egg timers + push notifications, daily login streak, a basic co-op (group + shared goal), the social trade ticker, and an **offline-grace / vacation-pause** so absence doesn't silently destroy assets.
9. **Spoilage** (eggs rot after 4 days, offline-grace applied).
10. **The economy backbone:** double-entry ledger (3 balance classes, integer milliclucks, fee-rounds-to-house, maturity-hold scaffolding), server-authority on all state/price/RNG, **mint-conservation invariant**, NetCoinFlow tracking + dashboard, and the **pre-launch 1,000-player / 90-day sim with Sybil + herd-growth + dump scenarios**.

**OUT of scope (v1):**
- Any real money in or out; any IAP-for-cash.
- Crypto/USDT.
- Multiple rails / payment integrations.
- **AMM / bonding-curve market (banned at all stages)**, full CLOB, leverage, shorting, derivatives, probabilistic "insurance", cosmetics store.
- Multiple animal species beyond hen (+rooster for breeding).
- Full KYC (vendor selected + light plumbing designed, not required while cash-out is off).
- Leaderboards/seasons can be a fast-follow if time-boxed.

---

## 12. Timeline & Milestones (solo + AI builder)

*Indicative; compress/expand to your pace. Two hard gates: the economy sim before any real money, and the written processor+lawyer sign-off before any P2 real-money-market code.*

| Weeks | Milestone | Deliverable |
|---|---|---|
| **1–2** | Skeleton | Repo, TS/Node + Postgres + Redis, Telegram Mini-App auth, **double-entry ledger (3 balance classes, integer milliclucks, fee-rounds-to-house) + server-authority + mint-conservation invariant** scaffolding |
| **3–4** | Core loop | Hen lifecycle (feed/grow/declining-yield/age/death + vet), NPC buy/sell at floor **with daily purchase budget**, timers + push, offline-grace |
| **5–6** | Market v1 | Player↔player trades inside **deterministic EMA NPC band** (no AMM), price chart, **live trade ticker**, listing/trade fees as sinks |
| **7** | Breeding + sinks | Breeding with **base fee above offspring mint**, escalation/cooldown/cap, coop upgrades, spoilage, vet events, deterministic vet subscription |
| **8** | Social + retention | Co-op + group goal, login streak, shareable "big flip" cards |
| **9** | **Economy sim** | 1,000-player / 90-day simulation **with Sybil + herd-growth + coordinated-dump scenarios and the corrected §4.5 lifetime params**; tune until `rolling_7d(NetCoinFlow) ≤ 0`; assert all 4 invariants |
| **10** | **P1 soft launch** | Seed founding-traders cohort from crypto audience; obsess over **D1/D7/D30** |
| **(parallel, start now)** | **VERIFY + legal lead-time** | Send §6.7 emails immediately (esp. **#1 FIB payout API** — gates P3 sequencing — and **#3 written sign-off on the exact P2 real-money-market mechanics** — gates P2); brief Kurdistan/Iraq lawyer on the P2 framing + KRG-vs-federal entity question; shortlist a **KYC/sanctions vendor** |
| **11–14** | *(gate: strong D7 **AND** §7.7 #1 written sign-off in hand)* → **P2** | Build `PaymentProvider` iface + **FIB** then **ZainCash** cash-IN adapters, deposit spread + **maturity hold**, premium breeds, light KYC plumbing + vendor contract |
| **15+** | *(gate: positive trade-fee/ARPU + lawyer P3 sign-off + FIB-payout-API resolved)* → **P3** | Reserve-backed asset-aware throttled cash-OUT (**local or crypto-first per §6.7 #1**), full KYC/AML via vendor + human reviewer, USDT-TRC20 bridge, CLOB upgrade, reserve/solvency dashboards |

> **Gates are hard.** Don't spend a dinar on growth until D7 is strong (P1). **Don't write P2 real-money-market code until the processor + lawyer bless the exact mechanics in writing (P2 gate — moved forward).** Don't ship cash-OUT until the lawyer confirms money-transmission posture and the FIB payout API question is resolved (P3).

---

## 13. Risks & Mitigations

| Risk | Likelihood / Impact | Mitigation |
|---|---|---|
| **"Profit-making platform" / gambling reclassification → frozen merchant accounts (begins in P2)** | Med / **Fatal** | Defend framing in *mechanics* (no RNG payouts, no house, skill/production value); identical wording everywhere; **written processor + lawyer sign-off on the exact P2 real-money-market mechanics BEFORE any P2 code** (§7.7 #1); halal-by-design + sharia review |
| **Free starter grant / Sybil-minted faucet (broke own invariant)** | High (if unfixed) / Severe | **Tutorial-class off-ledger grant**; tradeable balance starts at 0; phone+device verification to unlock; **mint-conservation invariant** alarmed |
| **Uncapped NPC-floor mint (the hidden uncapped faucet)** | High (if unfixed) / Severe | **Per-good NPC daily purchase budget + declining marginal floor**; modeled in the sim, not asserted |
| **Breeding is a faucet, not a sink** | Med / Severe | **Base breed fee set above offspring lifetime NPC-floor mint**; offspring eggs draw from the same NPC daily budget; modeled explicitly |
| **Headline hen economics ~2.7× too optimistic (false sim green light)** | Med / High | **Lifetime model with decline curve + expected vet cost (§4.5)**; feed+vet ratio tuned into the **45–70% band** (upper bound now stated); diligent player must still profit |
| **Faucet > sink → hyperinflation (Axie/StepN)** | Med / Severe | No uncapped mint; capped/decaying faucets; budgeted NPC floor; live NetCoinFlow + auto sink-thermostat; mandatory 90-day pre-launch sim with Sybil/herd/dump scenarios |
| **Growth-dependent ponzi / late-player bag-hold** | Med / Severe | Yield-anchored (DCF) value; no referral-to-earn/staking/deposit-yield; cash-out from real reserve only |
| **FIB has no payout API → cash-out is crypto-first, inverting the strategy** | Med / High | **Resolve §6.7 #1 before P3 engineering**; plan P3 as USDT/Kurdcoin off-ramp with crypto legal review pulled forward if confirmed |
| **AML/KYC under-scoped as "plumbing" for a solo founder** | High (if unfixed) / High | Reframe as **compliance program + paid KYC/sanctions vendor + named human reviewer**; operate cash-out through/under a licensed EPSP/partner; budget for it |
| **Reserve insolvency — coin OR asset-side run** | Low–Med / Severe | **Asset-aware** model: `cashout ≤ deposits + fees − margin` + buffer vs outstanding asset value at NPC floor; **NPC daily budget caps dump-mint**; caps; dynamic spread; segregated funds; published ratio |
| **Whale/bot/launderer manipulation** | Med / Med | NPC band + budget + circuit breakers; listing fee + min order life; **same-name-wallet cash-out + velocity/holding + counterparty-graph** (not the fee); breed caps; spot-only |
| **Thin MVP liquidity mis-sold as real discovery** | Med / Low | Honest UI labeling (NPC-anchored when thin); **no AMM** (no value leak); deterministic band + order list |
| **Spoilage/death while offline → involuntary loss → disputes** | Med / Med | **Offline-grace / vacation-pause**; destruction-while-offline never touches deposit-backed value (two-ledger split) |
| **Chargeback after coins already traded → ledger cascade** | Med / Med | **Deposit maturity hold + clawback/quarantine** of downstream value; never confiscate a third party's assets; KYC + receipts + non-refundable ToS |
| **Weak D7 — loop isn't addictive** | Med / High | P1 exists precisely to find this cheaply; fix the loop before any monetization or paid UA |
| **Low regional ARPU undercuts revenue** | High / Med | Trade-fee throughput (whole base) + near-zero CAC (Telegram virality) + spread, not per-head spend; **§5.3 figures marked illustrative, not planning inputs** |
| **Money/ledger correctness bug** | Low / Severe | Integer milliclucks; **defined rounding (to house) + sum-to-zero after rounding**; append-only double-entry; `FOR UPDATE` + serializable; idempotency keys; reconcile every settlement |
| **KYC PII breach** | Low / High | Encrypted-at-rest, access-logged store; retention/deletion policy; breach plan; least-privilege (§9) |
| **Solo-founder bandwidth / bus factor** | High / Med | Boring AI-fluent stack; one rail at a time; one adapter file per provider; ruthless P1 scope; outsource compliance |

---

## 14. Tech Stack Summary + Immediate Next 5 Steps

**Stack:** TypeScript/Node · Postgres (serializable, `FOR UPDATE`, encrypted PII) · Redis · Socket.IO · React PWA delivered as a **Telegram Mini-App** · **integer milliclucks, never floats, fee-rounds-to-house, ledger sums to zero after rounding** · **server is sole authority on state/price/RNG** · append-only **double-entry ledger with 3 balance classes (tutorial/earned/deposited), maturity holds, chargeback clawback** · **mint-conservation invariant** (`tradeable_minted == faucets + budgeted_npc_floor + deposits`) · single **PaymentProvider** interface + separate **ComplianceProvider** vendor adapter (one file per rail: FIB → ZainCash → Nass → USDT) · market is a **deterministic EMA-trailed NPC floor/ceiling band with a per-good daily purchase budget → upgrades to single-threaded CLOB per market** (no AMM/bonding curve at any stage).

**Immediate next 5 steps:**

1. **Scaffold the money-correct backbone first.** TS/Node + Postgres + Redis; append-only double-entry ledger with **three balance classes**, integer milliclucks, **fee-rounds-to-house + sum-to-zero-after-rounding**, and the **mint-conservation invariant** asserted at the ledger boundary; server-authority on all state/price/RNG; idempotency-key plumbing. Get this right before any gameplay — it's the one thing you can't retrofit, and it's where v1's two hidden faucets are closed.
2. **Build the P1 core loop** for a single Basic Hen (feed → declining-yield → age/death + vet) with **budgeted** NPC floor/ceiling buy/sell and **offline-grace**, on the Telegram Mini-App shell. Use the **corrected §4.5 lifetime params** (floor 3.5 CLK), not the v1 "+1 CLK/day" numbers.
3. **Stand up market v1 + the social ticker** — player↔player trades inside the **deterministic EMA NPC band (no AMM)** with a price-time-priority order list, price chart (honestly NPC-anchored when thin), live trade feed, and the 5% trade fee + listing fee wired as coin sinks (knowing the fee is a tax, not the laundering defense).
4. **Write and run the 1,000-player / 90-day economy simulation** with the corrected §4.5 params **plus Sybil-cluster, herd-growth, and coordinated-dump scenarios**; tune until `rolling_7d(NetCoinFlow) ≤ 0` and all **4 invariants** hold. **Do not launch without this** — and do not trust a green light produced from v1's understated params.
5. **Send the VERIFY emails + brief the lawyer NOW (they have the longest lead time and gate P2/P3):** FIB (`support@fib-payment.com`) — **payout/disbursement API existence (gates P3 sequencing) + exact merchant rate**; ZainCash — **per-txn acceptance % + the "profit-making platforms" clause**; and — highest leverage — get FIB + ZainCash compliance **and** a Kurdistan/Iraq lawyer to confirm **in writing** that the **exact P2 mechanics (real-money coin purchase + priced player↔player secondary market + 5% house fee, no cash-out)** are acceptable **before you write a line of P2 payment code**; shortlist a **KYC/sanctions vendor** in the same pass.