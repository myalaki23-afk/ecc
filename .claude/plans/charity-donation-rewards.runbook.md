# Loop Runbook: Charity Donation & Rewards SPA

**Pattern:** continuous-pr (per-phase gated commit)
**Mode:** fast (loop-start override 2026-07-05)
**Model tier:** Opus 4.8 (1M context)
**Branch:** `main` (loop-start override — commit phases directly, no feature branch)
**Started:** 2026-07-04 · **Loop resumed:** 2026-07-05

> Fast-mode gate: run `npm run type-check` (0 errors) before each phase commit to keep
> `main` green; defer the `: any` / `as any` grep to the final phase.

## Objective
Feature-Sliced Vue 3 + strict-TS + Tailwind SPA: donation slider ($10–$500, 2.5% fee
added on top), intercepted mock-auth (1.5 s) with pending-donation auto-commit,
rAF Wheel of Fortune with clean teardown, append-only deep-cloned ledger. Headless
composables decouple logic from presentation.

## Decisions
- Fee model: **added on top** — `total = amount + amount * 0.025`.
- Cross-feature state: **singleton store composables** (no Pinia/router dependency).
- "Navigate away from wheel" = `v-if` unmount (proves rAF/listener teardown).
- Tests: **type-check + manual only** (no runner installed).

## Gate (run after every code phase)
```bash
npm run type-check      # vue-tsc --noEmit → 0 errors
grep -rn ": any\|as any" src/   # must be empty
```
Final gate additionally: `npm run build` (exit 0) + manual `npm run dev` behavioral walkthrough with zero console errors.

## Stop condition
All phases committed AND `type-check` + `build` green AND manual behavioral flow passes.

> **✅ STOP CONDITION MET (2026-07-05).** Phases 0–6 committed on `main` (HEAD `07bd2ff`).
> Final gate: `type-check` exit 0, `build` exit 0, any-grep clean, manual walkthrough passed
> (auth interception + pending auto-commit, wheel reward → ledger, `v-if` teardown, zero console errors).

## Phases (each = one commit unit)
| # | Phase | Gate |
|---|---|---|
| 0 | Tooling: type-check script, slim style.css, delete HelloWorld | type-check |
| 1 | Shared: types, currency, clone, config, BaseButton, BaseModal | type-check |
| 2 | Auth: useAuth + LoginModal | type-check |
| 3 | Donation: useDonation + DonationCard | type-check |
| 4 | Ledger: useLedger + LedgerDashboard | type-check |
| 5 | Wheel: useWheelOfFortune + WheelOfFortune | type-check |
| 6 | App orchestration + final validation | type-check + build + manual |

## Rollback
Per-phase commits on the feature branch; revert a phase with `git revert <sha>` or
`git reset --hard HEAD~1` before the next phase starts.

## Monitor
```bash
git log --oneline feat/charity-donation-rewards
npm run type-check
```
