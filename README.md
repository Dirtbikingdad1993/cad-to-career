# Current application status (November 17, 2026)

**CAD to Career is an independently deployed, free, Android-first CAD learning application.** The current implementation contains **53 lessons** (20 core certification-track lessons and 33 additional practice lessons), five evidence-based portfolio projects, a measured-geometry lab, and Supabase-backed login and private cloud progress. Learners begin on Android and transition to desktop FreeCAD, LibreCAD, Blender or appropriately licensed Fusion.

- **Application:** https://cad-to-career.vercel.app
- **Architecture:** standalone HTML/CSS/JavaScript, Vercel, Supabase Auth/Postgres/Storage/Edge Functions; no build dependency on Base44 or Lovable for the production website.
- **Assessment integrity:** 159 public *practice* questions are not official credit. A separate 60-question official bank remains in a private Supabase schema; signed-in learners use server-grade exams and approved projects for platform-issued credentials, not professional accreditation.
- **Latest checked production:** GitHub validation passed; Vercel production deployment READY for commit `2f1b461`.
- **Not fully launched:** General-purpose confirmation email delivery, authentication redirects, real-device cross-device QA, designated reviewer onboarding, legal operator information, and evidence upload scanning still require validation. Do not claim unrestricted registration or verified employment outcomes.
- **Repo visibility:** public. Never commit passwords, service-role tokens, assessment answer keys or student design files.

See [development status](README_DEVELOPMENT.md) and [launch checklist](docs/public-launch-checklist.md) for current operational requirements.

---

## Original project vision and roadmap (historical)

CAD to Career

Learn CAD for Free. Prove What You Can Design. Build Your Future.

CAD to Career is a free, accessible, project-based technical education platform designed to help anyone progress from an absolute beginner to practical skills in 2D drafting, 3D modeling, product design, and computer-aided engineering.

Inspired by the accessibility of freeCodeCamp, CAD to Career aims to make technical design education available to everyone, regardless of their background, experience, location, or financial situation.

Our mission is simple:

Don't just teach people which buttons to click. Teach them how to design, solve problems, and prove their skills through real projects.

---

Our Mission

Professional CAD training can be expensive, complicated, and intimidating for beginners.

CAD to Career is being developed to remove those barriers by offering:

- Free, structured CAD education
- Beginner-friendly, step-by-step lessons
- Interactive drawing and geometry exercises
- Hands-on engineering and product design projects
- Automated feedback and design validation
- Skill assessments based on demonstrated ability
- Progress tracking and personal portfolios
- Free completion certificates based on verified project requirements
- Career preparation and practical industry knowledge

No paywalls. No unnecessary prerequisites. No experience required.

Learn on Your Phone. Design on Your Computer.

CAD to Career follows a mobile-first learning approach.

Students will be able to begin learning engineering fundamentals, geometry, measurements, technical drawing, and design principles using an Android phone or other compatible device.

As learners advance, the platform will guide them toward desktop CAD software for professional drafting and 3D modeling.

Supported Learning Paths

Software| Primary Focus
FreeCAD| Parametric 3D modeling and mechanical design
Autodesk Fusion| Product design, CAD, CAM, and engineering
Blender| 3D modeling, visualization, and rendering
LibreCAD| 2D drafting and technical drawings

Software selection will emphasize accessible learning options, with commercial licensing requirements explained clearly.

---

Learning Roadmap

Level 1 — CAD Fundamentals

Learn the basics of technical drawing, measurements, geometry, units, coordinates, and engineering design.

Level 2 — 2D Technical Drafting

Create accurate technical drawings using lines, circles, dimensions, constraints, layers, and standard drafting practices.

Level 3 — 3D Modeling

Learn sketching, extrusion, revolution, fillets, chamfers, parametric modeling, and part design.

Level 4 — Mechanical and Product Design

Develop functional parts, assemblies, dimensioned components, and practical engineering projects.

Level 5 — Advanced Design Skills

Explore design optimization, tolerances, manufacturing considerations, assemblies, and technical documentation.

Level 6 — Career and Portfolio Preparation

Build a portfolio that demonstrates practical drafting and design skills to potential employers or clients.

---

Interactive Learning Workspace

The planned workspace will combine educational content with practical design exercises.

Planned Features

- Interactive lessons and quizzes
- Browser-based 2D geometry workspace
- Geometry and dimensional accuracy checks
- Real-time design feedback where technically feasible
- Individual student accounts
- Saved progress across sessions
- Skill checklists and achievement tracking
- Downloadable design exercises
- Portfolio project submissions
- Project evaluation rubrics
- Certificate eligibility tracking
- Responsive desktop and mobile layouts

Where possible, the platform will use deterministic validation rules to evaluate measurable design requirements rather than relying exclusively on subjective feedback.

---

Five Portfolio Projects

The curriculum is planned to include five progressively challenging projects:

1. Precision 2D Drawing — Create a fully dimensioned technical drawing.
2. Parametric Mechanical Part — Build an editable 3D component with defined constraints.
3. Functional Assembly — Design multiple components that fit together correctly.
4. Real-World Product Design — Develop a practical product from requirements to final CAD model.
5. Capstone Engineering Project — Produce a documented design demonstrating technical accuracy, problem-solving, and manufacturing awareness.

These projects are intended to demonstrate practical ability rather than course participation alone.

---

Technology and Architecture

The proposed development direction includes:

- Frontend: React, TypeScript, and potentially Next.js
- Styling: Responsive, accessible, mobile-first UI
- Backend: API-driven full-stack architecture
- Authentication: Secure user accounts
- Database: Persistent learner progress and project records
- Geometry Engine: Browser-based 2D drawing and rule-based validation
- Version Control: Git and GitHub
- Deployment: Vercel
- Testing: Automated checks for geometry, persistence, and core user workflows

Technology choices and integrations will be confirmed as the implementation progresses.

---

Initial MVP Development Goals

The first working product milestone is an end-to-end learning experience.

A learner should be able to:

1. Register and securely sign in.
2. Complete the first four introductory lessons.
3. Open an interactive 2D drawing workspace.
4. Draw a rectangle and circle to specified dimensions.
5. Submit the drawing for automated geometry checks.
6. Receive clear, understandable feedback.
7. Save their progress.
8. Sign out and return with their work preserved.

Completion criteria: Every step must work consistently and be tested before the MVP is considered complete.

---

Project Status

CAD to Career is under active development.

This README describes the project's intended direction, curriculum, and technical objectives. Planned functionality should not be interpreted as implemented, tested, or released.

Features will only be marked complete after implementation and verification.

Development Priorities

- [ ] Establish the application architecture
- [ ] Build responsive navigation and layouts
- [ ] Implement authentication
- [ ] Create the first four lessons
- [ ] Develop the interactive geometry workspace
- [ ] Implement automated geometry checks
- [ ] Save and restore learning progress
- [ ] Build the initial student dashboard
- [ ] Implement portfolio functionality
- [ ] Add project evaluation workflows
- [ ] Develop certificate generation and verification
- [ ] Complete accessibility and security testing
- [ ] Prepare a production deployment

---

Who Is CAD to Career For?

CAD to Career is designed for:

- Complete beginners interested in technical design
- Self-taught learners
- Students exploring engineering and manufacturing
- Career changers entering technical industries
- Hobbyists, makers, and 3D printing enthusiasts
- Aspiring CAD technicians and mechanical designers
- People who cannot afford traditional CAD training

Anyone willing to learn should have the opportunity to develop practical technical skills.

---

Contributing

CAD to Career welcomes interest from developers, engineers, CAD professionals, technical educators, designers, and learners.

Useful contributions may include:

- Software development
- UI/UX improvements
- Interactive geometry tools
- CAD exercise development
- Technical curriculum design
- Automated validation rules
- Accessibility improvements
- Documentation and testing

Contribution guidelines and repository licensing details will be published as the project develops.

Certification and Career Preparation

The planned free certificates will recognize completion of defined course and project requirements.

Certificates are intended to document learning achievements and demonstrated skills. They are not accredited academic degrees, professional licenses, or guarantees of employment.

---

Long-Term Vision

CAD to Career aims to become a comprehensive, accessible technical education platform where learners can move from fundamental geometry to complex real-world design.

Future curriculum expansion may include CNC manufacturing, 3D printing, mechanical engineering fundamentals, technical drafting standards, and other technical trades.

The ultimate goal is to create a platform where a learner's portfolio proves what they can design, not merely what lessons they have watched.

---

CAD to Career

Learn Free. Design Anything. Prove Your Skills.

Education should be accessible. Skills should be measurable. Opportunity should be earned through demonstrated ability.
