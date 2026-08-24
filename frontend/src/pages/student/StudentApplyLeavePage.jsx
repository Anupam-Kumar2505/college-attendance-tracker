import React from 'react';
import LeaveApplicationForm from '../../components/leave/LeaveApplicationForm.jsx';
import { FilePlus, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const StudentApplyLeavePage = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <FilePlus className="w-6 h-6 text-brand-400" />
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Apply for Attendance Exemption
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Submit your leave dates and mandatory official proof PDF
        </p>
      </div>

      {/* Notice Banner */}
      <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-xs text-slate-300 space-y-1">
        <p className="font-semibold text-brand-300 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4" />
          Automatic Date-Range Coverage:
        </p>
        <p className="leading-relaxed text-slate-400">
          When you submit a leave range (e.g. 19 Aug to 24 Aug), your leave automatically applies to every scheduled lecture within those dates. Scanned official proof (medical certificate, event authorization, etc.) in PDF format is strictly mandatory.
        </p>
      </div>

      {/* Form Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
        <LeaveApplicationForm />
      </div>
    </div>
  );
};

export default StudentApplyLeavePage;
