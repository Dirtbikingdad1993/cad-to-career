# CAD to Career — in-app learning assistant

## Implemented
- Responsive Help button on every route for desktop and mobile Android PWA.
- Guest and offline users: no-cost deterministic navigation help and keyword lookup across 53 lessons, 5 assessed projects and 12 extra self-reviewed projects.
- Signed-in learners: optional, real model-generated answers via Supabase Edge Function cad-help (verify_jwt=true). The OpenAI API key is **server-only**, never placed in app.js, cloud-config.js, GitHub or Vercel public environment variables.
- Replies include relevant safe in-app navigation links; basic keyboard support and screen-reader labels.
- No persistent chat transcript in app storage. At most four short recent chat messages and limited *public* lesson text are forwarded with each model request.
- Each verified account is restricted by an atomic database quota to 4 requests/minute, 20/day (UTC). SQL lives in scripts/cad-help-rate-limits.sql and is applied to the existing Supabase project. Browser roles cannot execute the quota function.

## Enable live AI answers — owner action required
The Edge Function is deployed, but model-generated answers require an owner-managed OpenAI API credential.
1. Create an API key in your own OpenAI developer account at https://platform.openai.com/api-keys. Set an appropriate project spend limit/alerts. API usage is separately billed; a ChatGPT subscription does **not** grant API usage.
2. In Supabase project kcerxxauczxydmexcdly, open Edge Functions → Secrets. Set **OPENAI_API_KEY** to your key, entered in the private Dashboard only.
3. Optional: set **OPENAI_MODEL** to an available inexpensive text-capable Responses API model. Source default is gpt-4.1-mini.
4. Sign into CAD to Career with a verified account. Open Help, ask "What is a fully constrained sketch?" and confirm an AI explanation is returned (not just the local course guide).
5. On an incognito/guest browser, open Help and confirm navigation guidance works without a login or model key. Check mobile display and offline guidance.
6. Verify quotas, provider budget/usage and function logs. Treat an HTTP 503 as "AI not configured" and 429 as "question quota reached".

**Do not put API keys into this chat, public repositories, browser JavaScript or customer-visible settings.** Do not disable JWT verification or server quotas to make guest AI requests work. Live AI currently requires a verified student login; visitors can still use the in-app lesson/navigation guide. General public enrollment also needs transactional SMTP configuration.

## Operational details
- Frontend: /assistant.js, /styles.css, /index.html, /cloud.js
- Endpoint: POST /functions/v1/cad-help (verified Supabase JWT, JSON {message,context,history})
- Edge source: supabase/functions/cad-help/index.ts (not copied into public static deployment)
- SQL: scripts/cad-help-rate-limits.sql (private quota table, function executable only by service_role)
- Models use the OpenAI Responses API with store:false and capped max output tokens. This is not a promise of zero provider-side security logging.
- The assistant never changes records, approves projects or issues certificates. It must not be represented as an instructor, safety certification or human reviewer.
- If the AI provider is unavailable, navigation and lesson lookup continue offline.

## Future improvements
- Optionally allow guest model responses after an owner-approved abuse-protection scheme (CAPTCHA plus durable anonymous quotas) and billing review.
- Add broader retrieval over curriculum material while excluding private assessment answer banks.
- Add an opt-in feedback/rating mechanism and monitoring without collecting student secrets or private design files.
