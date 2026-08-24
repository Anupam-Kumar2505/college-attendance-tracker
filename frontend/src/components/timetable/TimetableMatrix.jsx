import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  MapPin,
  Users,
  BookOpen,
  ChevronRight,
  CheckCircle,
  FileText,
  Calendar,
  Grid,
  List,
  Sparkles,
  Info
} from 'lucide-react';
import { formatDisplayDate, formatShortDate } from '../../utils/dateUtils.js';
import { formatClassSection } from '../../utils/formatters.js';

// Color theme mapper for different subjects in Teams style
const getSubjectTheme = (subjectCode = '') => {
  const code = subjectCode.toUpperCase();
  if (code.includes('801')) {
    // Software Engineering - Blue
    return {
      bg: 'bg-sky-950/80 hover:bg-sky-900/90 border-sky-500/40 text-sky-100',
      borderLeft: 'border-l-sky-400',
      badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      accent: 'text-sky-400'
    };
  }
  if (code.includes('802')) {
    // Distributed Systems - Purple / Indigo
    return {
      bg: 'bg-indigo-950/80 hover:bg-indigo-900/90 border-indigo-500/40 text-indigo-100',
      borderLeft: 'border-l-indigo-400',
      badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      accent: 'text-indigo-400'
    };
  }
  if (code.includes('803')) {
    // Cloud Computing - Cyan / Teal
    return {
      bg: 'bg-cyan-950/80 hover:bg-cyan-900/90 border-cyan-500/40 text-cyan-100',
      borderLeft: 'border-l-cyan-400',
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      accent: 'text-cyan-400'
    };
  }
  if (code.includes('804')) {
    // Artificial Intelligence - Violet / Magenta
    return {
      bg: 'bg-purple-950/80 hover:bg-purple-900/90 border-purple-500/40 text-purple-100',
      borderLeft: 'border-l-purple-400',
      badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      accent: 'text-purple-400'
    };
  }
  return {
    bg: 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-100',
    borderLeft: 'border-l-brand-400',
    badge: 'bg-brand-500/20 text-brand-300 border-brand-500/30',
    accent: 'text-brand-400'
  };
};

export const TimetableMatrix = ({ lectures = [], role, onSelectLecture }) => {
  const navigate = useNavigate();

  // Define standard Matrix time slots along the Y-Axis
  const timeSlots = [
    { label: '09:00 AM', start: '09:00', end: '10:00' },
    { label: '10:15 AM', start: '10:15', end: '11:15' },
    { label: '11:30 AM', start: '11:30', end: '12:30' },
    { label: '12:30 PM', start: '12:30', end: '14:00', isBreak: true, labelTitle: 'Lunch & Recess' },
    { label: '02:00 PM', start: '14:00', end: '16:00' }
  ];

  // Extract unique sorted days/dates along the X-Axis
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Map lectures to day + date
  const dayDateMap = {};
  lectures.forEach((l) => {
    if (!dayDateMap[l.day]) {
      dayDateMap[l.day] = l.date;
    }
  });

  const handleCardClick = (lecture) => {
    if (onSelectLecture) {
      onSelectLecture(lecture);
      return;
    }
    if (role === 'TEACHER') {
      navigate(`/teacher/lecture/${lecture._id}`);
    }
  };

  // Helper to find lectures matching day and time interval
  const getLecturesForCell = (day, slot) => {
    return lectures.filter((l) => {
      if (l.day !== day) return false;
      // Match start time or overlapping time interval
      if (slot.start === '14:00') {
        return l.startTime >= '14:00' && l.startTime < '16:00';
      }
      return l.startTime === slot.start;
    });
  };

  return (
    <div className="space-y-4">
      {/* Teams Matrix Frame */}
      <div className="glass-panel rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* Teams Calendar Top Bar */}
        <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600/20 text-brand-400 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>Microsoft Teams Schedule Matrix</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/30">
                  X: Date • Y: Time
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                BE COMPS C1 • Weekly Lecture & Practical Allocation
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Attendance Sync</span>
          </div>
        </div>

        {/* Scrollable Matrix Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Header Row: Dates on X-Axis */}
            <div className="grid grid-cols-[110px_repeat(6,1fr)] bg-slate-900 border-b border-slate-800 sticky top-0 z-20">
              {/* Top-Left Corner Cell (Time / Date axis indicator) */}
              <div className="p-3.5 border-r border-slate-800 flex flex-col justify-center items-center text-center bg-slate-950/40">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  TIME \ DATE
                </span>
                <Clock className="w-3.5 h-3.5 text-slate-500 mt-0.5" />
              </div>

              {/* Day / Date Columns (X-Axis) */}
              {daysOfWeek.map((day) => {
                const dateStr = dayDateMap[day];
                const dayLectures = lectures.filter((l) => l.day === day);
                const isToday = false; // can be checked against current date

                return (
                  <div
                    key={day}
                    className={`p-3.5 border-r border-slate-800/80 text-center last:border-r-0 transition-colors ${
                      isToday ? 'bg-brand-950/40' : 'bg-slate-900/60'
                    }`}
                  >
                    <p className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
                      {day.slice(0, 3)}
                    </p>
                    <p className="text-sm font-black text-brand-300 mt-0.5">
                      {dateStr ? formatShortDate(dateStr) : day}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-medium text-slate-400 px-2 py-0.2 rounded-full bg-slate-800/80">
                      {dayLectures.length} {dayLectures.length === 1 ? 'class' : 'classes'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Matrix Body: Time on Y-Axis */}
            <div className="divide-y divide-slate-800/60 bg-slate-950/30">
              {timeSlots.map((slot, slotIndex) => {
                if (slot.isBreak) {
                  return (
                    <div
                      key={slot.start}
                      className="grid grid-cols-[110px_repeat(6,1fr)] bg-slate-900/40 border-b border-slate-800/60"
                    >
                      <div className="p-2.5 border-r border-slate-800/80 text-right pr-3 flex flex-col justify-center bg-slate-950/60">
                        <span className="text-[11px] font-bold text-slate-500">{slot.label}</span>
                        <span className="text-[9px] text-slate-600 font-mono">12:30 - 14:00</span>
                      </div>
                      <div className="col-span-6 p-2 text-center flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 tracking-wider uppercase bg-slate-900/20">
                        <span>— {slot.labelTitle} —</span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={slot.start}
                    className="grid grid-cols-[110px_repeat(6,1fr)] min-h-[110px]"
                  >
                    {/* Time Column (Y-Axis) */}
                    <div className="p-3 border-r border-slate-800 text-right pr-3.5 bg-slate-900/30 flex flex-col justify-start">
                      <span className="text-xs font-extrabold text-slate-300">{slot.label}</span>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {slot.start} - {slot.end}
                      </span>
                    </div>

                    {/* Columns for each day (X-Axis) */}
                    {daysOfWeek.map((day) => {
                      const cellLectures = getLecturesForCell(day, slot);

                      return (
                        <div
                          key={day}
                          className="p-1.5 border-r border-slate-800/60 last:border-r-0 relative group hover:bg-slate-800/10 transition-colors flex flex-col gap-1.5"
                        >
                          {cellLectures.map((lecture) => {
                            const theme = getSubjectTheme(lecture.subjectCode);

                            return (
                              <div
                                key={lecture._id}
                                onClick={() => handleCardClick(lecture)}
                                className={`p-2.5 rounded-xl border border-l-4 ${theme.borderLeft} ${theme.bg} cursor-pointer transition-all duration-150 shadow-md hover:shadow-lg hover:scale-[1.02] flex flex-col justify-between min-h-[90px]`}
                              >
                                <div>
                                  <div className="flex items-start justify-between gap-1 mb-1">
                                    <span
                                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border ${theme.badge}`}
                                    >
                                      {lecture.subjectCode}
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-300 opacity-90">
                                      {lecture.startTime}
                                    </span>
                                  </div>

                                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight">
                                    {lecture.subject}
                                  </h4>
                                </div>

                                <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300">
                                  <div className="flex items-center gap-1.5">
                                    <span className="flex items-center gap-0.5 font-medium">
                                      <MapPin className="w-3 h-3 opacity-70" />
                                      {lecture.room}
                                    </span>
                                    {lecture.batch && (
                                      <span className="font-semibold text-brand-300">
                                        B{lecture.batch}
                                      </span>
                                    )}
                                  </div>

                                  {/* Role status badge */}
                                  {role === 'TEACHER' ? (
                                    <span
                                      className={`px-1.5 py-0.2 rounded-full font-bold text-[9px] ${
                                        lecture.leaveCount > 0
                                          ? 'bg-amber-400/25 text-amber-200 border border-amber-400/40'
                                          : 'bg-slate-800/80 text-slate-400'
                                      }`}
                                    >
                                      {lecture.leaveCount > 0
                                        ? `${lecture.leaveCount} Leaves`
                                        : '0'}
                                    </span>
                                  ) : (
                                    <span>
                                      {lecture.hasLeave ? (
                                        <span className="px-1.5 py-0.2 rounded-full font-bold text-[9px] bg-emerald-500/25 text-emerald-300 border border-emerald-500/40">
                                          Leave: Applied
                                        </span>
                                      ) : null}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetableMatrix;
