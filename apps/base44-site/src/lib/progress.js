import { allLessons, lessonCount } from '@/content/curriculum';
import { skills, coreSkills, coreSkillCount } from '@/content/skills';
import { projects } from '@/content/projects';

export const STATUS_META = {
  not_started: { label: 'Not started', className: 'border-hairline text-muted-foreground' },
  in_progress: { label: 'In progress', className: 'border-ink/30 text-ink' },
  ready_for_review: { label: 'Awaiting review', className: 'border-signal/40 bg-signalSoft text-signal' },
  submitted: { label: 'Submitted', className: 'border-signal/40 bg-signalSoft text-signal' },
  needs_work: { label: 'Sent back', className: 'border-destructive/40 text-destructive' },
  confirmed: { label: 'Confirmed', className: 'border-emerald-600/30 bg-emerald-50 text-emerald-700' },
};

export function recordMap(records = []) {
  const map = {};
  for (const r of records) map[`${r.kind}:${r.item}`] = r;
  return map;
}

export function recordFor(map, kind, item) {
  return map[`${kind}:${item}`] || null;
}

export function statusOf(map, kind, item) {
  return recordFor(map, kind, item)?.status || 'not_started';
}

export function statusMeta(status) {
  return STATUS_META[status] || STATUS_META.not_started;
}

export function summarize(records = []) {
  const map = recordMap(records);
  const confirmedLessons = allLessons.filter((l) => statusOf(map, 'lesson', l.slug) === 'confirmed').length;
  const readyLessons = allLessons.filter((l) =>
    ['ready_for_review'].includes(statusOf(map, 'lesson', l.slug))
  ).length;
  const startedLessons = allLessons.filter((l) =>
    ['in_progress', 'ready_for_review', 'needs_work', 'confirmed'].includes(statusOf(map, 'lesson', l.slug))
  ).length;
  const confirmedProjects = projects.filter((p) => statusOf(map, 'project', p.slug) === 'confirmed').length;
  const submittedProjects = projects.filter((p) =>
    ['submitted', 'ready_for_review'].includes(statusOf(map, 'project', p.slug))
  ).length;
  const confirmedSkills = skills.filter((s) => statusOf(map, 'skill', s.id) === 'confirmed').length;
  const confirmedCore = coreSkills.filter((s) => statusOf(map, 'skill', s.id) === 'confirmed').length;
  return {
    map,
    confirmedLessons,
    readyLessons,
    startedLessons,
    confirmedProjects,
    submittedProjects,
    confirmedSkills,
    confirmedCore,
    totalLessons: lessonCount,
    totalProjects: projects.length,
    totalSkills: skills.length,
    totalCore: coreSkillCount,
  };
}

export function nextActions(records = [], limit = 3) {
  const { map } = summarize(records);
  const out = [];

  for (const project of projects) {
    const status = statusOf(map, 'project', project.slug);
    if (status === 'needs_work') {
      out.push({ kind: 'project', label: `Rework Project ${project.n}: ${project.title}`, to: `/projects/${project.slug}`, note: 'A reviewer sent this back with notes.' });
    }
  }

  const nextLesson = allLessons.find((l) => !['confirmed', 'ready_for_review'].includes(statusOf(map, 'lesson', l.slug)));
  if (nextLesson) {
    out.push({ kind: 'lesson', label: `Next lesson: ${nextLesson.title}`, to: `/lessons/${nextLesson.slug}`, note: `Stage ${nextLesson.stageN} · ${nextLesson.min} min · ${nextLesson.tool}` });
  }

  const openCore = coreSkills.find((s) => statusOf(map, 'skill', s.id) !== 'confirmed');
  if (openCore) {
    out.push({ kind: 'skill', label: `Unproven core skill: ${openCore.label}`, to: '/skills', note: 'Attach proof and send it for review.' });
  }

  const nextProject = projects.find((p) => !['confirmed', 'submitted', 'ready_for_review'].includes(statusOf(map, 'project', p.slug)));
  if (nextProject) {
    out.push({ kind: 'project', label: `Open Project ${nextProject.n}: ${nextProject.title}`, to: `/projects/${nextProject.slug}`, note: nextProject.tools.join(' · ') });
  }

  return out.slice(0, limit);
}

export function certificateRequirements(records = [], student = {}) {
  const s = summarize(records);
  return [
    {
      label: `All ${s.totalProjects} portfolio projects confirmed`,
      met: s.confirmedProjects === s.totalProjects,
      detail: `${s.confirmedProjects} of ${s.totalProjects} confirmed`,
    },
    {
      label: `All ${s.totalCore} core skills confirmed`,
      met: s.confirmedCore === s.totalCore,
      detail: `${s.confirmedCore} of ${s.totalCore} confirmed`,
    },
    {
      label: 'Certificate requested',
      met: ['requested', 'issued'].includes(student.certificate_status),
      detail: student.certificate_status === 'issued' ? 'Issued' : student.certificate_status === 'requested' ? 'Waiting for the reviewer' : 'Not requested yet',
    },
    {
      label: 'Reviewer issued the certificate',
      met: student.certificate_status === 'issued',
      detail: student.certificate_code || '—',
    },
  ];
}

export function stageProgress(records = [], stageId) {
  const { map } = summarize(records);
  const lessons = allLessons.filter((l) => l.stageId === stageId);
  const confirmed = lessons.filter((l) => statusOf(map, 'lesson', l.slug) === 'confirmed').length;
  return { confirmed, total: lessons.length };
}