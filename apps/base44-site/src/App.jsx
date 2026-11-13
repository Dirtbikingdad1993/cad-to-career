import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import SiteLayout from './components/site/SiteLayout';
import WorkspaceProvider from './components/workspace/WorkspaceProvider';
import Home from './pages/Home';
import Roadmap from './pages/Roadmap';
import Lessons from './pages/Lessons';
import LessonDetail from './pages/LessonDetail';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Tools from './pages/Tools';
import PhoneToDesktop from './pages/PhoneToDesktop';
import Downloads from './pages/Downloads';
import Workspace from './pages/Workspace';
import Skills from './pages/Skills';
import Portfolio from './pages/Portfolio';
import Certificate from './pages/Certificate';
import Owner from './pages/Owner';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Mfa from './pages/Mfa';
import GeometryLab from './pages/GeometryLab';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <WorkspaceProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/mfa" element={<Mfa />} />
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/lessons/:slug" element={<LessonDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/lab" element={<GeometryLab />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/phone-to-desktop" element={<PhoneToDesktop />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/certificate" element={<Certificate />} />
          <Route path="/owner" element={<Owner />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </WorkspaceProvider>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App