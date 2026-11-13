import { FileText, Download, Table2 } from 'lucide-react';
import PageHeader from '@/components/site/PageHeader';
import { stages } from '@/content/curriculum';
import { projects } from '@/content/projects';
import { skills } from '@/content/skills';
import { downloadProjectPacket, downloadStageWorksheet, downloadSkillChecklist, downloadSkillCsv } from '@/lib/pdf';

export default function Downloads() {
  return (
    <div>
      <PageHeader
        kicker="Downloadable exercises"
        title="Print the packet, work offline, bring it back"
        intro="Every packet is generated in your browser as a PDF — brief, specification, steps, tolerances and a reviewer sign-off box. Nothing is emailed, nothing is stored."
      />

      <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
        <section>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mono-label">Project packets</p>
              <h2 className="mt-2 font-heading text-2xl font-medium tracking-tight">Five projects, print-ready</h2>
            </div>
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">A4 · PDF · generated locally</p>
          </div>

          <div className="mt-6 grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <button
                key={project.slug}
                type="button"
                onClick={() => downloadProjectPacket(project)}
                className="group flex flex-col justify-between bg-card p-5 text-left transition-colors hover:bg-paper"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-signal">Project {project.n}</span>
                    <FileText size={15} className="text-muted-foreground group-hover:text-ink" />
                  </div>
                  <h3 className="mt-3 font-heading text-[15px] font-medium leading-snug">{project.title}</h3>
                  <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">{project.packet.subtitle}</p>
                </div>
                <span className="mt-5 inline-flex items-center gap-2 border-t border-hairline pt-3 font-mono text-[9px] uppercase tracking-[0.12em]">
                  <Download size={12} /> Download PDF
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <p className="mono-label">Stage worksheets</p>
          <h2 className="mt-2 font-heading text-2xl font-medium tracking-tight">Lesson checklists with room to write</h2>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {stages.map((stage) => (
              <button
                key={stage.id}
                type="button"
                onClick={() => downloadStageWorksheet(stage)}
                className="flex items-center justify-between gap-4 border border-hairline bg-card px-4 py-3 text-left transition-colors hover:border-ink"
              >
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-signal">Stage {stage.n}</p>
                  <p className="mt-0.5 text-[13px]">{stage.title}</p>
                </div>
                <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                  {stage.lessons.length} lessons <Download size={12} />
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-14 border border-hairline bg-paper p-6 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="mono-label">Skill checklist</p>
              <h2 className="mt-2 font-heading text-xl font-medium">All {skills.length} skills, with how each is proven</h2>
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
                Print the PDF to tick by hand, or take the CSV into a spreadsheet. A tick on paper is not a
                confirmation in this system — only your reviewer’s confirmation is.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={downloadSkillChecklist}
                className="inline-flex items-center justify-center gap-2 bg-ink px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-paper"
              >
                <Download size={13} /> PDF
              </button>
              <button
                type="button"
                onClick={downloadSkillCsv}
                className="inline-flex items-center justify-center gap-2 border border-ink/25 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] hover:border-ink"
              >
                <Table2 size={13} /> CSV
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}