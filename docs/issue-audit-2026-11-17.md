# CAD to Career — GitHub issue audit (2026-11-17)

This audit distinguishes **implemented code** from externally verified product outcomes. Do not close an issue only because the feature appears in source. Learner project approvals and certificates are evidence-based and must not be assumed.

## Verified code fixes
| Reference | Status | Evidence |
|---|---|---|
| PR #21 — redesign all 53 lessons | **Merged** | Detailed lesson guides and mobile layout; GitHub validation passed |
| Issue #18 — public official quiz answers | **Closed** | 60 new official questions and keys in unexposed `app_private.assessment_questions`, secure grading RPC, 5 attempts per rolling 24h, no keys in client response, verified correct/incorrect grading in rolled-back SQL tests |
| Issue #5 — deterministic geometry validator | **Closed** | Positive/negative geometry tests; local CAD checks are not misrepresented as arbitrary DXF/STEP parsing |
| Issue #6 — deployment/config inventory | **Closed** | Vercel READY on `2f1b461`, GitHub checks passed, RLS/secret handling confirmed; remaining authentication delivery addressed separately |
| CAD lab keyboard accessibility | **Implemented; real-device signoff open** | Keyboard-selectable entity palette, labeled focusable SVG shapes and automated checks |
| Dependency updater config | **Repaired** | Replaced ignored `.github/dependabot.ymll` with valid `.github/dependabot.yml` for legacy Base44 dependency monitoring |

## Open issues with actual blockers

| GitHub issue | Work that remains | Why it cannot be truthfully closed yet |
|---|---|---|
| [#15 Public registration checklist](https://github.com/Dirtbikingdad1993/cad-to-career/issues/15) | Verify Auth Site URL and redirects, configure verified sender domain and custom SMTP, send confirmation and recovery email to non-team addresses, activate one email-confirmed owner reviewer | No custom sender or domain is confirmed. A domain quote is not a purchase; Vercel registration requires separate explicit checkout authorization |
| [#10 Free learning and reviewer-approved portfolios end to end](https://github.com/Dirtbikingdad1993/cad-to-career/issues/10) | Test real student/reviewer accounts, private files, revocation, offline recovery, consent and accessibility on Android/desktop | Synthetic tests cannot substitute for a real end-to-end release exercise |
| [#7 Learner demo](https://github.com/Dirtbikingdad1993/cad-to-career/issues/7) | Run and record a real demo with two separate authenticated learners | Needs actual device/user participation |
| [#4 Interactive CAD lab](https://github.com/Dirtbikingdad1993/cad-to-career/issues/4) | Validate touch, numeric input, keyboard/screen-reader feedback, sign-out/in retention on actual Android devices | Code and automated accessibility tests exist; physical device QA is pending |
| [#2 Authentication & progress](https://github.com/Dirtbikingdad1993/cad-to-career/issues/2) | Test signup, confirmation, password recovery, two-device sync with production email routing | Auth code/RLS exist; provider settings and real account test are not verified |
| [#3 Lessons 1–4](https://github.com/Dirtbikingdad1993/cad-to-career/issues/3) | Owner/content quality signoff on glossary, examples and task sequence; user completion is not assumed | 53 lesson redesign is merged; signoff needs explicit review |
| [#1 React/TypeScript foundation](https://github.com/Dirtbikingdad1993/cad-to-career/issues/1) | Owner decision whether to migrate current independent vanilla JS frontend to React/TypeScript | The production app works without Lovable/Base44; a framework migration is a separate architecture project with regression risk |
| [#11 Organization pilots](https://github.com/Dirtbikingdad1993/cad-to-career/issues/11) | Identify/contact authorized schools and employers; agreements and real pilot participants; authenticated reporting before billing | Fictional public pilot is **not** a real partner service |
| [#12 Affiliate program applications](https://github.com/Dirtbikingdad1993/cad-to-career/issues/12) | Verify eligibility/terms, apply using actual organization identity and contact, attach truthful referral disclosures | No applications/acceptances have been verified |
| [#13 Recruiting marketplace gate](https://github.com/Dirtbikingdad1993/cad-to-career/issues/13) | At least a meaningful verified portfolio cohort, employer demand, moderation, candidate consent, owner launch approval | **Intentional safety and product gate** — recruiting must remain disabled |

## Open pull requests
| PR | Decision |
|---|---|
| [#16 Verified portfolio](https://github.com/Dirtbikingdad1993/cad-to-career/pull/16) | **Draft, do not merge yet.** Branch diverged before PR #21 and the new official assessment version; rebase and preserve server-only exam security. Real consent/reviewer QA still missing |
| [#9 Social OAuth](https://github.com/Dirtbikingdad1993/cad-to-career/pull/9) | **Do not merge yet.** Provider credentials and redirects not configured, branch conflicts and fails CI |
| [#14 Legacy Base44 dependency updates](https://github.com/Dirtbikingdad1993/cad-to-career/pull/14) | Rebase/test the separate legacy app and its Zod major update before merging; it does not ship in the independent CAD site |

## Current production/assessment status

- Latest verified frontend deployment commit: `2f1b461e2626505f6dccac70e220092d3d2a0ffa`, Vercel READY.
- GitHub validation passed at `d393f62c61d88e697e6c8843aa6cf44f29723bb4`, covering the new CAD keyboard selection test.
- Live Supabase `cad-assess` Edge Function version **8** uses `foundations-v2-private`, with a new private 60-question bank. Client local practice answers do not count for official credit.
- The Supabase security advisor reports informational no-policy entries on intentionally server-only tables and a warning that leaked-password protection is disabled. **No plan upgrade or external domain purchase has been authorized.**
- Public registration and certification should **not** be advertised as fully release-tested until the blockers above are resolved.

## Prioritized next real-world actions
1. Purchase and verify a CAD to Career domain using an explicitly approved registrant/payment checkout; set DNS ownership and transactional SPF/DKIM records.
2. Configure Supabase Auth Site URL and allowed redirects, and a verified SMTP provider; test a confirmation/reset email to a non-team inbox.
3. Activate a real email-confirmed owner reviewer identity; exercise student A/B privacy with project files and reviewer-only approvals.
4. Complete Android Chrome + desktop testing, accessibility and backup/reconnect scenarios.
5. Approve legal operator/contact details, retention/deletion rights and private-upload scanning for general enrollment.
6. Only after validated learners and demand exist, start organization pilots or recruiting evaluation.

**No code test can establish that a third-party domain was purchased, a real partner agreed, or a user completed a design project.**
