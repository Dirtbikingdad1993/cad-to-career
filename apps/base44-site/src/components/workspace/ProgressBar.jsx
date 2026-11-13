export default function ProgressBar({ value, total, label }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="mono-label">{label}</span>
        <span className="font-mono text-[10px] text-ink">
          {value}/{total}
        </span>
      </div>
      <div className="mt-2 h-[3px] w-full bg-hairline">
        <div className="h-[3px] bg-signal transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}