import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { leaveApi } from '../../api/leaveApi.js';
import LeaveApplicationTable from '../../components/leave/LeaveApplicationTable.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import Alert from '../../components/common/Alert.jsx';
import { FileText, FilePlus } from 'lucide-react';

export const StudentLeaveHistoryPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await leaveApi.getMyLeaveApplications();
        if (res.success) {
          setApplications(res.data || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to load leave history');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading your submitted leave records..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              My Leave Applications
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            History of all submitted attendance exemption requests and proof documents
          </p>
        </div>

        <div>
          <Link
            to="/student/apply"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all shadow-md shadow-brand-600/20"
          >
            <FilePlus className="w-4 h-4" />
            <span>New Leave Application</span>
          </Link>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}

      <LeaveApplicationTable applications={applications} />
    </div>
  );
};

export default StudentLeaveHistoryPage;
