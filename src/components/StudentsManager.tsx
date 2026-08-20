import React, { useState } from 'react';
import {
  Edit2,
  FileSpreadsheet,
  Plus,
  Printer,
  Search,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react';
import { ClassItem, Student } from '../types';

interface StudentsManagerProps {
  students: Student[];
  classes: ClassItem[];
  selectedClassFilter?: string;
  onAddStudent: (newStudent: Omit<Student, 'id'>) => void;
  onUpdateStudent: (updatedStudent: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onSelectStudentForGrades: (studentId: string) => void;
  onSelectStudentForReport: (studentId: string) => void;
}

export const StudentsManager: React.FC<StudentsManagerProps> = ({
  students,
  classes,
  selectedClassFilter = 'All',
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onSelectStudentForGrades,
  onSelectStudentForReport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState<string>(selectedClassFilter);
  const [genderFilter, setGenderFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form State
  const [admissionNo, setAdmissionNo] = useState('');
  const [fullName, setFullName] = useState('');
  const [classId, setClassId] = useState(classes[0]?.id || '');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [dob, setDob] = useState('2013-01-01');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.guardianName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'All' || s.classId === classFilter;
    const matchesGender = genderFilter === 'All' || s.gender === genderFilter;
    return matchesSearch && matchesClass && matchesGender;
  });

  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setAdmissionNo(`STU/${new Date().getFullYear()}/${String(students.length + 1).padStart(3, '0')}`);
    setFullName('');
    setClassId(classFilter !== 'All' ? classFilter : classes[0]?.id || '');
    setGender('Male');
    setDob('2013-01-01');
    setGuardianName('');
    setGuardianPhone('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (student: Student) => {
    setEditingStudent(student);
    setAdmissionNo(student.admissionNo);
    setFullName(student.fullName);
    setClassId(student.classId);
    setGender(student.gender);
    setDob(student.dob || '2013-01-01');
    setGuardianName(student.guardianName || '');
    setGuardianPhone(student.guardianPhone || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !admissionNo.trim() || !classId) return;

    const defaultAvatars = [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
    ];
    const avatarUrl =
      editingStudent?.avatarUrl ||
      defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

    const payload = {
      admissionNo: admissionNo.trim(),
      fullName: fullName.trim(),
      classId,
      gender,
      dob,
      guardianName: guardianName.trim(),
      guardianPhone: guardianPhone.trim(),
      avatarUrl,
    };

    if (editingStudent) {
      onUpdateStudent({
        ...editingStudent,
        ...payload,
      });
    } else {
      onAddStudent(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Student Roster & Directory</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Register students, manage admission details, and access individual report cards.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Student</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search student by name, admission number, or guardian..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Class Selector */}
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Classes ({students.length})</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Gender Selector */}
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Admission No</th>
                <th className="py-3.5 px-4">Class</th>
                <th className="py-3.5 px-4">Gender</th>
                <th className="py-3.5 px-4">Guardian Info</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
              {filteredStudents.map((std) => {
                const clsObj = classes.find((c) => c.id === std.classId);

                return (
                  <tr key={std.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={std.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                          alt={std.fullName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">
                            {std.fullName}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
                      {std.admissionNo}
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {clsObj?.name || 'Unassigned'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-xs">
                      {std.gender}
                    </td>

                    <td className="py-3 px-4 text-xs">
                      <div className="text-slate-800 dark:text-slate-200 font-medium">
                        {std.guardianName || 'N/A'}
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                        {std.guardianPhone || ''}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => onSelectStudentForGrades(std.id)}
                          className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-medium rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-1 cursor-pointer"
                          title="Input Scores for student"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Grades</span>
                        </button>

                        <button
                          onClick={() => onSelectStudentForReport(std.id)}
                          className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-500 transition-colors flex items-center gap-1 cursor-pointer"
                          title="Print Student Report Card"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Report</span>
                        </button>

                        <button
                          onClick={() => handleOpenEditModal(std)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Edit Student"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete student ${std.fullName}?`)) {
                              onDeleteStudent(std.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition-colors cursor-pointer"
                          title="Delete Student"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="p-10 text-center text-slate-500 text-sm">
            No students found for the current search and filter selections.
          </div>
        )}
      </div>

      {/* Add / Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingStudent ? 'Edit Student Details' : 'Register New Student'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Admission Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. STU/2025/001"
                    value={admissionNo}
                    onChange={(e) => setAdmissionNo(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Class *
                  </label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.section})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Emanuel Chimamanda"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Guardian / Parent Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Peter Chimamanda"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Guardian Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 08021112233"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {editingStudent ? 'Save Changes' : 'Register Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
