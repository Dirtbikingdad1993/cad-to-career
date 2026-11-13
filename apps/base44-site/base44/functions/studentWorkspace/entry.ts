import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { PROJECT_SLUGS, CORE_SKILL_IDS, LESSON_SLUGS, PROJECT_RULES } from '../../shared/courseRules.ts';
import { normalizeCode, asList } from '../../shared/requirements.ts';
import { assessGeometry } from '../../shared/geometry.js';

const LEARNER_STATUSES = ['in_progress', 'ready_for_review'];
const SKILL_SET = new Set(CORE_SKILL_IDS);
const PROJECT_SET = new Set(PROJECT_SLUGS);
const LESSON_SET = new Set(LESSON_SLUGS);
const GEOMETRY_KEYS = ['x','y','width','height','cx','cy','radius'];

function fail(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}
function publicStudent(student: any) {
  if (!student) return null;
  const { access_code: _legacySecret, ...safe } = student;
  return safe;
}
function validUrl(value: unknown) {
  const candidate = String(value || '').trim().slice(0, 600);
  try { const url = new URL(candidate); return ['http:', 'https:'].includes(url.protocol) ? candidate : ''; }
  catch { return ''; }
}
function evaluateRule(rule: any, answers: Record<string, unknown>) {
  const raw = answers[rule.field];
  const str = String(raw ?? '').trim();
  const numeric = /^[-+]?(?:[0-9]+(?:[.][0-9]*)?|[.][0-9]+)$/.test(str) ? Number(str) : NaN;
  let pass = false;
  switch (rule.type) {
    case 'range': pass = Number.isFinite(numeric) && numeric >= rule.min && numeric <= rule.max; break;
    case 'min': pass = Number.isFinite(numeric) && numeric >= rule.min; break;
    case 'max': pass = Number.isFinite(numeric) && numeric <= rule.max; break;
    case 'equals': pass = str.toLowerCase() === String(rule.value).trim().toLowerCase(); break;
    case 'filled': pass = str.length > 0; break;
    case 'checkbox': pass = raw === true; break;
    case 'text_pattern': pass = str.length > 0 && new RegExp(rule.pattern, 'i').test(str); break;
  }
  return { id: `${rule.field}:${rule.type}`, label: rule.label, pass, detail: pass ? 'Passed server check' : 'Needs correction' };
}
function hasRequirements(records: any[]) {
  const confirmed = (kind: string, item: string) => records.some((r: any) =>
    r.kind === kind && r.item === item && r.status === 'confirmed');
  return PROJECT_SLUGS.every((item) => confirmed('project', item)) &&
    CORE_SKILL_IDS.every((item) => confirmed('skill', item));
}

export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    // Never allow a resume code or client-supplied student ID to authenticate a learner.
    const user = await base44.auth.me().catch(() => null);
    if (!user?.id) return fail('Sign in to access your private workspace.', 401);
    const db = base44.asServiceRole.entities;
    const body: any = await req.json().catch(() => ({}));
    const action = String(body?.action || '');
    const loadCurrent = async () => asList(await db.Student.filter({ owner_user_id: user.id }))[0] || null;
    const loadRecords = async (student: any) =>
      asList(await db.ProgressRecord.filter({ student_id: student.id }));

    if (action === 'me') {
      const student = await loadCurrent();
      return Response.json({ student: publicStudent(student), records: student ? await loadRecords(student) : [] });
    }

    if (action === 'create') {
      const existing = await loadCurrent();
      if (existing) return Response.json({ student: publicStudent(existing), records: await loadRecords(existing) });
      const full_name = String(body.full_name || user.full_name || '').trim().slice(0, 60);
      if (full_name.length < 2) return fail('Enter a display name with at least two characters.');
      const student = await db.Student.create({
        owner_user_id: user.id,
        full_name,
        email: String(user.email || '').trim().toLowerCase(),
        goal: String(body.goal || 'job').slice(0, 80),
        device: String(body.device || 'phone').slice(0, 40),
        access_code: crypto.randomUUID(), // schema compatibility; never an auth credential
        certificate_status: 'not_requested',
      });
      return Response.json({ student: publicStudent(student), records: [] });
    }

    if (action === 'resume') {
      // One-time legacy migration ONLY when the old profile's saved email matches
      // the authenticated account email. No-email profiles need manual admin recovery.
      const code = normalizeCode(body.code);
      if (!code) return fail('Enter your old resume code.');
      const already = await loadCurrent();
      if (already) return fail('Your signed-in account already has a workspace.', 409);
      const legacy = asList(await db.Student.filter({ access_code: code }))[0];
      if (!legacy || legacy.owner_user_id ||
          !legacy.email || legacy.email.trim().toLowerCase() !== String(user.email || '').trim().toLowerCase()) {
        return fail('Could not verify this legacy workspace. The original email must match your signed-in account. Contact the course owner for accounts without an email.', 403);
      }
      const updated = await db.Student.update(legacy.id, { owner_user_id: user.id });
      return Response.json({ student: publicStudent(updated), records: await loadRecords(updated) });
    }

    const student = await loadCurrent();
    if (!student) return fail('Create your learner workspace first.', 404);

    const upsert = async (kind: string, item: string, status: string, extra: Record<string, unknown>) => {
      const existing = asList(await db.ProgressRecord.filter({ student_id: student.id, kind, item }))[0];
      if (existing && ['confirmed', 'submitted', 'ready_for_review'].includes(existing.status)) {
        return { record: existing, locked: true };
      }
      const payload = { student_id: student.id, kind, item, status,
        claimed_date: new Date().toISOString(), ...extra };
      const record = existing ? await db.ProgressRecord.update(existing.id, payload)
        : await db.ProgressRecord.create(payload);
      return { record, locked: false };
    };

    if (action === 'save') {
      const kind = String(body.kind || '');
      const item = String(body.item || '').slice(0, 120);
      if (kind === 'lesson' && !LESSON_SET.has(item)) return fail('Unknown lesson.');
      if (kind === 'skill' && !SKILL_SET.has(item)) return fail('Unknown skill.');
      if (!['lesson','skill'].includes(kind)) return fail('Only lessons and skills can be claimed here.');
      const wanted = String(body.status || 'in_progress');
      const status = LEARNER_STATUSES.includes(wanted) ? wanted : 'in_progress';
      const result = await upsert(kind, item, status, {
        score: Number.isFinite(Number(body.score)) ? Math.max(0, Math.min(100, Number(body.score))) : 0,
        answers_json: JSON.stringify(body.answers || {}).slice(0, 12000),
        auto_json: JSON.stringify(body.auto || []).slice(0, 10000), // informational only; reviewer confirms
        evidence_url: validUrl(body.evidence_url),
        note: String(body.note || '').slice(0, 2000),
      });
      return Response.json(result);
    }

    if (action === 'saveGeometry') {
      const input: any = body.geometry || {};
      const sketch: any = { units: input.units };
      for (const key of GEOMETRY_KEYS) sketch[key] = String(input[key] ?? '').slice(0, 40);
      const report = assessGeometry(sketch);
      const result = await upsert('lab','rectangle-circle','in_progress',{
        answers_json: JSON.stringify(sketch),
        auto_json: JSON.stringify(report.checks),
        score: report.checks.filter((c: any)=>c.pass).length,
        note: report.pass ? 'Geometry constraints passed; awaits learner-led CAD work.' : 'Sketch saved as a draft.',
      });
      return Response.json({ ...result, validation: report });
    }

    if (action === 'submitProject') {
      const item = String(body.item || '').slice(0, 120);
      if (!PROJECT_SET.has(item)) return fail('Unknown portfolio project.');
      const answers = body.answers && typeof body.answers === 'object' && !Array.isArray(body.answers) ? body.answers : {};
      const rules = PROJECT_RULES[item as keyof typeof PROJECT_RULES];
      const results = rules.map((rule: any) => evaluateRule(rule, answers));
      if (!results.every((r: any) => r.pass)) return fail('Correct the automatic checks before submitting.');
      const evidence = validUrl(body.evidence_url);
      if (!evidence) return fail('Attach a valid HTTPS or HTTP evidence link before submitting.');
      const result = await upsert('project', item, 'submitted', {
        answers_json: JSON.stringify(answers).slice(0, 12000),
        auto_json: JSON.stringify(results),
        evidence_url: evidence,
        note: String(body.note || '').slice(0, 2000),
      });
      return Response.json(result);
    }

    if (action === 'requestCertificate') {
      if (student.certificate_status === 'issued') return Response.json({ student: publicStudent(student) });
      const records = await loadRecords(student);
      if (!hasRequirements(records)) return fail('Certificate requires all 5 named portfolio projects and all 12 named core skills confirmed by a reviewer.');
      const updated = await db.Student.update(student.id, { certificate_status: 'requested', requested_date: new Date().toISOString() });
      return Response.json({ student: publicStudent(updated) });
    }
    return fail('Unknown action.');
  } catch (error: any) {
    return fail(error?.message || 'Request failed.', 500);
  }
}