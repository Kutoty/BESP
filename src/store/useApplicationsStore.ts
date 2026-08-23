import { create } from 'zustand';
import { useAnnouncementsStore } from './useAnnouncementsStore';
import { useScholarsStore } from './useScholarsStore';
import { getNextGradeStep, levelDisplayName } from '../lib/utils';
import type { Application, ApplicationStatus, DocumentFile } from '../types';
import { scoreToDisplayGrade, cbcCodeToBand, usesCbcGrading } from '../lib/utils';

interface ApplicationsStore {
  applications: Application[];
  addApplication: (newApp: Omit<Application, 'id' | 'status'>) => void;
  updateApplicationStatus: (id: number, status: ApplicationStatus) => void;
}

function makeApp(
  partial: Omit<Application, 'meanGrade'> & { meanScore: number }
): Application {
  const meanGrade = scoreToDisplayGrade(partial.meanScore, partial.schoolLevel);
  let results = partial.currentTermResults;
  if (usesCbcGrading(partial.schoolLevel)) {
    const band = cbcCodeToBand(meanGrade);
    const term = (partial.currentTermResults || '').split(' - ')[0] || 'Term';
    results = `${term} — ${band} (${meanGrade})`;
  }
  return {
    ...partial,
    meanGrade,
    currentTermResults: results,
    feeStatus: partial.feeStatus ?? ((partial.id ?? 0) % 3 === 0 ? 'Pending' : 'Paid'),
  };
}

export const useApplicationsStore = create<ApplicationsStore>((set) => ({
  applications: [
    // PRIMARY
    makeApp({
      id: 101, studentName: 'Aisha Mohammed', email: 'aisha.m@email.com',
      school: 'Mara Primary School', schoolLevel: 'Primary', course: 'Grade 8',
      meanScore: 82, appliedDate: '2026-03-10', status: 'Approved',
      amountRequested: 18500, sponsorshipAmount: 17200, nextPaymentDate: '2026-06-01',
      lastUploadDate: '2026-04-10', currentTermFees: 14800,
      currentTermResults: 'Term 2 2026 - 82% (A)', region: 'Rift Valley',
      documents: [{ name: 'report_card.pdf', dataUrl: '', type: 'application/pdf' }],
    }),
    makeApp({
      id: 102, studentName: 'Fatima Hassan', email: 'fatima.h@email.com',
      school: 'Kajiado Primary', schoolLevel: 'Primary', course: 'Grade 7',
      meanScore: 79, appliedDate: '2026-03-15', status: 'Approved',
      amountRequested: 17200, sponsorshipAmount: 15800, nextPaymentDate: '2026-05-20',
      lastUploadDate: '2026-04-08', currentTermFees: 13500,
      currentTermResults: 'Term 2 2026 - 79% (A-)', region: 'Rift Valley',
      documents: [{ name: 'report_card.pdf', dataUrl: '', type: 'application/pdf' }],
    }),
    makeApp({
      id: 103, studentName: 'Hassan Ali', email: 'hassan.a@email.com',
      school: 'Mara Primary School', schoolLevel: 'Primary', course: 'Grade 8',
      meanScore: 75, appliedDate: '2026-03-20', status: 'Approved',
      amountRequested: 18000, sponsorshipAmount: 16500, nextPaymentDate: '2026-06-01',
      lastUploadDate: '2026-04-05', currentTermFees: 14200,
      currentTermResults: 'Term 2 2026 - 75% (A-)', region: 'Rift Valley',
      documents: [{ name: 'report_card.pdf', dataUrl: '', type: 'application/pdf' }],
    }),
    makeApp({
      id: 104, studentName: 'Zainab Yusuf', email: 'zainab.y@email.com',
      school: 'Kajiado Primary', schoolLevel: 'Primary', course: 'Grade 6',
      meanScore: 85, appliedDate: '2026-03-25', status: 'Approved',
      amountRequested: 16500, sponsorshipAmount: 15200, nextPaymentDate: '2026-05-15',
      lastUploadDate: '2026-04-12', currentTermFees: 12800,
      currentTermResults: 'Term 2 2026 - 85% (A)', region: 'Rift Valley',
      documents: [{ name: 'report_card.pdf', dataUrl: '', type: 'application/pdf' }],
    }),
    makeApp({
      id: 105, studentName: 'Khalid Osman', email: 'khalid.o@email.com',
      school: 'Mara Primary School', schoolLevel: 'Primary', course: 'Grade 7',
      meanScore: 77, appliedDate: '2026-04-01', status: 'Approved',
      amountRequested: 17500, sponsorshipAmount: 16000, nextPaymentDate: '2026-06-01',
      lastUploadDate: '2026-04-09', currentTermFees: 13800,
      currentTermResults: 'Term 2 2026 - 77% (A-)', region: 'Rift Valley',
      documents: [{ name: 'report_card.pdf', dataUrl: '', type: 'application/pdf' }],
    }),

    // SECONDARY
    makeApp({
      id: 106, studentName: 'John Okoro', email: 'john.okoro@email.com',
      school: 'Rift Valley High School', schoolLevel: 'Senior Secondary', course: 'Form 4',
      meanScore: 68, appliedDate: '2026-03-12', status: 'Approved',
      amountRequested: 32500, sponsorshipAmount: 29500, nextPaymentDate: '2026-05-15',
      lastUploadDate: '2026-04-10', currentTermFees: 25800,
      currentTermResults: 'Term 2 2026 - 68% (B)', region: 'Rift Valley',
      documents: [{ name: 'kcse_mock.pdf', dataUrl: '', type: 'application/pdf' }],
    }),
    makeApp({
      id: 107, studentName: 'Mary Wanjiku', email: 'mary.w@email.com',
      school: 'Ngong Girls Secondary', schoolLevel: 'Senior Secondary', course: 'Form 3',
      meanScore: 74, appliedDate: '2026-03-18', status: 'Approved',
      amountRequested: 31000, sponsorshipAmount: 28500, nextPaymentDate: '2026-06-01',
      lastUploadDate: '2026-04-11', currentTermFees: 24500,
      currentTermResults: 'Term 2 2026 - 74% (B+)', region: 'Rift Valley',
      documents: [{ name: 'kcse_mock.pdf', dataUrl: '', type: 'application/pdf' }],
    }),
    makeApp({
      id: 108, studentName: 'Peter Kamau', email: 'peter.k@email.com',
      school: 'Rift Valley High School', schoolLevel: 'Senior Secondary', course: 'Form 4',
      meanScore: 71, appliedDate: '2026-03-22', status: 'Approved',
      amountRequested: 33000, sponsorshipAmount: 30000, nextPaymentDate: '2026-05-20',
      lastUploadDate: '2026-04-07', currentTermFees: 26000,
      currentTermResults: 'Term 2 2026 - 71% (B+)', region: 'Rift Valley',
      documents: [{ name: 'kcse_mock.pdf', dataUrl: '', type: 'application/pdf' }],
    }),
    makeApp({
      id: 109, studentName: 'Grace Akinyi', email: 'grace.a@email.com',
      school: 'Kajiado Secondary', schoolLevel: 'Senior Secondary', course: 'Form 2',
      meanScore: 78, appliedDate: '2026-03-28', status: 'Approved',
      amountRequested: 29000, sponsorshipAmount: 27000, nextPaymentDate: '2026-06-01',
      lastUploadDate: '2026-04-13', currentTermFees: 23000,
      currentTermResults: 'Term 2 2026 - 78% (A-)', region: 'Rift Valley',
      documents: [{ name: 'kcse_mock.pdf', dataUrl: '', type: 'application/pdf' }],
    }),
    makeApp({
      id: 110, studentName: 'David Mutua', email: 'david.m@email.com',
      school: 'Rift Valley High School', schoolLevel: 'Senior Secondary', course: 'Form 3',
      meanScore: 69, appliedDate: '2026-04-02', status: 'Approved',
      amountRequested: 31500, sponsorshipAmount: 29000, nextPaymentDate: '2026-05-15',
      lastUploadDate: '2026-04-10', currentTermFees: 25000,
      currentTermResults: 'Term 2 2026 - 69% (B)', region: 'Rift Valley',
      documents: [{ name: 'kcse_mock.pdf', dataUrl: '', type: 'application/pdf' }],
    }),

    // UNIVERSITY
    makeApp({
      id: 111, studentName: 'Ahmed Hassan', email: 'ahmed.h@email.com',
      school: 'University of Nairobi', schoolLevel: 'University', course: 'Computer Science Year 3',
      meanScore: 78, appliedDate: '2026-03-05', status: 'Approved',
      amountRequested: 52000, sponsorshipAmount: 48500, nextPaymentDate: '2026-06-01',
      lastUploadDate: '2026-04-10', currentTermFees: 45000,
      currentTermResults: 'Semester 2 2026 - 78% (A-)', region: 'Nairobi',
      documents: [{ name: 'transcript.pdf', dataUrl: '', type: 'application/pdf' }],
    }),
    makeApp({
      id: 112, studentName: 'Esther Njeri', email: 'esther.n@email.com',
      school: 'Kenyatta University', schoolLevel: 'University', course: 'Education Year 2',
      meanScore: 82, appliedDate: '2026-03-10', status: 'Approved',
      amountRequested: 48000, sponsorshipAmount: 45000, nextPaymentDate: '2026-05-20',
      lastUploadDate: '2026-04-12', currentTermFees: 41500,
      currentTermResults: 'Semester 2 2026 - 82% (A)', region: 'Nairobi',
      documents: [{ name: 'transcript.pdf', dataUrl: '', type: 'application/pdf' }],
    }),
    makeApp({
      id: 113, studentName: 'Michael Omondi', email: 'michael.o@email.com',
      school: 'Moi University', schoolLevel: 'University', course: 'Engineering Year 4',
      meanScore: 72, appliedDate: '2026-03-15', status: 'Approved',
      amountRequested: 55000, sponsorshipAmount: 51000, nextPaymentDate: '2026-06-01',
      lastUploadDate: '2026-04-08', currentTermFees: 47500,
      currentTermResults: 'Semester 2 2026 - 72% (B+)', region: 'Rift Valley',
      documents: [{ name: 'transcript.pdf', dataUrl: '', type: 'application/pdf' }],
    }),
    makeApp({
      id: 114, studentName: 'Sarah Wambui', email: 'sarah.w@email.com',
      school: 'Jomo Kenyatta University', schoolLevel: 'University', course: 'Business Administration Year 3',
      meanScore: 85, appliedDate: '2026-03-20', status: 'Approved',
      amountRequested: 49500, sponsorshipAmount: 46500, nextPaymentDate: '2026-05-15',
      lastUploadDate: '2026-04-11', currentTermFees: 43000,
      currentTermResults: 'Semester 2 2026 - 85% (A)', region: 'Nairobi',
      documents: [{ name: 'transcript.pdf', dataUrl: '', type: 'application/pdf' }],
    }),
    makeApp({
      id: 115, studentName: 'Brian Kipchoge', email: 'brian.k@email.com',
      school: 'Maseno University', schoolLevel: 'University', course: 'Medicine Year 2',
      meanScore: 76, appliedDate: '2026-03-25', status: 'Approved',
      amountRequested: 58000, sponsorshipAmount: 54000, nextPaymentDate: '2026-06-01',
      lastUploadDate: '2026-04-09', currentTermFees: 49500,
      currentTermResults: 'Semester 2 2026 - 76% (A-)', region: 'Nyanza',
      documents: [{ name: 'transcript.pdf', dataUrl: '', type: 'application/pdf' }],
    }),
    makeApp({
      id: 116, studentName: 'Nancy Chebet', email: 'nancy.c@email.com',
      school: 'University of Nairobi', schoolLevel: 'University', course: 'Law Year 3',
      meanScore: 80, appliedDate: '2026-03-28', status: 'Approved',
      amountRequested: 50500, sponsorshipAmount: 47500, nextPaymentDate: '2026-05-20',
      lastUploadDate: '2026-04-13', currentTermFees: 44000,
      currentTermResults: 'Semester 2 2026 - 80% (A)', region: 'Nairobi',
      documents: [{ name: 'transcript.pdf', dataUrl: '', type: 'application/pdf' }],
    }),
    makeApp({
      id: 117, studentName: 'Kevin Otieno', email: 'kevin.o@email.com',
      school: 'Kenyatta University', schoolLevel: 'University', course: 'Agriculture Year 4',
      meanScore: 70, appliedDate: '2026-04-01', status: 'Approved',
      amountRequested: 47500, sponsorshipAmount: 44500, nextPaymentDate: '2026-06-01',
      lastUploadDate: '2026-04-10', currentTermFees: 41000,
      currentTermResults: 'Semester 2 2026 - 70% (B+)', region: 'Central',
      documents: [{ name: 'transcript.pdf', dataUrl: '', type: 'application/pdf' }],
    }),
    makeApp({
      id: 118, studentName: 'Lilian Muthoni', email: 'lilian.m@email.com',
      school: 'Moi University', schoolLevel: 'University', course: 'Nursing Year 3',
      meanScore: 87, appliedDate: '2026-04-05', status: 'Approved',
      amountRequested: 51000, sponsorshipAmount: 48000, nextPaymentDate: '2026-05-15',
      lastUploadDate: '2026-04-12', currentTermFees: 43500,
      currentTermResults: 'Semester 2 2026 - 87% (A)', region: 'Rift Valley',
      documents: [{ name: 'transcript.pdf', dataUrl: '', type: 'application/pdf' }],
    }),
    makeApp({
      id: 119, studentName: 'Samuel Kiprono', email: 'samuel.k@email.com',
      school: 'Jomo Kenyatta University', schoolLevel: 'University', course: 'Economics Year 2',
      meanScore: 73, appliedDate: '2026-04-08', status: 'Approved',
      amountRequested: 48500, sponsorshipAmount: 45500, nextPaymentDate: '2026-06-01',
      lastUploadDate: '2026-04-14', currentTermFees: 42000,
      currentTermResults: 'Semester 2 2026 - 73% (B+)', region: 'Nairobi',
      documents: [{ name: 'transcript.pdf', dataUrl: '', type: 'application/pdf' }],
    }),
    makeApp({
      id: 120, studentName: 'Rebecca Akinyi', email: 'rebecca.a@email.com',
      school: 'Maseno University', schoolLevel: 'University', course: 'Environmental Science Year 3',
      meanScore: 79, appliedDate: '2026-04-10', status: 'Approved',
      amountRequested: 49000, sponsorshipAmount: 46000, nextPaymentDate: '2026-05-20',
      lastUploadDate: '2026-04-15', currentTermFees: 42500,
      currentTermResults: 'Semester 2 2026 - 79% (A-)', region: 'Nyanza',
      documents: [{ name: 'transcript.pdf', dataUrl: '', type: 'application/pdf' }],
    }),
  ],

  addApplication: (newApp) => {
    const newEntry: Application = {
      ...newApp,
      id: Date.now(),
      status: 'Pending',
      lastUploadDate: new Date().toISOString().split('T')[0],
    };

    set((state) => ({
      applications: [newEntry, ...state.applications],
    }));

    const ann = useAnnouncementsStore.getState();
    // Admin-only: new upload to verify
    ann.addAnnouncement(
      'New Term Upload Received',
      `${newApp.studentName} from ${newApp.school} has submitted term results for verification.`,
      'normal',
      'admin'
    );
    // Student personal confirmation
    if (newApp.email) {
      ann.addAnnouncement(
        'Results submitted',
        `Your term results for ${newApp.school} were submitted successfully and are awaiting admin verification.`,
        'normal',
        'students',
        newApp.email
      );
    }
  },

  updateApplicationStatus: (id, status) => {
    let updatedApp: Application | undefined;
    set((state) => {
      const applications = state.applications.map((app) => {
        if (app.id === id) {
          updatedApp = { ...app, status };
          return updatedApp;
        }
        return app;
      });
      return { applications };
    });

    if (!updatedApp) return;

    const ann = useAnnouncementsStore.getState();

    if (status === 'Rejected') {
      ann.addAnnouncement(
        'Results need attention',
        `Your recent term upload was not approved. Please check the documents and re-submit if required.`,
        'important',
        'students',
        updatedApp.email
      );
      return;
    }

    if (status !== 'Approved') return;

    // Always notify student of approval
    ann.addAnnouncement(
      'Results approved',
      `Your term results (${updatedApp.currentTermResults}) have been approved by the programme administrator.`,
      'important',
      'students',
      updatedApp.email
    );

    // Auto-advance only for end-of-year uploads
    if (!updatedApp.isEndOfYear) return;

    const scholars = useScholarsStore.getState();
    const scholar = scholars.getScholarByEmail(updatedApp.email);
    if (!scholar || scholar.schoolLevel === 'Alumni') return;

    const next = getNextGradeStep(scholar.schoolLevel, scholar.currentClass);
    if (!next) return;

    // Grade 9 → Senior Secondary: hold until student chooses pathway
    if (next.requiresPathway && !scholar.pathway) {
      ann.addAnnouncement(
        'Choose your Senior Secondary pathway',
        'Your end-of-year results were approved. Before you move to Grade 10, choose your pathway (STEM, Social Sciences, or Arts and Sports Science) on your dashboard.',
        'important',
        'students',
        updatedApp.email
      );
      return;
    }

    const result = scholars.advanceYear(scholar.id);
    if (!result.ok) {
      if (result.error) {
        ann.addAnnouncement(
          'Pathway required',
          result.error,
          'important',
          'students',
          updatedApp.email
        );
      }
      return;
    }

    // Refresh scholar after advance
    const advanced = useScholarsStore.getState().getScholarByEmail(updatedApp.email);
    if (!advanced) return;

    if (advanced.schoolLevel === 'Alumni') {
      ann.addAnnouncement(
        'Programme completed',
        'Congratulations! You have completed the Scholars Programme.',
        'important',
        'students',
        updatedApp.email
      );
    } else {
      const pathwayNote = advanced.pathway ? ` (${advanced.pathway} pathway)` : '';
      ann.addAnnouncement(
        'Advanced to next year',
        `You have moved to ${advanced.currentClass} — ${levelDisplayName(advanced.schoolLevel)}${pathwayNote}.`,
        'important',
        'students',
        updatedApp.email
      );
    }
  },

}));
