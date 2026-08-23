import { useMessagesStore } from '../../store/useMessagesStore';
import { useState } from 'react';
import { toast } from 'sonner';

const AdminMessages = () => {
  const { messages, addReply, markAsRead } = useMessagesStore();
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const handleReply = (id: number) => {
    if (!replyText.trim()) return;
    addReply(id, replyText.trim());
    markAsRead(id);
    toast.success('Reply sent to student');
    setReplyText('');
    setReplyingTo(null);
  };

  return (
    <div className="max-w-3xl space-y-8">
      <p className="text-gray-600 dark:text-gray-400">
        View and respond to messages from scholars
      </p>

      {messages.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-16 text-center border border-gray-100 dark:border-gray-800">
          <p className="text-gray-500">No messages from students yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800"
            >
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {msg.from}
                  </p>
                  <p className="text-sm text-gray-500">
                    {msg.email} · {msg.date}
                  </p>
                </div>
                {!msg.read && (
                  <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 px-2.5 py-1 rounded-full shrink-0">
                    New
                  </span>
                )}
              </div>

              <div className="mt-4">
                <p className="font-medium text-gray-900 dark:text-white">
                  {msg.subject}
                </p>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  {msg.message}
                </p>
              </div>

              {msg.reply && (
                <div className="mt-4 pl-4 border-l-4 border-emerald-500">
                  <p className="text-sm text-emerald-600 font-medium">Your reply</p>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {msg.reply}
                  </p>
                </div>
              )}

              {!msg.reply && (
                <div className="mt-5">
                  {replyingTo === msg.id ? (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply..."
                        className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-2xl bg-transparent focus:border-emerald-500 outline-none text-sm"
                        autoFocus
                      />
                      <button
                        onClick={() => handleReply(msg.id)}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-medium transition"
                      >
                        Send
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setReplyingTo(msg.id);
                        markAsRead(msg.id);
                      }}
                      className="text-emerald-600 font-medium text-sm hover:underline"
                    >
                      Reply to student
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
