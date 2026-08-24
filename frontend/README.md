# College Attendance & Leave Management Frontend

A React + Vite + Tailwind CSS single page web application for students and faculty.

## Technology Stack

- **Framework**: React 18 with JSX (Pure JavaScript, No TypeScript)
- **Bundler**: Vite
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios (with HTTP-only cookie support)
- **Icons**: Lucide React

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment (`.env`):
   ```env
   VITE_API_URL=/api
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

## Features

- **Split Role Portals**: Dedicated dashboard and views for Teachers and Students.
- **Weekly Class Timetable**: Shows all lectures for BE COMPS C1, highlighting leave status for students and student leave counts for teachers.
- **Teacher Lecture Details**: Displays all students whose leave ranges cover that specific lecture date, with secure proof PDF viewing.
- **Student Leave Application**: Submit multi-day attendance exemptions with mandatory scanned PDF proof upload and file validation.
- **Leave History**: View previously submitted applications and inspect uploaded documents.
- **Demo Quick-Fill**: 1-click test credential buttons on the login screen.
