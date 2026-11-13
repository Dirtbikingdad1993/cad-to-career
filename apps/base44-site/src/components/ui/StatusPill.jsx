import { statusMeta } from '@/lib/progress';

export default function StatusPill({ status }) {
  const meta = statusMeta(status);
  return (
    <span
      className={`inline-flex shrink-0 items-center border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}