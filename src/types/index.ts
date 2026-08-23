export type Role = 'student' | 'admin';

/**
 * Kenyan CBC education levels.
 * Year-by-year: Primary G1–6 → Junior Sec G7–9 → (pathway choice) → Senior Sec G10–12 → University → Alumni
 */
export type SchoolLevel =
  | 'Primary'
  | 'Junior Secondary'
  | 'Senior Secondary'
  | 'University'
  | 'Alumni';

export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected';


export type Priority = 'normal' | 'important';

/** Who can see an announcement / notification */
export type AnnouncementAudience = 'all' | 'admin' | 'students';

/** KNEC CBC performance levels (Primary & Junior Secondary) — 8-point scale */
export type CbcLevel =
  | 'EE1'
  | 'EE2'
  | 'ME1'
  | 'ME2'
  | 'AE1'
  | 'AE2'
  | 'BE1'
  | 'BE2';

/** Traditional / KCSE-style mean grades (Senior Secondary & University) */
export type MeanGrade =
  | 'A'
  | 'A-'
  | 'B+'
  | 'B'
  | 'B-'
  | 'C+'
  | 'C'
  | 'C-'
  | 'D+'
  | 'D'
  | 'D-'
  | 'E';

export type ScholarStatus =
  | 'Active'
  | 'Promoted'
  | 'Graduated'
  | 'Exited';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  schoolLevel?: SchoolLevel;
  scholarId?: number;
}

export interface DocumentFile {
  name: string;
  dataUrl: string;
  type: string;
}

/** Master student record — only admin can create */
export interface Scholar {
  id: number;
  fullName: string;
  email: string;
  password: string;
  school: string;
  schoolLevel: SchoolLevel;
  /** e.g. Grade 6, Grade 9, Grade 11, Year 2 */
  currentClass: string;
  region: string;
  dateJoined: string;
  status: ScholarStatus;
  /** Required before advancing Junior Sec → Senior Sec */
  pathway?: string;
  programme?: string;
}

export interface Application {
  id: number;
  scholarId?: number;
  studentName: string;
  email: string;
  school: string;
  schoolLevel: SchoolLevel;
  course: string;
  meanScore: number;
  meanGrade: string;
  appliedDate: string;
  status: ApplicationStatus;
  amountRequested: number;
  sponsorshipAmount?: number;
  nextPaymentDate?: string;
  /** If true, approving this upload advances the scholar one CBC year */
  isEndOfYear?: boolean;
  lastUploadDate?: string;
  currentTermFees: number;
  currentTermResults: string;
  region: string;
  documents: DocumentFile[];
  /** Fee coverage for this term (tracking only) */
  feeStatus?: 'Paid' | 'Pending';
}

export interface Announcement {
  id: number;
  title: string;
  message: string;
  date: string;
  priority: Priority;
  /** Who should see this */
  audience: AnnouncementAudience;
  /** If set, only this email sees it (personal notification) */
  targetEmail?: string;
  /** Emails of users who have seen it */
  seenBy: string[];
}

export interface Message {
  id: number;
  from: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
  reply?: string;
  replyRead?: boolean;
}
