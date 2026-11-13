import { useEffect, useState } from 'react';
import { ShieldCheck, Lock, AlertCircle, RefreshCw } from 'lucide-react';
import PageHeader from '@/components/site/PageHeader';
import { reviewerAction } from '@/lib/workspaceApi';
import { fieldClass } from '@/components/ui/Field';
import { useAuth } from '@/lib/AuthContext';
import ReviewItem from '@/components/owner/ReviewItem';

export default function Owner() {
  const { user, isAuthenticated } = useAuth();
  const [configured, setConfigured] = useState(null);
  const [passcode, setPasscode] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') return;
    reviewerAction('status')
      .then((r) => setConfigured(Boolean(r.configured)))
      .catch(() => setConfigured(false));
  }, [isAuthenticated, user?.role]);

  const load = async (code) => {
    const d = await reviewerAction('queue', { passcode: code });
    setData(d);
    setUnlocked(true);
  };

  const claim = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await reviewerAction('claim', { passcode });
      setConfigured(true);
      await load(passcode);
    } catch (err) {
      setError(err.message || 'Could not save the passcode.');
    } finally {
      setBusy(false);
    }
  };

  const unlock = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await load(passcode);
    } catch (err) {
      setError(err.message || 'Could not unlock.');
    } finally {
      setBusy(false);
    }
  };

  const refresh = async () => {
    setBusy(true);
    try {
      await load(passcode);
    } catch (err) {
      setError(err.message || 'Could not refresh.');
    } finally {
      setBusy(false);
    }
  };

  const issue = async (studentId) => {
    setError('');
    try {
      await reviewerAction('issueCertificate', { passcode, student_id: studentId });
      await load(passcode);
    } catch (err) {
      setError(err.message || 'Could not issue.');
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') return (
    <div className="mx-auto max-w-3xl px-5 py-20" role="alert">
      <h1 className="font-heading text-3xl">Administrator sign-in required</h1>
      <p className="mt-3 text-sm text-muted-foreground">Only authorized course administrators can review, confirm or issue certificates.</p>
    </div>
  );

  return (
    <div>
      <PageHeader
        kicker="Reviewer console"
        title="Only what you confirm counts"
        intro="Learners can claim and attach evidence. Nothing becomes confirmed, scored or certified without a decision made on this page."
      />

      <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8 lg:py-14">
        {error && (
          <p className="mb-6 flex items-start gap-2 border border-destructive/30 bg-destructive/5 px-3 py-2 text-[12px] text-destructive">
            <AlertCircle size={14} className="mt-0.5 shrink-0" /> {error}
          </p>
        )}

        {configured === null && <p className="mono-label">Checking reviewer access…</p>}

        {configured === false && (
          <form onSubmit={claim} className="max-w-md border border-hairline bg-card p-6">
            <p className="mono-label">First-time setup</p>
            <h2 className="mt-2 font-heading text-xl font-medium">Set your reviewer passcode</h2>
            <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
              Do this now, before you share the site: the first passcode claimed here becomes the only one that can
              confirm work. Store it somewhere safe — it is saved hashed and cannot be recovered from this page.
            </p>
            <input
              type="password"
              className={`${fieldClass} mt-4`}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="At least 8 characters"
              minLength={8}
              required
            />
            <button
              type="submit"
              disabled={busy}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-ink px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-paper disabled:opacity-50"
            >
              <ShieldCheck size={14} /> {busy ? 'Saving…' : 'Claim reviewer access'}
            </button>
          </form>
        )}

        {configured === true && !unlocked && (
          <form onSubmit={unlock} className="max-w-md border border-hairline bg-card p-6">
            <p className="mono-label">Locked</p>
            <h2 className="mt-2 font-heading text-xl font-medium">Enter the reviewer passcode</h2>
            <input
              type="password"
              className={`${fieldClass} mt-4`}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Passcode"
              required
            />
            <button
              type="submit"
              disabled={busy}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-ink px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-paper disabled:opacity-50"
            >
              <Lock size={14} /> {busy ? 'Checking…' : 'Unlock console'}
            </button>
          </form>
        )}

        {unlocked && data && (
          <div className="space-y-10">
            <div className="grid grid-cols-2 gap-px bg-hairline sm:grid-cols-4">
              {[
                [data.stats.pending, 'waiting for you'],
                [data.stats.confirmedLessons, 'lessons confirmed'],
                [data.stats.confirmedProjects, 'projects confirmed'],
                [data.stats.confirmedSkills, 'skills confirmed'],
              ].map(([value, label]) => (
                <div key={label} className="bg-card px-4 py-4">
                  <p className="font-heading text-2xl">{value}</p>
                  <p className="mono-label mt-1">{label}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <p className="mono-label">Certificate requests</p>
              <button
                type="button"
                onClick={refresh}
                className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground hover:text-ink"
              >
                <RefreshCw size={12} /> Refresh queue
              </button>
            </div>

            {data.certificateRequests.length === 0 ? (
              <p className="text-[12.5px] text-muted-foreground">No certificate requests.</p>
            ) : (
              <div className="divide-y divide-hairline border border-hairline bg-card">
                {data.certificateRequests.map((s) => (
                  <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                    <div>
                      <p className="font-heading text-[14px] font-medium">{s.full_name}</p>
                      <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                        Requested {s.requested_date ? new Date(s.requested_date).toLocaleDateString() : ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => issue(s.id)}
                      className="inline-flex items-center gap-2 bg-emerald-700 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-white"
                    >
                      Issue certificate
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <p className="mono-label border-b border-hairline pb-3">Waiting for review ({data.queue.length})</p>
              {data.queue.length === 0 ? (
                <p className="mt-4 text-[12.5px] text-muted-foreground">
                  Nothing waiting. When a learner sends a lesson, skill or project for confirmation it appears here.
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  {data.queue.map((entry) => (
                    <ReviewItem key={entry.record.id} entry={entry} passcode={passcode} onDone={refresh} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}