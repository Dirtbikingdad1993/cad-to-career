# Finish public registration and reviewer setup

Supabase project: `kcerxxauczxydmexcdly` (CAD to Career).

## 1. Authentication redirect configuration — mandatory
Open [Supabase Auth URL Configuration](https://supabase.com/dashboard/project/kcerxxauczxydmexcdly/auth/url-configuration).

Set:
- **Site URL:** `https://cad-to-career.vercel.app`
- **Additional Redirect URLs:** `https://cad-to-career.vercel.app/**`
- For local development only: `http://localhost:8000/**`

Keep Email Confirmation enabled. Do not publish test accounts or passwords. The frontend signup confirmation flow expects implicit access/refresh tokens redirected to the site origin.

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
**Current live state:** no student accounts are registered yet and no reviewer has been granted access. Do not insert an arbitrary or unverified email.

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

## 5. Production-readiness status (November 13, 2026)

- **Completed:** Backend migrations, least-privilege table grants, database ownership checks for two simulated users, reviewer authorization and atomic decision tests. Test data was rolled back.
- **Completed:** Vercel Git deployment, cloud authentication UI, student drafts, private submission and reviewer UI code, server grader and read-only certificate verification endpoint.
- **Incomplete:** Supabase project Site URL/redirect allowlist has not been read or configured through a privileged token. The current connected tools do not expose those Auth settings.
- **Incomplete:** SMTP host, verified sender domain and email credential have not been supplied or configured, so public email verification/password resets are not live for arbitrary users.
- **Incomplete:** Owner account has not been created and email-verified, so reviewer admin membership cannot be safely granted yet.
- **Incomplete:** Real-device onboarding, public-domain email delivery, role-access QA from actual accounts and storage malware scanning.

**Do not announce unrestricted public registration or verified certificates as fully tested until these prerequisites are satisfied.**
