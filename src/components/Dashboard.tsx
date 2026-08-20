import React from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FileSpreadsheet,
  GraduationCap,
  Plus,
  Printer,
  School,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  AssessmentScore,
  ClassItem,
  SchoolSettings,
  Student,
  Subject,
} from '../types';
import { calculateTotalScore, getGradeAndRemark } from '../utils/calculations';

interface DashboardProps {
  settings: SchoolSettings;
  classes: ClassItem[];
  subjects: Subject[];
  students: Student[];
  scores: AssessmentScore[];
  onNavigate: (tab: 'dashboard' | 'classes' | 'subjects' | 'students' | 'grades' | 'results', param?: any) => void;
  onSelectStudentForReport: (studentId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  settings,
  classes,
  subjects,
  students,
  scores,
  onNavigate,
  onSelectStudentForReport,
}) => {
  // Filter scores for active term & session
  const currentTermScores = scores.filter(
    (s) => s.term === settings.currentTerm && s.session === settings.currentSession
  );

  // Calculate top students based on total scores
  const studentPerformanceList = students.map((std) => {
    const studentScores = currentTermScores.filter((sc) => sc.studentId === std.id);
    const totalScoreSum = studentScores.reduce(
      (sum, sc) => sum + calculateTotalScore(sc.ca1, sc.ca2, sc.midTerm, sc.exam),
      0
    );
    const avgScore = studentScores.length > 0 ? totalScoreSum / studentScores.length : 0;
    const classObj = classes.find((c) => c.id === std.classId);

    return {
      student: std,
      classObj,
      totalScoreSum,
      subjectCount: studentScores.length,
      avgScore: Math.round(avgScore * 10) / 10,
    };
  }).filter((sp) => sp.subjectCount > 0);

  // Sort by average score descending
  const topStudents = [...studentPerformanceList]
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 5);

  const overallAverage =
    studentPerformanceList.length > 0
      ? Math.round(
          (studentPerformanceList.reduce((acc, curr) => acc + curr.avgScore, 0) /
            studentPerformanceList.length) *
            10
        ) / 10
      : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-indigo-900/50 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>School Exam & Assessment Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome to {settings.name}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Easily manage classes, subjects, students, continuous assessment scores (CA1 & CA2), mid-term test, and final exams. Generate and print clean official student report cards in seconds.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('grades')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Input Grades & Scores</span>
            </button>
            <button
              onClick={() => onNavigate('results')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>View & Print Results</span>
            </button>
          </div>
        </div>
      </div>

      {/* Assessment Weights Breakdown Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Official Assessment Score Weights (Total 100 Marks)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">CA 1</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">10 Marks</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">1st Continuous Assessment</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">CA 2</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">10 Marks</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">2nd Continuous Assessment</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Mid-Term</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">20 Marks</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Mid-Term Test</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Final Exam</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">60 Marks</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Terminal Examination</p>
          </div>
        </div>
      </div>

      {/* Core Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('classes')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Classes</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{classes.length}</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <School className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 flex items-center gap-1">
            <span>Manage classes & form teachers</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 ml-auto" />
          </p>
        </div>

        <div
          onClick={() => onNavigate('subjects')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Subjects</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{subjects.length}</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 flex items-center gap-1">
            <span>Core & elective curriculum</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 ml-auto" />
          </p>
        </div>

        <div
          onClick={() => onNavigate('students')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Enrolled Students</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{students.length}</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 flex items-center gap-1">
            <span>Student profiles & roll calls</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 ml-auto" />
          </p>
        </div>

        <div
          onClick={() => onNavigate('results')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Term Average Score</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{overallAverage}%</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 flex items-center gap-1">
            <span>Overall term academic mean</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 ml-auto" />
          </p>
        </div>
      </div>

      {/* Top Performing Students List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Top Academic Performers ({settings.currentTerm})</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Highest achieving students sorted by average percentage across subjects
              </p>
            </div>
            <button
              onClick={() => onNavigate('results')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              View All Results &rarr;
            </button>
          </div>

          {topStudents.length > 0 ? (
            <div className="space-y-3">
              {topStudents.map((item, idx) => {
                const { grade, color } = getGradeAndRemark(item.avgScore);
                return (
                  <div
                    key={item.student.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="relative">
                        <img
                          src={item.student.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                          alt={item.student.fullName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-slate-600"
                        />
                        <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                          {idx + 1}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                          {item.student.fullName}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                          <span>{item.student.admissionNo}</span>
                          <span>•</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {item.classObj?.name || 'Unassigned'}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {item.avgScore}%
                        </span>
                        <div className="text-[10px]">
                          <span className={`px-1.5 py-0.5 rounded font-bold ${color}`}>
                            Grade {grade}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onSelectStudentForReport(item.student.id);
                          onNavigate('results');
                        }}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                        title="Print Result Card"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Report</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500 text-sm">
              No scores recorded yet for {settings.currentTerm}. Click "Input Grades" to add student scores.
            </div>
          )}
        </div>

        {/* Quick Portal Guide */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Workflow Steps</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Set Up Classes & Subjects</span>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  Create classes (e.g., JSS 1, SS 2) and add your curriculum subjects.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Register Students</span>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  Enroll students into their respective classes with admission numbers.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div>
                <span className="font-semibold text-amber-900 dark:text-amber-200">Input Scores (CA1, CA2, MidTerm, Exam)</span>
                <p className="text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                  Enter scores per subject or student. Totals out of 100 auto-calculate.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/40 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                4
              </span>
              <div>
                <span className="font-semibold text-emerald-900 dark:text-emerald-200">Print Student Report Cards</span>
                <p className="text-emerald-800/80 dark:text-emerald-300/80 mt-0.5">
                  Preview positions, grades, teacher remarks, and print clean official cards!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
