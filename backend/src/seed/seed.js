import { connectDB, disconnectDB, isDatabaseConnected } from '../config/db.js';
import { User } from '../models/User.js';
import { Timetable } from '../models/Timetable.js';
import { LeaveApplication } from '../models/LeaveApplication.js';
import { sampleTeachers, sampleStudents } from './users.seed.js';
import { generateSampleTimetable } from './timetable.seed.js';
import { generateSampleLeaveApplications } from './leaveApplications.seed.js';
import { saveJsonData } from '../data/jsonDb.js';

const runSeed = async () => {
  try {
    console.log('\x1b[36m%s\x1b[0m', '--- [SEED] Starting Database & Local Data Seeding ---');
    await connectDB();

    // Map emails to student documents
    const studentMap = {};
    sampleStudents.forEach((student, idx) => {
      student._id = `60000000000000000000010${idx + 1}`.slice(0, 24);
      studentMap[student.email] = student;
    });

    sampleTeachers.forEach((teacher, idx) => {
      teacher._id = `60000000000000000000000${idx + 1}`.slice(0, 24);
    });

    const teacher1 = sampleTeachers[0];
    const teacher2 = sampleTeachers[1];

    console.log('[SEED] Generating weekly timetable for BE COMPS C1...');
    const timetableData = generateSampleTimetable(teacher1._id, teacher2._id);
    timetableData.forEach((t, idx) => {
      t._id = `6000000000000000000010${(idx + 1).toString().padStart(2, '0')}`;
    });

    console.log('[SEED] Generating sample leave applications with proof fixtures...');
    const leaveApplicationsData = await generateSampleLeaveApplications(studentMap);
    leaveApplicationsData.forEach((l, idx) => {
      l._id = `6000000000000000000020${(idx + 1).toString().padStart(2, '0')}`;
    });

    // 1. Save to local data.json
    console.log('[SEED] Writing local data store to backend/src/data/data.json...');
    saveJsonData({
      users: [...sampleTeachers, ...sampleStudents],
      timetable: timetableData,
      leaveApplications: leaveApplicationsData
    });
    console.log('[SEED] Local data.json successfully updated.');

    // 2. If connected to MongoDB Atlas, seed Atlas as well
    if (isDatabaseConnected()) {
      console.log('[SEED] Clearing existing MongoDB Atlas collections...');
      await User.deleteMany({});
      await Timetable.deleteMany({});
      await LeaveApplication.deleteMany({});

      console.log('[SEED] Inserting sample data into MongoDB Atlas...');
      await User.insertMany([...sampleTeachers, ...sampleStudents]);
      await Timetable.insertMany(timetableData);
      await LeaveApplication.insertMany(leaveApplicationsData);
      console.log('[SEED] MongoDB Atlas successfully updated.');
    }

    console.log('\n\x1b[32m%s\x1b[0m', '=== SEEDING COMPLETED SUCCESSFULLY ===');
    console.log('\nDevelopment Credentials:');
    console.log('--------------------------------------------------');
    console.log('Role    | Email                 | Password    | Info');
    console.log('--------------------------------------------------');
    console.log('TEACHER | teacher1@example.com  | password123 | Prof. Rajesh Verma (SE, DS)');
    console.log('TEACHER | teacher2@example.com  | password123 | Prof. Sneha Kulkarni (CC, AI)');
    console.log('STUDENT | student1@example.com  | password123 | Rahul Sharma (Leave 19-24 Aug)');
    console.log('STUDENT | student2@example.com  | password123 | Priya Patel (Leave 18 Aug)');
    console.log('STUDENT | student3@example.com  | password123 | Aman Gupta (Leave 20-22 Aug)');
    console.log('STUDENT | student4@example.com  | password123 | Neha Singh (No Leave)');
    console.log('--------------------------------------------------\n');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `[SEED ERROR] Failed to seed data: ${error.message}`);
    await disconnectDB();
    process.exit(1);
  }
};

runSeed();
