import { Link } from 'react-router-dom';
import { ArrowRight, LogOut, RefreshCw } from 'lucide-react';
import PageHeader from '@/components/site/PageHeader';
import ProfileGate from '@/components/workspace/ProfileGate';
import { useWorkspace } from '@/components/workspace/WorkspaceProvider';
import ProgressBar from '@/components/workspace/ProgressBar';
import { summarize, nextActions, certificateRequirements } from '@/lib/progress';

function Dashboard() {
  const { student, records, leave, refresh, loading } = useWorkspace();
  const s = summarize(records);
  const actions = nextActions(records, 4);
  const reqs = certificateRequirements(records, student);

  return (
    <div>
      <PageHeader
        kicker={`Workspace · ${student.full_name}`}
        title="What you have actually proven"
        intro="Confirmed work is counted separately from work you have sent for review. Only the confirmed column reaches your certificate."
      >
        <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-hairline pt-5">
          <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">Cloud progress tied to your verified account</p>
          <button type="button" onClick={refresh} disabled={loading} className="inline-flex items-center gap-2 border border-ink/25 px-3 py-2 font-mono text-[10px] uppercase disabled:opacity-50"><RefreshCw size={13}/>{loading?'Loading…':'Refresh from cloud'}</button>
        </div>
      </PageHeader>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[1.4fr_1fr] lg:gap-14 lg:px-8 lg:py-16">
        <div>
          <section className="border border-hairline bg-card p-6">
            <p className="mono-label">Confirmed progress</p>
            <div className="mt-5 space-y-5">
              <ProgressBar value={s.confirmedLessons} total={s.totalLessons} label="Lessons confirmed" />
              <ProgressBar value={s.confirmedProjects} total={s.totalProjects} label="Projects confirmed" />
              <ProgressBar value={s.confirmedCore} total={s.totalCore} label="Core skills confirmed" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-hairline pt-5">
              <div>
                <p className="font-heading text-2xl">{s.readyLessons + s.submittedProjects}</p>
                <p className="mono-label mt-1">Awaiting review</p>
              </div>
              <div>
                <p className="font-heading text-2xl">{s.confirmedSkills}</p>
                <p className="mono-label mt-1">Skills confirmed of {s.totalSkills}</p>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <p className="mono-label">Do next</p>
            <div className="mt-3 border-t border-hairline">
              {actions.map((a) => (
                <Link
                  key={a.label}
                  to={a.to}
                  className="group flex items-center justify-between gap-4 border-b border-hairline py-4"
                >
                  <div>
                    <p className="font-heading text-[14.5px] font-medium group-hover:text-signal">{a.label}</p>
                    <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">{a.note}</p>
                  </div>
                  <ArrowRight size={14} className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-signal" />
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-8 grid gap-2 sm:grid-cols-3">
            {[
              ['/skills', 'Skill checklist'],
              ['/portfolio', 'My portfolio'],
              ['/certificate', 'Certificate'],
            ].map(([to, label]) => (
              <Link
                key={to}
                to={to}
                className="border border-hairline bg-card px-4 py-3 text-center font-mono text-[10px] uppercase tracking-[0.12em] hover:border-ink"
              >
                {label}
              </Link>
            ))}
          </section>
        </div>

        <aside className="space-y-5">
          <div className="border border-hairline bg-card p-5">
            <p className="mono-label">Certificate</p>
            <p className="mt-2 font-heading text-lg font-medium">
              {student.certificate_status === 'issued'
                ? 'Issued'
                : student.certificate_status === 'requested'
                  ? 'Waiting for the reviewer'
                  : 'Not requested yet'}
            </p>
            <ul className="mt-4 space-y-2">
              {reqs.map((r) => (
                <li key={r.label} className="flex items-start gap-2 text-[12px] leading-snug">
                  <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 ${r.met ? 'bg-emerald-600' : 'bg-hairline'}`} />
                  <span className={r.met ? 'text-ink' : 'text-muted-foreground'}>
                    {r.label} <span className="font-mono text-[9px] uppercase tracking-[0.08em]">· {r.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link
              to="/certificate"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 border border-ink px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] hover:bg-ink hover:text-paper"
            >
              Open certificate page <ArrowRight size={12} />
            </Link>
          </div>

          <div className="border border-hairline bg-paper p-5">
            <p className="mono-label">This device</p>
            <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
              Progress is stored against your authenticated account, not a shareable resume code. Signing out does not remove saved work.
            </p>
            <button
              type="button"
              onClick={leave}
              className="mt-4 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground hover:text-destructive"
            >
              <LogOut size={12} /> Sign out safely
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function Workspace() {
  return (
    <ProfileGate>
      <Dashboard />
    </ProfileGate>
  );
}