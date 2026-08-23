import { useEffect } from 'react';
import { useAnnouncementsStore } from '../../store/useAnnouncementsStore';
import { useRoleStore } from '../../store/useRoleStore';
import { Megaphone, Calendar } from 'lucide-react';

const StudentAnnouncements = () => {
  const { visibleFor, markAllSeenFor } = useAnnouncementsStore();
  const { currentUser } = useRoleStore();
  const email = currentUser?.email || '';

  const announcements = visibleFor(email, 'student');

  useEffect(() => {
    if (email) markAllSeenFor(email, 'student');
  }, [email, announcements.length]);

  return (
    <div className="max-w-3xl space-y-8">
      <p className="text-gray-600 dark:text-gray-400">
        Updates from the programme administrator and confirmations about your
        submissions
      </p>

      {announcements.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-16 text-center border border-gray-100 dark:border-gray-800">
          <Megaphone className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500">No announcements at the moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => {
            const isUnread = !ann.seenBy.includes(email);
            return (
              <div
                key={ann.id}
                className={`p-6 sm:p-7 rounded-3xl border-l-4 ${
                  ann.priority === 'important'
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
                    : 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
                } ${isUnread ? 'ring-1 ring-emerald-300 dark:ring-emerald-800' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <Megaphone className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {ann.title}
                      </h3>
                      {isUnread && (
                        <span className="text-[10px] uppercase tracking-wide bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                          New
                        </span>
                      )}
                      {ann.targetEmail && (
                        <span className="text-[10px] uppercase tracking-wide bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                          Personal
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-gray-700 dark:text-gray-300 leading-relaxed">
                      {ann.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-4 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {ann.date}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentAnnouncements;
