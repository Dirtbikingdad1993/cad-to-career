import PageHeader from '@/components/site/PageHeader';
import { tools, decisions, costPath } from '@/content/tools';
import { Smartphone, Laptop } from 'lucide-react';

export default function Tools() {
  return (
    <div>
      <PageHeader
        kicker="Software comparison"
        title="Which CAD tool, and when to switch"
        intro="Prices and plans change — check the vendor page before you commit. What does not change is the order: concepts first, software second."
      />

      <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full border-collapse border border-hairline text-left">
            <thead>
              <tr className="bg-card">
                {['Tool', 'Cost to start', 'Runs on', 'Strongest at', 'Watch out for', 'Curriculum role'].map((h) => (
                  <th key={h} className="border-b border-hairline px-4 py-3 mono-label">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tools.map((tool) => (
                <tr key={tool.name} className="align-top">
                  <td className="border-b border-hairline px-4 py-4">
                    <div className="flex items-center gap-2">
                      {tool.icon === 'phone' ? <Smartphone size={14} className="text-signal" /> : <Laptop size={14} className="text-signal" />}
                      <span className="font-heading text-[14px] font-medium">{tool.name}</span>
                    </div>
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">{tool.licence}</p>
                  </td>
                  <td className="border-b border-hairline px-4 py-4 text-[12px] text-ink/80">{tool.cost}</td>
                  <td className="border-b border-hairline px-4 py-4 text-[12px] text-ink/80">{tool.runs}</td>
                  <td className="border-b border-hairline px-4 py-4 text-[12px] text-ink/80">{tool.best}</td>
                  <td className="border-b border-hairline px-4 py-4 text-[12px] text-muted-foreground">{tool.limits}</td>
                  <td className="border-b border-hairline px-4 py-4 font-mono text-[10px] uppercase tracking-[0.1em] text-signal">{tool.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4 lg:hidden">
          {tools.map((tool) => (
            <div key={tool.name} className="border border-hairline bg-card p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-heading text-base font-medium">{tool.name}</h2>
                <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-signal">{tool.role}</span>
              </div>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">{tool.licence} · {tool.runs}</p>
              <p className="mt-3 text-[12.5px] leading-relaxed text-ink/80">{tool.best}</p>
              <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{tool.limits}</p>
              <p className="mt-3 border-t border-hairline pt-2 font-mono text-[10px] text-ink">{tool.cost}</p>
            </div>
          ))}
        </div>

        <section className="mt-14">
          <p className="mono-label">Decision guide</p>
          <h2 className="mt-3 font-heading text-2xl font-medium tracking-tight sm:text-3xl">If this is your situation</h2>
          <div className="mt-6 grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-3">
            {decisions.map((d) => (
              <div key={d.situation} className="bg-card p-5">
                <p className="mono-label">{d.situation}</p>
                <p className="mt-2 font-heading text-[15px] font-medium leading-snug">{d.answer}</p>
                <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{d.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-8 lg:grid-cols-2">
          <div>
            <p className="mono-label">Cost path</p>
            <div className="mt-3 border border-hairline">
              {costPath.map(([stage, what, cost], i) => (
                <div key={stage} className={`flex items-center justify-between gap-4 px-4 py-3 ${i > 0 ? 'border-t border-hairline' : ''}`}>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">{stage}</p>
                    <p className="mt-0.5 text-[13px]">{what}</p>
                  </div>
                  <span className={`font-mono text-[11px] ${cost === '$0' ? 'text-emerald-700' : 'text-signal'}`}>{cost}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border border-hairline bg-paper p-6">
            <p className="mono-label">A warning about “free”</p>
            <p className="mt-3 text-[13px] leading-relaxed text-ink/80">
              Free plans often make your documents public, or limit commercial use. That is fine for learning — this whole
              curriculum is built to run on free tiers — but read the licence before you sell a design.
            </p>
            <p className="mt-4 text-[13px] leading-relaxed text-ink/80">
              FreeCAD and Blender have no such restriction. If you need a completely free, permanent, offline toolchain,
              that pair covers every project here.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}