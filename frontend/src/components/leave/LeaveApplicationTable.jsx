import React, { useState } from 'react';
import { FileText, Eye, Calendar } from 'lucide-react';
import Button from '../common/Button.jsx';
import LeaveProofModal from './LeaveProofModal.jsx';
import { formatDisplayDate } from '../../utils/dateUtils.js';

export const LeaveApplicationTable = ({ applications = [] }) => {
  const [selectedApplication, setSelectedApplication] = useState(null);

  if (applications.length === 0) {
    return (
      <div className="glass-panel p-12 rounded-2xl text-center">
        <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h4 className="text-base font-bold text-slate-300">No Leave Applications Found</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          You haven't submitted any leave applications yet.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/90 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Leave Date</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Proof & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-brand-400 flex-shrink-0" />
                      <div className="text-xs">
                        <p className="font-bold text-slate-100">
                          {formatDisplayDate(app.startDate)}
                        </p>
                        <p className="text-slate-400">
                          to {formatDisplayDate(app.endDate)}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-500/15 text-brand-300 border border-brand-500/30">
                      {app.reason}
                    </span>
                  </td>

                  {/* Merged Proof & Action */}
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 max-w-[200px]">
                        <FileText className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                        <span className="truncate text-[11px] font-medium">{app.proofFileName}</span>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Eye}
                        onClick={() => setSelectedApplication(app)}
                      >
                        View Proof PDF
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {applications.map((app) => (
          <div key={app._id} className="glass-card p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-400" />
                <span className="text-sm font-bold text-slate-100">
                  {formatDisplayDate(app.startDate)} - {formatDisplayDate(app.endDate)}
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-500/15 text-brand-300 border border-brand-500/30">
                {app.reason}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <div className="text-xs text-slate-400 truncate flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                <span className="truncate">{app.proofFileName}</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                icon={Eye}
                onClick={() => setSelectedApplication(app)}
              >
                View Proof
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Proof PDF Viewer Modal */}
      <LeaveProofModal
        isOpen={Boolean(selectedApplication)}
        onClose={() => setSelectedApplication(null)}
        application={selectedApplication}
      />
    </>
  );
};

export default LeaveApplicationTable;
