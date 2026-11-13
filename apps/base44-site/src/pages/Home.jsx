import { Link } from 'react-router-dom';
import { ArrowRight, Smartphone, Laptop, ClipboardCheck } from 'lucide-react';
import HeroDrawing from '@/components/home/HeroDrawing';
import StagePreview from '@/components/home/StagePreview';
import ProjectPreview from '@/components/home/ProjectPreview';
import { lessonCount } from '@/content/curriculum';
import { projectCount } from '@/content/projects';
import { skills } from '@/content/skills';

const STAGES = [
  { n: '00', title: 'Phone-first foundations', promise: 'See and measure like a drafter, using only an Android phone.', tool: 'Onshape · Fusion app', lessons: 6 },
  { n: '01', title: '2D drafting that shops accept', promise: 'Dimensioned, toleranced drawings built on a real datum scheme.', tool: 'FreeCAD TechDraw · Fusion', lessons: 6 },
  { n: '02', title: 'Solid 3D modeling', promise: 'Parametric parts you can measure, validate and change safely.', tool: 'Fusion 360 · FreeCAD', lessons: 6 },
  { n: '03', title: 'Assemblies & motion', promise: 'Multi-part products that fit, move and rebuild without breaking.', tool: 'Fusion · FreeCAD Assembly', lessons: 6 },
  { n: '04', title: 'Product design & surfacing', promise: 'Ergonomic forms, clean surfaces, presentable renders.', tool: 'Blender · Fusion surface', lessons: 6 },
  { n: '05', title: 'Job readiness', promise: 'A portfolio, a drawing package and a timed interview drill.', tool: 'All of the above', lessons: 6 },
];

const PROJECTS = [
  { n: '01', stage: 'Stage 01', title: 'Dimensioned bracket drawing', proves: 'You can produce a drawing a machinist would accept without calling you.', tool: 'FreeCAD or Fusion' },
  { n: '02', stage: 'Stage 02–03', title: 'Parametric snap-fit enclosure', proves: 'Your model is driven by parameters and tolerances, not by dragging.', tool: 'Fusion 360 / FreeCAD' },
  { n: '03', stage: 'Stage 03', title: 'Hinge assembly with motion', proves: 'You resolve joints, interferences and a bill of materials.', tool: 'Fusion 360' },
  { n: '04', stage: 'Stage 04', title: 'Surface-modelled grip', proves: 'You can shape a product for a hand, then make it printable.', tool: 'Blender / Fusion' },
  { n: '05', stage: 'Stage 05', title: 'Manufacturing redesign', proves: 'You can reverse-engineer a part and defend your process choice.', tool: 'Any parametric CAD' },
];

const STEPS = [
  { icon: ClipboardCheck, n: '01', title: 'Do the work in real CAD', body: 'Every lesson ends in a part, a drawing or a measurement — not a quiz you can guess.' },
  { icon: Laptop, n: '02', title: 'Attach the proof', body: 'Export the PDF, render or screenshot, then log the numbers a reviewer would check.' },
  { icon: Smartphone, n: '03', title: 'A human confirms it', body: 'Only the course owner can mark a lesson, project, skill or certificate confirmed.' },
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="pointer-events-none absolute inset-0 grid-sheet opacity-40" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-16 lg:px-8 lg:py-24">
          <div className="rise">
            <p className="mono-label">Free · Technical trade education · CAD</p>
            <h1 className="mt-6 font-heading text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-[4.1rem]">
              Learn CAD from zero.
              <span className="mt-2 block text-signal">Prove you can actually design.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink/70 sm:text-base">
              A beginner-to-career curriculum for 2D drafting, parametric 3D and product design. Start on an
              Android phone. Finish with five reviewed portfolio projects and a certificate that lists exactly
              what you proved — nothing you merely clicked through.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/roadmap"
                className="group inline-flex items-center justify-center gap-3 bg-ink px-6 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-paper transition-opacity hover:opacity-85"
              >
                Start the roadmap
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/projects"
                className="inline-flex items-center justify-center gap-3 border border-ink/25 px-6 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-ink transition-colors hover:border-ink"
              >
                See the five projects
              </Link>
            </div>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Browse lessons free · create an account to sync progress across devices
            </p>
          </div>
          <div className="rise" style={{ animationDelay: '0.15s' }}>
            <HeroDrawing />
          </div>
        </div>
      </section>

      <section className="border-b border-hairline bg-card">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-hairline px-5 sm:grid-cols-4 sm:divide-x lg:px-8">
          {[
            [String(lessonCount), 'authored lessons'],
            [String(projectCount).padStart(2, '0'), 'portfolio projects'],
            [String(skills.length), 'skill checks'],
            ['00', 'auto-completions'],
          ].map(([value, label]) => (
            <div key={label} className="px-2 py-6 sm:px-6">
              <p className="font-heading text-2xl font-medium sm:text-3xl">{value}</p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="mono-label">Completion policy</p>
            <h2 className="mt-5 font-heading text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
              Watching a lesson is not the same as being able to build the part.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
              CAD to Career separates what you claim from what has been confirmed. Your workspace keeps the two
              columns apart on purpose, and the certificate only ever reads from the confirmed one.
            </p>
          </div>
          <div className="grid gap-px bg-hairline sm:grid-cols-3">
            {STEPS.map(({ icon: Icon, n, title, body }) => (
              <div key={n} className="bg-paper p-6">
                <div className="flex items-center justify-between">
                  <Icon size={18} className="text-signal" strokeWidth={1.5} />
                  <span className="font-mono text-[10px] text-muted-foreground">{n}</span>
                </div>
                <h3 className="mt-6 font-heading text-base font-medium leading-snug">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 lg:px-8 lg:pb-24">
        <div className="flex flex-wrap items-end justify-between gap-4 pb-6">
          <div>
            <p className="mono-label">The roadmap</p>
            <h2 className="mt-4 font-heading text-3xl font-medium tracking-tight sm:text-4xl">
              Six stages, phone to drafting bench
            </h2>
          </div>
          <Link to="/roadmap" className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal hover:underline">
            Full roadmap →
          </Link>
        </div>
        <StagePreview stages={STAGES} />
      </section>

      <section className="border-y border-hairline bg-card">
        <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4 pb-8">
            <div>
              <p className="mono-label">Five portfolio projects</p>
              <h2 className="mt-4 max-w-xl font-heading text-3xl font-medium tracking-tight sm:text-4xl">
                The work that gets you hired, not the software tour
              </h2>
            </div>
            <Link to="/projects" className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal hover:underline">
              Rubrics & rules →
            </Link>
          </div>
          <ProjectPreview projects={PROJECTS} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-20">
          <div>
            <p className="mono-label">Software</p>
            <h2 className="mt-4 font-heading text-3xl font-medium tracking-tight sm:text-4xl">
              Free tools first. Industry tools when you need them.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Every exercise is written so it can be done in at least two of the recommended tools. Start on your
              phone with Onshape or the Fusion app; move to Fusion 360, FreeCAD or Blender on a desktop when the
              work demands it — and this site tells you exactly when that is.
            </p>
            <Link
              to="/tools"
              className="mt-8 inline-flex items-center gap-2 border border-ink/25 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors hover:border-ink"
            >
              Compare software <ArrowRight size={13} />
            </Link>
          </div>
          <div className="border border-hairline bg-card">
            {[
              ['Onshape', 'Free plan · browser & phone', 'Start here on Android'],
              ['Fusion 360', 'Free personal use · desktop', 'Main teaching tool'],
              ['FreeCAD', 'Free & open source · desktop', 'Drawings & parametric parts'],
              ['Blender', 'Free · desktop', 'Surfacing, subdivision, renders'],
              ['AutoCAD LT', 'Paid · industry standard', 'Read the job ads'],
              ['Tinkercad', 'Free · browser', 'First hour only'],
            ].map(([name, meta, role], i) => (
              <div
                key={name}
                className={`flex items-center justify-between gap-4 px-5 py-4 ${i > 0 ? 'border-t border-hairline' : ''}`}
              >
                <div>
                  <p className="font-heading text-sm font-medium">{name}</p>
                  <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">{meta}</p>
                </div>
                <span className="text-right font-mono text-[9px] uppercase tracking-[0.12em] text-signal">{role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-hairline bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-16 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/60">Start today</p>
            <h2 className="mt-4 max-w-2xl font-heading text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
              Stage 00 needs nothing but the phone in your pocket.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/workspace"
              className="inline-flex items-center justify-center gap-2 bg-signal px-6 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white"
            >
              Create my workspace <ArrowRight size={14} />
            </Link>
            <Link
              to="/phone-to-desktop"
              className="inline-flex items-center justify-center border border-paper/30 px-6 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-paper"
            >
              Phone → desktop plan
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}