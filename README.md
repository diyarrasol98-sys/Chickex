# ChickeX 🐔📈

A livestock-farming game fused with a live, player-driven exchange. **Iraq/Kurdistan market**, local fiat rails first (ZainCash/FIB/Nass), crypto later. Built as a Telegram Mini-App.

## Run the prototype
```bash
bun app/server.ts          # → http://localhost:5666
# tunable: CHICKEX_DAY_MS=9000  (1 game-day in ms, demo speed)
```
Stack: **Bun + bun:sqlite + vanilla-JS/canvas single-page Telegram Mini-App**, zero build step.

## What's here
- `app/server.ts` — server-authoritative game + market engine. **Double-entry, integer-milliclucks ledger** (invariant: `SUM(accounts)==0`). Multi-species livestock (HEN/ROOSTER/DUCK/GOAT), produce (EGG/MILK), lifecycle (young→prime→aging→elder→die), and a live exchange (6 instruments, order book, market+limit orders, simulated tape + news events, 1.5% house fee). Farm↔market linked (buy livestock → spawns on farm; collect produce → sellable).
- `app/public/index.html` — the Mini-App UI: animated farm world (original SVG animals, particles, sound, level/XP) + premium trading terminal (gradient area chart, depth book, buy/sell ticket).
- `CHICKEX_BUILD_PLAN.md` — full 14-section build/business plan (Iraq/Kurdistan-tailored).
- `CHICKEX_CRITIQUE.md` — adversarial review of the plan.

## Status
Play-coins only — **no real money, no cash-out, no crypto yet** (P1 "Hook" phase). Single-player, so market "other traders" are simulated; real P2P matching is a backend swap (UI ready).

## Roadmap (next)
Breeding/genetics · idle/offline earnings · daily rewards · Telegram bot + tunnel deploy · real multiplayer market · payments adapter (ZainCash/FIB/Nass → crypto).
