# CAD to Career — product and revenue sequence
Updated: 2026-11-13 · status: implementation and planning, **not customer validation**

## Nonnegotiable product promise
Individuals can learn CAD, complete core exercises, and assemble a portfolio **for free**. No educational activity or earned credential is automatically verified. A learner's self-claim, a deterministic geometry check, a reviewer approval, and certificate issuance are separate states. The platform does not offer an accredited professional license or guaranteed job.

## Stage 1 — Free learning and trusted learner portfolios (first; maintain indefinitely)

Existing independent GitHub app: 20 free lessons, browser 2D drafting lab, practice quiz feedback, local learning progress, Supabase sign-in and saved workspace code, private project evidence uploads and signed reviewer access logic. Backend code for quiz/project assessment and minimal-data certificate verification is present. Its **deployment and end-to-end operation must be verified** before calling any of these production ready.

New: `/verify.html` — public read-only UUID verification UI using `cad-verify`. The UI never issues a credential, requests passwords, or claims a certificate valid unless the server returns `valid:true` and it is not revoked.

Acceptance tests (complete before public marketing):
- Free course browsing and interactive geometry lab work without payment; accessible mobile viewport (360px).
- Account sign-up, verification, password recovery, sign out, new-device sign in, saved progress restored exactly, no cross-student leakage.
- Student's lesson claim never auto-confirms a verified skill; reviewed portfolio status only from authorized independent reviewer.
- Authoritative geometry, quiz scoring and certificate eligibility computed server-side; malformed inputs rejected; signed private uploads protected by storage rules.
- Student explicitly consents before any public portfolio is indexed or shared. Staff can revoke mistaken approvals and certificates with auditable reasons.
- Public certificate checks return only opt-in public name, program, issue date, validity/revocation, not student email, file paths or full learning history.
- Real Android device and desktop browser runs, support contact, privacy/terms, incident response and retention controls.

## Stage 2 — Business and school training pilot (3–5 real organizations; after Stage 1 security review)

`/pilot/` is a **public, synthetic-data UX prototype only**. It is not a paid or authenticated organization dashboard. No learner data is sent to it. Never import real learner records into this page.

Pilot design: recruit 2 schools / workforce programs + 2–3 fabrication, design or training employers; target teams training at least 5 people each. Ask permission, sign a short pilot agreement, specify legitimate purpose and data minimization, define accountable contact, run a 4–6 week test. Actual partner participation is **not confirmed**.

Real dashboard must be built as a separate access-controlled service before pilot with personal data:
- Organization tables, account invitations, instructor/reviewer roles, and **server-enforced organization-scoped RLS**.
- Learners opt into institutional visibility; otherwise show only privacy-preserving aggregate counts.
- Metrics: enrolled, first lesson, weekly active, practice claims, projects submitted, projects independently reviewed, portfolio completeness, median time to first reviewed artifact, instructor review turnaround, organization renewal intent.
- Clear trust labels for *practice*, *pending review*, *approved by reviewer*; no raw answers or private evidence URLs in cohort exports.
- Plans, paid invoices, cancellation, refunds, taxation and billing integration **not implemented**. Test willingness to pay manually, then build billing after pilot validation.
- Interview buyers weekly and collect task-completion feedback, not just dashboard page views.

Suggested stage-exit targets (hypotheses, not observed): ≥3 active pilot organizations; ≥70% of invited instructors report the evidence/verification workflow useful; ≥2 willing to pay for renewal; no unresolved cross-tenant access defects. Revise after actual interviews.

## Stage 3 — Recruiting (deliberately gated)

Do not launch a job board or promise hiring until a meaningful pool of **real reviewer-confirmed portfolios** and employers exists. Suggested checkpoint to reconsider: ≥50 learners with externally reviewed evidence, ≥2 employers requesting qualified candidates, job listing moderation policy, ability to handle privacy/consent requests and clear recruiter payment terms. These are decision thresholds, not currently met.

When enabled: optional learner-controlled public portfolio, explicit recruiter contact opt-in, job postings with verification of employers, accessible salary and location details, report/block tools. Employers never get private learner data merely because a school pays for training. No pay-to-apply and no fraudulent credential claims.

## Sustainable funding order
1. Free learning is the audience and mission, independent of ads.
2. Optional paid **organization dashboards and instructor services** after buyer validation; no student paywall.
3. Relevant, clearly labeled affiliate/referral partnerships for optional CAD/3D printing tools; no endorsement-for-a-badge and no affiliate requirements to pass a lesson.
4. Potential grants, institutional sponsors, paid custom workshops or donations with transparency.
5. Advertisements only if ever appropriate, separate from assessment and never essential to payroll or hosting.

No business revenue, partner organizations, recruiting placements, paid dashboard customers or affiliate approvals have been confirmed.
