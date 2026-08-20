import React, { useState } from 'react';
import {
  Award,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Edit,
  GraduationCap,
  Printer,
  School,
  Save,
  User,
} from 'lucide-react';
import {
  AssessmentScore,
  ClassItem,
  SchoolSettings,
  Student,
  StudentReportRemarks,
  Subject,
} from '../types';
import { generateFullStudentReport, getOrdinalSuffix } from '../utils/calculations';

interface ResultCardProps {
  settings: SchoolSettings;
  classes: ClassItem[];
  subjects: Subject[];
  students: Student[];
  scores: AssessmentScore[];
  remarksList: StudentReportRemarks[];
  selectedStudentId: string;
  onSelectStudent: (studentId: string) => void;
  onNavigateToGrades: (studentId: string) => void;
  onSaveRemarks: (updatedRemarks: StudentReportRemarks) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  settings,
  classes,
  subjects,
  students,
  scores,
  remarksList,
  selectedStudentId,
  onSelectStudent,
  onNavigateToGrades,
  onSaveRemarks,
}) => {
  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  // Calculate full report metrics
  const reportData = currentStudent
    ? generateFullStudentReport(
        currentStudent.id,
        currentStudent.classId,
        settings,
        students,
        classes,
        subjects,
        scores,
        remarksList
      )
    : null;

  // Local state for editable remarks & attendance in the UI view
  const [teacherRemarkInput, setTeacherRemarkInput] = useState<string>(
    reportData?.remarks.classTeacherRemark || ''
  );
  const [principalRemarkInput, setPrincipalRemarkInput] = useState<string>(
    reportData?.remarks.principalRemark || ''
  );
  const [daysPresent, setDaysPresent] = useState<number>(
    reportData?.remarks.attendancePresent || 62
  );
  const [totalDays, setTotalDays] = useState<number>(
    reportData?.remarks.attendanceTotal || 65
  );

  // Sync state when student changes
  React.useEffect(() => {
    if (reportData) {
      setTeacherRemarkInput(reportData.remarks.classTeacherRemark);
      setPrincipalRemarkInput(reportData.remarks.principalRemark);
      setDaysPresent(reportData.remarks.attendancePresent);
      setTotalDays(reportData.remarks.attendanceTotal);
    }
  }, [selectedStudentId]);

  if (!currentStudent || !reportData) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 text-slate-500">
        No student selected or invalid class data. Please select a student from the menu.
      </div>
    );
  }

  // Navigation Index helpers
  const currentStudentIndex = students.findIndex((s) => s.id === currentStudent.id);
  const prevStudent = students[currentStudentIndex - 1];
  const nextStudent = students[currentStudentIndex + 1];

  const handleTriggerPrint = () => {
    window.print();
  };

  const handleSaveRemarksAndAttendance = () => {
    const updated: StudentReportRemarks = {
      ...reportData.remarks,
      studentId: currentStudent.id,
      term: settings.currentTerm,
      session: settings.currentSession,
      classTeacherRemark: teacherRemarkInput,
      principalRemark: principalRemarkInput,
      attendancePresent: daysPresent,
      attendanceTotal: totalDays,
    };
    onSaveRemarks(updated);
    alert('Teacher & Principal remarks successfully saved!');
  };

  return (
    <div className="space-y-6">
      {/* On-Screen Action Toolbar (Hidden when printing) */}
      <div className="no-print bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Student Dropdown & Prev/Next */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            disabled={!prevStudent}
            onClick={() => prevStudent && onSelectStudent(prevStudent.id)}
            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 disabled:opacity-40 rounded-xl transition-colors cursor-pointer"
            title="Previous Student"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <select
            value={selectedStudentId}
            onChange={(e) => onSelectStudent(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1 md:flex-initial"
          >
            {students.map((st) => {
              const cls = classes.find((c) => c.id === st.classId);
              return (
                <option key={st.id} value={st.id}>
                  {st.fullName} ({st.admissionNo}) — {cls?.name}
                </option>
              );
            })}
          </select>

          <button
            disabled={!nextStudent}
            onClick={() => nextStudent && onSelectStudent(nextStudent.id)}
            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 disabled:opacity-40 rounded-xl transition-colors cursor-pointer"
            title="Next Student"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Print & Edit Controls */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            onClick={() => onNavigateToGrades(currentStudent.id)}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Scores</span>
          </button>

          <button
            onClick={handleSaveRemarksAndAttendance}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Remarks</span>
          </button>

          <button
            onClick={handleTriggerPrint}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report Sheet</span>
          </button>
        </div>
      </div>

      {/* ================= OFFICIAL PRINTABLE REPORT SHEET CONTAINER ================= */}
      <div className="print-page bg-white text-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-300 shadow-md max-w-4xl mx-auto space-y-6 text-xs leading-tight">
        
        {/* 1. School Letterhead Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-4">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt="School Crest"
                className="w-16 h-16 object-cover rounded-lg border border-slate-300"
              />
            ) : (
              <div className="w-16 h-16 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-2xl">
                SA
              </div>
            )}

            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-black tracking-wide text-slate-900 uppercase">
                {settings.name}
              </h1>
              <p className="text-xs text-slate-600 italic font-medium">"{settings.motto}"</p>
              <p className="text-[11px] text-slate-500">{settings.address} • Tel: {settings.phone}</p>
            </div>
          </div>

          <div className="border border-slate-900 p-2.5 rounded-lg text-center bg-slate-50 shrink-0">
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              OFFICIAL REPORT CARD
            </span>
            <span className="block text-sm font-extrabold text-indigo-950 uppercase mt-0.5">
              {settings.currentTerm}
            </span>
            <span className="block text-xs font-semibold text-slate-700">
              Session: {settings.currentSession}
            </span>
          </div>
        </div>

        {/* 2. Student Metadata Table Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-300 text-slate-800">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block">STUDENT NAME</span>
            <span className="font-extrabold text-sm text-slate-900 block mt-0.5">{reportData.student.fullName}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block">ADMISSION NO</span>
            <span className="font-mono font-bold text-xs text-slate-900 block mt-0.5">{reportData.student.admissionNo}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block">CLASS & SECTION</span>
            <span className="font-bold text-xs text-slate-900 block mt-0.5">{reportData.classItem.name} ({reportData.classItem.section})</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block">GENDER & FORM TEACHER</span>
            <span className="font-medium text-xs text-slate-900 block mt-0.5">{reportData.student.gender} • {reportData.classItem.formTeacher}</span>
          </div>
        </div>

        {/* 3. Performance Summary Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
          <div className="p-2.5 rounded-xl border border-slate-300 bg-white">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">CLASS POSITION</span>
            <span className="text-sm font-black text-indigo-900 mt-0.5 block">
              {getOrdinalSuffix(reportData.classPosition)} / {reportData.totalStudentsInClass}
            </span>
          </div>

          <div className="p-2.5 rounded-xl border border-slate-300 bg-white">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">TOTAL MARKS</span>
            <span className="text-sm font-black text-slate-900 mt-0.5 block">
              {reportData.overallTotal} / {reportData.maxPossibleTotal}
            </span>
          </div>

          <div className="p-2.5 rounded-xl border border-slate-300 bg-white">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">AVERAGE SCORE</span>
            <span className="text-sm font-black text-slate-900 mt-0.5 block">
              {reportData.averagePercentage}%
            </span>
          </div>

          <div className="p-2.5 rounded-xl border border-slate-300 bg-white">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">CLASS AVERAGE</span>
            <span className="text-sm font-bold text-slate-700 mt-0.5 block">
              {reportData.classAveragePercentage}%
            </span>
          </div>

          <div className="p-2.5 rounded-xl border border-slate-300 bg-white">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">OVERALL GRADE</span>
            <span className="text-sm font-black text-emerald-800 mt-0.5 block">
              GRADE {reportData.overallGrade}
            </span>
          </div>
        </div>

        {/* 4. Subject Scores Breakdown Table */}
        <div className="overflow-x-auto border border-slate-300 rounded-xl">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-[10px] font-bold text-slate-700 uppercase">
                <th className="py-2 px-3 border-r border-slate-300">Subject Name</th>
                <th className="py-2 px-1.5 text-center border-r border-slate-300">CA 1 (10)</th>
                <th className="py-2 px-1.5 text-center border-r border-slate-300">CA 2 (10)</th>
                <th className="py-2 px-1.5 text-center border-r border-slate-300">Mid-Term (20)</th>
                <th className="py-2 px-1.5 text-center border-r border-slate-300">Exam (60)</th>
                <th className="py-2 px-2 text-center border-r border-slate-300 bg-slate-200/60 font-black">Total (100)</th>
                <th className="py-2 px-2 text-center border-r border-slate-300">Grade</th>
                <th className="py-2 px-1.5 text-center border-r border-slate-300">Rank</th>
                <th className="py-2 px-1.5 text-center border-r border-slate-300">Class Avg</th>
                <th className="py-2 px-1.5 text-center border-r border-slate-300">Highest</th>
                <th className="py-2 px-2">Subject Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-900 font-medium">
              {reportData.subjectsResults.map((res) => {
                const ca1 = res.score?.ca1 || 0;
                const ca2 = res.score?.ca2 || 0;
                const mid = res.score?.midTerm || 0;
                const exam = res.score?.exam || 0;

                return (
                  <tr key={res.subject.id} className="hover:bg-slate-50">
                    <td className="py-1.5 px-3 border-r border-slate-200 font-bold">
                      {res.subject.name}
                    </td>
                    <td className="py-1.5 px-1.5 text-center border-r border-slate-200">{ca1}</td>
                    <td className="py-1.5 px-1.5 text-center border-r border-slate-200">{ca2}</td>
                    <td className="py-1.5 px-1.5 text-center border-r border-slate-200">{mid}</td>
                    <td className="py-1.5 px-1.5 text-center border-r border-slate-200">{exam}</td>
                    <td className="py-1.5 px-2 text-center border-r border-slate-200 bg-slate-50 font-black text-xs">
                      {res.total}
                    </td>
                    <td className="py-1.5 px-2 text-center border-r border-slate-200 font-bold">
                      {res.grade}
                    </td>
                    <td className="py-1.5 px-1.5 text-center border-r border-slate-200 text-[10px]">
                      {getOrdinalSuffix(res.subjectRank)}
                    </td>
                    <td className="py-1.5 px-1.5 text-center border-r border-slate-200 text-[10px] text-slate-600">
                      {res.classAverage}
                    </td>
                    <td className="py-1.5 px-1.5 text-center border-r border-slate-200 text-[10px] text-slate-600">
                      {res.highestInClass}
                    </td>
                    <td className="py-1.5 px-2 text-[10px] text-slate-700 italic">
                      {res.remark}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 5. Affective & Behavioral Domain + Attendance Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Affective Ratings */}
          <div className="border border-slate-300 rounded-xl p-3 bg-slate-50/50">
            <h4 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
              AFFECTIVE & BEHAVIORAL DOMAIN (5-POINT SCALE)
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
              <div className="flex justify-between border-b border-slate-200/60 py-0.5">
                <span>Punctuality:</span>
                <span className="font-bold">{reportData.remarks.affective.punctuality} / 5</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 py-0.5">
                <span>Neatness:</span>
                <span className="font-bold">{reportData.remarks.affective.neatness} / 5</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 py-0.5">
                <span>Politeness & Respect:</span>
                <span className="font-bold">{reportData.remarks.affective.politeness} / 5</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 py-0.5">
                <span>Honesty & Integrity:</span>
                <span className="font-bold">{reportData.remarks.affective.honesty} / 5</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 py-0.5">
                <span>Leadership Skills:</span>
                <span className="font-bold">{reportData.remarks.affective.leadership} / 5</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 py-0.5">
                <span>Attentiveness:</span>
                <span className="font-bold">{reportData.remarks.affective.attentiveness} / 5</span>
              </div>
            </div>
          </div>

          {/* Attendance & Grading Key */}
          <div className="border border-slate-300 rounded-xl p-3 bg-slate-50/50 flex flex-col justify-between space-y-2">
            <div>
              <h4 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 border-b border-slate-200 pb-1">
                ATTENDANCE RECORD
              </h4>
              <div className="flex items-center gap-4 text-[11px] no-print">
                <label className="flex items-center gap-1 font-medium">
                  <span>Days Present:</span>
                  <input
                    type="number"
                    value={daysPresent}
                    onChange={(e) => setDaysPresent(Number(e.target.value))}
                    className="w-14 px-1.5 py-0.5 bg-white border border-slate-300 rounded text-center font-bold"
                  />
                </label>
                <label className="flex items-center gap-1 font-medium">
                  <span>Total Days:</span>
                  <input
                    type="number"
                    value={totalDays}
                    onChange={(e) => setTotalDays(Number(e.target.value))}
                    className="w-14 px-1.5 py-0.5 bg-white border border-slate-300 rounded text-center font-bold"
                  />
                </label>
              </div>

              <div className="print-only text-[11px] font-semibold text-slate-800">
                Present {daysPresent} out of {totalDays} school days
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1 border-b border-slate-200 pb-0.5">
                GRADING SCALE KEY
              </h4>
              <p className="text-[10px] text-slate-600 leading-tight">
                <strong>70-100:</strong> A (Excellent) • <strong>60-69:</strong> B (Very Good) • <strong>50-59:</strong> C (Good) • <strong>45-49:</strong> D (Pass) • <strong>40-44:</strong> E (Fair) • <strong>0-39:</strong> F (Fail)
              </p>
            </div>
          </div>
        </div>

        {/* 6. Remarks & Signatures */}
        <div className="border border-slate-300 rounded-xl p-3.5 space-y-3 bg-white">
          <div>
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
              CLASS TEACHER'S REMARK ({reportData.classItem.formTeacher}):
            </label>
            <input
              type="text"
              value={teacherRemarkInput}
              onChange={(e) => setTeacherRemarkInput(e.target.value)}
              className="no-print w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
            />
            <p className="print-only text-xs text-slate-900 font-semibold italic border-b border-slate-300 pb-1">
              "{teacherRemarkInput}"
            </p>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
              PRINCIPAL'S REMARK:
            </label>
            <input
              type="text"
              value={principalRemarkInput}
              onChange={(e) => setPrincipalRemarkInput(e.target.value)}
              className="no-print w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
            />
            <p className="print-only text-xs text-slate-900 font-semibold italic border-b border-slate-300 pb-1">
              "{principalRemarkInput}"
            </p>
          </div>

          <div className="pt-4 flex items-end justify-between text-[11px] font-semibold text-slate-800">
            <div>
              <span>Next Term Resumes: </span>
              <span className="font-extrabold text-indigo-950">{settings.nextTermBegins}</span>
            </div>

            <div className="text-center">
              <div className="w-32 border-b border-slate-900 mb-1"></div>
              <span className="text-[10px] text-slate-500 uppercase block font-bold">Principal Signature & Stamp</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
