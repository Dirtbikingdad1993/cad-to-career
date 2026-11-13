import { Link } from 'react-router-dom';
import { ArrowRight, Download } from 'lucide-react';
import PageHeader from '@/components/site/PageHeader';
import { projects } from '@/content/projects';
import { statusOf, recordMap, summarize } from '@/lib/progress';
import { useWorkspace } from '@/components/workspace/WorkspaceProvider';
import StatusPill from '@/components/ui/StatusPill';
import { downloadProjectPacket } from '@/lib/pdf';

export default function Projects() {
  const { records } = useWorkspace();
  const map = recordMap(records);
  const s = summarize(records);

  return (
    <div>
      <PageHeader
        kicker="Five portfolio projects"
        title="The five pieces of work that prove you can design"
        intro="Each project has a written brief, a specification, automatic checks for what can be measured, and a published rubric. A project is confirmed only after a reviewer has scored it."
      >
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-hairline pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          <span>{s.confirmedProjects} of {s.totalProjects} confirmed</span>
          <span>{s.submittedProjects} in review</span>
          <span>Rubric-weighted, not self-scored</span>
        </div>
      </PageHeader>

      <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-6 lg:gap-8">
          {projects.map((project) => {
            const status = statusOf(map, 'project', project.slug);
            return (
              <article key={project.slug} className="border border-hairline bg-card">
                <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_18rem] lg:gap-10">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal">{project.stage}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">Project {project.n} · {project.time}</span>
                      <StatusPill status={status} />
                    </div>
                    <h2 className="mt-3 font-heading text-2xl font-medium tracking-tight">{project.title}</h2>
                    <p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-ink/75">{project.brief}</p>
                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                      <span>{project.tools.join(' · ')}</span>
                      <span>{project.rules.length} automatic checks</span>
                      <span>{project.rubric.length} rubric criteria</span>
                    </div>
                  </div>
                  <div className="border-t border-hairline pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                    <p className="mono-label">What it proves</p>
                    <p className="mt-2 text-[13px] leading-relaxed text-ink/80">{project.proves}</p>
                    <div className="mt-5 flex flex-col gap-2">
                      <Link
                        to={`/projects/${project.slug}`}
                        className="inline-flex items-center justify-center gap-2 bg-ink px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-paper"
                      >
                        Open brief <ArrowRight size={13} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => downloadProjectPacket(project)}
                        className="inline-flex items-center justify-center gap-2 border border-hairline px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] hover:border-ink"
                      >
                        <Download size={13} /> Exercise packet
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 border border-hairline bg-paper p-6">
          <p className="mono-label">How completion works</p>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            {[
              ['Automatic checks', 'Dimensions, tolerances, naming and required fields are checked instantly from what you type. They cannot open your file.'],
              ['Evidence', 'Your drawing, render or model summary is attached to the submission — public, so it can live in your portfolio.'],
              ['Reviewer confirmation', 'Only the course owner can confirm a project, score the rubric and unlock the certificate.'],
            ].map(([title, body]) => (
              <div key={title}>
                <p className="font-heading text-[14px] font-medium">{title}</p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}