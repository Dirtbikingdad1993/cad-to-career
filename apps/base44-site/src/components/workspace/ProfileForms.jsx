import { useState } from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { useWorkspace } from './WorkspaceProvider';
import { useAuth } from '@/lib/AuthContext';
import Field, { fieldClass } from '@/components/ui/Field';

export default function ProfileForms() {
  const { createProfile, resumeProfile } = useWorkspace();
  const { user } = useAuth();
  const [mode, setMode] = useState('create');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    goal: 'job', device: 'phone', code: '',
  });
  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));
  const submit = async e => {
    e.preventDefault(); setBusy(true); setError('');
    try {
      if (mode === 'create') await createProfile({ full_name: form.full_name, goal: form.goal, device: form.device });
      else await resumeProfile(form.code);
    } catch(err) { setError(err.message || 'Could not open your workspace.'); }
    finally { setBusy(false); }
  };
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-2 lg:px-8 lg:py-20">
      <div>
        <p className="mono-label">Your private learner account</p>
        <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Your projects, saved under your sign-in.</h1>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          Signed in as <strong className="text-ink">{user?.email || 'a verified learner'}</strong>.
          Your project reviews, lesson claims and portfolio now follow your account when you change phones or computers.
          No lesson, project, or skill is automatically marked confirmed.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          If you used this site before accounts were introduced, you can migrate a resume-code workspace only when
          its original email matches your signed-in email. For profiles without an email, contact the course owner.
        </p>
        <p className="mt-4 text-xs text-muted-foreground">Submitted evidence links may be public. Do not upload private documents.</p>
      </div>
      <div className="border border-hairline bg-card p-6 sm:p-8">
        <div className="flex border border-hairline">
          {[['create','Create account workspace'],['resume','Migrate old code']].map(([id,label])=>(
            <button key={id} type="button" onClick={()=>{setMode(id);setError('')}} className={`flex-1 px-3 py-3 font-mono text-[9px] uppercase tracking-[0.12em] ${mode===id?'bg-ink text-paper':'bg-card text-muted-foreground'}`}>{label}</button>
          ))}
        </div>
        <form onSubmit={submit} className="mt-6 space-y-5">
          {mode === 'create' ? (<>
            <Field label="Display name"><input className={fieldClass} required minLength={2} maxLength={60} value={form.full_name} onChange={set('full_name')} placeholder="Your name" /></Field>
            <Field label="Goal"><select className={fieldClass} value={form.goal} onChange={set('goal')}>
              <option value="job">Drafting or CAD career</option><option value="trade">Trade and workshop skills</option><option value="product">Product design</option><option value="curious">Learning CAD</option>
            </select></Field>
            <Field label="Starting device"><select className={fieldClass} value={form.device} onChange={set('device')}>
              <option value="phone">Android / other phone</option><option value="tablet">Tablet</option><option value="shared">Shared computer</option><option value="desktop">Desktop or laptop</option>
            </select></Field>
          </>) : (<Field label="Previous resume code" hint="Only usable with the original matching email">
            <input className={fieldClass} required autoComplete="off" maxLength={20} value={form.code} onChange={set('code')} placeholder="Old 10-character code" />
          </Field>)}
          {error && <p role="alert" className="flex gap-2 border border-destructive/30 p-3 text-xs text-destructive"><AlertCircle size={14}/>{error}</p>}
          <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 bg-ink px-5 py-3.5 font-mono text-[10px] uppercase tracking-widest text-paper disabled:opacity-50">
            {busy?'Saving…':mode==='create'?'Start my workspace':'Verify and migrate'} <ArrowRight size={14}/>
          </button>
        </form>
      </div>
    </div>
  );
}
