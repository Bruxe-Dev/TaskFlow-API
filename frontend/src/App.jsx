import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { ThemeProvider } from '@/context/ThemeContext';
import { AppProvider } from '@/context/AppContext';

// Page imports
import Landing from '@/pages/Landing';
import Register from '@/pages/Register';
import VerifyEmail from '@/pages/VerifyEmail';
import Dashboard from '@/pages/Dashboard';
import Tasks from '@/pages/Tasks';
import Projects from '@/pages/Projects';
import Teams from '@/pages/Teams';
import Notifications from '@/pages/Notifications';
import Reports from '@/pages/Reports';
import AccessRequests from '@/pages/AccessRequests';
import Workspace from '@/pages/Workspace';
import Analytics from '@/pages/Analytics';
import Submissions from '@/pages/Submissions';
import Organizations from '@/pages/Organizations';
import AIFlow from '@/pages/AIFlow';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Show public routes without auth, redirect protected routes to login
      const publicPaths = ['/', '/register', '/verify-email'];
      const pathname = window.location.pathname;
      const isPublic = publicPaths.some(p => pathname === p);
      if (!isPublic) {
        navigateToLogin();
        return null;
      }
      // Fall through and render public pages
    }
  }

  // If auth required but on public page, still render routes

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* App */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:id" element={<Projects />} />
      <Route path="/teams" element={<Teams />} />
      <Route path="/workspace" element={<Workspace />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/access-requests" element={<AccessRequests />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/submissions" element={<Submissions />} />
      <Route path="/organizations" element={<Organizations />} />
      <Route path="/ai" element={<AIFlow />} />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <ThemeProvider>
          <AppProvider>
            <Router>
              <AuthenticatedApp />
            </Router>
            <Toaster />
          </AppProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App