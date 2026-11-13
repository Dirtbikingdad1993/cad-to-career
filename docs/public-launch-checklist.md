# Finish public registration and reviewer setup

Supabase project: `kcerxxauczxydmexcdly` (CAD to Career).

## 1. Authentication redirect configuration — mandatory
Open [Supabase Auth URL Configuration](https://supabase.com/dashboard/project/kcerxxauczxydmexcdly/auth/url-configuration).

Set:
- **Site URL:** `https://cad-to-career.vercel.app`
- **Additional Redirect URLs:** `https://cad-to-career.vercel.app/**`
- For local development only: `http://localhost:8000/**`

Keep Email Confirmation enabled. Do not publish test accounts or passwords. The frontend signup confirmation flow expects implicit access/refresh tokens redirected to the site origin.

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
After the platform owner has registered and verified an account, the Supabase admin can grant it reviewer permission through SQL editor:
```sql
-- Replace only with the verified account email under your own control.
insert into public.reviewer_memberships(user_id,role)
select id,'admin' from auth.users
where email='verified-owner@example.com' and email_confirmed_at is not null
on conflict (user_id) do update set role=excluded.role;
```
Never enable public insertion/update access to reviewer membership. Do not grant reviewer access based on user-editable metadata. Test it with a second ordinary student account to ensure unauthorized users cannot open the reviewer queue.

## 4. Release checks
- Student A cannot read Student B's workspace or uploads.
- Project 1 must be server-verified; Projects 2–5 need signed-in reviewer approval.
- Capstone must reach >=85/100.
- Certificate must require every quiz pass, exercise confirmation, project approval and confirmed email.
- Public credential verification reveals name, issue date, validity, program only.
- Test on Android phones, desktop browsers and offline-to-online transitions.
- Complete legal operator contact, retention/deletion policy and storage malware screening before wide distribution.
