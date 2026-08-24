import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Button from '../components/common/Button.jsx';
import { Home, AlertTriangle } from 'lucide-react';

export const NotFoundPage = () => {
  const { user } = useAuth();
  const homePath = user?.role === 'TEACHER' ? '/teacher' : user?.role === 'STUDENT' ? '/student' : '/login';

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 max-w-md w-full space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">404</h1>
        <h2 className="text-lg font-bold text-slate-200">Page Not Found</h2>
        <p className="text-xs text-slate-400">
          The requested route does not exist or you do not have permission to view it.
        </p>
        <div className="pt-2">
          <Link to={homePath} className="no-underline">
            <Button variant="primary" icon={Home} className="w-full">
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
