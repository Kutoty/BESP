import { create } from 'zustand';
import type { Message } from '../types';

interface MessagesStore {
  messages: Message[];
  addMessage: (from: string, email: string, subject: string, message: string) => void;
  markAsRead: (id: number) => void;
  addReply: (id: number, reply: string) => void;
  markReplyRead: (id: number) => void;
}

export const useMessagesStore = create<MessagesStore>((set) => ({
  messages: [],

  addMessage: (from, email, subject, message) =>
    set((state) => ({
      messages: [
        {
          id: Date.now(),
          from,
          email,
          subject,
          message,
          date: new Date().toISOString().split('T')[0],
          read: false,
          replyRead: false,
        },
        ...state.messages,
      ],
    })),

  markAsRead: (id) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, read: true } : m
      ),
    })),

  addReply: (id, reply) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, reply, read: true, replyRead: false } : m
      ),
    })),

  markReplyRead: (id) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, replyRead: true } : m
      ),
    })),
}));
