import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import Alert from '../components/common/Alert.jsx';
import { Mail, Lock, LogIn, UserCheck, ShieldCheck, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      if (user.role === 'TEACHER') {
        navigate('/teacher', { replace: true });
      } else if (user.role === 'STUDENT') {
        navigate('/student', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }

    try {
      setLoading(true);
      const loggedInUser = await login(email, password);
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (loggedInUser.role === 'TEACHER') {
        navigate('/teacher', { replace: true });
      } else {
        navigate('/student', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPassword = 'password123') => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-100">Sign in to your account</h3>
        <p className="text-xs text-slate-400 mt-1">
          Enter your institutional email credentials below
        </p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Institutional Email"
          name="email"
          type="email"
          placeholder="e.g. teacher1@example.com / student1@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          icon={Mail}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          icon={Lock}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          icon={LogIn}
          className="w-full mt-2"
        >
          Sign In
        </Button>
      </form>

      {/* Quick Fill Development Accounts */}
      <div className="pt-4 border-t border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-400 mb-2.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Demo Credentials (1-Click Fill)</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-200">Teacher 1 (Prof. Rajesh Verma)</p>
              <p className="text-[11px] text-slate-400">Software Eng, Distributed Systems</p>
            </div>
            <button
              type="button"
              onClick={() => handleQuickFill('teacher1@example.com')}
              className="px-2.5 py-1 rounded-lg bg-brand-500/15 hover:bg-brand-500/25 text-brand-300 font-semibold transition-colors text-[11px]"
            >
              Fill Teacher
            </button>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-200">Student 1 (Rahul Sharma)</p>
              <p className="text-[11px] text-emerald-400">Has Multi-day leave (19-24 Aug)</p>
            </div>
            <button
              type="button"
              onClick={() => handleQuickFill('student1@example.com')}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-semibold transition-colors text-[11px]"
            >
              Fill Student 1
            </button>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-200">Student 2 (Priya Patel)</p>
              <p className="text-[11px] text-amber-400">Has Single-day leave (18 Aug)</p>
            </div>
            <button
              type="button"
              onClick={() => handleQuickFill('student2@example.com')}
              className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-semibold transition-colors text-[11px]"
            >
              Fill Student 2
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
