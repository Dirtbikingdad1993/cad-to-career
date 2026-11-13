import { Link } from 'react-router-dom';

const COLUMNS = [
  {
    title: 'Learn',
    links: [
      { label: 'Roadmap', to: '/roadmap' },
      { label: 'Lessons', to: '/lessons' },
      { label: 'Phone → desktop plan', to: '/phone-to-desktop' },
    ],
  },
  {
    title: 'Prove',
    links: [
      { label: 'Portfolio projects', to: '/projects' },
      { label: 'Skill checklist', to: '/skills' },
      { label: 'Certificate', to: '/certificate' },
    ],
  },
  {
    title: 'Reference',
    links: [
      { label: 'Software comparison', to: '/tools' },
      { label: 'Downloads', to: '/downloads' },
      { label: 'Reviewer console', to: '/owner' },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_2fr]">
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[0.3em]">CAD to Career</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Free technical trade education for CAD. Nothing is marked complete here until a reviewer
              confirms the work you attached.
            </p>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              A learning project — not an accredited institution
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="mono-label">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="text-sm text-ink/80 transition-colors hover:text-signal">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            Sheet 01 · Revision A · Free to use
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            Draw it · Dimension it · Prove it
          </p>
        </div>
      </div>
    </footer>
  );
}