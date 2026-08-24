import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Users, BookOpen, ChevronRight, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { formatClassSection, formatFileSize } from '../../utils/formatters.js';

export const TimetableCard = ({ lecture, role, onSelect }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(lecture);
      return;
    }
    if (role === 'TEACHER') {
      navigate(`/teacher/lecture/${lecture._id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`glass-card p-4 sm:p-5 rounded-2xl glass-card-hover cursor-pointer border border-slate-800/80 flex flex-col justify-between gap-3 ${
        role === 'TEACHER' ? 'hover:border-brand-500/40' : ''
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-lg border border-brand-500/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lecture.subjectCode}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{lecture.startTime} - {lecture.endTime}</span>
          </div>
        </div>

        <h4 className="text-base font-bold text-slate-100 line-clamp-1 group-hover:text-brand-300">
          {lecture.subject}
        </h4>

        {lecture.teacherId && typeof lecture.teacherId === 'object' && (
          <p className="text-xs text-slate-400 mt-1">
            Faculty: <span className="text-slate-300 font-medium">{lecture.teacherId.name}</span>
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {lecture.room}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            {formatClassSection(lecture.year, lecture.branch, lecture.classNumber, lecture.batch)}
          </span>
        </div>

        {/* Role-specific status badge */}
        {role === 'TEACHER' ? (
          <div className="flex items-center gap-1.5">
            <span
              className={`px-2 py-0.5 rounded-full font-semibold text-[11px] ${
                lecture.leaveCount > 0
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {lecture.leaveCount > 0 ? `${lecture.leaveCount} Leave Proofs` : '0 Leaves'}
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        ) : (
          <div>
            {lecture.hasLeave ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold text-[11px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <CheckCircle className="w-3 h-3" />
                Leave: Applied
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium text-[11px] bg-slate-800 text-slate-400 border border-slate-700">
                Leave: Not Applied
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimetableCard;
