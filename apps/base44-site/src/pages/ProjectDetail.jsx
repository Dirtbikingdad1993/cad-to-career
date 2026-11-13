import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Check, AlertCircle, Lock } from 'lucide-react';
import { findProject } from '@/content/projects';
import { evaluateRules, rulesPassed, valuesFromSubmission } from '@/lib/validation';
import { recordMap, statusOf } from '@/lib/progress';
import { useWorkspace } from '@/components/workspace/WorkspaceProvider';
import StatusPill from '@/components/ui/StatusPill';
import EvidenceField from '@/components/workspace/EvidenceField';
import AutoCheckForm from '@/components/projects/AutoCheckForm';
import RubricTable from '@/components/projects/RubricTable';
import { fieldClass } from '@/components/ui/Field';
import { downloadProjectPacket } from '@/lib/pdf';

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = findProject(slug);
  const { records, student, submitProject } = useWorkspace();
  const record = project ? recordMap(records)[`project:${project.slug}`] : null;
  const status = project ? statusOf(recordMap(records), 'project', project.slug) : 'not_started';

  const [values, setValues] = useState(() => valuesFromSubmission(record?.answers_json));
  const [evidence, setEvidence] = useState(record?.evidence_url || '');
  const [note, setNote] = useState(record?.note || '');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setValues(valuesFromSubmission(record?.answers_json));
    setEvidence(record?.evidence_url || '');
    setNote(record?.note || '');
  }, [record?.id]);

  useEffect(() => {
    if (!project) {
      const meta = document.createElement('meta');
      meta.name = 'prerender-status-code';
      meta.content = '404';
      document.head.appendChild(meta);
      return () => document.head.removeChild(meta);
    }
  }, [project]);

  if (!project) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center lg:px-8">
        <p className="mono-label">404</p>
        <h1 className="mt-3 font-heading text-3xl">That project does not exist</h1>
        <Link to="/projects" className="mt-6 inline-block border border-ink px-5 py-3 font-mono text-[10px] uppercase tracking-[0.14em]">
          Back to projects
        </Link>
      </div>
    );
  }

  const results = evaluateRules(project.rules, values);
  const allPass = rulesPassed(results);
  const locked = ['confirmed', 'submitted', 'ready_for_review'].includes(status);
  let scores = {};
  try {
    scores = JSON.parse(record?.rubric_json || '{}');
  } catch {
    scores = {};
  }

  const submit = async () => {
    if (!student) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await submitProject({
        item: project.slug,
        answers: values,
        auto: results,
        evidence_url: evidence,
        note,
      });
      setMessage('Submitted — a reviewer will confirm or send it back with notes.');
    } catch (err) {
      setError(err.message || 'Could not submit.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="border-b border-hairline bg-card">
        <div className="mx-auto max-w-6xl px-5 py-5 lg:px-8">
          <Link to="/projects" className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:text-ink">
            <ArrowLeft size={12} /> All projects
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-10 lg:grid-cols-[1.6fr_1fr] lg:gap-16 lg:px-8 lg:py-14">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal">Project {project.n} · {project.stage}</span>
            <span className="font-mono text-[10px] text-muted-foreground">{project.time}</span>
            <StatusPill status={status} />
          </div>
          <h1 className="mt-4 font-heading text-3xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-4xl">{project.title}</h1>
          <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-ink/80">{project.brief}</p>

          <section className="mt-9">
            <p className="mono-label">Specification</p>
            <div className="mt-3 border border-hairline">
              {project.spec.map(([label, value], i) => (
                <div key={label} className={`flex justify-between gap-4 px-4 py-2 ${i > 0 ? 'border-t border-hairline' : ''}`}>
                  <span className="text-[12.5px] text-ink/75">{label}</span>
                  <span className="font-mono text-[11px] text-ink">{value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-9">
            <p className="mono-label">Guided practice</p>
            <ol className="mt-4 space-y-4">
              {project.steps.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="font-mono text-[11px] text-signal">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[14px] leading-relaxed text-ink/85">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-9">
            <p className="mono-label">Deliverables</p>
            <ul className="mt-3 space-y-2">
              {project.deliverables.map((d) => (
                <li key={d} className="flex gap-3 text-[13.5px] text-ink/85">
                  <span className="mt-2 h-1 w-3 shrink-0 bg-signal" />
                  {d}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10 border-t border-hairline pt-8">
            <p className="mono-label">Submission form</p>
            <h2 className="mt-2 font-heading text-xl font-medium">Automatic checks</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
              Fill these from your finished drawing. They verify measurable facts and conventions — never your CAD file.
            </p>
            <div className="mt-5">
              <AutoCheckForm project={project} values={values} onChange={setValues} results={results} />
            </div>
          </section>

          <section className="mt-10">
            <p className="mono-label">Rubric</p>
            <div className="mt-3">
              <RubricTable rubric={project.rubric} scores={scores} />
            </div>
            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
              Scored 0–4 by the reviewer against each anchor, then weighted.
            </p>
          </section>
        </div>

        <aside className="space-y-5">
          <div className="border border-hairline bg-card p-5">
            <p className="mono-label">Your submission</p>
            {record?.confirmed_date && (
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-emerald-700">
                Confirmed {new Date(record.confirmed_date).toLocaleDateString()}
                {record.total_score ? ` · ${record.total_score}%` : ''}
              </p>
            )}
            {record?.reviewer_note && (
              <p className={`mt-3 border-l-2 pl-3 text-[12px] leading-relaxed ${status === 'confirmed' ? 'border-emerald-600/40 text-emerald-800' : 'border-destructive/40 text-destructive'}`}>
                Reviewer: {record.reviewer_note}
              </p>
            )}
            {locked && (
              <p className="mt-3 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                <Lock size={12} /> Locked while in review
              </p>
            )}
          </div>

          {!student ? (
            <div className="border border-ink/20 bg-signalSoft p-5">
              <p className="text-[13px] leading-relaxed text-ink/80">Create a workspace to submit this project for confirmation.</p>
              <Link to="/workspace" className="mt-4 inline-block bg-ink px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-paper">
                Create workspace
              </Link>
            </div>
          ) : (
            <>
              <EvidenceField value={evidence} onChange={setEvidence} />
              <textarea
                className={`${fieldClass} min-h-[80px]`}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What you want the reviewer to look at first"
                disabled={locked}
              />
              <button
                type="button"
                disabled={locked || busy || !allPass || !evidence}
                onClick={submit}
                className="inline-flex w-full items-center justify-center gap-2 bg-ink px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-paper disabled:opacity-40"
              >
                <Check size={13} /> {busy ? 'Submitting…' : 'Submit for confirmation'}
              </button>
              {!locked && !allPass && (
                <p className="font-mono text-[9px] leading-relaxed tracking-[0.06em] text-muted-foreground">
                  Every automatic check must pass before submission. Fixing a check means fixing the drawing.
                </p>
              )}
              {message && <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-emerald-700">{message}</p>}
              {error && (
                <p className="flex items-center gap-2 font-mono text-[10px] text-destructive">
                  <AlertCircle size={13} /> {error}
                </p>
              )}
            </>
          )}

          <button
            type="button"
            onClick={() => downloadProjectPacket(project)}
            className="inline-flex w-full items-center justify-center gap-2 border border-hairline px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] hover:border-ink"
          >
            <Download size={13} /> Download exercise packet
          </button>

          <div className="border border-hairline bg-paper p-4">
            <p className="mono-label">Tools</p>
            <p className="mt-2 text-[12px] text-ink/80">{project.tools.join(' · ')}</p>
            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
              You may use any parametric CAD tool for this project — the rubric scores the result, not the software.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}