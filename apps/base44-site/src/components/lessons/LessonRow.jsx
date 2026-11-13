import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import StatusPill from '@/components/ui/StatusPill';

export default function LessonRow({ lesson, status }) {
  return (
    <Link
      to={`/lessons/${lesson.slug}`}
      className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-hairline py-4 transition-colors hover:bg-card"
    >
      <span className="font-mono text-[10px] text-muted-foreground">
        {lesson.stageN}.{String(lesson.index).padStart(2, '0')}
      </span>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-heading text-[15px] font-medium">{lesson.title}</h3>
          <ArrowUpRight size={13} className="shrink-0 text-signal opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <p className="mt-0.5 truncate font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
          {lesson.min} min · {lesson.tool}
        </p>
      </div>
      <StatusPill status={status} />
    </Link>
  );
}