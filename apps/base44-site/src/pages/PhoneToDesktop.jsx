import PageHeader from '@/components/site/PageHeader';
import { milestones, hardwareFloor, desktopOnly, fileDiscipline } from '@/content/transition';
import { Smartphone, Laptop, ArrowRight } from 'lucide-react';

export default function PhoneToDesktop() {
  return (
    <div>
      <PageHeader
        kicker="Transition plan"
        title="Start on the phone. Move to a desk exactly when the work demands it."
        intro="Most courses assume a laptop on day one. This one does not. Stage 00 is designed for a phone; the move to desktop is a scheduled step with a trigger, not a vague upgrade."
      />

      <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="flex items-center gap-3 border-y border-hairline py-4 font-mono text-[10px] uppercase tracking-[0.16em]">
          <Smartphone size={15} className="text-signal" />
          <span>Phone only</span>
          <ArrowRight size={13} className="text-muted-foreground" />
          <span className="text-muted-foreground">Shared computer</span>
          <ArrowRight size={13} className="text-muted-foreground" />
          <span className="flex items-center gap-1.5"><Laptop size={14} /> Own desk</span>
        </div>

        <div className="mt-12 space-y-10">
          {milestones.map((m) => (
            <section key={m.n} className="grid gap-6 border-t border-ink pt-5 lg:grid-cols-[6rem_1fr_1fr] lg:gap-10">
              <div>
                <p className="font-mono text-2xl text-signal">{m.n}</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">{m.device}</p>
              </div>
              <div>
                <h2 className="font-heading text-xl font-medium tracking-tight sm:text-2xl">{m.title}</h2>
                <p className="mt-2 text-[13px] leading-relaxed text-ink/75">{m.can}</p>
                <ul className="mt-4 space-y-1.5">
                  {m.do.map((item) => (
                    <li key={item} className="flex gap-2 text-[12.5px] text-ink/80">
                      <span className="mt-1.5 h-1 w-2.5 shrink-0 bg-signal" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border border-hairline bg-card p-4">
                <p className="mono-label">Move on when</p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-ink/85">{m.moveWhen}</p>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <section>
            <p className="mono-label">Hardware floor</p>
            <h2 className="mt-3 font-heading text-2xl font-medium tracking-tight">What a desktop actually needs</h2>
            <div className="mt-4 border border-hairline">
              {hardwareFloor.map(([label, value], i) => (
                <div key={label} className={`flex justify-between gap-4 px-4 py-3 ${i > 0 ? 'border-t border-hairline' : ''}`}>
                  <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">{label}</span>
                  <span className="text-right text-[12.5px] text-ink">{value}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <p className="mono-label">What really needs a desktop</p>
            <h2 className="mt-3 font-heading text-2xl font-medium tracking-tight">Honest limits of phone CAD</h2>
            <div className="mt-4 space-y-3">
              {desktopOnly.map(([title, body]) => (
                <div key={title} className="border-l-2 border-signal pl-4">
                  <p className="font-heading text-[14px] font-medium">{title}</p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-16 border border-hairline bg-card p-6 sm:p-8">
          <p className="mono-label">Habits that transfer</p>
          <h2 className="mt-3 font-heading text-2xl font-medium tracking-tight">File discipline from day one</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {fileDiscipline.map((item, i) => (
              <li key={item} className="flex gap-3 text-[13px] leading-relaxed text-ink/80">
                <span className="font-mono text-[10px] text-signal">{String(i + 1).padStart(2, '0')}</span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}