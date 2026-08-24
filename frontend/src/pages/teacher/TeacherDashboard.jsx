import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { timetableApi } from '../../api/timetableApi.js';
import TimetableCard from '../../components/timetable/TimetableCard.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import Alert from '../../components/common/Alert.jsx';
import { Calendar, Users, FileText, BookOpen, Clock, ArrowRight } from 'lucide-react';

export const TeacherDashboard = () => {
  const { user } = useAuth();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        const res = await timetableApi.getTeacherTimetable();
        if (res.success) {
          setLectures(res.data || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to load timetable');
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  const totalLeaveApplications = lectures.reduce((sum, l) => sum + (l.leaveCount || 0), 0);
  const upcomingLectures = lectures.slice(0, 4);

  if (loading) {
    return <LoadingSpinner text="Loading faculty dashboard..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            Faculty Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            {user?.department || 'Department of Computer Engineering'} • {user?.subjects?.join(', ') || 'Software Engineering'}
          </p>
        </div>

        {/* Ambient glow in corner */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {error && <Alert type="error" message={error} />}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Weekly Sessions</span>
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-3">{lectures.length}</p>
          <p className="text-xs text-slate-500 mt-1">Scheduled for current semester week</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Leave Proofs</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-300 mt-3">{totalLeaveApplications}</p>
          <p className="text-xs text-slate-500 mt-1">Submitted student exemption proofs</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Class</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-purple-300 mt-3">BE COMPS C1</p>
          <p className="text-xs text-slate-500 mt-1">Batches 1, 2, 3</p>
        </div>
      </div>

      {/* Upcoming Lecture Sessions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Weekly Lecture Schedule</h2>
            <p className="text-xs text-slate-400">Click any lecture to inspect student leave proofs</p>
          </div>
          <Link
            to="/teacher/timetable"
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
          >
            <span>View Full Timetable</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingLectures.map((lecture) => (
            <TimetableCard key={lecture._id} lecture={lecture} role="TEACHER" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
