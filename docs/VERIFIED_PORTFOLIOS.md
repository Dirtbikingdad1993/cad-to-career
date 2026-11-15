# Verified portfolios

The portfolio is private until the learner explicitly enables a public page. Each
case study has its own publication control. Learner-written text is always
labelled as such; it is not an assessment or proof of authorship.

- Project 1: a new `foundations-v1` server geometry check stores the five
  measured shapes and a SHA-256 digest in the server-created submission. Public
  display rechecks both the digest and geometric requirements. Sharing a case
  study shares these measurements. Earlier approvals did not retain geometry;
  learners must rerun the check before sharing those projects. Neither a digest
  nor a server check proves authorship or a complete dimensioned drawing.
- Projects 2–5: the public page requires an approved submission, a matching
  approved review and score, a non-owner reviewer, and the applicable score
  threshold. Changing or removing a review automatically removes its public badge
  and project. The assessment service's existing transactional review function
  enforces reviewer membership and bars self-review at decision time.
- Evidence is private by default. Learners may choose a single PNG or JPEG image
  from that exact submission. The service verifies the path and image signature,
  limits images to 5 MiB, checks publication and review status on each request,
  and serves a `no-store` response. Shared images may contain metadata. Source CAD
  files, submitted notes, email addresses and reviewer feedback are not exposed.
- Disabling the page, unpublishing a case study, or replacing the link stops new
  public access; it cannot recall copies already saved by a visitor.

## Deployment and checks

`supabase/migrations/20261113152920_verified_portfolio.sql` adds two
service-only tables with RLS and no client grants. The `cad-portfolio` Edge
Function uses the standard Supabase-provided service-role environment secret.
Deploy it with JWT gateway verification disabled because public portfolio GETs
are intentionally anonymous; the handler independently verifies the user token
and ownership for every POST. Never put a service key in frontend code.

Run `node tests/smoke.cjs`, `node tests/cloud-sync.cjs`, and
`node --test tests/geometry-feedback.cjs tests/portfolio.test.mjs`. Test account
creation, review submission, approval, publication, image opt-in, unpublishing,
link replacement and cross-account isolation in a non-production environment
before a public release. The automated tests use synthetic data and mocked
services; they do not establish that a real learner can register or receive a
review in production. Public registration still depends on the separate SMTP and
redirect setup in the launch checklist. Reviewers must be provisioned separately.

The portfolio function enforces a shared ceiling of 600 requests per minute and
an additional 60 requests per minute for each authenticated account. It records
throttling in function logs and rejects oversized request bodies. The public
ceiling is shared: a surge can temporarily affect all visitors, and a database
counter is not a substitute for an independent edge-level DDoS/WAF service.
Configure rate-limit alerts and network-edge protections before wide release.
