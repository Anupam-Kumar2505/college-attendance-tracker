import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { leaveApi } from '../../api/leaveApi.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import Alert from '../../components/common/Alert.jsx';
import Button from '../../components/common/Button.jsx';
import LeaveProofModal from '../../components/leave/LeaveProofModal.jsx';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  BookOpen,
  FileText,
  Eye,
  Download,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Hash,
  GraduationCap
} from 'lucide-react';
import { formatDisplayDate } from '../../utils/dateUtils.js';
import { formatClassSection } from '../../utils/formatters.js';

export const TeacherLectureDetailPage = () => {
  const { lectureId } = useParams();
  const navigate = useNavigate();

  const [lectureData, setLectureData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProofApplication, setSelectedProofApplication] = useState(null);

  useEffect(() => {
    const fetchLectureDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await leaveApi.getLectureLeaveApplications(lectureId);
        if (res.success) {
          setLectureData(res.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load lecture leave records');
      } finally {
        setLoading(false);
      }
    };

    fetchLectureDetails();
  }, [lectureId]);

  if (loading) {
    return <LoadingSpinner text="Loading lecture attendance and leave records..." />;
  }

  if (error || !lectureData) {
    return (
      <div className="space-y-4">
        <Link to="/teacher/timetable" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Timetable</span>
        </Link>
        <Alert type="error" message={error || 'Lecture details could not be retrieved'} />
      </div>
    );
  }

  const { lecture, applications } = lectureData;

  return (
    <div className="space-y-6">
      {/* Top Back Navigation */}
      <div>
        <Link
          to="/teacher/timetable"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Weekly Timetable</span>
        </Link>
      </div>

      {/* Lecture Info Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                {lecture.subjectCode}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                {lecture.day}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {lecture.subject}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                applications.length > 0
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{applications.length} Students on Leave</span>
            </span>
          </div>
        </div>

        {/* Detailed Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 font-semibold uppercase text-[10px] block">Date</span>
            <div className="flex items-center gap-1.5 mt-1 font-bold text-slate-200">
              <Calendar className="w-3.5 h-3.5 text-brand-400" />
              <span>{formatDisplayDate(lecture.date)}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 font-semibold uppercase text-[10px] block">Time Slot</span>
            <div className="flex items-center gap-1.5 mt-1 font-bold text-slate-200">
              <Clock className="w-3.5 h-3.5 text-brand-400" />
              <span>{lecture.startTime} - {lecture.endTime}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 font-semibold uppercase text-[10px] block">Location</span>
            <div className="flex items-center gap-1.5 mt-1 font-bold text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-brand-400" />
              <span>{lecture.room}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 font-semibold uppercase text-[10px] block">Class Section</span>
            <div className="flex items-center gap-1.5 mt-1 font-bold text-slate-200">
              <Users className="w-3.5 h-3.5 text-brand-400" />
              <span>{formatClassSection(lecture.year, lecture.branch, lecture.classNumber, lecture.batch)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Applicable Leave Applications Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              Applicable Leave Applications ({applications.length})
            </h2>
            <p className="text-xs text-slate-400">
              Students covering lecture on <span className="text-slate-200 font-semibold">{formatDisplayDate(lecture.date)}</span>
            </p>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="glass-panel p-10 rounded-2xl text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <h4 className="text-base font-bold text-slate-200">No Leaves on This Date</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              All students in {formatClassSection(lecture.year, lecture.branch, lecture.classNumber, lecture.batch)} are expected in class without submitted leave proofs.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block glass-panel rounded-2xl overflow-hidden border border-slate-800">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900/90 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-4 text-center">Roll No</th>
                    <th className="px-5 py-4">Student Name</th>
                    <th className="px-5 py-4">Branch / Class / Batch</th>
                    <th className="px-5 py-4">Leave Date</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4 text-right">Proof & Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {applications.map((app) => {
                    const student = app.studentId || {};
                    return (
                      <tr key={app._id} className="hover:bg-slate-800/30 transition-colors">
                        {/* 1. Dedicated Roll No Column */}
                        <td className="px-4 py-4 text-center whitespace-nowrap">
                          <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl bg-brand-500/15 border border-brand-500/30 text-sm font-black text-white">
                            {student.rollNo || '—'}
                          </span>
                        </td>

                        {/* 2. Student Name Column (No Email) */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div>
                            <p className="font-bold text-slate-100">{student.name}</p>
                            {student.sapId && (
                              <span className="text-[11px] text-slate-400 font-mono">
                                SAP ID: {student.sapId}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 3. Branch, Class & Batch */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-200">
                              <GraduationCap className="w-3.5 h-3.5 text-brand-400" />
                              <span>
                                {student.year || lecture.year} {student.branch || lecture.branch} C{student.classNumber || lecture.classNumber}
                              </span>
                            </div>
                            <div>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/10 text-brand-300 border border-brand-500/20">
                                Batch {student.batch || lecture.batch || 'All'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 4. Leave Date */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
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

                        {/* 5. Category (No details) */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-brand-500/15 text-brand-300 border border-brand-500/30">
                            {app.reason}
                          </span>
                        </td>

                        {/* 6. Merged Proof & Action */}
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <div className="flex flex-col items-end gap-1.5">
                            <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 max-w-[190px]">
                              <FileText className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                              <span className="truncate text-[11px] font-medium">{app.proofFileName}</span>
                            </div>

                            <Button
                              variant="primary"
                              size="sm"
                              icon={Eye}
                              onClick={() => setSelectedProofApplication(app)}
                              className="w-full max-w-[190px]"
                            >
                              View Proof PDF
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {applications.map((app) => {
                const student = app.studentId || {};
                return (
                  <div key={app._id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-300 font-black text-sm flex flex-col items-center justify-center border border-brand-500/30">
                          <span className="text-[8px] uppercase">ROLL</span>
                          <span>{student.rollNo || '—'}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-100">{student.name}</h4>
                          {student.sapId && (
                            <p className="text-[11px] text-slate-400 font-mono">SAP: {student.sapId}</p>
                          )}
                        </div>
                      </div>

                      <div className="text-right text-xs">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-[11px]">
                          {student.year || lecture.year} {student.branch || lecture.branch} C{student.classNumber || lecture.classNumber} (B{student.batch || 'All'})
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-semibold">Date Range:</span>
                        <span className="text-slate-200 font-bold">
                          {formatDisplayDate(app.startDate)} - {formatDisplayDate(app.endDate)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-semibold">Category:</span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/15 text-brand-300 border border-brand-500/30">
                          {app.reason}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 truncate">
                        <FileText className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                        <span className="truncate">{app.proofFileName}</span>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        icon={Eye}
                        onClick={() => setSelectedProofApplication(app)}
                      >
                        View Proof PDF
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Proof PDF Viewer Modal */}
      <LeaveProofModal
        isOpen={Boolean(selectedProofApplication)}
        onClose={() => setSelectedProofApplication(null)}
        application={selectedProofApplication}
      />
    </div>
  );
};

export default TeacherLectureDetailPage;
