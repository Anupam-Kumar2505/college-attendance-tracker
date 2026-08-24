# College Attendance & Leave-Proof Management System

A production-grade, JavaScript-only prototype for managing college attendance exemptions, lecture timetables, and student leave proof documents.

---

## 1. Project Overview

The **College Attendance & Leave Management Portal** automates the workflow between students requesting attendance exemptions and teachers conducting lectures. Students can submit leave applications with mandatory scanned official proof documents (in PDF format) for single-day or multi-day periods. The system dynamically applies the exemption across all lectures falling within the inclusive date range without duplicating database records. Teachers can immediately view absent students and securely inspect their original uploaded proof PDFs.

---

## 2. Architecture

```text
college-attendence-tracker/
│
├── frontend/                     # React + Vite + Tailwind CSS (JavaScript/JSX only)
│   ├── src/
│   │   ├── api/                  # Axios HTTP clients & API modules
│   │   ├── components/           # Timetable, Leave, and Common UI components
│   │   ├── context/              # AuthContext for session management
│   │   ├── hooks/                # Custom React hooks (useAuth)
│   │   ├── layouts/              # MainLayout & AuthLayout
│   │   ├── pages/                # Teacher & Student page views
│   │   ├── routes/               # ProtectedRoute & RoleRoute guards
│   │   ├── utils/                # Date & file formatters
│   │   ├── App.jsx               # Root application router
│   │   ├── index.css             # Tailwind CSS & custom styling
│   │   └── main.jsx              # React entrypoint
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── backend/                      # Node.js + Express (ES Modules, JavaScript only)
│   ├── src/
│   │   ├── config/               # MongoDB Atlas connection & environment config
│   │   ├── controllers/          # Request handlers
│   │   ├── middleware/           # Auth, Role, Multer Upload & Error middlewares
│   │   ├── models/               # User, Timetable, LeaveApplication (Mongoose)
│   │   ├── routes/               # REST API route handlers
│   │   ├── services/             # Core business & date-range logic
│   │   ├── utils/                # JWT, Date, and Secure File Storage utils
│   │   ├── validators/           # Request input validators
│   │   ├── seed/                 # Hardcoded database seeders & PDF fixtures
│   │   ├── app.js                # Express app setup
│   │   └── server.js             # HTTP server entrypoint
│   ├── uploads/                  # Secure local file storage for uploaded PDFs
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── .gitignore
└── README.md
```

---

## 3. Technology Stack

### Frontend
- **Framework**: React 18 with JSX (Pure JavaScript, No TypeScript)
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios (with HTTP-only cookies)
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js (ES Modules `"type": "module"`)
- **Web Framework**: Express.js
- **Database**: MongoDB Atlas via Mongoose ODM
- **Authentication**: JWT with HTTP-only cookies
- **File Upload**: Multer (strict `application/pdf` filter and size limit)
- **Security**: Helmet, CORS, bcryptjs, path-traversal prevention

---

## 4. MongoDB Setup

The application connects to **MongoDB Atlas**.

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and allow your IP address in Network Access.
3. Copy your MongoDB connection string and set `MONGODB_URI` in `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/college_attendance?retryWrites=true&w=majority
   ```

---

## 5. Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/college_attendance?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_change_in_production_987654321
JWT_EXPIRES_IN=1d
FRONTEND_URL=http://localhost:5173
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=10
NODE_ENV=development
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=/api
```

---

## 6. Installation & Running

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Seed Sample Data into MongoDB

```bash
npm run seed
```

### Step 3: Run Backend Server

```bash
npm run dev
```

*Backend runs at `http://localhost:5000` (API at `http://localhost:5000/api`)*.

---

### Step 4: Install Frontend Dependencies & Run

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

*Frontend runs at `http://localhost:5173`*.

---

## 7. Development Credentials

The seed script creates the following accounts (all passwords: `password123`):

### Faculty Accounts (Teachers)

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **TEACHER** | `teacher1@example.com` | `password123` | Prof. Rajesh Verma (Software Engineering, Distributed Systems) |
| **TEACHER** | `teacher2@example.com` | `password123` | Prof. Sneha Kulkarni (Cloud Computing, Artificial Intelligence) |

### Student Accounts (BE COMPS C1)

| Role | Email | Password | Roll No | SAP ID | Batch | Leave Scenarios |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **STUDENT** | `student1@example.com` | `password123` | 101 | 60004210001 | 1 | Multi-day leave (19 Aug – 24 Aug 2026) |
| **STUDENT** | `student2@example.com` | `password123` | 102 | 60004210002 | 1 | Single-day leave (18 Aug 2026) |
| **STUDENT** | `student3@example.com` | `password123` | 103 | 60004210003 | 2 | Overlapping conference leave (20 Aug – 22 Aug) |
| **STUDENT** | `student4@example.com` | `password123` | 104 | 60004210004 | 2 | Regular student (No Leave) |
| **STUDENT** | `student5@example.com` | `password123` | 105 | 60004210005 | 3 | Regular student (No Leave) |

*(The login page includes 1-click Quick-Fill buttons for effortless testing)*.

---

## 8. Critical Date-Range Rule

When a student submits a leave application with a date range (e.g., **19 August 2026 to 24 August 2026**):

- The application automatically applies to **every scheduled lecture** belonging to that student's class where `lecture.date >= startDate && lecture.date <= endDate`.
- It applies to lectures on **19, 20, 21, 22, and 24 August 2026**.
- It does **not** apply to lectures outside that range (e.g., 18 August or 25 August).
- When a teacher opens any lecture on 19 August, the backend evaluates active leaves dynamically and displays the student with their proof PDF.
- The date range remains the single source of truth; no duplicate lecture-level status records are created.

---

## 9. PDF Upload & Security

- **Mandatory PDF**: Submissions without a PDF or with non-PDF files are rejected on both frontend and backend.
- **Zero PDF Generation**: Students upload scanned official proof; teachers view/download the original uploaded PDF.
- **Access Authorization**: Uploaded PDFs are stored in the server's uploads folder and served via an authorized endpoint:
  ```text
  GET /api/leave-applications/:id/proof
  ```
  - **Students** can only access their own uploaded proof documents.
  - **Teachers** can only access proof documents for students belonging to lectures they teach during the leave period.
  - Public static access to `/uploads` is disabled to prevent unauthorized file enumeration.

---

## 10. API Endpoints

### Authentication
- `POST /api/auth/login` - Authenticate user, returns user profile and sets HTTP-only cookie.
- `POST /api/auth/logout` - Invalidate session and clear cookie.
- `GET /api/auth/me` - Resolve currently authenticated user session.

### Timetable
- `GET /api/timetable/teacher` - Retrieve authenticated teacher's weekly lectures.
- `GET /api/timetable/student` - Retrieve student's class timetable with leave status indicators.
- `GET /api/timetable/:id` - Retrieve individual lecture details.

### Leave Applications
- `POST /api/leave-applications` - Submit leave request with mandatory proof PDF (`multipart/form-data`).
- `GET /api/leave-applications/my` - List authenticated student's leave applications.
- `GET /api/leave-applications/:id` - Retrieve leave application details.
- `GET /api/leave-applications/:id/proof` - Stream or download original uploaded proof PDF.

### Teacher Portal
- `GET /api/teacher/lectures/:lectureId/applications` - Retrieve students on leave for a specific lecture.
