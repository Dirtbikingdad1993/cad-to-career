import { useState } from 'react';
import { Check, X, ExternalLink, AlertCircle } from 'lucide-react';
import { findLesson } from '@/content/curriculum';
import { findProject } from '@/content/projects';
import { findSkill } from '@/content/skills';
import { valuesFromSubmission } from '@/lib/validation';
import { reviewerAction } from '@/lib/workspaceApi';
import RubricTable from '@/components/projects/RubricTable';
import { fieldClass } from '@/components/ui/Field';

export default function ReviewItem({ entry, passcode, onDone }) {
  const { record, student } = entry;
  const project = record.kind === 'project' ? findProject(record.item) : null;
  const lesson = record.kind === 'lesson' ? findLesson(record.item) : null;
  const skill = record.kind === 'skill' ? findSkill(record.item) : null;
  const title = project?.title || lesson?.title || skill?.label || record.item;
  const answers = valuesFromSubmission(record.answers_json);
  let auto = [];
  try {
    auto = JSON.parse(record.auto_json || '[]');
  } catch {
    auto = [];
  }
  const failing = auto.filter((r) => !r.pass);
  const [scores, setScores] = useState({});
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const total = project
    ? Math.round(project.rubric.reduce((sum, c) => sum + ((scores[c.id] || 0) / 4) * c.weight, 0))
    : null;

  const decide = async (decision) => {
    setBusy(true);
    setError('');
    try {
      await reviewerAction('decide', {
        passcode,
        record_id: record.id,
        decision,
        note,
        scores: project ? scores : undefined,
        total_score: project ? total : undefined,
      });
      onDone();
    } catch (err) {
      setError(err.message || 'Could not save the decision.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="border border-hairline bg-card">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-hairline px-4 py-3">
        <div>
          <p className="mono-label">
            {student.full_name} · {record.kind}
          </p>
          <h3 className="mt-1.5 font-heading text-[15px] font-medium leading-snug">{title}</h3>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-signal">{record.status.replace('_', ' ')}</span>
      </div>

      <div className="space-y-4 px-4 py-4">
        {record.evidence_url ? (
          <a
            href={record.evidence_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-ink/25 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] hover:border-ink"
          >
            Open evidence <ExternalLink size={12} />
          </a>
        ) : (
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-destructive">No evidence attached</p>
        )}

        {Object.keys(answers).length > 0 && (
          <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
            {Object.entries(answers).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-3 border-b border-hairline py-1">
                <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-muted-foreground">{key}</span>
                <span className="font-mono text-[10px] text-ink">{String(value)}</span>
              </div>
            ))}
          </div>
        )}

        {auto.length > 0 && (
          <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
            Automatic checks: {auto.length - failing.length}/{auto.length} passing
            {failing.length > 0 && <span className="text-destructive"> · {failing.map((f) => f.label).join('; ')}</span>}
          </p>
        )}

        {record.note && <p className="border-l-2 border-hairline pl-3 text-[12px] italic text-muted-foreground">{record.note}</p>}

        {project && <RubricTable rubric={project.rubric} scores={scores} editable onChange={(id, n) => setScores((s) => ({ ...s, [id]: n }))} />}
        {project && (
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
            Weighted score {total}% {Object.keys(scores).length < project.rubric.length && '· not all criteria scored'}
          </p>
        )}

        <textarea
          className={`${fieldClass} min-h-[70px]`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note back to the learner (what was accepted, what must change)"
        />

        {error && (
          <p className="flex items-center gap-2 font-mono text-[10px] text-destructive">
            <AlertCircle size={13} /> {error}
          </p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            disabled={busy}
            onClick={() => decide('confirm')}
            className="inline-flex flex-1 items-center justify-center gap-2 bg-emerald-700 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white disabled:opacity-50"
          >
            <Check size={13} /> Confirm
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => decide('send_back')}
            className="inline-flex flex-1 items-center justify-center gap-2 border border-ink/25 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] disabled:opacity-50"
          >
            <X size={13} /> Send back
          </button>
        </div>
      </div>
    </div>
  );
}