import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Printer, AlertCircle, Check, ArrowRight } from 'lucide-react';
import PageHeader from '@/components/site/PageHeader';
import ProfileGate from '@/components/workspace/ProfileGate';
import { useWorkspace } from '@/components/workspace/WorkspaceProvider';
import { certificateRequirements, summarize } from '@/lib/progress';
import CertificateSheet from '@/components/certificate/CertificateSheet';

function CertificateBody() {
  const { student, records, requestCertificate } = useWorkspace();
  const reqs = certificateRequirements(records, student);
  const s = summarize(records);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const issued = student.certificate_status === 'issued';
  const requested = student.certificate_status === 'requested';
  const eligible = s.confirmedProjects === s.totalProjects && s.confirmedCore === s.totalCore;

  const request = async () => {
    setBusy(true);
    setError('');
    try {
      await requestCertificate();
    } catch (err) {
      setError(err.message || 'Could not request the certificate.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="no-print">
        <PageHeader
          kicker="Free certificate"
          title={issued ? 'Your certificate is issued' : 'A certificate that only lists confirmed work'}
          intro={
            issued
              ? 'The certificate below names the projects and core skills a reviewer confirmed. Its code identifies this exact record.'
              : 'The certificate is free, but it is not automatic. It is issued by the reviewer once all five projects and twelve core skills are confirmed.'
          }
        />
      </div>

      <div className="mx-auto max-w-4xl px-5 py-12 lg:px-8 lg:py-16">
        {issued ? (
          <>
            <div className="no-print mb-6 flex justify-end">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 border border-ink px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] hover:bg-ink hover:text-paper"
              >
                <Printer size={13} /> Print / save as PDF
              </button>
            </div>
            <CertificateSheet student={student} records={records} />
          </>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div className="border border-hairline bg-card p-6">
              <p className="mono-label">Requirements</p>
              <ul className="mt-4 space-y-3">
                {reqs.map((r) => (
                  <li key={r.label} className="flex items-start gap-3 border-b border-hairline pb-3 last:border-0">
                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border ${r.met ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-hairline'}`}>
                      {r.met && <Check size={12} />}
                    </span>
                    <span>
                      <span className="block text-[13px] leading-snug">{r.label}</span>
                      <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">{r.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>

              {error && (
                <p className="mt-4 flex items-start gap-2 border border-destructive/30 bg-destructive/5 px-3 py-2 text-[12px] text-destructive">
                  <AlertCircle size={14} className="mt-0.5 shrink-0" /> {error}
                </p>
              )}

              <button
                type="button"
                disabled={!eligible || busy || requested}
                onClick={request}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 bg-ink px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-paper disabled:opacity-40"
              >
                {requested ? 'Requested — waiting for reviewer' : busy ? 'Requesting…' : 'Request certificate review'}
              </button>
              {!eligible && (
                <p className="mt-3 font-mono text-[9px] leading-relaxed tracking-[0.06em] text-muted-foreground">
                  Finish and confirm the outstanding projects and core skills first. The request is checked on the server, not just in this page.
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="border border-hairline bg-paper p-5">
                <p className="mono-label">What it says</p>
                <p className="mt-3 text-[13px] leading-relaxed text-ink/80">
                  It names you, the five confirmed projects and the twelve confirmed core skills, with a code and a date.
                  It does not claim hours, grades or accreditation.
                </p>
              </div>
              <div className="border border-hairline bg-paper p-5">
                <p className="mono-label">Why it is gated</p>
                <p className="mt-3 text-[13px] leading-relaxed text-ink/80">
                  A certificate that anyone can self-issue is worth nothing to an employer. Here, every line on it was
                  confirmed by a person who looked at the work.
                </p>
              </div>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-signal hover:underline"
              >
                Go to the projects <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Certificate() {
  return (
    <ProfileGate>
      <CertificateBody />
    </ProfileGate>
  );
}