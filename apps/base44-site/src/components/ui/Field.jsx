export const fieldClass =
  'w-full border border-hairline bg-card px-3 py-2.5 font-mono text-[11px] text-ink outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-ink';

export default function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mono-label">{label}</span>
      <span className="mt-2 block">{children}</span>
      {hint && (
        <span className="mt-1.5 block font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
          {hint}
        </span>
      )}
    </label>
  );
}