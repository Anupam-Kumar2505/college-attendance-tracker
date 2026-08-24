import React, { useState, useEffect } from 'react';
import { timetableApi } from '../../api/timetableApi.js';
import TimetableGrid from '../../components/timetable/TimetableGrid.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import Alert from '../../components/common/Alert.jsx';
import { CalendarDays, CheckCircle2, ShieldCheck } from 'lucide-react';

export const StudentTimetablePage = () => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        const res = await timetableApi.getStudentTimetable();
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

  if (loading) {
    return <LoadingSpinner text="Loading your class timetable..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Class Timetable
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Weekly schedule for BE COMPS C1 with automated leave status indicators
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Leave: Applied</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 border border-slate-700">
            <span>Leave: Not Applied</span>
          </div>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}

      <TimetableGrid lectures={lectures} role="STUDENT" />
    </div>
  );
};

export default StudentTimetablePage;
