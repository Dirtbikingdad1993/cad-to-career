# CAD to Career — Development and Release Status

## Current stack
- Static HTML/CSS/JavaScript learning app (no runtime npm dependencies)
- **Public** GitHub repository: Dirtbikingdad1993/cad-to-career (never commit secrets or private exam keys)
- Vercel production: https://cad-to-career.vercel.app/
- Supabase Auth, PostgreSQL, private Storage and JWT-authenticated Edge Functions
- Responsive Android PWA with offline lesson files and on-device draft cache

## Implemented
- 53 detailed lessons, including 20 core lessons and 33 additional practice-only lessons, with 159 practice quiz questions and a student dashboard
- Real 2D SVG CAD editor, numeric dimensions, import/export, undo/redo
- Five project briefs and five assessment rubrics
- Email/password account registration, login, logout, recovery and password updates
- Private cloud workspace per authenticated user; automatic save after edits, restore on login
- Guest-to-account import and account-to-account isolation
- Official server-side quiz scoring with **60 different server-held official questions**, a 5-attempt/24h limit and `foundations-v2-private` credit, plus exercise confirmations and Project 1 geometry checks. The 159 publicly visible questions remain local **practice only**.
- The existing certificate uses only the original 20 core lessons. Additional lesson quizzes and confirmations are practice records and do not create official assessment entries or change credential eligibility.
- Private evidence uploads for Projects 2–5 and Needs Review status
- Reviewer-only queue, private short-lived evidence links, verdicts, rubric scores and feedback
- Server-controlled credential eligibility and minimal public credential verification
- Student account protection via Supabase RLS; Vercel previews protected, production public
- Unit smoke tests and security-focused checks

## Live Supabase project
- Project: `kcerxxauczxydmexcdly` (us-west-1)
- Publishable key is in public `cloud-config.js`, as intended. **Never** commit service-role keys.
- Applied migrations include the initial schema, secure cloud workspaces, reviewer integrity, least-privilege student grants, atomic reviewer decisions, opt-in portfolio drafts, and `20261117103000_private_official_quiz.sql` / `20261117104500_service_private_quiz_usage.sql`.
- Edge Functions: `cad-assess` (JWT required) and `cad-verify` (public read-only)
- RLS and private quiz tests using synthetic users passed. Tested correct and incorrect answers, rate limits, and service-only bank access; all synthetic records were rolled back.

## Still needs live verification / setup before broad enrollment

**November 17, 2026:** GitHub CI passed and the Vercel production build for `2f1b461` was READY. Public signup email/SMTP and redirect URL configuration remain unverified. A domain purchase is only quoted, not approved or completed. Supabase's leaked-password protection reports a warning on the Free tier; do not upgrade the plan without explicit consent.
1. **Supabase Auth URL configuration:** Set Site URL to `https://cad-to-career.vercel.app` and allow redirect URLs including `https://cad-to-career.vercel.app/**` in Supabase Dashboard → Authentication → URL Configuration. This setting cannot be changed with the current connected action set and is not verified.
2. **Real registration QA:** Confirm email verification link, password reset, logout, new-device sign-in and a saved CAD drawing using two test devices.
3. **Reviewer identity:** Sign in as the designated reviewer, then have an administrator assign that user's UUID in `public.reviewer_memberships`. The reviewer role is never granted through public self-service. Test project approval and certificate issuance end-to-end.
4. **Final public policies:** Name a legal operator/support channel; publish finalized privacy, retention, deletion and terms.
5. **Account deletion/data export:** Export of local state is implemented; cloud account deletion and complete subject data export need a hardened endpoint and separate QA.
6. **Production file controls:** Verify native CAD file signatures and storage quotas in a trusted upload API, add antivirus/malware scanning and periodic orphan cleanup before allowing arbitrary public uploads.
7. **Browser QA:** Android Chrome, desktop browsers, screen readers, service worker upgrades, and internet disconnection/reconnection.
8. **Performance and error monitoring:** Add incident alerts and server metrics.

## Privacy and credential integrity
- Cloud workspace JSON is for **practice**; localStorage and browser states are not trusted as certification evidence.
- Official quiz and Project 1 scores are computed independently in a JWT-authenticated Supabase Edge Function and saved by a service role.
- Human-reviewed Projects 2–5 require authorized reviewer membership. No student may self-assign a reviewer role.
- A certificate is issued only after all official course and project requirements pass, capstone ≥85/100, confirmed email, and a server-side eligibility check.
- Public verification returns name, program, issue date and validity only. It does not disclose student emails or CAD files.

## Running locally
```bash
python3 -m http.server 8000
```
Open http://localhost:8000. For local authentication, add `http://localhost:8000/**` to the Supabase Auth redirect allow-list. Do not replace production redirects with localhost.

## Testing
```bash
node --check app.js
node --check cloud.js
node --check data.js
node tests/smoke.cjs
node --test tests/geometry-feedback.cjs
```
The GitHub Actions workflow runs the checks. Tests do **not** substitute for a verified student login and live cross-device exercise.

## Deployment
Main-branch pushes deploy automatically through Vercel. Keep preview deployment protection enabled. Check the new commit's production deployment status before release.

## License
Repository remains private with no declared open-source license. Course content is free to access, but do not assume source redistribution permissions.

