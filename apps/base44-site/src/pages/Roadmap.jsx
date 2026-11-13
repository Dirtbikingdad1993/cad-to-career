import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageHeader from '@/components/site/PageHeader';
import { stages } from '@/content/curriculum';
import { stageProgress, statusOf, recordMap } from '@/lib/progress';
import { useWorkspace } from '@/components/workspace/WorkspaceProvider';
import LessonRow from '@/components/lessons/LessonRow';

export default function Roadmap() {
  const { records, student } = useWorkspace();
  const map = recordMap(records);

  return (
    <div>
      <PageHeader
        kicker="Beginner → career · six stages"
        title="The roadmap, and what has to be true before you move on"
        intro="Nothing is locked. Work in any order you like — but each stage has a real exit condition, and the certificate only counts work a reviewer has confirmed."
      />

      <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
        {!student && (
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border border-ink/20 bg-signalSoft px-5 py-4">
            <p className="text-[13px] text-ink/80">
              Read every lesson for free. Sign in to save your progress and return on a different device.
            </p>
            <Link
              to="/workspace"
              className="inline-flex items-center gap-2 bg-ink px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-paper"
            >
              Create workspace <ArrowRight size={13} />
            </Link>
          </div>
        )}

        <div className="space-y-14">
          {stages.map((stage) => {
            const sp = stageProgress(records, stage.id);
            return (
              <section key={stage.id} id={stage.id} className="scroll-mt-24">
                <div className="grid gap-6 border-t border-ink pt-5 lg:grid-cols-[auto_1fr_20rem] lg:gap-10">
                  <span className="font-mono text-2xl text-signal">{stage.n}</span>
                  <div>
                    <h2 className="font-heading text-2xl font-medium tracking-tight sm:text-3xl">{stage.title}</h2>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{stage.promise}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {stage.tools.map((tool) => (
                        <span key={tool} className="border border-hairline px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="border border-hairline bg-card p-4">
                    <p className="mono-label">Confirmed in this stage</p>
                    <p className="mt-2 font-heading text-xl">
                      {sp.confirmed}
                      <span className="text-sm text-muted-foreground"> / {sp.total}</span>
                    </p>
                    <div className="mt-3 h-[3px] w-full bg-hairline">
                      <div className="h-[3px] bg-signal transition-all" style={{ width: `${(sp.confirmed / sp.total) * 100}%` }} />
                    </div>
                    <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
                      <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink">Move on when: </span>
                      {stage.moveOn}
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-hairline">
                  {stage.lessons.map((lesson, i) => (
                    <LessonRow
                      key={lesson.slug}
                      lesson={{ ...lesson, stageN: stage.n, index: i + 1 }}
                      status={statusOf(map, 'lesson', lesson.slug)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-16 border border-hairline bg-card p-6 sm:p-8">
          <p className="mono-label">Then what</p>
          <h2 className="mt-3 font-heading text-xl font-medium">The five projects are the roadmap’s real output</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Lessons build the skill; projects prove it. A certificate needs all five projects confirmed and twelve core
            skills confirmed — both by a reviewer, never by you.
          </p>
          <Link
            to="/projects"
            className="mt-5 inline-flex items-center gap-2 border border-ink px-5 py-3 font-mono text-[10px] uppercase tracking-[0.14em] hover:bg-ink hover:text-paper"
          >
            See the projects <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}