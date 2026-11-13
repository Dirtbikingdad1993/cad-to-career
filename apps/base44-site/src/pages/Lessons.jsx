import { useState } from 'react';
import PageHeader from '@/components/site/PageHeader';
import { stages, allLessons } from '@/content/curriculum';
import { statusOf, recordMap, summarize } from '@/lib/progress';
import { useWorkspace } from '@/components/workspace/WorkspaceProvider';
import LessonRow from '@/components/lessons/LessonRow';

export default function Lessons() {
  const { records } = useWorkspace();
  const map = recordMap(records);
  const [filter, setFilter] = useState('all');
  const s = summarize(records);

  const list = filter === 'all' ? allLessons : allLessons.filter((l) => l.stageId === filter);

  return (
    <div>
      <PageHeader
        kicker={`${allLessons.length} authored lessons · mobile-friendly`}
        title="Lessons you can start on an Android phone"
        intro="Every lesson ends in an artefact a reviewer can check — a measured part, a sketch, a sheet or a screenshot. Reading alone is never counted."
      >
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-hairline pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          <span>{s.confirmedLessons} confirmed</span>
          <span>{s.readyLessons} awaiting review</span>
          <span>{s.startedLessons} started</span>
        </div>
      </PageHeader>

      <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-14">
        <div className="flex flex-wrap gap-2 border-b border-hairline pb-5">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] transition-colors ${
              filter === 'all' ? 'border-ink bg-ink text-paper' : 'border-hairline hover:border-ink/40'
            }`}
          >
            All stages
          </button>
          {stages.map((stage) => (
            <button
              key={stage.id}
              type="button"
              onClick={() => setFilter(stage.id)}
              className={`border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] transition-colors ${
                filter === stage.id ? 'border-ink bg-ink text-paper' : 'border-hairline hover:border-ink/40'
              }`}
            >
              {stage.n} · {stage.title}
            </button>
          ))}
        </div>

        <div className="mt-2">
          {list.map((lesson) => (
            <LessonRow key={lesson.slug} lesson={lesson} status={statusOf(map, 'lesson', lesson.slug)} />
          ))}
        </div>
      </div>
    </div>
  );
}