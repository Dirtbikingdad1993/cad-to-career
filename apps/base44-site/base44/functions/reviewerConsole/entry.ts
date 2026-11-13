import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { hashPasscode, asList } from '../../shared/requirements.ts';
import { PROJECT_SLUGS, CORE_SKILL_IDS } from '../../shared/courseRules.ts';

const PENDING = ['ready_for_review', 'submitted'];

export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    // All reviewer operations, including first-time claiming, require a real admin session.
    const reviewer = await base44.auth.me().catch(() => null);
    if (!reviewer) return Response.json({ error: 'Sign in as an administrator.' }, { status: 401 });
    if (reviewer.role !== 'admin') return Response.json({ error: 'Administrator access required.' }, { status: 403 });
    const db = base44.asServiceRole.entities;
    const body = await req.json().catch(() => ({}));
    const action = String(body.action || '');
    const passcode = String(body.passcode || '');

    const settings = asList(await db.ReviewerSetting.list());
    const setting = settings[0] || null;

    if (action === 'status') {
      return Response.json({ configured: Boolean(setting) });
    }

    if (action === 'claim') {
      if (setting) {
        return Response.json({ error: 'This site already has a reviewer passcode.' }, { status: 409 });
      }
      if (passcode.length < 8) {
        return Response.json({ error: 'Use at least 8 characters.' }, { status: 400 });
      }
      const salt = crypto.randomUUID();
      const created = await db.ReviewerSetting.create({
        salt,
        passcode_hash: await hashPasscode(salt, passcode),
        label: String(body.label || 'Course owner').slice(0, 80),
        claim_date: new Date().toISOString(),
      });
      return Response.json({ configured: true, setting_id: created.id });
    }

    if (!setting) {
      return Response.json({ error: 'No reviewer passcode is set on this site yet.' }, { status: 400 });
    }

    const supplied = await hashPasscode(setting.salt, passcode);
    if (supplied !== setting.passcode_hash) {
      return Response.json({ error: 'That passcode is not correct.' }, { status: 403 });
    }

    if (action === 'queue') {
      const pending = asList(await db.ProgressRecord.filter({ status: { $in: PENDING } }));
      const ids = Array.from(new Set(pending.map((r: any) => r.student_id).filter(Boolean)));
      const students = ids.length ? asList(await db.Student.filter({ id: { $in: ids } })) : [];
      const studentMap: Record<string, any> = {};
      students.forEach((s: any) => {
        studentMap[s.id] = { id: s.id, full_name: s.full_name, email: s.email };
      });

      const certificateRequests = asList(await db.Student.filter({ certificate_status: 'requested' })).map((s: any) => ({
        id: s.id,
        full_name: s.full_name,
        email: s.email,
        requested_date: s.requested_date,
      }));

      const confirmed = asList(await db.ProgressRecord.filter({ status: 'confirmed' }));
      const stats = {
        confirmedLessons: confirmed.filter((r: any) => r.kind === 'lesson').length,
        confirmedProjects: confirmed.filter((r: any) => r.kind === 'project').length,
        confirmedSkills: confirmed.filter((r: any) => r.kind === 'skill').length,
        pending: pending.length,
      };

      const queue = pending
        .map((r: any) => ({ record: r, student: studentMap[r.student_id] || { full_name: 'Unknown learner' } }))
        .sort((a: any, b: any) => String(a.record.claimed_date || '').localeCompare(String(b.record.claimed_date || '')));

      return Response.json({ queue, certificateRequests, stats });
    }

    if (action === 'decide') {
      const record_id = String(body.record_id || '');
      const decision = String(body.decision || '');
      if (!record_id) return Response.json({ error: 'Missing record.' }, { status: 400 });
      if (!['confirm', 'send_back'].includes(decision)) {
        return Response.json({ error: 'Unknown decision.' }, { status: 400 });
      }

      const record = await db.ProgressRecord.get(record_id).catch((e: any) => (e.status === 404 ? null : Promise.reject(e)));
      if (!record) return Response.json({ error: 'That submission no longer exists.' }, { status: 404 });

      const update: Record<string, unknown> = {
        status: decision === 'confirm' ? 'confirmed' : 'needs_work',
        reviewer_note: String(body.note || '').slice(0, 2000),
      };
      if (decision === 'confirm') {
        update.confirmed_date = new Date().toISOString();
        if (body.scores) update.rubric_json = JSON.stringify(body.scores);
        if (body.total_score !== undefined) update.total_score = Number(body.total_score) || 0;
      }

      const updated = await db.ProgressRecord.update(record.id, update);
      return Response.json({ record: updated });
    }

    if (action === 'issueCertificate') {
      const student_id = String(body.student_id || '');
      if (!student_id) return Response.json({ error: 'Missing learner.' }, { status: 400 });

      const student = await db.Student.get(student_id).catch((e: any) => (e.status === 404 ? null : Promise.reject(e)));
      if (!student) return Response.json({ error: 'That learner no longer exists.' }, { status: 404 });

      const records = asList(await db.ProgressRecord.filter({ student_id }));
      const confirmed = (kind: string, item: string) => records.some((r: any) =>
        r.kind === kind && r.item === item && r.status === 'confirmed');
      if (student.certificate_status !== 'requested' ||
          !PROJECT_SLUGS.every(item => confirmed('project', item)) ||
          !CORE_SKILL_IDS.every(item => confirmed('skill', item))) {
        return Response.json({ error: 'Certificate requires a learner request and all five specified projects plus all twelve specified core skills confirmed.' }, { status: 400 });
      }

      const year = new Date().getFullYear();
      const updated = await db.Student.update(student.id, {
        certificate_status: 'issued',
        certificate_code: `CAD-${year}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        issued_date: new Date().toISOString(),
      });
      return Response.json({ student: updated });
    }

    return Response.json({ error: 'Unknown action.' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message || 'Something went wrong.' }, { status: 500 });
  }
}