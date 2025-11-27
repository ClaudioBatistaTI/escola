import { Student, Course, Grade, DashboardStats, Teacher, SchoolClass } from '../types';

// --- MOCK DATA INITIALIZATION ---

const INITIAL_CLASSES: SchoolClass[] = [
  { id: 'c1', name: '1º Ano EM - A', year: 2024 },
  { id: 'c2', name: '2º Ano EM - B', year: 2024 },
  { id: 'c3', name: '3º Ano EM - C', year: 2024 },
];

const INITIAL_TEACHERS: Teacher[] = [
  { id: 't1', name: 'Prof. Mendes', email: 'mendes@escola.com', specialty: 'Matemática' },
  { id: 't2', name: 'Profa. Clara', email: 'clara@escola.com', specialty: 'Português' },
  { id: 't3', name: 'Prof. Alberto', email: 'alberto@escola.com', specialty: 'Física' },
  { id: 't4', name: 'Profa. Helena', email: 'helena@escola.com', specialty: 'Biologia' },
];

const INITIAL_STUDENTS: Student[] = [
  { id: '1', name: 'Ana Silva', email: 'ana.silva@exemplo.com', age: 16, classId: 'c2', enrollmentDate: '2024-02-15', status: 'Ativo', notes: 'Aluna dedicada, interesse em biologia.', avatarUrl: 'https://picsum.photos/200' },
  { id: '2', name: 'Bruno Santos', email: 'bruno.s@exemplo.com', age: 17, classId: 'c3', enrollmentDate: '2024-01-20', status: 'Ativo', notes: 'Precisa de reforço em matemática.', avatarUrl: 'https://picsum.photos/201' },
  { id: '3', name: 'Carla Dias', email: 'carla.d@exemplo.com', age: 15, classId: 'c1', enrollmentDate: '2024-03-01', status: 'Inativo', notes: 'Transferida.', avatarUrl: 'https://picsum.photos/202' },
  { id: '4', name: 'Daniel Costa', email: 'daniel.c@exemplo.com', age: 16, classId: 'c2', enrollmentDate: '2024-02-10', status: 'Ativo', notes: 'Líder de turma.', avatarUrl: 'https://picsum.photos/203' },
];

const INITIAL_COURSES: Course[] = [
  { id: '101', name: 'Matemática Avançada', teacherId: 't1', schedule: 'Seg/Qua 08:00' },
  { id: '102', name: 'Literatura Portuguesa', teacherId: 't2', schedule: 'Ter/Qui 10:00' },
  { id: '103', name: 'Física', teacherId: 't3', schedule: 'Sex 09:00' },
  { id: '104', name: 'Biologia', teacherId: 't4', schedule: 'Seg 10:00' },
];

const INITIAL_GRADES: Grade[] = [
  { id: 'g1', studentId: '1', courseId: '101', value: 85, date: '2024-04-10' },
  { id: 'g2', studentId: '1', courseId: '102', value: 92, date: '2024-04-12' },
  { id: 'g3', studentId: '2', courseId: '101', value: 65, date: '2024-04-10' },
  { id: 'g4', studentId: '4', courseId: '103', value: 78, date: '2024-04-15' },
];

class SchoolDatabase {
  private students: Student[];
  private courses: Course[];
  private grades: Grade[];
  private teachers: Teacher[];
  private classes: SchoolClass[];

  constructor() {
    const storedStudents = localStorage.getItem('school_students');
    const storedCourses = localStorage.getItem('school_courses');
    const storedGrades = localStorage.getItem('school_grades');
    const storedTeachers = localStorage.getItem('school_teachers');
    const storedClasses = localStorage.getItem('school_classes');

    this.students = storedStudents ? JSON.parse(storedStudents) : INITIAL_STUDENTS;
    this.courses = storedCourses ? JSON.parse(storedCourses) : INITIAL_COURSES;
    this.grades = storedGrades ? JSON.parse(storedGrades) : INITIAL_GRADES;
    this.teachers = storedTeachers ? JSON.parse(storedTeachers) : INITIAL_TEACHERS;
    this.classes = storedClasses ? JSON.parse(storedClasses) : INITIAL_CLASSES;
  }

  private save() {
    localStorage.setItem('school_students', JSON.stringify(this.students));
    localStorage.setItem('school_courses', JSON.stringify(this.courses));
    localStorage.setItem('school_grades', JSON.stringify(this.grades));
    localStorage.setItem('school_teachers', JSON.stringify(this.teachers));
    localStorage.setItem('school_classes', JSON.stringify(this.classes));
  }

  // --- Helper: Simulate SQL JOIN ---
  
  private resolveStudent(student: Student): Student {
    const classObj = this.classes.find(c => c.id === student.classId);
    return {
      ...student,
      className: classObj ? classObj.name : 'Sem Turma'
    };
  }

  private resolveCourse(course: Course): Course {
    const teacherObj = this.teachers.find(t => t.id === course.teacherId);
    return {
      ...course,
      teacherName: teacherObj ? teacherObj.name : 'Sem Professor'
    };
  }

  // --- CRUD Classes (Turmas) ---

  async getClasses(): Promise<SchoolClass[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...this.classes];
  }

  async addClass(data: Omit<SchoolClass, 'id'>): Promise<SchoolClass> {
    const newClass = { ...data, id: Math.random().toString(36).substr(2, 9) };
    this.classes.push(newClass);
    this.save();
    return newClass;
  }

  async deleteClass(id: string): Promise<void> {
    this.classes = this.classes.filter(c => c.id !== id);
    // Logic to handle students in deleted class? Set to null/undefined or block delete?
    // For now, we allow it, resolveStudent will return "Sem Turma"
    this.save();
  }

  // --- CRUD Teachers (Professores) ---

  async getTeachers(): Promise<Teacher[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...this.teachers];
  }

  async addTeacher(data: Omit<Teacher, 'id'>): Promise<Teacher> {
    const newTeacher = { ...data, id: Math.random().toString(36).substr(2, 9) };
    this.teachers.push(newTeacher);
    this.save();
    return newTeacher;
  }

  async deleteTeacher(id: string): Promise<void> {
    this.teachers = this.teachers.filter(t => t.id !== id);
    this.save();
  }

  // --- CRUD Students ---

  async getStudents(): Promise<Student[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    // JOIN operation
    return this.students.map(s => this.resolveStudent(s));
  }

  async addStudent(student: Omit<Student, 'id'>): Promise<Student> {
    const newStudent = { ...student, id: Math.random().toString(36).substr(2, 9), avatarUrl: `https://picsum.photos/200?random=${Math.random()}` };
    this.students.push(newStudent);
    this.save();
    return this.resolveStudent(newStudent);
  }

  async updateStudent(id: string, data: Partial<Student>): Promise<Student> {
    const index = this.students.findIndex(s => s.id === id);
    if (index === -1) throw new Error("Student not found");
    this.students[index] = { ...this.students[index], ...data };
    this.save();
    return this.resolveStudent(this.students[index]);
  }

  async deleteStudent(id: string): Promise<void> {
    this.students = this.students.filter(s => s.id !== id);
    this.grades = this.grades.filter(g => g.studentId !== id);
    this.save();
  }

  // --- CRUD Courses ---

  async getCourses(): Promise<Course[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.courses.map(c => this.resolveCourse(c));
  }

  async addCourse(course: Omit<Course, 'id'>): Promise<Course> {
    const newCourse = { ...course, id: Math.random().toString(36).substr(2, 9) };
    this.courses.push(newCourse);
    this.save();
    return this.resolveCourse(newCourse);
  }

  async updateCourse(id: string, data: Partial<Course>): Promise<Course> {
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) throw new Error("Course not found");
    this.courses[index] = { ...this.courses[index], ...data };
    this.save();
    return this.resolveCourse(this.courses[index]);
  }

  async deleteCourse(id: string): Promise<void> {
    this.courses = this.courses.filter(c => c.id !== id);
    this.grades = this.grades.filter(g => g.courseId !== id);
    this.save();
  }

  // --- Stats ---

  async getDashboardStats(): Promise<DashboardStats> {
    const totalStudents = this.students.length;
    const activeStudents = this.students.filter(s => s.status === 'Ativo').length;
    const totalCourses = this.courses.length;
    const totalTeachers = this.teachers.length;
    
    const totalGradesValue = this.grades.reduce((acc, curr) => acc + curr.value, 0);
    const averageGrade = this.grades.length > 0 ? Math.round(totalGradesValue / this.grades.length) : 0;

    return {
      totalStudents,
      activeStudents,
      averageGrade,
      totalCourses,
      totalTeachers
    };
  }

  // --- Grades helper ---
  
  async getStudentGrades(studentId: string): Promise<{courseName: string, value: number}[]> {
    return this.grades
      .filter(g => g.studentId === studentId)
      .map(g => {
        const course = this.courses.find(c => c.id === g.courseId);
        return {
          courseName: course ? course.name : 'Unknown',
          value: g.value
        };
      });
  }
}

export const db = new SchoolDatabase();