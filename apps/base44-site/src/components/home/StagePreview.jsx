import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function StagePreview({ stages }) {
  return (
    <div className="border-t border-hairline">
      {stages.map((s) => (
        <Link
          key={s.n}
          to="/roadmap"
          className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-hairline py-5 transition-colors hover:bg-card sm:grid-cols-[auto_1fr_auto_auto] sm:gap-8"
        >
          <span className="font-mono text-[11px] text-signal">{s.n}</span>
          <div>
            <h3 className="font-heading text-base font-medium tracking-tight sm:text-lg">{s.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.promise}</p>
          </div>
          <span className="hidden font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground md:block">
            {s.tool}
          </span>
          <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
            {s.lessons} lessons
            <ArrowUpRight size={13} className="text-signal opacity-0 transition-opacity group-hover:opacity-100" />
          </span>
        </Link>
      ))}
    </div>
  );
}