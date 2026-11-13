import { Check, X } from 'lucide-react';
import Field, { fieldClass } from '@/components/ui/Field';

export default function AutoCheckForm({ project, values, onChange, results }) {
  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    onChange({ ...values, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {project.fields.map((f) => (
          <div key={f.key} className={f.key === 'file_name' ? 'sm:col-span-2' : ''}>
            {f.type === 'select' && (
              <Field label={f.label}>
                <select className={fieldClass} value={values[f.key] || ''} onChange={set(f.key)}>
                  <option value="">Choose…</option>
                  {f.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </Field>
            )}
            {f.type === 'checkbox' && (
              <label className="flex h-full items-start gap-3 border border-hairline bg-card px-3 py-3">
                <input
                  type="checkbox"
                  checked={Boolean(values[f.key])}
                  onChange={set(f.key)}
                  className="mt-0.5 h-4 w-4 accent-[hsl(var(--signal))]"
                />
                <span className="text-[12px] leading-snug">{f.label}</span>
              </label>
            )}
            {(f.type === 'number' || f.type === 'text') && (
              <Field label={f.label} hint={f.hint}>
                <input
                  className={fieldClass}
                  type={f.type === 'number' ? 'number' : 'text'}
                  step="any"
                  value={values[f.key] ?? ''}
                  onChange={set(f.key)}
                  placeholder={f.placeholder || ''}
                />
              </Field>
            )}
          </div>
        ))}
      </div>

      <div className="border border-hairline bg-card">
        <div className="flex items-center justify-between border-b border-hairline px-4 py-2.5">
          <span className="mono-label">Automatic checks</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
            {results.filter((r) => r.pass).length}/{results.length} passing
          </span>
        </div>
        {results.map((r) => (
          <div key={r.id} className="flex items-start gap-2 border-b border-hairline px-4 py-2 last:border-0">
            <span className={r.pass ? 'mt-0.5 text-emerald-700' : 'mt-0.5 text-muted-foreground'}>
              {r.pass ? <Check size={13} /> : <X size={13} />}
            </span>
            <span className={`text-[12px] ${r.pass ? 'text-ink' : 'text-ink/70'}`}>
              {r.label}
              <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">{r.detail}</span>
            </span>
          </div>
        ))}
        <p className="px-4 py-3 font-mono text-[9px] leading-relaxed tracking-[0.04em] text-muted-foreground">
          These checks read only what you typed here. They cannot open your CAD file, and passing them never completes the project.
        </p>
      </div>
    </div>
  );
}