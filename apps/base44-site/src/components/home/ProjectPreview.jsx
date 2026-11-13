import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ProjectPreview({ projects }) {
  return (
    <div className="grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p, i) => (
        <Link
          key={p.n}
          to="/projects"
          className={`group flex flex-col justify-between bg-card p-6 transition-colors hover:bg-paper ${
            i === 0 ? 'sm:col-span-2 lg:col-span-1' : ''
          }`}
        >
          <div>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal">{p.stage}</span>
              <span className="font-mono text-[10px] text-muted-foreground">{p.n}/05</span>
            </div>
            <h3 className="mt-4 font-heading text-lg font-medium leading-snug tracking-tight">{p.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.proves}</p>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-hairline pt-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{p.tool}</span>
            <ArrowRight size={14} className="text-ink transition-transform group-hover:translate-x-1 group-hover:text-signal" />
          </div>
        </Link>
      ))}
      <div className="flex flex-col justify-between bg-signalSoft p-6">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal">How it counts</span>
          <h3 className="mt-4 font-heading text-lg font-medium leading-snug tracking-tight">
            A project is only “done” when a reviewer confirms it.
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">
            Automatic checks catch measurable mistakes. They never tick a box on your behalf.
          </p>
        </div>
        <Link
          to="/projects"
          className="mt-6 inline-flex items-center gap-2 border-t border-signal/25 pt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-signal"
        >
          Read the rubrics <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}