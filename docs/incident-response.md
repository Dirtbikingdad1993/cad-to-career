# Production incident and release runbook

CAD to Career serves a public static application from Vercel. Authentication,
private learner data and assessment functions run separately on Supabase. A
Vercel rollback does not roll back the database, Auth settings, Storage, or Edge
Functions. Assess compatibility before changing any backend service.

## Contacts and communication

- **Incident lead and escalation:** The Vercel team owner is the current first
  responder. Until a backup is appointed, there is no confirmed backup or
  round-the-clock coverage; assign one before broad enrollment.
- **Internal coordination:** Keep a private incident record in the GitHub
  repository with timestamps, impact, decisions, deployment ID, and next
  update. Do not add student records, passwords, API keys, or session tokens.
- **Learner communication:** A public support contact and status channel still
  need an owner and publication. When established, explain the affected
  feature, known impact, and next update time without disclosing private data.
- Check [Vercel status](https://www.vercel-status.com/) and
  [Supabase status](https://status.supabase.com/) for provider incidents.

## Triage

1. Record the start time, affected routes and user reports. Treat exposed
   private data, compromised credentials, unauthorized grading, or lost learner
   work as urgent. Avoid risky experiments against learner accounts or data.
2. Identify the currently serving production deployment and commit in the
   [Vercel project](https://vercel.com/hardwored/cad-to-career), then compare
   with the [GitHub Actions checks](https://github.com/Dirtbikingdad1993/cad-to-career/actions).
   A READY build does not by itself prove that a learner workflow works.
3. Determine whether the failure is in the public app, Supabase Auth, database,
   Storage, or an Edge Function. Vercel Firewall rules protect traffic sent to
   Vercel, not the browser's direct calls to Supabase.
4. Preserve useful logs securely and minimize personal data. In a suspected
   compromise, restrict affected access and follow the provider's guidance for
   credential rotation and data exposure; do not post secrets into an issue.

## Stage and release

1. Open a pull request against `main`. Vercel creates a protected preview.
   Verify the relevant learner flow and confirm the pull request's checks pass.
   Preview configuration and backend access may differ from production.
2. Merging to `main` normally triggers an automatic production deployment.
   Check the production deployment's commit and READY state, then smoke-test the
   public site and the affected workflow. Record the prior good deployment ID.
3. For a staged production deployment or a preview promotion, follow
   [Vercel's promotion guidance](https://vercel.com/docs/deployments/promoting-a-deployment);
   check the target domains and environment settings before promoting. A preview
   promotion rebuilds for production, while a staged production build can be
   promoted without rebuilding. Do not assume the two are identical.

## Rollback and recovery

1. If a frontend release caused material harm, open the Vercel project overview
   and select **Instant Rollback**. Review the eligible known-good deployment
   and domains, then confirm. Hobby permits the immediately previous production
   deployment; plan and deployment eligibility can change.
2. Re-test the affected public routes and core learner journey. A rollback
   restores an existing build and its build-time configuration; it does not
   undo Supabase changes or erase a learner's offline service-worker cache.
   Avoid destructive database restoration without a separate recovery plan.
3. Vercel disables automatic production-domain assignment while a rollback is
   active. Once a corrected release is ready, follow the dashboard's **Manage**
   flow to promote it and restore normal deployment behavior.
4. Record resolution, affected data, follow-up tasks and a short review. Keep
   at least one tested recovery contact and practice the process before launch.

References: [Vercel instant rollback](https://vercel.com/docs/instant-rollback)
and [deployment promotion](https://vercel.com/docs/deployments/promoting-a-deployment).
