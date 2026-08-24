import React, { useState } from 'react';
import TimetableCard from './TimetableCard.jsx';
import TimetableMatrix from './TimetableMatrix.jsx';
import { Calendar, Layers, LayoutGrid, ListFilter } from 'lucide-react';
import { formatShortDate } from '../../utils/dateUtils.js';

export const TimetableGrid = ({ lectures = [], role, onSelectLecture }) => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Default to Teams Matrix view
  const [viewMode, setViewMode] = useState('MATRIX'); // 'MATRIX' or 'CARDS'
  const [activeTab, setActiveTab] = useState('ALL');

  // Group lectures by day
  const groupedLectures = daysOfWeek.reduce((acc, day) => {
    acc[day] = lectures.filter((l) => l.day === day);
    return acc;
  }, {});

  const filteredDays =
    activeTab === 'ALL'
      ? daysOfWeek.filter((day) => groupedLectures[day] && groupedLectures[day].length > 0)
      : [activeTab];

  if (lectures.length === 0) {
    return (
      <div className="glass-panel p-12 rounded-2xl text-center">
        <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h4 className="text-base font-bold text-slate-300">No Lectures Scheduled</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          There are no timetable sessions found for your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top View Toggle Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-900/60 p-2 rounded-2xl border border-slate-800">
        {/* Left: View Mode Selector */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setViewMode('MATRIX')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'MATRIX'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Teams Matrix (Date × Time)</span>
          </button>

          <button
            onClick={() => setViewMode('CARDS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'CARDS'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Day Cards View</span>
          </button>
        </div>

        {/* Right: Day Quick Filter (Active when in Cards mode) */}
        {viewMode === 'CARDS' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'ALL'
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Days ({lectures.length})
            </button>

            {daysOfWeek.map((day) => {
              const count = groupedLectures[day]?.length || 0;
              return (
                <button
                  key={day}
                  onClick={() => setActiveTab(day)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    activeTab === day
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {day.slice(0, 3)} ({count})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main View Container */}
      {viewMode === 'MATRIX' ? (
        <TimetableMatrix
          lectures={lectures}
          role={role}
          onSelectLecture={onSelectLecture}
        />
      ) : (
        /* Cards by Day View */
        <div className="space-y-8">
          {filteredDays.map((day) => {
            const dayLectures = groupedLectures[day] || [];
            if (dayLectures.length === 0) {
              return (
                <div key={day} className="glass-panel p-8 rounded-2xl text-center text-slate-400">
                  <p className="text-sm">No lectures scheduled on {day}.</p>
                </div>
              );
            }

            const dayDate = dayLectures[0]?.date;

            return (
              <section key={day} className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-lg font-bold text-slate-100">{day}</h3>
                    {dayDate && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-lg bg-slate-800/80 text-slate-400 border border-slate-700/60">
                        {dayDate}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {dayLectures.length} {dayLectures.length === 1 ? 'Session' : 'Sessions'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {dayLectures.map((lecture) => (
                    <TimetableCard
                      key={lecture._id}
                      lecture={lecture}
                      role={role}
                      onSelect={onSelectLecture}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TimetableGrid;
