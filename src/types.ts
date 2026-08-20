export interface SchoolSettings {
  name: string;
  motto: string;
  address: string;
  phone: string;
  email: string;
  logoUrl: string;
  currentSession: string;
  currentTerm: '1st Term' | '2nd Term' | '3rd Term';
  nextTermBegins: string;
}

export interface ClassItem {
  id: string;
  name: string;
  section: string;
  formTeacher: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  category: string;
  classIds: string[]; // array of class IDs where this subject applies (empty array means all classes)
}

export interface Student {
  id: string;
  admissionNo: string;
  fullName: string;
  classId: string;
  gender: 'Male' | 'Female';
  dob: string;
  guardianName: string;
  guardianPhone: string;
  avatarUrl?: string;
}

export interface AssessmentScore {
  id: string;
  studentId: string;
  subjectId: string;
  classId: string;
  term: string;
  session: string;
  ca1: number; // Max 10
  ca2: number; // Max 10
  midTerm: number; // Max 20
  exam: number; // Max 60
  teacherRemark?: string;
}

export interface AffectiveDomain {
  punctuality: number; // 1-5
  neatness: number;    // 1-5
  politeness: number;  // 1-5
  honesty: number;     // 1-5
  leadership: number;  // 1-5
  attentiveness: number; // 1-5
}

export interface StudentReportRemarks {
  studentId: string;
  term: string;
  session: string;
  classTeacherRemark: string;
  principalRemark: string;
  attendancePresent: number;
  attendanceTotal: number;
  affective: AffectiveDomain;
}

export interface GradeScaleItem {
  minScore: number;
  maxScore: number;
  grade: string;
  remark: string;
  color: string;
}

export interface CalculatedSubjectResult {
  subject: Subject;
  score?: AssessmentScore;
  total: number;
  grade: string;
  remark: string;
  classAverage: number;
  highestInClass: number;
  lowestInClass: number;
  subjectRank: number; // e.g. 1st out of 30
}

export interface FullStudentReport {
  student: Student;
  classItem: ClassItem;
  subjectsResults: CalculatedSubjectResult[];
  overallTotal: number;
  maxPossibleTotal: number;
  averagePercentage: number;
  classPosition: number;
  totalStudentsInClass: number;
  classAveragePercentage: number;
  overallGrade: string;
  remarks: StudentReportRemarks;
}
