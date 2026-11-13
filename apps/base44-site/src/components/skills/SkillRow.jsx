import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import StatusPill from '@/components/ui/StatusPill';
import EvidenceField from '@/components/workspace/EvidenceField';
import { fieldClass } from '@/components/ui/Field';

export default function SkillRow({ skill, record, onSave }) {
  const status = record?.status || 'not_started';
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(record?.evidence_url || '');
  const [note, setNote] = useState(record?.note || '');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const locked = status === 'confirmed';

  const submit = async () => {
    setBusy(true);
    try {
      await onSave(skill.id, { evidence_url: url, note, status: 'ready_for_review' });
      setSaved(true);
      setOpen(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="border-b border-hairline">
      <div className="flex flex-wrap items-start justify-between gap-3 py-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[13.5px] font-medium leading-snug">{skill.label}</h3>
            {skill.core && (
              <span className="border border-signal/40 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em] text-signal">
                core
              </span>
            )}
          </div>
          <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">Proven by: {skill.how}</p>
          {record?.reviewer_note && (
            <p className="mt-2 border-l-2 border-emerald-600/40 pl-2 text-[11px] text-emerald-800">{record.reviewer_note}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <StatusPill status={status} />
          {!locked && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-1 border border-hairline px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] hover:border-ink"
            >
              {open ? 'Close' : saved ? 'Edit' : 'Add proof'} <ArrowRight size={11} />
            </button>
          )}
        </div>
      </div>

      {open && !locked && (
        <div className="space-y-3 pb-5">
          <EvidenceField value={url} onChange={setUrl} />
          <textarea
            className={`${fieldClass} min-h-[60px]`}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="One line: what you made and where the proof shows it"
          />
          <button
            type="button"
            disabled={busy || !url}
            onClick={submit}
            className="inline-flex items-center gap-2 bg-ink px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-paper disabled:opacity-40"
          >
            <Check size={13} /> {busy ? 'Saving…' : 'Send for confirmation'}
          </button>
        </div>
      )}
    </div>
  );
}