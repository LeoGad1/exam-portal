import {
  AssessmentScore,
  ClassItem,
  SchoolSettings,
  Student,
  StudentReportRemarks,
  Subject,
} from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'exam_portal_settings_v1',
  CLASSES: 'exam_portal_classes_v1',
  SUBJECTS: 'exam_portal_subjects_v1',
  STUDENTS: 'exam_portal_students_v1',
  SCORES: 'exam_portal_scores_v1',
  REMARKS: 'exam_portal_remarks_v1',
};

// Default Initial School Settings
export const INITIAL_SETTINGS: SchoolSettings = {
  name: 'ST. AUGUSTINE HIGH SCHOOL',
  motto: 'Knowledge, Integrity & Excellence',
  address: '15 Academy Boulevard, Victoria Island, Lagos, Nigeria',
  phone: '+234 803 123 4567',
  email: 'info@staugustineschool.edu',
  logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
  currentSession: '2025/2026',
  currentTerm: '1st Term',
  nextTermBegins: '2026-09-14',
};

// Default Initial Classes
export const INITIAL_CLASSES: ClassItem[] = [
  { id: 'cls-1', name: 'JSS 1 Alpha', section: 'Junior Secondary', formTeacher: 'Mr. David Okafor' },
  { id: 'cls-2', name: 'JSS 2 Gold', section: 'Junior Secondary', formTeacher: 'Mrs. Victoria Adeleke' },
  { id: 'cls-3', name: 'SS 2 Science', section: 'Senior Secondary', formTeacher: 'Dr. Samuel Mensah' },
];

// Default Initial Subjects
export const INITIAL_SUBJECTS: Subject[] = [
  { id: 'sub-1', code: 'MTH101', name: 'Mathematics', category: 'Core', classIds: [] },
  { id: 'sub-2', code: 'ENG101', name: 'English Language', category: 'Core', classIds: [] },
  { id: 'sub-3', code: 'BSC101', name: 'Basic Science', category: 'Science', classIds: ['cls-1', 'cls-2'] },
  { id: 'sub-4', code: 'PHY201', name: 'Physics', category: 'Science', classIds: ['cls-3'] },
  { id: 'sub-5', code: 'CHM201', name: 'Chemistry', category: 'Science', classIds: ['cls-3'] },
  { id: 'sub-6', code: 'ICT101', name: 'Computer Studies', category: 'Vocational', classIds: [] },
  { id: 'sub-7', code: 'CIV101', name: 'Civic Education', category: 'Social Science', classIds: [] },
  { id: 'sub-8', code: 'AGRIC', name: 'Agricultural Science', category: 'Vocational', classIds: [] },
];

// Default Initial Students
export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    admissionNo: 'STU/2025/001',
    fullName: 'Emanuel Chimamanda',
    classId: 'cls-1',
    gender: 'Male',
    dob: '2013-05-14',
    guardianName: 'Dr. Peter Chimamanda',
    guardianPhone: '08021112233',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'std-2',
    admissionNo: 'STU/2025/002',
    fullName: 'Aisha Aisha Abubakar',
    classId: 'cls-1',
    gender: 'Female',
    dob: '2013-08-22',
    guardianName: 'Alhaji Usman Abubakar',
    guardianPhone: '08033334444',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'std-3',
    admissionNo: 'STU/2025/003',
    fullName: 'Blessing Chioma Nnamdi',
    classId: 'cls-1',
    gender: 'Female',
    dob: '2013-11-03',
    guardianName: 'Mrs. Grace Nnamdi',
    guardianPhone: '08055556666',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'std-4',
    admissionNo: 'STU/2025/004',
    fullName: 'Tunde Oluwaseun Davies',
    classId: 'cls-1',
    gender: 'Male',
    dob: '2013-02-17',
    guardianName: 'Engr. Michael Davies',
    guardianPhone: '08077778888',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'std-5',
    admissionNo: 'STU/2025/005',
    fullName: 'Kofi Mensah Boateng',
    classId: 'cls-2',
    gender: 'Male',
    dob: '2012-07-09',
    guardianName: 'Mr. Isaac Boateng',
    guardianPhone: '08099990000',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'std-6',
    admissionNo: 'STU/2025/006',
    fullName: 'Zainab Fatima Danjuma',
    classId: 'cls-3',
    gender: 'Female',
    dob: '2010-03-30',
    guardianName: 'Dr. Danjuma Bello',
    guardianPhone: '08011223344',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  },
];

// Pre-populated Sample Assessment Scores
export const INITIAL_SCORES: AssessmentScore[] = [
  // Student 1 (Emanuel) - JSS 1 Alpha
  { id: 'sc-1', studentId: 'std-1', subjectId: 'sub-1', classId: 'cls-1', session: '2025/2026', term: '1st Term', ca1: 9, ca2: 8, midTerm: 18, exam: 52 }, // 87 (A)
  { id: 'sc-2', studentId: 'std-1', subjectId: 'sub-2', classId: 'cls-1', session: '2025/2026', term: '1st Term', ca1: 8, ca2: 9, midTerm: 17, exam: 48 }, // 82 (A)
  { id: 'sc-3', studentId: 'std-1', subjectId: 'sub-3', classId: 'cls-1', session: '2025/2026', term: '1st Term', ca1: 7, ca2: 8, midTerm: 15, exam: 45 }, // 75 (A)
  { id: 'sc-4', studentId: 'std-1', subjectId: 'sub-6', classId: 'cls-1', session: '2025/2026', term: '1st Term', ca1: 10, ca2: 9, midTerm: 19, exam: 55 }, // 93 (A)
  { id: 'sc-5', studentId: 'std-1', subjectId: 'sub-7', classId: 'cls-1', session: '2025/2026', term: '1st Term', ca1: 8, ca2: 7, midTerm: 16, exam: 44 }, // 75 (A)
  { id: 'sc-6', studentId: 'std-1', subjectId: 'sub-8', classId: 'cls-1', session: '2025/2026', term: '1st Term', ca1: 9, ca2: 8, midTerm: 17, exam: 46 }, // 80 (A)

  // Student 2 (Aisha) - JSS 1 Alpha
  { id: 'sc-7', studentId: 'std-2', subjectId: 'sub-1', classId: 'cls-1', session: '2025/2026', term: '1st Term', ca1: 8, ca2: 7, midTerm: 15, exam: 42 }, // 72 (A)
  { id: 'sc-8', studentId: 'std-2', subjectId: 'sub-2', classId: 'cls-1', session: '2025/2026', term: '1st Term', ca1: 9, ca2: 9, midTerm: 18, exam: 50 }, // 86 (A)
  { id: 'sc-9', studentId: 'std-2', subjectId: 'sub-3', classId: 'cls-1', session: '2025/2026', term: '1st Term', ca1: 8, ca2: 8, midTerm: 14, exam: 40 }, // 70 (A)
  { id: 'sc-10', studentId: 'std-2', subjectId: 'sub-6', classId: 'cls-1', session: '2025/2026', term: '1st Term', ca1: 9, ca2: 8, midTerm: 16, exam: 46 }, // 79 (A)

  // Student 3 (Blessing) - JSS 1 Alpha
  { id: 'sc-11', studentId: 'std-3', subjectId: 'sub-1', classId: 'cls-1', session: '2025/2026', term: '1st Term', ca1: 6, ca2: 7, midTerm: 12, exam: 38 }, // 63 (B)
  { id: 'sc-12', studentId: 'std-3', subjectId: 'sub-2', classId: 'cls-1', session: '2025/2026', term: '1st Term', ca1: 7, ca2: 8, midTerm: 14, exam: 42 }, // 71 (A)
  { id: 'sc-13', studentId: 'std-3', subjectId: 'sub-3', classId: 'cls-1', session: '2025/2026', term: '1st Term', ca1: 6, ca2: 5, midTerm: 11, exam: 35 }, // 57 (C)

  // Student 4 (Tunde) - JSS 1 Alpha
  { id: 'sc-14', studentId: 'std-4', subjectId: 'sub-1', classId: 'cls-1', session: '2025/2026', term: '1st Term', ca1: 5, ca2: 6, midTerm: 10, exam: 30 }, // 51 (C)
  { id: 'sc-15', studentId: 'std-4', subjectId: 'sub-2', classId: 'cls-1', session: '2025/2026', term: '1st Term', ca1: 6, ca2: 6, midTerm: 12, exam: 34 }, // 58 (C)

  // Student 6 (Zainab) - SS 2 Science
  { id: 'sc-16', studentId: 'std-6', subjectId: 'sub-1', classId: 'cls-3', session: '2025/2026', term: '1st Term', ca1: 10, ca2: 9, midTerm: 19, exam: 54 }, // 92 (A)
  { id: 'sc-17', studentId: 'std-6', subjectId: 'sub-4', classId: 'cls-3', session: '2025/2026', term: '1st Term', ca1: 9, ca2: 9, midTerm: 18, exam: 51 }, // 87 (A)
  { id: 'sc-18', studentId: 'std-6', subjectId: 'sub-5', classId: 'cls-3', session: '2025/2026', term: '1st Term', ca1: 9, ca2: 8, midTerm: 17, exam: 50 }, // 84 (A)
];

export const INITIAL_REMARKS: StudentReportRemarks[] = [
  {
    studentId: 'std-1',
    session: '2025/2026',
    term: '1st Term',
    classTeacherRemark: 'Emanuel is a brilliant and highly focused student. He showed exemplary performance across all subjects.',
    principalRemark: 'An exceptional result. Excellent conduct and discipline. Keep it up!',
    attendancePresent: 64,
    attendanceTotal: 65,
    affective: {
      punctuality: 5,
      neatness: 5,
      politeness: 5,
      honesty: 5,
      leadership: 5,
      attentiveness: 5,
    },
  },
];

// LocalStorage Persistence Helpers
export function loadSettings(): SchoolSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : INITIAL_SETTINGS;
  } catch (e) {
    console.error('Failed to load settings:', e);
    return INITIAL_SETTINGS;
  }
}

export function saveSettings(settings: SchoolSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function loadClasses(): ClassItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CLASSES);
    return data ? JSON.parse(data) : INITIAL_CLASSES;
  } catch (e) {
    return INITIAL_CLASSES;
  }
}

export function saveClasses(classes: ClassItem[]): void {
  localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
}

export function loadSubjects(): Subject[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    return data ? JSON.parse(data) : INITIAL_SUBJECTS;
  } catch (e) {
    return INITIAL_SUBJECTS;
  }
}

export function saveSubjects(subjects: Subject[]): void {
  localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
}

export function loadStudents(): Student[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return data ? JSON.parse(data) : INITIAL_STUDENTS;
  } catch (e) {
    return INITIAL_STUDENTS;
  }
}

export function saveStudents(students: Student[]): void {
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
}

export function loadScores(): AssessmentScore[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SCORES);
    return data ? JSON.parse(data) : INITIAL_SCORES;
  } catch (e) {
    return INITIAL_SCORES;
  }
}

export function saveScores(scores: AssessmentScore[]): void {
  localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(scores));
}

export function loadRemarks(): StudentReportRemarks[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REMARKS);
    return data ? JSON.parse(data) : INITIAL_REMARKS;
  } catch (e) {
    return INITIAL_REMARKS;
  }
}

export function saveRemarks(remarks: StudentReportRemarks[]): void {
  localStorage.setItem(STORAGE_KEYS.REMARKS, JSON.stringify(remarks));
}

export function resetAllDataToDefault(): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(INITIAL_CLASSES));
  localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(INITIAL_SUBJECTS));
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
  localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(INITIAL_SCORES));
  localStorage.setItem(STORAGE_KEYS.REMARKS, JSON.stringify(INITIAL_REMARKS));
}
