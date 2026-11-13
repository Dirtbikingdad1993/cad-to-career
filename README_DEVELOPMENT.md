# CAD to Career — Development and Release Status

## Current stack
- Static HTML/CSS/JavaScript learning app (no runtime npm dependencies)
- Private GitHub repository: Dirtbikingdad1993/cad-to-career
- Vercel production: https://cad-to-career.vercel.app/
- Supabase Auth, PostgreSQL, private Storage and JWT-authenticated Edge Functions
- Responsive Android PWA with offline lesson files and on-device draft cache

## Implemented
- 20 course lessons, 60 practice quiz questions, student dashboard
- Real 2D SVG CAD editor, numeric dimensions, import/export, undo/redo
- Five project briefs and five assessment rubrics
- Email/password account registration, login, logout, recovery and password updates
- Private cloud workspace per authenticated user; automatic save after edits, restore on login
- Guest-to-account import and account-to-account isolation
- Official server-side quiz scoring, exercise confirmations and Project 1 geometry checks
- Private evidence uploads for Projects 2–5 and Needs Review status
- Reviewer-only queue, private short-lived evidence links, verdicts, rubric scores and feedback
- Server-controlled credential eligibility and minimal public credential verification
- Student account protection via Supabase RLS; Vercel previews protected, production public
- Unit smoke tests and security-focused checks

## Live Supabase project
- Project: `kcerxxauczxydmexcdly` (us-west-1)
- Publishable key is in public `cloud-config.js`, as intended. **Never** commit service-role keys.
- Applied migrations: `0001_initial.sql`, `0002_student_cloud_workspaces.sql`, `0003_reviewer_assessment.sql`
- Edge Functions: `cad-assess` (JWT required) and `cad-verify` (public read-only)
- RLS test using two synthetic users was successful; test transaction rolled back.

## Still needs live verification / setup before broad enrollment
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

## Verified portfolio implementation

The opt-in portfolio flow and its verification limits are documented in
[docs/VERIFIED_PORTFOLIOS.md](docs/VERIFIED_PORTFOLIOS.md). The public page is
private by default and displays only case studies whose underlying assessment
still meets the server-side checks. Real-account and reviewer testing remains a
release requirement.
