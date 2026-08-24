import React from 'react';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';
import { leaveApi } from '../../api/leaveApi.js';
import { Download, ExternalLink, FileText, AlertCircle } from 'lucide-react';
import { formatDisplayDate } from '../../utils/dateUtils.js';

export const LeaveProofModal = ({ isOpen, onClose, application }) => {
  if (!application) return null;

  const pdfUrl = leaveApi.getProofPdfUrl(application._id || application.id);
  const downloadUrl = leaveApi.getProofPdfUrl(application._id || application.id, true);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Attendance Exemption Proof Document"
      subtitle={`${application.reason || 'Leave Application'} (${formatDisplayDate(application.startDate)} - ${formatDisplayDate(application.endDate)})`}
      maxWidth="max-w-4xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-slate-400 truncate max-w-xs sm:max-w-md">
            File: <span className="text-slate-200 font-medium">{application.proofFileName || 'Proof Document.pdf'}</span>
          </div>
          <div className="flex items-center gap-2">
            <a href={downloadUrl} download className="no-underline">
              <Button variant="secondary" size="sm" icon={Download}>
                Download PDF
              </Button>
            </a>
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="no-underline">
              <Button variant="primary" size="sm" icon={ExternalLink}>
                Open Fullscreen
              </Button>
            </a>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Leave Summary Card */}
        <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
          <div>
            <span className="text-slate-500 font-semibold block uppercase text-[10px]">Category:</span>
            <span className="font-bold text-brand-300">{application.reason}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block uppercase text-[10px]">Date Range:</span>
            <span className="font-medium text-slate-200">
              {formatDisplayDate(application.startDate)} → {formatDisplayDate(application.endDate)}
            </span>
          </div>
        </div>

        {/* Embedded PDF Viewer */}
        <div className="w-full h-[55vh] min-h-[350px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 relative">
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=0`}
            title="Proof PDF Viewer"
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </Modal>
  );
};

export default LeaveProofModal;
