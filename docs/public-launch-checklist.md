# CAD to Career — public launch checklist

## Live audit — November 18, 2026

**Status:** Public course and PWA are deployed, but do not advertise unrestricted enrollment or verified certificates yet.

**Confirmed:**
- Vercel production and public URLs: deployment READY. Public lessons and course routes exist in the repository; external crawler/indexing verification remains pending.
- Signup and recovery redirects: source now pins `https://cad-to-career.vercel.app/`; production commit `cb23f3d` deployed.
- Real-user tests: account creation/confirmation and password sign-in worked for test accounts; lesson progress restored after reopening, appeared on a second device, and manual plus automatic offline-to-cloud synchronization passed.
- Supabase public workspace RLS enabled; a saved completed-lesson record was observed. Independent student A/B isolation and comprehensive reviewer/file security still require production QA.
- Recent frontend: rate-limited email requests now display an actionable message instead of raw provider wording.

**Blocking public enrollment / wide launch:**
1. **Transactional email** — Supabase built-in SMTP returned "email rate exceeded"; set up custom SMTP with a verified sending domain and test a *non-team* signup, confirmation redirect, and password reset. Keep email confirmation enabled. [SMTP settings](https://supabase.com/dashboard/project/kcerxxauczxydmexcdly/auth/smtp) and [rate limits](https://supabase.com/dashboard/project/kcerxxauczxydmexcdly/auth/rate-limits).
2. **Policy/operator details** — designate a support/privacy contact, publish a concrete account deletion and retention process and update preview privacy/terms before broad enrollment.
3. **Untrusted evidence uploads** — validate file signatures and scan uploaded files server-side, plus orphan cleanup and storage quota monitoring before inviting arbitrary public submissions.
4. **Reviewer setup and assessment QA** — assign a verified owner-only reviewer role, test two-user access controls, independent reviews, certificates, revocations and read-only public credential verification.
5. **Security and observability** — review the leaked-password protection warning in Supabase; confirm monitoring and abuse protection without weakening login or making an unapproved paid upgrade.
6. **SEO/marketing validation** — sitemap and robots files exist; indexing and external crawlability have not been independently confirmed.

**Public release scope today:** The free course can be shared as a public preview; do not promise seamless general-purpose signup or official certification until the gates above pass.

---


Supabase project: `kcerxxauczxydmexcdly` (CAD to Career).

## 1. Authentication redirect configuration — mandatory
Open [Supabase Auth URL Configuration](https://supabase.com/dashboard/project/kcerxxauczxydmexcdly/auth/url-configuration).

Set:
- **Site URL:** `https://cad-to-career.vercel.app`
- **Additional Redirect URLs:** `https://cad-to-career.vercel.app/**`
- For local development only: `http://localhost:8000/**`

Keep Email Confirmation enabled. Do not publish test accounts or passwords. The frontend signup and recovery requests now specify the fixed production return URL. Re-test fresh emails after SMTP is enabled; old emails cannot validate a new setting.

**Repeatable configuration option:** I added [a GitHub Actions workflow](https://github.com/Dirtbikingdad1993/cad-to-career/actions/workflows/supabase-auth-urls.yml) and a `scripts/auth-redirects.mjs` command. They can read or update the exact site/redirect URLs while preserving existing allowlisted destinations. They require a **project-scoped Supabase Management API token** stored as the protected repository secret `SUPABASE_MANAGEMENT_PAT` with `auth_config_read`, `auth_config_write` and `project_admin_write` permissions. Create that secret yourself, then run the workflow with mode **configure**. The tool connection here does not expose your Supabase Management API token, so this workflow has **not** been run. It does not manage SMTP credentials.

The script will also assert that email confirmation remains enabled. No third-party OAuth providers are automatically enabled without their own verified client credentials.

## 2. Transactional signup and password-reset email — mandatory for public users
Supabase's built-in SMTP is restricted to the Supabase organization team accounts. It is **not suitable for public signup**.

Open [Supabase SMTP Settings](https://supabase.com/dashboard/project/kcerxxauczxydmexcdly/auth/smtp).

Choose a transactional email provider (Resend, Amazon SES, Mailgun, etc.) and configure a verified sender domain with SPF/DKIM records. Enter SMTP host, port, sender address, username and password in Supabase's private dashboard; do not paste them into chat or GitHub and do not expose them as public Vercel client variables.

Verify:
- email confirmation reaches a non-team test address;
- confirmation returns to the CAD to Career URL and signs in;
- wrong passwords are rejected;
- password reset email returns to `/#/reset-password`;
- reset updates credentials and old credentials stop working;
- new device gets same CAD geometry and lesson progress;
- sign-out removes account session from that device.

## 3. Reviewer activation
**Current live state:** test/student accounts have been confirmed, but no reviewer membership was present in the most recent database audit. Do not insert an arbitrary or unverified email.

1. Register your actual owner account at [CAD to Career](https://cad-to-career.vercel.app/#/register), after SMTP and URL redirects are working.
2. Open the verification email and confirm the account.
3. Open [Supabase SQL Editor](https://supabase.com/dashboard/project/kcerxxauczxydmexcdly/sql/new).
4. Open the repository's [`scripts/bootstrap-reviewer.sql`](https://github.com/Dirtbikingdad1993/cad-to-career/blob/main/scripts/bootstrap-reviewer.sql). Replace the placeholder with the exact verified owner account email and execute it in SQL Editor. This script fails explicitly if the account does not exist or has not verified its email.
5. Sign in as that account and visit `https://cad-to-career.vercel.app/#/reviewer`.

**Security confirmed:** Students have no direct INSERT/UPDATE/DELETE access to reviewer memberships, grades, project approvals or certificates. The reviewer service uses authenticated server-side membership checks and atomic database approvals. In rolled-back database tests, self-review, duplicate approvals, capstone approval below 85/100 and forged student approvals were rejected.

## 4. Release checks
- Student A cannot read Student B's workspace or uploads.
- Project 1 must be server-verified; Projects 2–5 need signed-in reviewer approval.
- Capstone must reach >=85/100.
- Certificate must require every quiz pass, exercise confirmation, project approval and confirmed email.
- Public credential verification reveals name, issue date, validity, program only.
- Test on Android phones, desktop browsers and offline-to-online transitions.
- Complete legal operator contact, retention/deletion policy and storage malware screening before wide distribution.

## 5. Release evidence and responsibilities

- **Production code:** Confirm Vercel READY on the exact commit and GitHub test results after each change.
- **Connected service checks:** Supabase project health, workspace presence and advisor warnings can be read with the existing integration; the current integration cannot set Auth SMTP credentials or edit hosted Auth URL settings.
- **Account-holder actions:** Configure provider credentials only in secure Supabase/Resend dashboards, verify DNS ownership, designate the site's legal operator/contact and approve final data-retention rules.
- **Acceptance test:** From an unassociated email address, register, click the new verification link, reach the public site, sign in, reset password, recover work on a second device, and test unauthorized student/reviewer access. Complete this after production SMTP is working.

**Do not announce unrestricted public registration or independently verified credentials as fully tested until these prerequisites are satisfied.**
