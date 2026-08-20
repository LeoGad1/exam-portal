import {
  AssessmentScore,
  CalculatedSubjectResult,
  ClassItem,
  FullStudentReport,
  GradeScaleItem,
  SchoolSettings,
  Student,
  StudentReportRemarks,
  Subject,
} from '../types';

export const DEFAULT_GRADE_SCALE: GradeScaleItem[] = [
  { minScore: 70, maxScore: 100, grade: 'A', remark: 'Excellent', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
  { minScore: 60, maxScore: 69, grade: 'B', remark: 'Very Good', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' },
  { minScore: 50, maxScore: 59, grade: 'C', remark: 'Good', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300' },
  { minScore: 45, maxScore: 49, grade: 'D', remark: 'Pass', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
  { minScore: 40, maxScore: 44, grade: 'E', remark: 'Fair', color: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300' },
  { minScore: 0, maxScore: 39, grade: 'F', remark: 'Fail', color: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' },
];

export function getGradeAndRemark(totalScore: number): { grade: string; remark: string; color: string } {
  const rounded = Math.round(totalScore);
  const match = DEFAULT_GRADE_SCALE.find(
    (scale) => rounded >= scale.minScore && rounded <= scale.maxScore
  );
  if (match) {
    return { grade: match.grade, remark: match.remark, color: match.color };
  }
  return { grade: 'F', remark: 'Fail', color: 'bg-rose-100 text-rose-800' };
}

export function calculateTotalScore(ca1: number = 0, ca2: number = 0, midTerm: number = 0, exam: number = 0): number {
  const validCa1 = Math.min(10, Math.max(0, Number(ca1) || 0));
  const validCa2 = Math.min(10, Math.max(0, Number(ca2) || 0));
  const validMid = Math.min(20, Math.max(0, Number(midTerm) || 0));
  const validExam = Math.min(60, Math.max(0, Number(exam) || 0));
  return validCa1 + validCa2 + validMid + validExam;
}

export function getOrdinalSuffix(num: number): string {
  if (num <= 0) return '-';
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) {
    return num + 'st';
  }
  if (j === 2 && k !== 12) {
    return num + 'nd';
  }
  if (j === 3 && k !== 13) {
    return num + 'rd';
  }
  return num + 'th';
}

export function generateDefaultRemarks(
  averagePercentage: number,
  studentName: string
): { teacherRemark: string; principalRemark: string } {
  const firstName = studentName.split(' ')[0] || 'Student';
  if (averagePercentage >= 80) {
    return {
      teacherRemark: `${firstName} has demonstrated outstanding academic brilliance this term. Keep shining!`,
      principalRemark: `An exceptional performance. Promising future ahead. Keep up the high standard.`,
    };
  } else if (averagePercentage >= 70) {
    return {
      teacherRemark: `An excellent result! ${firstName} shows great diligence and commitment to studies.`,
      principalRemark: `Very impressive academic output. Highly commendable effort.`,
    };
  } else if (averagePercentage >= 60) {
    return {
      teacherRemark: `${firstName} performed very well this term. Focused and hardworking student.`,
      principalRemark: `Good result. With consistent effort, higher positions can be attained.`,
    };
  } else if (averagePercentage >= 50) {
    return {
      teacherRemark: `A fair academic performance. ${firstName} can achieve better results with more practice.`,
      principalRemark: `Satisfactory effort, but there is room for significant improvement next term.`,
    };
  } else if (averagePercentage >= 40) {
    return {
      teacherRemark: `${firstName} needs to pay closer attention in class and devote more time to home studies.`,
      principalRemark: `Pass result. Needs extra academic coaching and close monitoring.`,
    };
  } else {
    return {
      teacherRemark: `Unsatisfactory performance. ${firstName} requires urgent academic assistance and study discipline.`,
      principalRemark: `Poor result. Parents are requested to consult with the class teacher immediately.`,
    };
  }
}

/**
  Generate comprehensive report data for a student in a specific class, term, and session.
 */
export function generateFullStudentReport(
  studentId: string,
  classId: string,
  settings: SchoolSettings,
  allStudents: Student[],
  allClasses: ClassItem[],
  allSubjects: Subject[],
  allScores: AssessmentScore[],
  allRemarks: StudentReportRemarks[]
): FullStudentReport | null {
  const student = allStudents.find((s) => s.id === studentId);
  const classItem = allClasses.find((c) => c.id === classId);

  if (!student || !classItem) return null;

  // Filter subjects for this class
  const classSubjects = allSubjects.filter(
    (subj) => subj.classIds.length === 0 || subj.classIds.includes(classId)
  );

  // Filter all students in this class
  const classStudents = allStudents.filter((s) => s.classId === classId);

  // Map of student totals across subjects in this class to compute class positions
  const studentTotalsMap = new Map<string, { studentId: string; totalScore: number; subjectCount: number; percentage: number }>();

  classStudents.forEach((st) => {
    let studentSum = 0;
    let count = 0;
    classSubjects.forEach((sub) => {
      const score = allScores.find(
        (sc) =>
          sc.studentId === st.id &&
          sc.subjectId === sub.id &&
          sc.term === settings.currentTerm &&
          sc.session === settings.currentSession
      );
      if (score) {
        studentSum += calculateTotalScore(score.ca1, score.ca2, score.midTerm, score.exam);
        count++;
      }
    });
    const avg = classSubjects.length > 0 ? studentSum / classSubjects.length : 0;
    studentTotalsMap.set(st.id, {
      studentId: st.id,
      totalScore: studentSum,
      subjectCount: classSubjects.length,
      percentage: avg,
    });
  });

  // Calculate Class Position (Rank)
  const sortedStudents = Array.from(studentTotalsMap.values()).sort(
    (a, b) => b.totalScore - a.totalScore
  );

  let classPosition = 1;
  const targetStudentRank = sortedStudents.findIndex((st) => st.studentId === studentId);
  if (targetStudentRank !== -1) {
    classPosition = targetStudentRank + 1;
  }

  // Calculate class overall average percentage
  const totalClassPercentageSum = sortedStudents.reduce((sum, item) => sum + item.percentage, 0);
  const classAveragePercentage = sortedStudents.length > 0 ? totalClassPercentageSum / sortedStudents.length : 0;

  // Process Subject Level Statistics & Calculations
  const subjectsResults: CalculatedSubjectResult[] = classSubjects.map((subject) => {
    // Target student's score for this subject
    const score = allScores.find(
      (sc) =>
        sc.studentId === studentId &&
        sc.subjectId === subject.id &&
        sc.term === settings.currentTerm &&
        sc.session === settings.currentSession
    );

    const total = score ? calculateTotalScore(score.ca1, score.ca2, score.midTerm, score.exam) : 0;
    const { grade, remark } = getGradeAndRemark(total);

    // Compute Subject Statistics across all class students
    const subjectScoresInClass: number[] = [];
    classStudents.forEach((st) => {
      const stScore = allScores.find(
        (sc) =>
          sc.studentId === st.id &&
          sc.subjectId === subject.id &&
          sc.term === settings.currentTerm &&
          sc.session === settings.currentSession
      );
      if (stScore) {
        subjectScoresInClass.push(calculateTotalScore(stScore.ca1, stScore.ca2, stScore.midTerm, stScore.exam));
      } else {
        subjectScoresInClass.push(0);
      }
    });

    const highestInClass = subjectScoresInClass.length > 0 ? Math.max(...subjectScoresInClass) : 0;
    const lowestInClass = subjectScoresInClass.length > 0 ? Math.min(...subjectScoresInClass) : 0;
    const sumInClass = subjectScoresInClass.reduce((a, b) => a + b, 0);
    const classAverage = subjectScoresInClass.length > 0 ? sumInClass / subjectScoresInClass.length : 0;

    // Calculate subject rank for this student
    const sortedSubjectScores = [...subjectScoresInClass].sort((a, b) => b - a);
    const subjectRankIndex = sortedSubjectScores.indexOf(total);
    const subjectRank = subjectRankIndex !== -1 ? subjectRankIndex + 1 : classStudents.length;

    return {
      subject,
      score,
      total,
      grade,
      remark,
      classAverage: Math.round(classAverage * 10) / 10,
      highestInClass,
      lowestInClass,
      subjectRank,
    };
  });

  // Calculate Overall Student Performance
  const overallTotal = subjectsResults.reduce((sum, res) => sum + res.total, 0);
  const maxPossibleTotal = classSubjects.length * 100;
  const averagePercentage = classSubjects.length > 0 ? overallTotal / classSubjects.length : 0;
  const { grade: overallGrade } = getGradeAndRemark(averagePercentage);

  // Fetch or construct Remarks
  const existingRemark = allRemarks.find(
    (r) =>
      r.studentId === studentId &&
      r.term === settings.currentTerm &&
      r.session === settings.currentSession
  );

  const defaultRemarks = generateDefaultRemarks(averagePercentage, student.fullName);

  const remarks: StudentReportRemarks = existingRemark || {
    studentId,
    term: settings.currentTerm,
    session: settings.currentSession,
    classTeacherRemark: defaultRemarks.teacherRemark,
    principalRemark: defaultRemarks.principalRemark,
    attendancePresent: 62,
    attendanceTotal: 65,
    affective: {
      punctuality: averagePercentage > 70 ? 5 : 4,
      neatness: 5,
      politeness: 5,
      honesty: 5,
      leadership: averagePercentage > 75 ? 5 : 4,
      attentiveness: averagePercentage > 60 ? 4 : 3,
    },
  };

  return {
    student,
    classItem,
    subjectsResults,
    overallTotal,
    maxPossibleTotal,
    averagePercentage: Math.round(averagePercentage * 10) / 10,
    classPosition,
    totalStudentsInClass: classStudents.length,
    classAveragePercentage: Math.round(classAveragePercentage * 10) / 10,
    overallGrade,
    remarks,
  };
}
