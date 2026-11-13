import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, AlertCircle, Lock } from 'lucide-react';
import { findLesson, findStage } from '@/content/curriculum';
import { findSkill } from '@/content/skills';
import { recordMap, statusOf } from '@/lib/progress';
import { useWorkspace } from '@/components/workspace/WorkspaceProvider';
import Checkpoint from '@/components/lessons/Checkpoint';
import StatusPill from '@/components/ui/StatusPill';
import EvidenceField from '@/components/workspace/EvidenceField';
import { fieldClass } from '@/components/ui/Field';

export default function LessonDetail() {
  const { slug } = useParams();
  const lesson = findLesson(slug);
  const stage = lesson ? findStage(lesson.stageId) : null;
  const { records, student, saveRecord } = useWorkspace();
  const record = lesson ? recordMap(records)[`lesson:${lesson.slug}`] : null;
  const status = lesson ? statusOf(recordMap(records), 'lesson', lesson.slug) : 'not_started';

  const [evidence, setEvidence] = useState(record?.evidence_url || '');
  const [note, setNote] = useState(record?.note || '');
  const [checkPassed, setCheckPassed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const locked = status === 'confirmed';

  useEffect(() => {
    setEvidence(record?.evidence_url || '');
    setNote(record?.note || '');
  }, [record?.id]);

  useEffect(() => {
    if (!lesson) {
      const meta = document.createElement('meta');
      meta.name = 'prerender-status-code';
      meta.content = '404';
      document.head.appendChild(meta);
      return () => document.head.removeChild(meta);
    }
  }, [lesson]);

  if (!lesson) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center lg:px-8">
        <p className="mono-label">404</p>
        <h1 className="mt-3 font-heading text-3xl">That lesson does not exist</h1>
        <Link to="/lessons" className="mt-6 inline-block border border-ink px-5 py-3 font-mono text-[10px] uppercase tracking-[0.14em]">
          Back to lessons
        </Link>
      </div>
    );
  }

  const save = async (nextStatus) => {
    if (!student) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await saveRecord({
        kind: 'lesson',
        item: lesson.slug,
        status: nextStatus,
        evidence_url: evidence,
        note,
        score: checkPassed ? 1 : 0,
      });
      setMessage(nextStatus === 'ready_for_review' ? 'Sent to your reviewer.' : 'Saved — keep going.');
    } catch (err) {
      setError(err.message || 'Could not save.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="border-b border-hairline bg-card">
        <div className="mx-auto max-w-6xl px-5 py-5 lg:px-8">
          <Link to="/lessons" className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-ink">
            <ArrowLeft size={12} /> All lessons
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-10 lg:grid-cols-[1.55fr_1fr] lg:gap-16 lg:px-8 lg:py-16">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal">
              Stage {stage.n} · {stage.title}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">{lesson.min} min · {lesson.tool}</span>
          </div>
          <h1 className="mt-4 font-heading text-3xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-4xl">{lesson.title}</h1>

          <div className="mt-6 border-l-2 border-signal pl-4">
            <p className="mono-label">What this proves</p>
            <p className="mt-1 text-[15px] leading-relaxed text-ink/85">{lesson.proof}</p>
          </div>

          <section className="mt-9">
            <p className="mono-label">Practice</p>
            <ol className="mt-4 space-y-4">
              {lesson.steps.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="font-mono text-[11px] text-signal">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[14px] leading-relaxed text-ink/85">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-9 border border-hairline bg-card p-5">
            <p className="mono-label">Artefact to attach</p>
            <p className="mt-2 text-[14px] leading-relaxed text-ink/85">{lesson.artifact}</p>
          </section>

          <section className="mt-9">
            <p className="mono-label">Skills this touches</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {lesson.skills.map((id) => {
                const skill = findSkill(id);
                return (
                  <Link
                    key={id}
                    to="/skills"
                    className="border border-hairline px-2.5 py-1.5 text-[11px] text-ink/80 hover:border-ink"
                  >
                    {skill?.label || id}
                    {skill?.core && <span className="ml-2 font-mono text-[8px] uppercase tracking-[0.12em] text-signal">core</span>}
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="mt-9">
            <Checkpoint check={lesson.check} onResult={setCheckPassed} />
          </section>
        </div>

        <aside className="space-y-5">
          <div className="border border-hairline bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="mono-label">Your status</p>
              <StatusPill status={status} />
            </div>
            {record?.reviewer_note && (
              <p className="mt-4 border-l-2 border-destructive/40 pl-3 text-[12px] leading-relaxed text-destructive">
                Reviewer: {record.reviewer_note}
              </p>
            )}
            {locked && (
              <p className="mt-4 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-emerald-700">
                <Lock size={12} /> Confirmed — this record is closed
              </p>
            )}
          </div>

          {!student ? (
            <div className="border border-ink/20 bg-signalSoft p-5">
              <p className="text-[13px] leading-relaxed text-ink/80">
                Create a workspace to save your evidence and send this lesson for confirmation.
              </p>
              <Link
                to="/workspace"
                className="mt-4 inline-flex items-center gap-2 bg-ink px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-paper"
              >
                Create workspace <ArrowRight size={13} />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <EvidenceField value={evidence} onChange={setEvidence} />
              <textarea
                className={`${fieldClass} min-h-[70px]`}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional note to your reviewer"
                disabled={locked}
              />
              <button
                type="button"
                disabled={locked || busy}
                onClick={() => save('in_progress')}
                className="w-full border border-ink/25 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] disabled:opacity-40"
              >
                {busy ? 'Saving…' : 'Save as in progress'}
              </button>
              <button
                type="button"
                disabled={locked || busy || !evidence || !checkPassed}
                onClick={() => save('ready_for_review')}
                className="inline-flex w-full items-center justify-center gap-2 bg-ink px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-paper disabled:opacity-40"
              >
                <Check size={13} /> Send for confirmation
              </button>
              {!locked && (
                <p className="font-mono text-[9px] leading-relaxed tracking-[0.06em] text-muted-foreground">
                  Needs a correct checkpoint answer and attached evidence. Sending it does not mark the lesson complete.
                </p>
              )}
              {message && <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-emerald-700">{message}</p>}
              {error && (
                <p className="flex items-center gap-2 font-mono text-[10px] text-destructive">
                  <AlertCircle size={13} /> {error}
                </p>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}