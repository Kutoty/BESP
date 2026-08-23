import type { SchoolLevel, MeanGrade } from '../types';

/** Format amount as Kenyan Shillings */
export function formatKsh(amount: number): string {
  return `KSh ${amount.toLocaleString('en-KE')}`;
}

/**
 * KNEC CBC performance levels (Primary & Junior Secondary).
 * Official 8-point scale used in KPSEA / KJSEA reporting.
 * Source: KNEC Competency-Based Assessment Framework.
 */
export type CbcPerformanceLevel =
  | 'EE1'
  | 'EE2'
  | 'ME1'
  | 'ME2'
  | 'AE1'
  | 'AE2'
  | 'BE1'
  | 'BE2';

export const CBC_LEVELS: {
  code: CbcPerformanceLevel;
  label: string;
  band: string;
  points: number;
  range: string;
}[] = [
  { code: 'EE1', label: 'Exceeding Expectations 1', band: 'Exceeding Expectations', points: 8, range: '90–100%' },
  { code: 'EE2', label: 'Exceeding Expectations 2', band: 'Exceeding Expectations', points: 7, range: '75–89%' },
  { code: 'ME1', label: 'Meeting Expectations 1', band: 'Meeting Expectations', points: 6, range: '58–74%' },
  { code: 'ME2', label: 'Meeting Expectations 2', band: 'Meeting Expectations', points: 5, range: '41–57%' },
  { code: 'AE1', label: 'Approaching Expectations 1', band: 'Approaching Expectations', points: 4, range: '31–40%' },
  { code: 'AE2', label: 'Approaching Expectations 2', band: 'Approaching Expectations', points: 3, range: '21–30%' },
  { code: 'BE1', label: 'Below Expectations 1', band: 'Below Expectations', points: 2, range: '11–20%' },
  { code: 'BE2', label: 'Below Expectations 2', band: 'Below Expectations', points: 1, range: '0–10%' },
];

export function cbcCodeToLabel(code: string): string {
  return CBC_LEVELS.find((l) => l.code === code)?.label ?? code;
}

export function cbcCodeToBand(code: string): string {
  return CBC_LEVELS.find((l) => l.code === code)?.band ?? code;
}

export function cbcCodeToPoints(code: string): number {
  return CBC_LEVELS.find((l) => l.code === code)?.points ?? 0;
}

/** Map mid-range percentage → official KNEC CBC level (for demo charts) */
export function percentageToCbcLevel(pct: number): CbcPerformanceLevel {
  if (pct >= 90) return 'EE1';
  if (pct >= 75) return 'EE2';
  if (pct >= 58) return 'ME1';
  if (pct >= 41) return 'ME2';
  if (pct >= 31) return 'AE1';
  if (pct >= 21) return 'AE2';
  if (pct >= 11) return 'BE1';
  return 'BE2';
}

/** Approximate percentage from CBC level (for charts that need a number) */
export function cbcLevelToApproxPercent(code: string): number {
  const map: Record<string, number> = {
    EE1: 95, EE2: 82, ME1: 66, ME2: 49, AE1: 35, AE2: 25, BE1: 15, BE2: 5,
  };
  return map[code] ?? 50;
}

/** CBC subjects by level */
export function subjectsForLevel(level?: SchoolLevel, pathway?: string): string[] {
  switch (level) {
    case 'Primary':
      return [
        'English',
        'Kiswahili',
        'Mathematics',
        'Science and Technology',
        'Social Studies',
        'Creative Arts',
        'Physical and Health Education',
        'Religious Education (CRE/IRE/HRE)',
      ];
    case 'Junior Secondary':
      return [
        'English',
        'Kiswahili / Kenyan Sign Language',
        'Mathematics',
        'Integrated Science',
        'Social Studies',
        'Agriculture & Nutrition',
        'Pre-Technical Studies',
        'Creative Arts & Sports',
        'Religious Education',
      ];
    case 'Senior Secondary': {
      const core = [
        'English',
        'Kiswahili',
        'Mathematics',
        'Community Service Learning',
        'Physical Education',
      ];
      if (pathway === 'STEM') {
        return [...core, 'Physics / Biology', 'Chemistry', 'Computer Science / Agriculture'];
      }
      if (pathway === 'Social Sciences') {
        return [...core, 'History / Geography', 'Business Studies', 'Religious Education'];
      }
      if (pathway === 'Arts and Sports Science') {
        return [...core, 'Sports Science', 'Music / Fine Arts', 'Performing Arts'];
      }
      return [...core, 'Core Pathway Subject 1', 'Core Pathway Subject 2', 'Elective Subject'];
    }
    case 'University':
      return [
        'Core Unit 1',
        'Core Unit 2',
        'Core Unit 3',
        'Elective / Specialisation Unit',
        'Research / Project (if applicable)',
      ];
    default:
      return ['English', 'Kiswahili', 'Mathematics', 'Science', 'Social Studies'];
  }
}

/** Senior Secondary pathways (chosen after Junior Secondary) */
export const SENIOR_PATHWAYS = [
  'STEM',
  'Social Sciences',
  'Arts and Sports Science',
] as const;

export type SeniorPathway = (typeof SENIOR_PATHWAYS)[number];

/** Senior Secondary / University letter grade */
export function percentageToMeanGrade(pct: number): MeanGrade {
  if (pct >= 80) return 'A';
  if (pct >= 75) return 'A-';
  if (pct >= 70) return 'B+';
  if (pct >= 65) return 'B';
  if (pct >= 60) return 'B-';
  if (pct >= 55) return 'C+';
  if (pct >= 50) return 'C';
  if (pct >= 45) return 'C-';
  if (pct >= 40) return 'D+';
  if (pct >= 35) return 'D';
  if (pct >= 30) return 'D-';
  return 'E';
}

export function scoreToDisplayGrade(pct: number, level: SchoolLevel): string {
  if (level === 'Primary' || level === 'Junior Secondary') {
    return percentageToCbcLevel(pct);
  }
  return percentageToMeanGrade(pct);
}

export function formatGradeLabel(level: SchoolLevel): string {
  if (level === 'Primary' || level === 'Junior Secondary') {
    return 'Performance Level';
  }
  return 'Mean Grade';
}

export function getMeanGradeColour(grade: string): string {
  if (grade.startsWith('EE') || grade.startsWith('A')) return 'text-emerald-600';
  if (grade.startsWith('ME') || grade.startsWith('B')) return 'text-blue-600';
  if (grade.startsWith('AE') || grade.startsWith('C')) return 'text-amber-600';
  return 'text-red-600';
}

export function getLevelBadgeClasses(level: SchoolLevel): string {
  switch (level) {
    case 'Primary':
      return 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300';
    case 'Junior Secondary':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
    case 'Senior Secondary':
      return 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300';
    case 'University':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
    case 'Alumni':
      return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  }
}

export function getStatusBadgeClasses(status: string): string {
  switch (status) {
    case 'Approved':
    case 'Active':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
    case 'Pending':
    case 'Promoted':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
    case 'Rejected':
      return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
    case 'Graduated':
    case 'Exited':
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export const PROGRESSION_ORDER: SchoolLevel[] = [
  'Primary',
  'Junior Secondary',
  'Senior Secondary',
  'University',
  'Alumni',
];

export function nextLevel(current: SchoolLevel): SchoolLevel | null {
  const idx = PROGRESSION_ORDER.indexOf(current);
  if (idx < 0 || idx >= PROGRESSION_ORDER.length - 1) return null;
  return PROGRESSION_ORDER[idx + 1];
}

export function levelDisplayName(level: SchoolLevel): string {
  const map: Record<SchoolLevel, string> = {
    Primary: 'Primary (Grade 1–6)',
    'Junior Secondary': 'Junior Secondary (Grade 7–9)',
    'Senior Secondary': 'Senior Secondary (Grade 10–12)',
    University: 'University / Tertiary',
    Alumni: 'Alumni (Exited)',
  };
  return map[level] ?? level;
}

/** Grades that use CBC competency selectors (not percentage inputs) */
export function usesCbcGrading(level?: SchoolLevel): boolean {
  return level === 'Primary' || level === 'Junior Secondary';
}


/** Parse grade number from currentClass e.g. "Grade 6" → 6, "Year 2" → 2 */
export function parseGradeNumber(currentClass: string): number | null {
  const m = currentClass.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

/**
 * CBC year-by-year next step.
 * Returns null when the scholar should exit (end of university) or is already Alumni.
 * Junior Sec Grade 9 → Senior Sec requires pathway chosen by student first.
 */
export function getNextGradeStep(
  level: SchoolLevel,
  currentClass: string
): { level: SchoolLevel; currentClass: string; requiresPathway: boolean } | null {
  const n = parseGradeNumber(currentClass);

  if (level === 'Primary') {
    if (n == null) return { level: 'Primary', currentClass: 'Grade 2', requiresPathway: false };
    if (n < 6) return { level: 'Primary', currentClass: `Grade ${n + 1}`, requiresPathway: false };
    // Grade 6 → Junior Secondary Grade 7
    return { level: 'Junior Secondary', currentClass: 'Grade 7', requiresPathway: false };
  }

  if (level === 'Junior Secondary') {
    if (n == null) return { level: 'Junior Secondary', currentClass: 'Grade 8', requiresPathway: false };
    if (n < 9) return { level: 'Junior Secondary', currentClass: `Grade ${n + 1}`, requiresPathway: false };
    // Grade 9 → Senior Secondary Grade 10 (pathway required)
    return { level: 'Senior Secondary', currentClass: 'Grade 10', requiresPathway: true };
  }

  if (level === 'Senior Secondary') {
    if (n == null) return { level: 'Senior Secondary', currentClass: 'Grade 11', requiresPathway: false };
    if (n < 12) return { level: 'Senior Secondary', currentClass: `Grade ${n + 1}`, requiresPathway: false };
    // Grade 12 → University Year 1
    return { level: 'University', currentClass: 'Year 1', requiresPathway: false };
  }

  if (level === 'University') {
    if (n == null) return { level: 'University', currentClass: 'Year 2', requiresPathway: false };
    if (n < 4) return { level: 'University', currentClass: `Year ${n + 1}`, requiresPathway: false };
    // End of programme
    return { level: 'Alumni', currentClass: 'Alumni', requiresPathway: false };
  }

  return null;
}


/** Academic year term definition */
export type AcademicTerm = {
  id: string;
  label: string;
  /** YYYY-MM-DD */
  startDate: string;
  endDate: string;
  /** Window when students should upload results */
  uploadOpen: string;
  uploadClose: string;
  /** When next fees are typically due (start of following term or this term) */
  feesDue: string;
  isFinalTerm: boolean;
};

/**
 * CBC-aligned academic calendar for the current programme year.
 * Primary & Junior/Senior Secondary: 3 terms.
 * University: 2 semesters.
 */
export function getAcademicCalendar(
  level?: SchoolLevel,
  year = 2026
): AcademicTerm[] {
  if (level === 'University') {
    return [
      {
        id: `${year}-sem1`,
        label: `Semester 1 ${year}`,
        startDate: `${year}-09-01`,
        endDate: `${year}-12-15`,
        uploadOpen: `${year}-11-15`,
        uploadClose: `${year}-12-20`,
        feesDue: `${year}-09-01`,
        isFinalTerm: false,
      },
      {
        id: `${year + 1}-sem2`,
        label: `Semester 2 ${year + 1}`,
        startDate: `${year + 1}-01-10`,
        endDate: `${year + 1}-04-30`,
        uploadOpen: `${year + 1}-03-20`,
        uploadClose: `${year + 1}-05-05`,
        feesDue: `${year + 1}-01-10`,
        isFinalTerm: true,
      },
    ];
  }

  // Primary, Junior Secondary, Senior Secondary — 3 terms
  return [
    {
      id: `${year}-t1`,
      label: `Term 1 ${year}`,
      startDate: `${year}-01-06`,
      endDate: `${year}-04-04`,
      uploadOpen: `${year}-03-15`,
      uploadClose: `${year}-04-10`,
      feesDue: `${year}-01-06`,
      isFinalTerm: false,
    },
    {
      id: `${year}-t2`,
      label: `Term 2 ${year}`,
      startDate: `${year}-05-05`,
      endDate: `${year}-08-01`,
      uploadOpen: `${year}-07-15`,
      uploadClose: `${year}-08-08`,
      feesDue: `${year}-05-05`,
      isFinalTerm: false,
    },
    {
      id: `${year}-t3`,
      label: `Term 3 ${year}`,
      startDate: `${year}-09-01`,
      endDate: `${year}-11-14`,
      uploadOpen: `${year}-10-20`,
      uploadClose: `${year}-11-20`,
      feesDue: `${year}-09-01`,
      isFinalTerm: true,
    },
  ];
}

/** Pick the term that contains today, or the nearest upcoming / just-ended term */
export function getCurrentTerm(level?: SchoolLevel, today = new Date()): AcademicTerm {
  const terms = getAcademicCalendar(level);
  const iso = today.toISOString().split('T')[0];

  const active = terms.find((t) => t.startDate <= iso && iso <= t.endDate);
  if (active) return active;

  // In a break — use the next term if any, else the last one
  const upcoming = terms.find((t) => t.startDate > iso);
  if (upcoming) return upcoming;
  return terms[terms.length - 1];
}

export function formatDisplayDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Whether today is inside the upload window for a term */
export function isUploadWindowOpen(term: AcademicTerm, today = new Date()): boolean {
  const iso = today.toISOString().split('T')[0];
  return term.uploadOpen <= iso && iso <= term.uploadClose;
}
