import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  FilePlus,
  LogOut,
  X,
  BookOpen,
  UserCheck
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const teacherNavLinks = [
    { to: '/teacher', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/teacher/timetable', label: 'My Timetable', icon: CalendarDays }
  ];

  const studentNavLinks = [
    { to: '/student', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/student/timetable', label: 'Class Timetable', icon: CalendarDays },
    { to: '/student/apply', label: 'Apply for Leave', icon: FilePlus },
    { to: '/student/applications', label: 'My Leave History', icon: FileText }
  ];

  const navLinks = user?.role === 'TEACHER' ? teacherNavLinks : studentNavLinks;

  const baseNavLinkClasses =
    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150';
  const activeNavLinkClasses =
    'bg-brand-600 text-white font-semibold shadow-md shadow-brand-600/20';
  const inactiveNavLinkClasses =
    'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header / Close Button */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 lg:hidden">
          <span className="font-bold text-base text-white">Menu</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card info inside sidebar */}
        <div className="p-4 border-b border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs">
                {user?.role === 'TEACHER' ? <BookOpen className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate">{user?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            {user?.role === 'STUDENT' && (
              <div className="mt-2 pt-2 border-t border-slate-700/40 grid grid-cols-2 gap-1 text-[10px] text-slate-400">
                <div>Class: <span className="text-slate-200 font-semibold">{user.year} {user.branch} C{user.classNumber}</span></div>
                <div>Batch: <span className="text-slate-200 font-semibold">{user.batch || 'All'}</span></div>
                {user.rollNo && <div>Roll: <span className="text-slate-200 font-semibold">{user.rollNo}</span></div>}
                {user.sapId && <div>SAP: <span className="text-slate-200 font-semibold">{user.sapId}</span></div>}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Navigation
          </p>
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `${baseNavLinkClasses} ${
                    isActive ? activeNavLinkClasses : inactiveNavLinkClasses
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
