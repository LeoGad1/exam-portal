import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  FileSpreadsheet,
  GraduationCap,
  Save,
  School,
  Sparkles,
  User,
} from 'lucide-react';
import {
  AssessmentScore,
  ClassItem,
  SchoolSettings,
  Student,
  Subject,
} from '../types';
import { calculateTotalScore, getGradeAndRemark } from '../utils/calculations';

interface GradeEntryProps {
  settings: SchoolSettings;
  classes: ClassItem[];
  subjects: Subject[];
  students: Student[];
  scores: AssessmentScore[];
  initialStudentId?: string;
  onSaveScores: (updatedScores: AssessmentScore[]) => void;
  onNavigateToReport: (studentId: string) => void;
}

export const GradeEntry: React.FC<GradeEntryProps> = ({
  settings,
  classes,
  subjects,
  students,
  scores,
  initialStudentId,
  onSaveScores,
  onNavigateToReport,
}) => {
  const [entryMode, setEntryMode] = useState<'subject' | 'student'>(
    initialStudentId ? 'student' : 'subject'
  );

  // Mode A: Subject Batch Selection
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');

  // Mode B: Student Selection
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudentId || students[0]?.id || ''
  );

  // Local draft scores map to allow smooth typing without flickering
  const [draftScores, setDraftScores] = useState<Record<string, { ca1: string; ca2: string; midTerm: string; exam: string; remark: string }>>({});
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Available subjects for selected class in Mode A
  const availableSubjectsForClass = subjects.filter(
    (sub) => sub.classIds.length === 0 || sub.classIds.includes(selectedClassId)
  );

  // Selected student object for Mode B
  const selectedStudentObj = students.find((st) => st.id === selectedStudentId);
  const selectedStudentClassSubjects = selectedStudentObj
    ? subjects.filter(
        (sub) => sub.classIds.length === 0 || sub.classIds.includes(selectedStudentObj.classId)
      )
    : [];

  // Initialize draft scores when selection changes
  useEffect(() => {
    const newDrafts: Record<string, { ca1: string; ca2: string; midTerm: string; exam: string; remark: string }> = {};

    if (entryMode === 'subject') {
      const classStudents = students.filter((st) => st.classId === selectedClassId);
      classStudents.forEach((st) => {
        const existing = scores.find(
          (sc) =>
            sc.studentId === st.id &&
            sc.subjectId === selectedSubjectId &&
            sc.term === settings.currentTerm &&
            sc.session === settings.currentSession
        );

        newDrafts[st.id] = {
          ca1: existing ? String(existing.ca1) : '',
          ca2: existing ? String(existing.ca2) : '',
          midTerm: existing ? String(existing.midTerm) : '',
          exam: existing ? String(existing.exam) : '',
          remark: existing?.teacherRemark || '',
        };
      });
    } else {
      if (selectedStudentObj) {
        selectedStudentClassSubjects.forEach((sub) => {
          const existing = scores.find(
            (sc) =>
              sc.studentId === selectedStudentObj.id &&
              sc.subjectId === sub.id &&
              sc.term === settings.currentTerm &&
              sc.session === settings.currentSession
          );

          newDrafts[sub.id] = {
            ca1: existing ? String(existing.ca1) : '',
            ca2: existing ? String(existing.ca2) : '',
            midTerm: existing ? String(existing.midTerm) : '',
            exam: existing ? String(existing.exam) : '',
            remark: existing?.teacherRemark || '',
          };
        });
      }
    }

    setDraftScores(newDrafts);
  }, [entryMode, selectedClassId, selectedSubjectId, selectedStudentId, scores, settings]);

  const handleScoreChange = (
    keyId: string, // studentId in Mode A, subjectId in Mode B
    field: 'ca1' | 'ca2' | 'midTerm' | 'exam' | 'remark',
    value: string
  ) => {
    setDraftScores((prev) => ({
      ...prev,
      [keyId]: {
        ...prev[keyId],
        [field]: value,
      },
    }));
  };

  const handleSaveAll = () => {
    const updatedList = [...scores];

    if (entryMode === 'subject') {
      const classStudents = students.filter((st) => st.classId === selectedClassId);

      classStudents.forEach((st) => {
        const draft = draftScores[st.id];
        if (!draft) return;

        const ca1Num = Math.min(10, Math.max(0, Number(draft.ca1) || 0));
        const ca2Num = Math.min(10, Math.max(0, Number(draft.ca2) || 0));
        const midNum = Math.min(20, Math.max(0, Number(draft.midTerm) || 0));
        const examNum = Math.min(60, Math.max(0, Number(draft.exam) || 0));

        const existingIndex = updatedList.findIndex(
          (sc) =>
            sc.studentId === st.id &&
            sc.subjectId === selectedSubjectId &&
            sc.term === settings.currentTerm &&
            sc.session === settings.currentSession
        );

        const newScoreRecord: AssessmentScore = {
          id: existingIndex !== -1 ? updatedList[existingIndex].id : `sc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          studentId: st.id,
          subjectId: selectedSubjectId,
          classId: selectedClassId,
          term: settings.currentTerm,
          session: settings.currentSession,
          ca1: ca1Num,
          ca2: ca2Num,
          midTerm: midNum,
          exam: examNum,
          teacherRemark: draft.remark,
        };

        if (existingIndex !== -1) {
          updatedList[existingIndex] = newScoreRecord;
        } else {
          updatedList.push(newScoreRecord);
        }
      });
    } else if (entryMode === 'student' && selectedStudentObj) {
      selectedStudentClassSubjects.forEach((sub) => {
        const draft = draftScores[sub.id];
        if (!draft) return;

        const ca1Num = Math.min(10, Math.max(0, Number(draft.ca1) || 0));
        const ca2Num = Math.min(10, Math.max(0, Number(draft.ca2) || 0));
        const midNum = Math.min(20, Math.max(0, Number(draft.midTerm) || 0));
        const examNum = Math.min(60, Math.max(0, Number(draft.exam) || 0));

        const existingIndex = updatedList.findIndex(
          (sc) =>
            sc.studentId === selectedStudentObj.id &&
            sc.subjectId === sub.id &&
            sc.term === settings.currentTerm &&
            sc.session === settings.currentSession
        );

        const newScoreRecord: AssessmentScore = {
          id: existingIndex !== -1 ? updatedList[existingIndex].id : `sc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          studentId: selectedStudentObj.id,
          subjectId: sub.id,
          classId: selectedStudentObj.classId,
          term: settings.currentTerm,
          session: settings.currentSession,
          ca1: ca1Num,
          ca2: ca2Num,
          midTerm: midNum,
          exam: examNum,
          teacherRemark: draft.remark,
        };

        if (existingIndex !== -1) {
          updatedList[existingIndex] = newScoreRecord;
        } else {
          updatedList.push(newScoreRecord);
        }
      });
    }

    onSaveScores(updatedList);
    setSaveSuccessMessage('Assessment scores successfully saved!');
    setTimeout(() => setSaveSuccessMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-500" />
            <span>Assessment Score Entry Sheet</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Input CA 1 (10mks), CA 2 (10mks), Mid-Term Test (20mks), and Final Exam (60mks). Totals out of 100 auto-compute.
          </p>
        </div>

        {/* Mode Switcher Buttons */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setEntryMode('subject')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              entryMode === 'subject'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Entry by Subject
          </button>
          <button
            onClick={() => setEntryMode('student')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              entryMode === 'student'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Entry by Student
          </button>
        </div>
      </div>

      {saveSuccessMessage && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900 p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Mode A: Subject Entry Control Bar */}
      {entryMode === 'subject' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <School className="w-4 h-4 text-indigo-500" />
                <span>Select Class</span>
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => {
                  setSelectedClassId(e.target.value);
                  const firstSubj = subjects.find(
                    (s) => s.classIds.length === 0 || s.classIds.includes(e.target.value)
                  );
                  if (firstSubj) setSelectedSubjectId(firstSubj.id);
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.section})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span>Select Subject</span>
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {availableSubjectsForClass.map((s) => (
                  <option key={s.id} value={s.id}>
                    [{s.code}] {s.name} ({s.category})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Mode B: Student Entry Control Bar */}
      {entryMode === 'student' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-500" />
              <span>Select Student</span>
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {students.map((st) => {
                const cls = classes.find((c) => c.id === st.classId);
                return (
                  <option key={st.id} value={st.id}>
                    {st.fullName} ({st.admissionNo}) — {cls?.name || 'Class'}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      )}

      {/* Score Entry Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <FileSpreadsheet className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>
              {entryMode === 'subject'
                ? `Students in ${classes.find((c) => c.id === selectedClassId)?.name} — ${subjects.find((s) => s.id === selectedSubjectId)?.name}`
                : `All Subjects for ${selectedStudentObj?.fullName}`}
            </span>
          </div>

          <button
            onClick={handleSaveAll}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Scores</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 uppercase font-bold">
                <th className="py-3 px-4 min-w-[180px]">
                  {entryMode === 'subject' ? 'Student Name' : 'Subject'}
                </th>
                <th className="py-3 px-2 text-center w-24">CA 1 (Max 10)</th>
                <th className="py-3 px-2 text-center w-24">CA 2 (Max 10)</th>
                <th className="py-3 px-2 text-center w-24">Mid-Term (Max 20)</th>
                <th className="py-3 px-2 text-center w-28">Exam (Max 60)</th>
                <th className="py-3 px-3 text-center w-24">Total (100)</th>
                <th className="py-3 px-3 text-center w-20">Grade</th>
                <th className="py-3 px-4">Subject Teacher Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {entryMode === 'subject' ? (
                // Mode A rows (Students)
                students
                  .filter((st) => st.classId === selectedClassId)
                  .map((st) => {
                    const draft = draftScores[st.id] || { ca1: '', ca2: '', midTerm: '', exam: '', remark: '' };
                    const ca1Val = Number(draft.ca1) || 0;
                    const ca2Val = Number(draft.ca2) || 0;
                    const midVal = Number(draft.midTerm) || 0;
                    const examVal = Number(draft.exam) || 0;

                    const total = calculateTotalScore(ca1Val, ca2Val, midVal, examVal);
                    const { grade, color } = getGradeAndRemark(total);

                    const ca1Err = ca1Val > 10;
                    const ca2Err = ca2Val > 10;
                    const midErr = midVal > 20;
                    const examErr = examVal > 60;

                    return (
                      <tr key={st.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {st.fullName}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {st.admissionNo}
                          </div>
                        </td>

                        {/* CA 1 */}
                        <td className="py-2.5 px-2 text-center">
                          <input
                            type="number"
                            min={0}
                            max={10}
                            placeholder="0-10"
                            value={draft.ca1}
                            onChange={(e) => handleScoreChange(st.id, 'ca1', e.target.value)}
                            className={`w-16 px-2 py-1.5 text-center font-bold bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 ${
                              ca1Err
                                ? 'border-rose-500 text-rose-600 focus:ring-rose-500'
                                : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-indigo-500'
                            }`}
                          />
                          {ca1Err && <p className="text-[9px] text-rose-500 mt-0.5">Max 10</p>}
                        </td>

                        {/* CA 2 */}
                        <td className="py-2.5 px-2 text-center">
                          <input
                            type="number"
                            min={0}
                            max={10}
                            placeholder="0-10"
                            value={draft.ca2}
                            onChange={(e) => handleScoreChange(st.id, 'ca2', e.target.value)}
                            className={`w-16 px-2 py-1.5 text-center font-bold bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 ${
                              ca2Err
                                ? 'border-rose-500 text-rose-600 focus:ring-rose-500'
                                : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-indigo-500'
                            }`}
                          />
                          {ca2Err && <p className="text-[9px] text-rose-500 mt-0.5">Max 10</p>}
                        </td>

                        {/* Mid Term */}
                        <td className="py-2.5 px-2 text-center">
                          <input
                            type="number"
                            min={0}
                            max={20}
                            placeholder="0-20"
                            value={draft.midTerm}
                            onChange={(e) => handleScoreChange(st.id, 'midTerm', e.target.value)}
                            className={`w-16 px-2 py-1.5 text-center font-bold bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 ${
                              midErr
                                ? 'border-rose-500 text-rose-600 focus:ring-rose-500'
                                : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-indigo-500'
                            }`}
                          />
                          {midErr && <p className="text-[9px] text-rose-500 mt-0.5">Max 20</p>}
                        </td>

                        {/* Exam */}
                        <td className="py-2.5 px-2 text-center">
                          <input
                            type="number"
                            min={0}
                            max={60}
                            placeholder="0-60"
                            value={draft.exam}
                            onChange={(e) => handleScoreChange(st.id, 'exam', e.target.value)}
                            className={`w-20 px-2 py-1.5 text-center font-bold bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 ${
                              examErr
                                ? 'border-rose-500 text-rose-600 focus:ring-rose-500'
                                : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-indigo-500'
                            }`}
                          />
                          {examErr && <p className="text-[9px] text-rose-500 mt-0.5">Max 60</p>}
                        </td>

                        {/* Total Score */}
                        <td className="py-2.5 px-3 text-center">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {total}
                          </span>
                        </td>

                        {/* Grade */}
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded font-bold text-xs ${color}`}>
                            {grade}
                          </span>
                        </td>

                        {/* Remark */}
                        <td className="py-2.5 px-4">
                          <input
                            type="text"
                            placeholder="e.g. Excellent grip on subject"
                            value={draft.remark}
                            onChange={(e) => handleScoreChange(st.id, 'remark', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </td>
                      </tr>
                    );
                  })
              ) : (
                // Mode B rows (Subjects for student)
                selectedStudentClassSubjects.map((sub) => {
                  const draft = draftScores[sub.id] || { ca1: '', ca2: '', midTerm: '', exam: '', remark: '' };
                  const ca1Val = Number(draft.ca1) || 0;
                  const ca2Val = Number(draft.ca2) || 0;
                  const midVal = Number(draft.midTerm) || 0;
                  const examVal = Number(draft.exam) || 0;

                  const total = calculateTotalScore(ca1Val, ca2Val, midVal, examVal);
                  const { grade, color } = getGradeAndRemark(total);

                  const ca1Err = ca1Val > 10;
                  const ca2Err = ca2Val > 10;
                  const midErr = midVal > 20;
                  const examErr = examVal > 60;

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {sub.name}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          [{sub.code}] — {sub.category}
                        </div>
                      </td>

                      {/* CA 1 */}
                      <td className="py-2.5 px-2 text-center">
                        <input
                          type="number"
                          min={0}
                          max={10}
                          placeholder="0-10"
                          value={draft.ca1}
                          onChange={(e) => handleScoreChange(sub.id, 'ca1', e.target.value)}
                          className={`w-16 px-2 py-1.5 text-center font-bold bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 ${
                            ca1Err
                              ? 'border-rose-500 text-rose-600 focus:ring-rose-500'
                              : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-indigo-500'
                          }`}
                        />
                        {ca1Err && <p className="text-[9px] text-rose-500 mt-0.5">Max 10</p>}
                      </td>

                      {/* CA 2 */}
                      <td className="py-2.5 px-2 text-center">
                        <input
                          type="number"
                          min={0}
                          max={10}
                          placeholder="0-10"
                          value={draft.ca2}
                          onChange={(e) => handleScoreChange(sub.id, 'ca2', e.target.value)}
                          className={`w-16 px-2 py-1.5 text-center font-bold bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 ${
                            ca2Err
                              ? 'border-rose-500 text-rose-600 focus:ring-rose-500'
                              : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-indigo-500'
                          }`}
                        />
                        {ca2Err && <p className="text-[9px] text-rose-500 mt-0.5">Max 10</p>}
                      </td>

                      {/* Mid Term */}
                      <td className="py-2.5 px-2 text-center">
                        <input
                          type="number"
                          min={0}
                          max={20}
                          placeholder="0-20"
                          value={draft.midTerm}
                          onChange={(e) => handleScoreChange(sub.id, 'midTerm', e.target.value)}
                          className={`w-16 px-2 py-1.5 text-center font-bold bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 ${
                            midErr
                              ? 'border-rose-500 text-rose-600 focus:ring-rose-500'
                              : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-indigo-500'
                          }`}
                        />
                        {midErr && <p className="text-[9px] text-rose-500 mt-0.5">Max 20</p>}
                      </td>

                      {/* Exam */}
                      <td className="py-2.5 px-2 text-center">
                        <input
                          type="number"
                          min={0}
                          max={60}
                          placeholder="0-60"
                          value={draft.exam}
                          onChange={(e) => handleScoreChange(sub.id, 'exam', e.target.value)}
                          className={`w-20 px-2 py-1.5 text-center font-bold bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 ${
                            examErr
                              ? 'border-rose-500 text-rose-600 focus:ring-rose-500'
                              : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-indigo-500'
                          }`}
                        />
                        {examErr && <p className="text-[9px] text-rose-500 mt-0.5">Max 60</p>}
                      </td>

                      {/* Total Score */}
                      <td className="py-2.5 px-3 text-center">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {total}
                        </span>
                      </td>

                      {/* Grade */}
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded font-bold text-xs ${color}`}>
                          {grade}
                        </span>
                      </td>

                      {/* Remark */}
                      <td className="py-2.5 px-4">
                        <input
                          type="text"
                          placeholder="e.g. Good progress"
                          value={draft.remark}
                          onChange={(e) => handleScoreChange(sub.id, 'remark', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Actions Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-indigo-500" />
            <span>Scores are automatically checked against standard maximum limits.</span>
          </p>

          <div className="flex items-center gap-3">
            {entryMode === 'student' && selectedStudentObj && (
              <button
                onClick={() => onNavigateToReport(selectedStudentObj.id)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Preview Student Report Card &rarr;
              </button>
            )}

            <button
              onClick={handleSaveAll}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Scores</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
