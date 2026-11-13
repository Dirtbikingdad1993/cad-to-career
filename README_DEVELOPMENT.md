# CAD to Career — Independent Learning Platform

**Status:** Working static alpha, not certified production or a completed full-stack service.

## Current stack

- Vanilla HTML, CSS, JavaScript; no build or framework dependency
- Vercel static deployment from private GitHub `Dirtbikingdad1993/cad-to-career`
- 20 real lessons with knowledge checks and a practical confirmation control
- 2D SVG CAD editor (numeric dimensions, select, edit, delete, undo/redo, JSON/SVG export and import)
- Project 1 geometry validator: 120 x 70 mm plate, 4 holes (Ø8 mm)
- Five portfolio project briefs and local drafting notes
- Device-local progress, quiz scores, settings, backup export/restore
- Certificate intentionally locked until independently verified reviewer assessments

## Start

Serve the repository over HTTP, e.g. `python3 -m http.server 8000`, then open localhost:8000.
Direct opening of `index.html` may work, but a local server matches deployment.

No installation, secrets, dependencies, or API keys are required for current preview.

## Architecture and integrity

All client data currently resides in `localStorage`, key `cad-to-career-local-v1`. Browser progress is not tamper-resistant and is **not official credit**. Project 1 validation checks geometry in client code for practice only; its score must be recomputed by a server before official award. The portfolio is not public and there is no file upload service. There is no authentication, server-side progress, reviewer accounts or automatic certificate issuance. Do not promise these are live.

### Launch requirements (not implemented)

1. Connect a new Supabase project with a reviewed cost, configure publishable key and env separately; do not expose service-role keys to browser.
2. Implement Supabase Auth: signup, email verification, sign-in, password reset and secure sessions.
3. Add RLS-protected tables for lesson progress, quizzes, submissions, reviews, certificate issuance, public profile opt-in and audit events.
4. Regrade quiz and 2D geometry server-side, with versioned immutable assessment evidence. Never trust client score or user_metadata for approval.
5. Store uploaded native CAD files in private buckets with owner-scoped access and real type/size/signature validation. Do not claim FCStd/STEP/blend are machine-inspected unless a parser exists.
6. Add reviewers/admin with server-enforced role access; only approved reviewers can approve Projects 2–5. Require capstone >=85/100 and all course requirements.
7. Issue unique, public-verifyable, tamper-resistant certificate PDFs from server; minimize exposed personal info and allow revocation.
8. Add privacy policy, terms, help/support, operational monitoring, automated end-to-end tests, usability/accessibility audits, content proofreading and custom domain.
9. Verify across Android devices and desktop browsers; run release security audit.

## Course progression

Quiz >=80% and actual exercise self-confirmation required. With three questions, all three must be correct. Locally confirmed lessons are distinguished from verified course credit.

## Lab data schema

Export JSON has format `cad-to-career-v1`, units `mm`, shapes array:
- Rectangles: `{id,type:"rect",x,y,w,h}` (lower-left origin)
- Circles: `{id,type:"circle",x,y,d}`
The on-screen canvas transforms into SVG Y-coordinates; geometry stays in millimeters.

## Security

There are no credentials in the repo. Site headers set baseline content security policy. Do not store sensitive personal data or upload confidential designs until backend and privacy controls are finished.

## License

Source is private and owned by the repository owner; no public open-source license has been assigned.
