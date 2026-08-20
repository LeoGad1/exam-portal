import React, { useState } from 'react';
import { Printer, School, Users } from 'lucide-react';
import {
  AssessmentScore,
  ClassItem,
  SchoolSettings,
  Student,
  StudentReportRemarks,
  Subject,
} from '../types';
import { generateFullStudentReport, getOrdinalSuffix } from '../utils/calculations';

interface BulkResultsPrintProps {
  settings: SchoolSettings;
  classes: ClassItem[];
  subjects: Subject[];
  students: Student[];
  scores: AssessmentScore[];
  remarksList: StudentReportRemarks[];
}

export const BulkResultsPrint: React.FC<BulkResultsPrintProps> = ({
  settings,
  classes,
  subjects,
  students,
  scores,
  remarksList,
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');

  const classStudents = students.filter((s) => s.classId === selectedClassId);
  const selectedClass = classes.find((c) => c.id === selectedClassId);

  const handlePrintAll = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Control Bar (Hidden during print) */}
      <div className="no-print bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Class-Wide Batch Report Printing</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Print report cards for all enrolled students in a class sequentially.
          </p>
        </div>

        <div className="flex items-center gap-3 self-stretch md:self-auto">
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({students.filter((st) => st.classId === c.id).length} Students)
              </option>
            ))}
          </select>

          <button
            disabled={classStudents.length === 0}
            onClick={handlePrintAll}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Printer className="w-4 h-4" />
            <span>Print All ({classStudents.length}) Reports</span>
          </button>
        </div>
      </div>

      {classStudents.length === 0 ? (
        <div className="no-print bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 text-slate-500">
          No students are currently enrolled in {selectedClass?.name || 'this class'}.
        </div>
      ) : (
        /* Sequential Student Report Cards for Batch Print */
        <div className="space-y-8">
          {classStudents.map((student) => {
            const reportData = generateFullStudentReport(
              student.id,
              student.classId,
              settings,
              students,
              classes,
              subjects,
              scores,
              remarksList
            );

            if (!reportData) return null;

            return (
              <div
                key={student.id}
                className="print-page bg-white text-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-300 shadow-sm space-y-5 text-xs leading-tight"
              >
                {/* Header */}
                <div className="border-b-2 border-slate-900 pb-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {settings.logoUrl && (
                      <img
                        src={settings.logoUrl}
                        alt="Logo"
                        className="w-12 h-12 object-cover rounded-md border border-slate-300"
                      />
                    )}
                    <div>
                      <h1 className="text-lg font-black tracking-wide uppercase text-slate-900">
                        {settings.name}
                      </h1>
                      <p className="text-[10px] text-slate-500 italic">"{settings.motto}"</p>
                    </div>
                  </div>

                  <div className="border border-slate-900 px-2 py-1 rounded text-center bg-slate-50">
                    <span className="block text-[9px] font-bold text-slate-500 uppercase">REPORT CARD</span>
                    <span className="block text-xs font-extrabold text-indigo-950 uppercase">{settings.currentTerm}</span>
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-300">
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">STUDENT</span>
                    <span className="font-extrabold text-xs block">{reportData.student.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">ADM NO</span>
                    <span className="font-mono font-bold text-xs block">{reportData.student.admissionNo}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">CLASS</span>
                    <span className="font-bold text-xs block">{reportData.classItem.name}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">POSITION</span>
                    <span className="font-black text-xs text-indigo-900 block">
                      {getOrdinalSuffix(reportData.classPosition)} / {reportData.totalStudentsInClass}
                    </span>
                  </div>
                </div>

                {/* Score Table */}
                <table className="w-full text-left border-collapse text-[10px] border border-slate-300">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 font-bold uppercase">
                      <th className="py-1.5 px-2 border-r border-slate-300">Subject</th>
                      <th className="py-1.5 px-1 text-center border-r border-slate-300">CA1 (10)</th>
                      <th className="py-1.5 px-1 text-center border-r border-slate-300">CA2 (10)</th>
                      <th className="py-1.5 px-1 text-center border-r border-slate-300">Mid (20)</th>
                      <th className="py-1.5 px-1 text-center border-r border-slate-300">Exam (60)</th>
                      <th className="py-1.5 px-1.5 text-center border-r border-slate-300 bg-slate-200/60 font-black">Total</th>
                      <th className="py-1.5 px-1 text-center border-r border-slate-300">Grade</th>
                      <th className="py-1.5 px-2">Remark</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {reportData.subjectsResults.map((res) => (
                      <tr key={res.subject.id}>
                        <td className="py-1 px-2 border-r border-slate-200 font-bold">{res.subject.name}</td>
                        <td className="py-1 px-1 text-center border-r border-slate-200">{res.score?.ca1 || 0}</td>
                        <td className="py-1 px-1 text-center border-r border-slate-200">{res.score?.ca2 || 0}</td>
                        <td className="py-1 px-1 text-center border-r border-slate-200">{res.score?.midTerm || 0}</td>
                        <td className="py-1 px-1 text-center border-r border-slate-200">{res.score?.exam || 0}</td>
                        <td className="py-1 px-1.5 text-center border-r border-slate-200 font-black">{res.total}</td>
                        <td className="py-1 px-1 text-center border-r border-slate-200 font-bold">{res.grade}</td>
                        <td className="py-1 px-2 italic text-[9px] text-slate-700">{res.remark}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Summary & Remarks */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="border border-slate-300 p-2 rounded">
                    <span className="text-[9px] font-bold uppercase block text-slate-500">CLASS TEACHER REMARK</span>
                    <p className="text-[10px] italic font-medium mt-0.5">"{reportData.remarks.classTeacherRemark}"</p>
                  </div>

                  <div className="border border-slate-300 p-2 rounded">
                    <span className="text-[9px] font-bold uppercase block text-slate-500">PRINCIPAL REMARK</span>
                    <p className="text-[10px] italic font-medium mt-0.5">"{reportData.remarks.principalRemark}"</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
