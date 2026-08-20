import React from 'react';
import {
  Award,
  BookOpen,
  BarChart3,
  GraduationCap,
  Printer,
  RefreshCw,
  School,
  Settings,
  Users,
} from 'lucide-react';
import { SchoolSettings } from '../types';

interface HeaderProps {
  settings: SchoolSettings;
  activeTab: 'dashboard' | 'classes' | 'subjects' | 'students' | 'grades' | 'results';
  setActiveTab: (tab: 'dashboard' | 'classes' | 'subjects' | 'students' | 'grades' | 'results') => void;
  onOpenSettings: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  activeTab,
  setActiveTab,
  onOpenSettings,
  onResetData,
}) => {
  return (
    <header className="no-print bg-slate-900 text-white shadow-md border-b border-slate-800 sticky top-0 z-40">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* School Name & Motto */}
          <div className="flex items-center gap-3">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt="School Logo"
                className="w-11 h-11 rounded-lg object-cover bg-white p-0.5 border border-slate-700 shadow-sm"
              />
            ) : (
              <div className="w-11 h-11 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-lg text-white shadow-sm">
                <School className="w-6 h-6" />
              </div>
            )}

            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                {settings.name}
              </h1>
              <p className="text-xs text-slate-300 italic flex items-center gap-2">
                <span>"{settings.motto}"</span>
                <span className="hidden sm:inline-block text-slate-500">•</span>
                <span className="hidden sm:inline-block text-indigo-300 font-medium">
                  {settings.currentSession} ({settings.currentTerm})
                </span>
              </p>
            </div>
          </div>

          {/* Term Badge & Header Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3 self-end md:self-auto">
            <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700/60 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300 font-medium">Session:</span>
              <span className="text-white font-semibold">{settings.currentSession}</span>
              <span className="text-slate-500">|</span>
              <span className="text-indigo-300 font-semibold">{settings.currentTerm}</span>
            </div>

            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 transition-colors shadow-xs cursor-pointer"
              title="Portal Settings"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all portal data back to initial sample state? Any changes made will be restored to default.')) {
                  onResetData();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800/80 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 rounded-lg border border-slate-700/80 hover:border-rose-800/60 transition-colors cursor-pointer"
              title="Reset Sample Data"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Reset Demo Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-950/60 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('classes')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'classes'
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <School className="w-4 h-4" />
            <span>Classes</span>
          </button>

          <button
            onClick={() => setActiveTab('subjects')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'subjects'
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Subjects</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'students'
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Students</span>
          </button>

          <button
            onClick={() => setActiveTab('grades')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'grades'
                ? 'bg-amber-600 text-white shadow-sm font-semibold'
                : 'text-amber-200/90 hover:text-white hover:bg-amber-950/40'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-amber-300" />
            <span>Input Grades</span>
          </button>

          <button
            onClick={() => setActiveTab('results')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'results'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-emerald-200/90 hover:text-white hover:bg-emerald-950/40'
            }`}
          >
            <Printer className="w-4 h-4 text-emerald-300" />
            <span>Print Results</span>
          </button>
        </div>
      </div>
    </header>
  );
};
