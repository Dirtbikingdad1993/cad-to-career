import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useWorkspace } from './WorkspaceProvider';
import ProfileForms from './ProfileForms';

export default function ProfileGate({ children }) {
  const { isAuthenticated, isLoadingAuth, authChecked } = useAuth();
  const { student, loading, error, refresh } = useWorkspace();
  const location = useLocation();
  if (isLoadingAuth || !authChecked || (isAuthenticated && loading)) {
    return <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8" role="status">Opening your private workspace…</div>;
  }
  if (!isAuthenticated) return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <p className="mono-label">Free learner account</p>
      <h1 className="mt-4 font-heading text-3xl">Sign in to save and restore your CAD progress.</h1>
      <p className="mt-4 text-sm text-muted-foreground">Lessons remain free to read without signing in. A verified account is required to save project evidence and completion claims.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} className="bg-ink px-5 py-3 font-mono text-xs text-paper">Sign in</Link>
        <Link to={`/register?returnTo=${encodeURIComponent(location.pathname)}`} className="border border-ink px-5 py-3 font-mono text-xs">Create free account</Link>
      </div>
    </div>
  );
  if (error) return <div className="mx-auto max-w-3xl px-5 py-20" role="alert">
    <p className="text-destructive">{error}</p>
    <button className="mt-4 border border-ink px-4 py-2" onClick={refresh}>Retry loading progress</button>
  </div>;
  if (!student) return <ProfileForms />;
  return children;
}
