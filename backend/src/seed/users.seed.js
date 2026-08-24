import bcrypt from 'bcryptjs';

const passwordHash = bcrypt.hashSync('password123', 10);

export const sampleTeachers = [
  {
    name: 'Prof. Rajesh Verma',
    email: 'teacher1@example.com',
    passwordHash,
    role: 'TEACHER',
    employeeId: 'EMP-COMPS-101',
    department: 'Computer Engineering',
    subjects: ['Software Engineering', 'Distributed Systems']
  },
  {
    name: 'Prof. Sneha Kulkarni',
    email: 'teacher2@example.com',
    passwordHash,
    role: 'TEACHER',
    employeeId: 'EMP-COMPS-102',
    department: 'Computer Engineering',
    subjects: ['Cloud Computing', 'Artificial Intelligence']
  }
];

export const sampleStudents = [
  {
    name: 'Rahul Sharma',
    email: 'student1@example.com',
    passwordHash,
    role: 'STUDENT',
    studentId: 'STU-BE-001',
    rollNo: '101',
    sapId: '60004210001',
    year: 'BE',
    branch: 'COMPS',
    classNumber: 1,
    batch: 1
  },
  {
    name: 'Priya Patel',
    email: 'student2@example.com',
    passwordHash,
    role: 'STUDENT',
    studentId: 'STU-BE-002',
    rollNo: '102',
    sapId: '60004210002',
    year: 'BE',
    branch: 'COMPS',
    classNumber: 1,
    batch: 1
  },
  {
    name: 'Aman Gupta',
    email: 'student3@example.com',
    passwordHash,
    role: 'STUDENT',
    studentId: 'STU-BE-003',
    rollNo: '103',
    sapId: '60004210003',
    year: 'BE',
    branch: 'COMPS',
    classNumber: 1,
    batch: 2
  },
  {
    name: 'Neha Singh',
    email: 'student4@example.com',
    passwordHash,
    role: 'STUDENT',
    studentId: 'STU-BE-004',
    rollNo: '104',
    sapId: '60004210004',
    year: 'BE',
    branch: 'COMPS',
    classNumber: 1,
    batch: 2
  },
  {
    name: 'Rohan Mehta',
    email: 'student5@example.com',
    passwordHash,
    role: 'STUDENT',
    studentId: 'STU-BE-005',
    rollNo: '105',
    sapId: '60004210005',
    year: 'BE',
    branch: 'COMPS',
    classNumber: 1,
    batch: 3
  },
  {
    name: 'Ananya Desai',
    email: 'student6@example.com',
    passwordHash,
    role: 'STUDENT',
    studentId: 'STU-BE-006',
    rollNo: '106',
    sapId: '60004210006',
    year: 'BE',
    branch: 'COMPS',
    classNumber: 1,
    batch: 3
  },
  {
    name: 'Vikram Joshi',
    email: 'student7@example.com',
    passwordHash,
    role: 'STUDENT',
    studentId: 'STU-BE-007',
    rollNo: '107',
    sapId: '60004210007',
    year: 'BE',
    branch: 'COMPS',
    classNumber: 1,
    batch: 1
  },
  {
    name: 'Pooja Nair',
    email: 'student8@example.com',
    passwordHash,
    role: 'STUDENT',
    studentId: 'STU-BE-008',
    rollNo: '108',
    sapId: '60004210008',
    year: 'BE',
    branch: 'COMPS',
    classNumber: 1,
    batch: 2
  },
  {
    name: 'Aditya Rao',
    email: 'student9@example.com',
    passwordHash,
    role: 'STUDENT',
    studentId: 'STU-BE-009',
    rollNo: '109',
    sapId: '60004210009',
    year: 'BE',
    branch: 'COMPS',
    classNumber: 1,
    batch: 3
  },
  {
    name: 'Tanvi Kadam',
    email: 'student10@example.com',
    passwordHash,
    role: 'STUDENT',
    studentId: 'STU-BE-010',
    rollNo: '110',
    sapId: '60004210010',
    year: 'BE',
    branch: 'COMPS',
    classNumber: 1,
    batch: 1
  }
];
