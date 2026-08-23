import { useState } from 'react';
import { useAnnouncementsStore } from '../../store/useAnnouncementsStore';
import { Megaphone, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Priority } from '../../types';

const AdminAnnouncements = () => {
  const { announcements, addAnnouncement, deleteAnnouncement } =
    useAnnouncementsStore();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<Priority>('normal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    addAnnouncement(title.trim(), message.trim(), priority, 'students');
    toast.success('Announcement posted');
    setTitle('');
    setMessage('');
    setPriority('normal');
  };

  return (
    <div className="max-w-3xl space-y-10">
      <p className="text-gray-600 dark:text-gray-400">
        Communicate important updates to all scholars
      </p>

      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800">
        <h3 className="font-semibold mb-5">Create new announcement</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Announcement title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl bg-transparent focus:border-emerald-500 outline-none"
            required
          />
          <textarea
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl bg-transparent focus:border-emerald-500 outline-none resize-none"
            required
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPriority('normal')}
              className={`flex-1 py-2.5 rounded-2xl text-sm font-medium transition ${
                priority === 'normal'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              Normal
            </button>
            <button
              type="button"
              onClick={() => setPriority('important')}
              className={`flex-1 py-2.5 rounded-2xl text-sm font-medium transition ${
                priority === 'important'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              Important
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-semibold transition"
          >
            Post Announcement
          </button>
        </form>
      </div>

      <div>
        <h3 className="font-semibold mb-4">
          Posted to scholars ({announcements.filter((a) => a.audience === 'students' || a.audience === 'all').length})
        </h3>
        {announcements.filter((a) => a.audience === 'students' || a.audience === 'all').length === 0 ? (
          <p className="text-gray-500">No announcements yet.</p>
        ) : (
          <div className="space-y-3">
            {announcements.filter((a) => a.audience === 'students' || a.audience === 'all').map((ann) => (
              <div
                key={ann.id}
                className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800 flex justify-between items-start gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Megaphone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {ann.title}
                    </h4>
                    {ann.priority === 'important' && (
                      <span className="text-xs bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 px-2 py-0.5 rounded-full">
                        Important
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {ann.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-3">{ann.date}</p>
                </div>
                <button
                  onClick={() => {
                    deleteAnnouncement(ann.id);
                    toast.success('Announcement deleted');
                  }}
                  className="text-red-500 hover:text-red-700 p-1 shrink-0"
                  aria-label="Delete announcement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnnouncements;
