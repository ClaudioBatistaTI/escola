export interface SchoolClass {
  id: string;
  name: string; // e.g. "3º Ano A"
  year: number; // e.g. 2024
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  specialty: string; // e.g. "Matemática"
}

export interface Student {
  id: string;
  name: string;
  email: string;
  age: number;
  
  // Foreign Key
  classId: string;
  // Display property (Resolved via Join)
  className?: string; 

  enrollmentDate: string;
  status: 'Ativo' | 'Inativo' | 'Pendente';
  notes: string;
  avatarUrl?: string;
}

export interface Course {
  id: string;
  name: string;
  
  // Foreign Key
  teacherId: string;
  // Display property (Resolved via Join)
  teacherName?: string;

  schedule: string;
}

export interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  value: number; // 0-100
  date: string;
}

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  averageGrade: number;
  totalCourses: number;
  totalTeachers: number;
}