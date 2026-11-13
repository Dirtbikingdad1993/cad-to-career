import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

const NAV = [
  { label: 'Roadmap', to: '/roadmap' },
  { label: 'Lessons', to: '/lessons' },
  { label: 'Projects', to: '/projects' },
  { label: 'Geometry lab', to: '/lab' },
  { label: 'Tools', to: '/tools' },
  { label: 'Phone → Desktop', to: '/phone-to-desktop' },
  { label: 'Downloads', to: '/downloads' },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center border border-ink">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M2 14 L14 2" className="stroke-signal" strokeWidth="2" />
              <circle cx="12" cy="12" r="1.6" className="fill-ink" />
            </svg>
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-mono text-[12px] font-medium uppercase tracking-[0.3em]">CAD to Career</span>
            <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Free CAD trade school</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `font-mono text-[10px] uppercase tracking-[0.16em] transition-colors ${
                  isActive ? 'text-signal' : 'text-muted-foreground hover:text-ink'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {!isAuthenticated ? <Link to="/login" className="border border-ink px-3 py-2 font-mono text-[10px] uppercase tracking-wide">Sign in</Link> : <button type="button" onClick={()=>logout(true)} className="hidden border border-ink/30 px-3 py-2 font-mono text-[10px] uppercase tracking-wide sm:block" title={user?.email}>Sign out</button>}
          <Link
            to="/workspace"
            className="hidden bg-ink px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-paper transition-opacity hover:opacity-80 sm:block"
          >
            My workspace
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center border border-hairline text-ink lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-hairline bg-paper px-5 py-4 lg:hidden">
          <div className="flex flex-col">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="border-b border-hairline py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink last:border-0"
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/workspace"
              onClick={() => setOpen(false)}
              className="mt-4 bg-ink px-4 py-3 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-paper"
            >
              My workspace
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}