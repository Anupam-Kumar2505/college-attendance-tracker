import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { LogOut, GraduationCap, Menu, User, ShieldCheck } from 'lucide-react';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to={user?.role === 'TEACHER' ? '/teacher' : '/student'} className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-md shadow-brand-500/20">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-base tracking-tight text-white hidden sm:inline-block">
            EduAttend <span className="text-brand-400 font-normal text-xs px-2 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/20">Portal</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {user && (
          <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-slate-100 leading-tight">{user.name}</p>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                    user.role === 'TEACHER'
                      ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                      : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {user.role}
                </span>
                {user.rollNo && (
                  <span className="text-[10px] text-slate-400">Roll: {user.rollNo}</span>
                )}
                {user.employeeId && (
                  <span className="text-[10px] text-slate-400">ID: {user.employeeId}</span>
                )}
              </div>
            </div>

            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-400">
              <User className="w-4 h-4" />
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-1"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
