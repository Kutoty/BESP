import { create } from 'zustand';
import type { Announcement, Priority, AnnouncementAudience } from '../types';

interface AnnouncementStore {
  announcements: Announcement[];
  addAnnouncement: (
    title: string,
    message: string,
    priority?: Priority,
    audience?: AnnouncementAudience,
    targetEmail?: string
  ) => void;
  deleteAnnouncement: (id: number) => void;
  markSeen: (id: number, email: string) => void;
  markAllSeenFor: (email: string, role: 'student' | 'admin') => void;
  /** Announcements visible to a given user */
  visibleFor: (email: string, role: 'student' | 'admin') => Announcement[];
  unreadCountFor: (email: string, role: 'student' | 'admin') => number;
}

export const useAnnouncementsStore = create<AnnouncementStore>((set, get) => ({
  announcements: [
    {
      id: 1,
      title: 'Next Scholarship Disbursement',
      message:
        'The next round of scholarship funds will be disbursed in the first week of June 2026. Please ensure your latest academic results are uploaded by 25 May 2026.',
      date: '2026-04-15',
      priority: 'important',
      audience: 'students',
      seenBy: [],
    },
  ],

  addAnnouncement: (
    title,
    message,
    priority = 'normal',
    audience = 'students',
    targetEmail
  ) =>
    set((state) => ({
      announcements: [
        {
          id: Date.now() + Math.floor(Math.random() * 1000),
          title,
          message,
          date: new Date().toISOString().split('T')[0],
          priority,
          audience,
          targetEmail,
          seenBy: [],
        },
        ...state.announcements,
      ],
    })),

  deleteAnnouncement: (id) =>
    set((state) => ({
      announcements: state.announcements.filter((a) => a.id !== id),
    })),

  markSeen: (id, email) =>
    set((state) => ({
      announcements: state.announcements.map((a) =>
        a.id === id && !a.seenBy.includes(email)
          ? { ...a, seenBy: [...a.seenBy, email] }
          : a
      ),
    })),

  markAllSeenFor: (email, role) => {
    const visible = get().visibleFor(email, role);
    set((state) => ({
      announcements: state.announcements.map((a) => {
        if (!visible.find((v) => v.id === a.id)) return a;
        if (a.seenBy.includes(email)) return a;
        return { ...a, seenBy: [...a.seenBy, email] };
      }),
    }));
  },

  visibleFor: (email, role) => {
    return get().announcements.filter((a) => {
      // Personal notification for this user
      if (a.targetEmail) {
        return a.targetEmail.toLowerCase() === email.toLowerCase();
      }
      if (role === 'admin') {
        return a.audience === 'admin' || a.audience === 'all';
      }
      // student
      return a.audience === 'students' || a.audience === 'all';
    });
  },

  unreadCountFor: (email, role) => {
    return get()
      .visibleFor(email, role)
      .filter((a) => !a.seenBy.includes(email)).length;
  },
}));
