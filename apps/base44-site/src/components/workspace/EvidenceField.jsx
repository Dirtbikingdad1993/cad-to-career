import { useState } from 'react';
import { Upload, Link2, Loader2, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import Field, { fieldClass } from '@/components/ui/Field';

export default function EvidenceField({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [note, setNote] = useState('');

  const upload = async (file) => {
    if (!file) return;
    setUploading(true);
    setNote('');
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      onChange(file_url);
      setNote('Uploaded.');
    } catch {
      setNote('Upload failed — paste a public link instead.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border border-hairline bg-paper p-4">
      <Field label="Evidence" hint="PDF, image or a public link · stored publicly — anyone with the link can open them">
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="flex cursor-pointer items-center justify-center gap-2 border border-ink/25 px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink">
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {uploading ? 'Uploading' : 'Upload file'}
            <input
              type="file"
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              onChange={(e) => upload(e.target.files?.[0])}
            />
          </label>
          <div className="relative flex-1">
            <Link2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              className={`${fieldClass} pl-9`}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://…"
            />
          </div>
        </div>
      </Field>
      {value && (
        <p className="mt-3 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-emerald-700">
          <Check size={12} /> Attached
          <a href={value} target="_blank" rel="noreferrer" className="ml-1 underline decoration-hairline">
            open
          </a>
        </p>
      )}
      {note && <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">{note}</p>}
    </div>
  );
}