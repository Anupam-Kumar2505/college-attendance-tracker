# College Attendance & Leave Management Backend

Backend REST API for the College Attendance and Leave-Proof Management System built with Node.js, Express, ES Modules, and MongoDB Atlas (Mongoose).

## Features

- **Authentication & Authorization**: JWT stored in secure HTTP-only cookies and Bearer header support, role-based protection (`TEACHER` and `STUDENT`).
- **Dynamic Date-Range Engine**: Multi-day leave applications automatically map across all lectures within the inclusive `[startDate, endDate]` range without database duplication.
- **Mandatory Proof PDF Handling**: Secure Multer upload pipeline strictly accepting `application/pdf`, validating file extensions and sizes, and authorizing access to original uploaded files.
- **Multi-Subject Teacher Support**: Teachers teach subjects across lectures; timetable queries link teachers dynamically.
- **MongoDB Atlas Integration**: Centralized database connection with Mongoose models, compound indexes, and sample seed mechanism.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the `backend/` directory:

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

### 3. Seed Sample Data

Populate MongoDB Atlas with realistic teachers, students (with Roll No & SAP ID), weekly BE COMPS C1 timetable, and sample leave applications with proof PDF fixtures:

```bash
npm run seed
```

### 4. Start the Server

```bash
# Development with auto-restart
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Log in with email and password
- `POST /api/auth/logout` - Log out and clear session cookie
- `GET /api/auth/me` - Get currently authenticated user

### Timetable
- `GET /api/timetable/teacher` - Get authenticated teacher's weekly lectures (with leave count)
- `GET /api/timetable/student` - Get authenticated student's weekly lectures (with leave status indicators)
- `GET /api/timetable/:id` - Get specific lecture details

### Leave Applications
- `POST /api/leave-applications` - Student submits leave with mandatory proof PDF (`multipart/form-data`)
- `GET /api/leave-applications/my` - Student views their leave history
- `GET /api/leave-applications/:id` - Get leave application details
- `GET /api/leave-applications/:id/proof` - Securely stream / download original uploaded proof PDF

### Teacher
- `GET /api/teacher/lectures/:lectureId/applications` - Get absent students with leave applications covering that lecture's date
