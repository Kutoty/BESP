import { create } from 'zustand';
import type { Scholar, SchoolLevel, ScholarStatus } from '../types';
import { getNextGradeStep, levelDisplayName } from '../lib/utils';
import { useAnnouncementsStore } from './useAnnouncementsStore';
import { useApplicationsStore } from './useApplicationsStore';

interface ScholarsStore {
  scholars: Scholar[];
  addScholar: (data: Omit<Scholar, 'id' | 'dateJoined' | 'status'>) => Scholar;
  /** Advance one CBC year (Grade 5→6, 9→10 with pathway, etc.) */
  advanceYear: (id: number, newSchool?: string) => { ok: boolean; error?: string };
  setPathway: (id: number, pathway: string) => void;
  exitScholar: (id: number) => void;
  updateScholar: (id: number, patch: Partial<Scholar>) => void;
  getScholarByEmail: (email: string) => Scholar | undefined;
}

export const useScholarsStore = create<ScholarsStore>((set, get) => ({
  scholars: [
    {
      id: 1,
      fullName: 'Aisha Mohammed',
      email: 'aisha.m@email.com',
      password: 'student123',
      school: 'Mara Primary School',
      schoolLevel: 'Primary',
      currentClass: 'Grade 6',
      region: 'Rift Valley',
      dateJoined: '2024-01-15',
      status: 'Active',
    },
    {
      id: 2,
      fullName: 'John Okoro',
      email: 'john.okoro@email.com',
      password: 'student123',
      school: 'Rift Valley High School',
      schoolLevel: 'Senior Secondary',
      currentClass: 'Grade 11',
      region: 'Rift Valley',
      dateJoined: '2023-02-10',
      status: 'Active',
      pathway: 'STEM',
    },
    {
      id: 3,
      fullName: 'Fatima Hassan',
      email: 'fatima.h@email.com',
      password: 'student123',
      school: 'Kajiado Primary',
      schoolLevel: 'Primary',
      currentClass: 'Grade 5',
      region: 'Rift Valley',
      dateJoined: '2024-03-01',
      status: 'Active',
    },
    {
      id: 4,
      fullName: 'Mary Wanjiku',
      email: 'mary.w@email.com',
      password: 'student123',
      school: 'Ngong Girls Secondary',
      schoolLevel: 'Junior Secondary',
      currentClass: 'Grade 9',
      region: 'Rift Valley',
      dateJoined: '2023-09-01',
      status: 'Active',
    },
    {
      id: 5,
      fullName: 'Ahmed Hassan',
      email: 'ahmed.h@email.com',
      password: 'student123',
      school: 'University of Nairobi',
      schoolLevel: 'University',
      currentClass: 'Year 3',
      region: 'Nairobi',
      dateJoined: '2022-09-01',
      status: 'Active',
      programme: 'BSc Computer Science',
    },
  ],

  addScholar: (data) => {
    const scholar: Scholar = {
      ...data,
      id: Date.now(),
      dateJoined: new Date().toISOString().split('T')[0],
      status: 'Active',
    };
    set((s) => ({ scholars: [scholar, ...s.scholars] }));
    return scholar;
  },

  advanceYear: (id, newSchool) => {
    const scholar = get().scholars.find((s) => s.id === id);
    if (!scholar) return { ok: false, error: 'Scholar not found' };

    const step = getNextGradeStep(scholar.schoolLevel, scholar.currentClass);
    if (!step) return { ok: false, error: 'No further progression available' };

    if (step.requiresPathway && !scholar.pathway) {
      return {
        ok: false,
        error:
          'Student must choose a Senior Secondary pathway (STEM / Social Sciences / Arts and Sports Science) before advancing from Grade 9.',
      };
    }

    set((s) => ({
      scholars: s.scholars.map((sch) => {
        if (sch.id !== id) return sch;
        if (step.level === 'Alumni') {
          return {
            ...sch,
            schoolLevel: 'Alumni' as SchoolLevel,
            currentClass: 'Alumni',
            status: 'Exited' as ScholarStatus,
          };
        }
        return {
          ...sch,
          schoolLevel: step.level,
          currentClass: step.currentClass,
          school: newSchool || sch.school,
          status: 'Active' as ScholarStatus,
        };
      }),
    }));
    return { ok: true };
  },

  setPathway: (id, pathway) => {
    set((s) => ({
      scholars: s.scholars.map((sch) =>
        sch.id === id ? { ...sch, pathway, status: 'Active' as ScholarStatus } : sch
      ),
    }));

    // If Grade 9 end-of-year was already approved while waiting for pathway, advance now
    const scholar = get().scholars.find((s) => s.id === id);
    if (!scholar) return;

    const next = getNextGradeStep(scholar.schoolLevel, scholar.currentClass);
    if (!next || !next.requiresPathway) return;

    const apps = useApplicationsStore.getState().applications;
    const hasApprovedEndOfYear = apps.some(
      (a) =>
        a.email.toLowerCase() === scholar.email.toLowerCase() &&
        a.status === 'Approved' &&
        a.isEndOfYear
    );
    if (!hasApprovedEndOfYear) return;

    const result = get().advanceYear(id);
    if (!result.ok) return;

    const advanced = get().getScholarByEmail(scholar.email);
    if (!advanced) return;

    useAnnouncementsStore.getState().addAnnouncement(
      'Advanced to next year',
      `You have moved to ${advanced.currentClass} — ${levelDisplayName(advanced.schoolLevel)} (${pathway} pathway).`,
      'important',
      'students',
      scholar.email
    );
  },

  exitScholar: (id) => {
    set((s) => ({
      scholars: s.scholars.map((sch) =>
        sch.id === id
          ? {
              ...sch,
              schoolLevel: 'Alumni' as SchoolLevel,
              currentClass: 'Alumni',
              status: 'Exited' as ScholarStatus,
            }
          : sch
      ),
    }));
  },

  updateScholar: (id, patch) => {
    set((s) => ({
      scholars: s.scholars.map((sch) =>
        sch.id === id ? { ...sch, ...patch } : sch
      ),
    }));
  },

  getScholarByEmail: (email) =>
    get().scholars.find((s) => s.email.toLowerCase() === email.toLowerCase()),
}));
