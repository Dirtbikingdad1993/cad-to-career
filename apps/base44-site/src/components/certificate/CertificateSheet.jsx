import { projects } from '@/content/projects';
import { coreSkills } from '@/content/skills';
import { statusOf, summarize } from '@/lib/progress';

export default function CertificateSheet({ student, records }) {
  const map = summarize(records).map;
  const date = student.issued_date ? new Date(student.issued_date) : new Date();
  const projectsDone = projects.filter((p) => statusOf(map, 'project', p.slug) === 'confirmed');
  const skillsDone = coreSkills.filter((s) => statusOf(map, 'skill', s.id) === 'confirmed');

  return (
    <div className="border border-ink bg-card p-6 sm:p-12">
      <div className="border-[3px] border-double border-ink/40 p-6 sm:p-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">CAD to Career · free CAD trade education</p>
            <h2 className="mt-4 font-heading text-2xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Certificate of confirmed practice
            </h2>
          </div>
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center border border-ink sm:flex">
            <svg width="22" height="22" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M2 14 L14 2" className="stroke-signal" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <p className="mt-8 mono-label">Awarded to</p>
        <p className="mt-2 font-heading text-2xl font-medium tracking-tight sm:text-3xl">{student.full_name}</p>

        <p className="mt-6 max-w-xl text-[13px] leading-relaxed text-ink/75">
          for completing the CAD to Career beginner-to-career CAD curriculum and producing original work that a
          reviewer confirmed against the published rubrics listed below.
        </p>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <p className="mono-label">Portfolio projects confirmed</p>
            <ul className="mt-3 space-y-1.5">
              {projectsDone.map((p) => (
                <li key={p.slug} className="flex gap-2 text-[12px]">
                  <span className="font-mono text-[10px] text-signal">{p.n}</span>
                  {p.title}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mono-label">Core skills confirmed</p>
            <ul className="mt-3 space-y-1.5">
              {skillsDone.map((s) => (
                <li key={s.id} className="flex gap-2 text-[12px] leading-snug">
                  <span className="mt-1.5 h-1 w-2.5 shrink-0 bg-signal" />
                  {s.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-4 border-t border-hairline pt-5">
          <div>
            <p className="mono-label">Certificate code</p>
            <p className="mt-1 font-mono text-[12px] tracking-[0.2em]">{student.certificate_code || '—'}</p>
          </div>
          <div>
            <p className="mono-label">Date issued</p>
            <p className="mt-1 font-mono text-[12px]">{date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
          </div>
          <div className="text-right">
            <p className="font-heading text-[15px] italic">CAD to Career reviewer</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Confirmed by review</p>
          </div>
        </div>
      </div>
      <p className="mt-4 text-center font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground">
        A learning record, not an accredited qualification · verify with the certificate code above
      </p>
    </div>
  );
}