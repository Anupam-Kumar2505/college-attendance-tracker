import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { timetableApi } from '../../api/timetableApi.js';
import { leaveApi } from '../../api/leaveApi.js';
import TimetableCard from '../../components/timetable/TimetableCard.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import Alert from '../../components/common/Alert.jsx';
import { Calendar, FilePlus, FileText, CheckCircle2, ArrowRight, UserCheck } from 'lucide-react';
import { formatClassSection } from '../../utils/formatters.js';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [lectures, setLectures] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [timetableRes, leaveRes] = await Promise.all([
          timetableApi.getStudentTimetable(),
          leaveApi.getMyLeaveApplications()
        ]);

        if (timetableRes.success) {
          setLectures(timetableRes.data || []);
        }
        if (leaveRes.success) {
          setApplications(leaveRes.data || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const lecturesCoveredByLeave = lectures.filter((l) => l.hasLeave).length;

  if (loading) {
    return <LoadingSpinner text="Loading student dashboard..." />;
  }

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Student Attendance Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
              Hello, {user?.name}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {formatClassSection(user?.year, user?.branch, user?.classNumber, user?.batch)} • Roll: {user?.rollNo || 'N/A'} • SAP: {user?.sapId || 'N/A'}
            </p>
          </div>

          <div>
            <Link
              to="/student/apply"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold shadow-lg shadow-brand-500/25 transition-all"
            >
              <FilePlus className="w-4 h-4" />
              <span>Apply for Leave</span>
            </Link>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {error && <Alert type="error" message={error} />}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Lectures</span>
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-3">{lectures.length}</p>
          <p className="text-xs text-slate-500 mt-1">Weekly curriculum sessions</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">My Leave Applications</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-purple-300 mt-3">{applications.length}</p>
          <p className="text-xs text-slate-500 mt-1">Submitted exemption requests</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Exempted Sessions</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-300 mt-3">{lecturesCoveredByLeave}</p>
          <p className="text-xs text-slate-500 mt-1">Lectures covered by your date range</p>
        </div>
      </div>

      {/* Timetable Snippet */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100">My Weekly Timetable</h2>
            <p className="text-xs text-slate-400">Check lecture schedule and active leave coverage</p>
          </div>
          <Link
            to="/student/timetable"
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
          >
            <span>View All Sessions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lectures.slice(0, 4).map((lecture) => (
            <TimetableCard key={lecture._id} lecture={lecture} role="STUDENT" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
