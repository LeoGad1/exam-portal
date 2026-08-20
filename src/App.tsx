import React, { useState, useEffect } from 'react';
import {
  AssessmentScore,
  ClassItem,
  SchoolSettings,
  Student,
  StudentReportRemarks,
  Subject,
} from './types';
import {
  loadClasses,
  loadRemarks,
  loadScores,
  loadSettings,
  loadStudents,
  loadSubjects,
  resetAllDataToDefault,
  saveClasses,
  saveRemarks,
  saveScores,
  saveSettings,
  saveStudents,
  saveSubjects,
} from './utils/storage';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ClassesManager } from './components/ClassesManager';
import { SubjectsManager } from './components/SubjectsManager';
import { StudentsManager } from './components/StudentsManager';
import { GradeEntry } from './components/GradeEntry';
import { ResultCard } from './components/ResultCard';
import { BulkResultsPrint } from './components/BulkResultsPrint';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'classes' | 'subjects' | 'students' | 'grades' | 'results' | 'bulk_results'
  >('dashboard');

  // Core Data State
  const [settings, setSettings] = useState<SchoolSettings>(loadSettings);
  const [classes, setClasses] = useState<ClassItem[]>(loadClasses);
  const [subjects, setSubjects] = useState<Subject[]>(loadSubjects);
  const [students, setStudents] = useState<Student[]>(loadStudents);
  const [scores, setScores] = useState<AssessmentScore[]>(loadScores);
  const [remarksList, setRemarksList] = useState<StudentReportRemarks[]>(loadRemarks);

  // Active Selection State
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    students[0]?.id || ''
  );
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('All');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Sync state changes with localStorage
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveClasses(classes);
  }, [classes]);

  useEffect(() => {
    saveSubjects(subjects);
  }, [subjects]);

  useEffect(() => {
    saveStudents(students);
  }, [students]);

  useEffect(() => {
    saveScores(scores);
  }, [scores]);

  useEffect(() => {
    saveRemarks(remarksList);
  }, [remarksList]);

  // Handler functions
  const handleResetData = () => {
    resetAllDataToDefault();
    setSettings(loadSettings());
    setClasses(loadClasses());
    setSubjects(loadSubjects());
    setStudents(loadStudents());
    setScores(loadScores());
    setRemarksList(loadRemarks());
    setSelectedStudentId(loadStudents()[0]?.id || '');
    setActiveTab('dashboard');
  };

  // Class Handlers
  const handleAddClass = (newClass: Omit<ClassItem, 'id'>) => {
    const created: ClassItem = {
      ...newClass,
      id: `cls-${Date.now()}`,
    };
    setClasses((prev) => [...prev, created]);
  };

  const handleUpdateClass = (updated: ClassItem) => {
    setClasses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleDeleteClass = (classId: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== classId));
  };

  // Subject Handlers
  const handleAddSubject = (newSubj: Omit<Subject, 'id'>) => {
    const created: Subject = {
      ...newSubj,
      id: `sub-${Date.now()}`,
    };
    setSubjects((prev) => [...prev, created]);
  };

  const handleUpdateSubject = (updated: Subject) => {
    setSubjects((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleDeleteSubject = (subjectId: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
  };

  // Student Handlers
  const handleAddStudent = (newStudent: Omit<Student, 'id'>) => {
    const created: Student = {
      ...newStudent,
      id: `std-${Date.now()}`,
    };
    setStudents((prev) => [...prev, created]);
    setSelectedStudentId(created.id);
  };

  const handleUpdateStudent = (updated: Student) => {
    setStudents((prev) => prev.map((st) => (st.id === updated.id ? updated : st)));
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((st) => st.id !== studentId));
    if (selectedStudentId === studentId) {
      const remaining = students.filter((st) => st.id !== studentId);
      setSelectedStudentId(remaining[0]?.id || '');
    }
  };

  // Remarks Handler
  const handleSaveRemarks = (updatedRemark: StudentReportRemarks) => {
    setRemarksList((prev) => {
      const index = prev.findIndex(
        (r) =>
          r.studentId === updatedRemark.studentId &&
          r.term === updatedRemark.term &&
          r.session === updatedRemark.session
      );
      if (index !== -1) {
        const next = [...prev];
        next[index] = updatedRemark;
        return next;
      }
      return [...prev, updatedRemark];
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white pb-12">
      {/* Header Bar */}
      <Header
        settings={settings}
        activeTab={activeTab === 'bulk_results' ? 'results' : activeTab}
        setActiveTab={(tab) => setActiveTab(tab)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            settings={settings}
            classes={classes}
            subjects={subjects}
            students={students}
            scores={scores}
            onNavigate={(tab) => setActiveTab(tab)}
            onSelectStudentForReport={(id) => {
              setSelectedStudentId(id);
              setActiveTab('results');
            }}
          />
        )}

        {activeTab === 'classes' && (
          <ClassesManager
            classes={classes}
            students={students}
            onAddClass={handleAddClass}
            onUpdateClass={handleUpdateClass}
            onDeleteClass={handleDeleteClass}
            onSelectClassStudents={(classId) => {
              setSelectedClassFilter(classId);
              setActiveTab('students');
            }}
          />
        )}

        {activeTab === 'subjects' && (
          <SubjectsManager
            subjects={subjects}
            classes={classes}
            onAddSubject={handleAddSubject}
            onUpdateSubject={handleUpdateSubject}
            onDeleteSubject={handleDeleteSubject}
          />
        )}

        {activeTab === 'students' && (
          <StudentsManager
            students={students}
            classes={classes}
            selectedClassFilter={selectedClassFilter}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
            onSelectStudentForGrades={(id) => {
              setSelectedStudentId(id);
              setActiveTab('grades');
            }}
            onSelectStudentForReport={(id) => {
              setSelectedStudentId(id);
              setActiveTab('results');
            }}
          />
        )}

        {activeTab === 'grades' && (
          <GradeEntry
            settings={settings}
            classes={classes}
            subjects={subjects}
            students={students}
            scores={scores}
            initialStudentId={selectedStudentId}
            onSaveScores={(updated) => setScores(updated)}
            onNavigateToReport={(id) => {
              setSelectedStudentId(id);
              setActiveTab('results');
            }}
          />
        )}

        {(activeTab === 'results' || activeTab === 'bulk_results') && (
          <div className="space-y-4">
            {/* Toggle between Single Student View and Class Bulk View */}
            <div className="no-print flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('results')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'results'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Single Student Result
                </button>
                <button
                  onClick={() => setActiveTab('bulk_results')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'bulk_results'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Class Bulk Print Mode
                </button>
              </div>

              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                {settings.currentTerm} • {settings.currentSession}
              </span>
            </div>

            {activeTab === 'results' ? (
              <ResultCard
                settings={settings}
                classes={classes}
                subjects={subjects}
                students={students}
                scores={scores}
                remarksList={remarksList}
                selectedStudentId={selectedStudentId}
                onSelectStudent={(id) => setSelectedStudentId(id)}
                onNavigateToGrades={(id) => {
                  setSelectedStudentId(id);
                  setActiveTab('grades');
                }}
                onSaveRemarks={handleSaveRemarks}
              />
            ) : (
              <BulkResultsPrint
                settings={settings}
                classes={classes}
                subjects={subjects}
                students={students}
                scores={scores}
                remarksList={remarksList}
              />
            )}
          </div>
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        settings={settings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={(updated) => setSettings(updated)}
      />
    </div>
  );
}
