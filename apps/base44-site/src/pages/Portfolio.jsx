import { ExternalLink, Printer } from 'lucide-react';
import PageHeader from '@/components/site/PageHeader';
import ProfileGate from '@/components/workspace/ProfileGate';
import { useWorkspace } from '@/components/workspace/WorkspaceProvider';
import { projects } from '@/content/projects';
import { coreSkills } from '@/content/skills';
import { recordMap } from '@/lib/progress';

function PortfolioBody() {
  const { student, records } = useWorkspace();
  const map = recordMap(records);
  const confirmed = projects.filter((p) => map[`project:${p.slug}`]?.status === 'confirmed');
  const skills = coreSkills.filter((s) => map[`skill:${s.id}`]?.status === 'confirmed');

  return (
    <div>
      <div className="no-print">
        <PageHeader
          kicker={`Portfolio · ${student.full_name}`}
          title="Only confirmed work appears here"
          intro="This page is your public-facing record: the projects a reviewer confirmed, the evidence attached to each, and the core skills they demonstrate. Print it or share the links."
        >
          <button
            type="button"
            onClick={() => window.print()}
            className="mt-8 inline-flex items-center gap-2 border border-ink px-5 py-3 font-mono text-[10px] uppercase tracking-[0.14em] hover:bg-ink hover:text-paper"
          >
            <Printer size={13} /> Print portfolio
          </button>
        </PageHeader>
      </div>

      <div className="mx-auto max-w-4xl px-5 py-12 lg:px-8 lg:py-16">
        {confirmed.length === 0 ? (
          <div className="border border-hairline bg-card p-8 text-center">
            <p className="mono-label">Nothing confirmed yet</p>
            <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-muted-foreground">
              When a reviewer confirms a project, it appears here with its evidence and score. Submitting work does not
              place it in the portfolio.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {confirmed.map((project) => {
              const record = map[`project:${project.slug}`];
              return (
                <article key={project.slug} className="border-t border-ink pt-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal">Project {project.n}</p>
                      <h2 className="mt-1 font-heading text-xl font-medium tracking-tight sm:text-2xl">{project.title}</h2>
                    </div>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {record?.total_score ? `${record.total_score}% · ` : ''}
                      confirmed {record?.confirmed_date ? new Date(record.confirmed_date).toLocaleDateString() : ''}
                    </p>
                  </div>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-ink/80">{project.proves}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {record?.evidence_url ? (
                      <a
                        href={record.evidence_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 border border-ink/25 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] hover:border-ink"
                      >
                        View evidence <ExternalLink size={11} />
                      </a>
                    ) : (
                      <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">Evidence not on file</span>
                    )}
                    <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">{project.tools.join(' · ')}</span>
                  </div>
                  {record?.reviewer_note && (
                    <p className="mt-4 border-l-2 border-emerald-600/40 pl-3 text-[12px] italic text-ink/70">
                      “{record.reviewer_note}”
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {skills.length > 0 && (
          <section className="mt-14 border-t border-hairline pt-6">
            <p className="mono-label">Core skills confirmed</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {skills.map((skill) => (
                <p key={skill.id} className="flex gap-2 text-[12.5px] leading-snug text-ink/80">
                  <span className="mt-1.5 h-1 w-2.5 shrink-0 bg-signal" />
                  {skill.label}
                </p>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default function Portfolio() {
  return (
    <ProfileGate>
      <PortfolioBody />
    </ProfileGate>
  );
}