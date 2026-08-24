import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getUploadsDir } from '../utils/fileStorage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateSampleLeaveApplications = async (studentMap) => {
  const uploadsDir = getUploadsDir();
  const fixturePdfPath = path.resolve(__dirname, 'fixtures/sample_leave_proof.pdf');
  const fixturePdfContent = fs.readFileSync(fixturePdfPath);

  // Helper to generate a copied file in uploads
  const prepareProofFile = (prefix) => {
    const filename = `proof-seed-${prefix}-${Date.now()}.pdf`;
    const targetPath = path.join(uploadsDir, filename);
    fs.writeFileSync(targetPath, fixturePdfContent);
    const stats = fs.statSync(targetPath);
    return {
      filename,
      size: stats.size
    };
  };

  const proof1 = prepareProofFile('rahul-medical');
  const proof2 = prepareProofFile('priya-sports');
  const proof3 = prepareProofFile('aman-conference');

  return [
    // 1. Critical Scenario: Multi-day leave covering 19 Aug to 24 Aug
    {
      studentId: studentMap['student1@example.com']._id,
      startDate: '2026-08-19',
      endDate: '2026-08-24',
      reason: 'Medical - Acute Viral Fever & Doctor Recommended Rest',
      details: 'Prescribed complete rest by Dr. Alok Mehta (City Care Clinic). Medical certificate and consultation prescription attached as PDF proof.',
      proofFileName: 'Medical_Certificate_Rahul_Sharma_Aug2026.pdf',
      proofMimeType: 'application/pdf',
      proofFilePath: proof1.filename,
      proofFileSize: proof1.size
    },
    // 2. Single-day leave on 18 Aug
    {
      studentId: studentMap['student2@example.com']._id,
      startDate: '2026-08-18',
      endDate: '2026-08-18',
      reason: 'Sports - University Table Tennis Championship Finals',
      details: 'Representing College of Engineering at the State University Inter-Collegiate Championship. Event schedule & sports director letter attached.',
      proofFileName: 'Sports_Permission_Priya_Patel_Aug18.pdf',
      proofMimeType: 'application/pdf',
      proofFilePath: proof2.filename,
      proofFileSize: proof2.size
    },
    // 3. Multi-day overlapping leave on 20 Aug to 22 Aug
    {
      studentId: studentMap['student3@example.com']._id,
      startDate: '2026-08-20',
      endDate: '2026-08-22',
      reason: 'Academic Conference - IEEE International Presentation',
      details: 'Selected for oral research paper presentation at the IEEE Smart Systems 2026 Conference. Acceptance letter and travel order attached.',
      proofFileName: 'IEEE_Conference_Acceptance_Aman_Gupta.pdf',
      proofMimeType: 'application/pdf',
      proofFilePath: proof3.filename,
      proofFileSize: proof3.size
    }
  ];
};
