# CAD to Career account providers

The application supports Google, Microsoft, GitHub, and Apple through Supabase Auth. The sign-in screen offers only providers that Supabase reports as enabled. Email and password accounts are managed by the existing cloud client. A provider is not ready until its credentials, callback, redirect settings, and real sign-in have been verified.

## Provider registration

Create an OAuth application with each provider and configure its callback URL as:

`https://kcerxxauczxydmexcdly.supabase.co/auth/v1/callback`

Configure each provider's credentials in the [Supabase Auth provider settings](https://supabase.com/dashboard/project/kcerxxauczxydmexcdly/auth/providers). Keep provider secrets, Apple signing keys, and Supabase privileged keys out of the repository, browser code, and chat. The publishable key used by the web client is not a service-role key.

1. [Google setup](https://supabase.com/docs/guides/auth/social-sign-in/auth-google): create a Google OAuth web client and configure the consent screen.
2. [Microsoft setup](https://supabase.com/docs/guides/auth/social-sign-in/auth-azure): register an app in Microsoft Entra ID, choose account types that include the desired personal Microsoft accounts, and configure a client secret. The application requests the required `email` scope.
3. [GitHub setup](https://supabase.com/docs/guides/auth/social-sign-in/auth-github): register a GitHub OAuth application and configure its client ID and secret.
4. [Apple setup](https://supabase.com/docs/guides/auth/social-sign-in/auth-apple): configure an Apple Developer account, Services ID, signing key, and the generated client secret. Apple web OAuth secrets must be rotated at least every six months.

In [Supabase URL configuration](https://supabase.com/dashboard/project/kcerxxauczxydmexcdly/auth/url-configuration), set the production Site URL and allow the exact production origin plus `/` as the post-login redirect. If preview environments are used, configure only the preview origins that should be allowed. Supabase's callback URL above is the redirect URI registered with the providers; the app's origin is the separate post-login redirect allowed by Supabase.

## Email confirmation and recovery

Before inviting the public to create email/password accounts, verify confirmation and password-reset delivery. Supabase's built-in SMTP service is restricted to project-team addresses; configure an approved [custom SMTP provider](https://supabase.com/docs/guides/auth/auth-smtp) for broader public email delivery. Keep SMTP credentials in Supabase, not GitHub.

## Verification

For each enabled method, use a real test account to sign in, save a small piece of practice data, sign out, sign in on another device, and confirm that the same account's data returns. Test cancelled and failed authorization, Android and desktop browsers, password recovery, and email confirmation. Do not assume two different providers identify the same account; verify linking behavior separately before promising shared data between login methods.

`npm ci && npm run build` inside `auth-build/` regenerates `social-auth.js` from pinned dependencies. Run `node --test tests/social-auth.cjs` from the repository root to test provider filtering, PKCE, callback handling, and session preservation with a mocked auth server.
