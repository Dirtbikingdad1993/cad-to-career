export default function RubricTable({ rubric, scores = {}, editable = false, onChange }) {
  return (
    <div className="border border-hairline">
      <div className="grid grid-cols-[1.4fr_auto] gap-4 border-b border-hairline bg-card px-4 py-2.5">
        <span className="mono-label">Criterion</span>
        <span className="mono-label">Weight</span>
      </div>
      {rubric.map((c) => (
        <div key={c.id} className="border-b border-hairline px-4 py-3 last:border-0">
          <div className="grid grid-cols-[1.4fr_auto] gap-4">
            <p className="font-heading text-[14px] font-medium">{c.label}</p>
            <span className="text-right font-mono text-[10px] text-signal">{c.weight}%</span>
          </div>
          <p className="mt-1 pr-4 text-[12px] leading-relaxed text-muted-foreground">{c.anchor}</p>
          {editable ? (
            <div className="mt-3 flex items-center gap-1.5">
              {[0, 1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onChange(c.id, n)}
                  className={`h-7 w-7 border font-mono text-[10px] transition-colors ${
                    Number(scores[c.id]) === n ? 'border-ink bg-ink text-paper' : 'border-hairline hover:border-ink/40'
                  }`}
                >
                  {n}
                </button>
              ))}
              <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                {scores[c.id] === undefined ? 'not scored' : `${scores[c.id]}/4`}
              </span>
            </div>
          ) : (
            scores[c.id] !== undefined && (
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-emerald-700">
                Reviewer score {scores[c.id]}/4
              </p>
            )
          )}
        </div>
      ))}
    </div>
  );
}