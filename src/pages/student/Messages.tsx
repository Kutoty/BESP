import { useState, useEffect } from 'react';
import { useMessagesStore } from '../../store/useMessagesStore';
import { useRoleStore } from '../../store/useRoleStore';
import { Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const StudentMessages = () => {
  const { messages, addMessage, markReplyRead } = useMessagesStore();
  const { currentUser } = useRoleStore();

  const [subject, setSubject] = useState('');
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);

  const myMessages = messages.filter((m) => m.email === currentUser?.email);

  // Mark admin replies as read when student views this page
  useEffect(() => {
    myMessages.forEach((m) => {
      if (m.reply && !m.replyRead) {
        markReplyRead(m.id);
      }
    });
  }, [myMessages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !messageText.trim()) {
      toast.error('Please fill in both subject and message');
      return;
    }

    setSending(true);
    setTimeout(() => {
      addMessage(
        currentUser?.name || 'Student',
        currentUser?.email || '',
        subject.trim(),
        messageText.trim()
      );
      toast.success('Message sent to admin');
      setSubject('');
      setMessageText('');
      setSending(false);
    }, 500);
  };

  return (
    <div className="max-w-2xl space-y-8">
      <p className="text-gray-600 dark:text-gray-400">
        Communicate directly with the programme administrators
      </p>

      <div className="space-y-4">
        {myMessages.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-800">
            <p className="text-gray-500">No messages yet. Send one below.</p>
          </div>
        ) : (
          myMessages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800"
            >
              <div className="flex justify-between text-sm text-gray-500">
                <span>{msg.date}</span>
                <span className="text-emerald-600">To Admin</span>
              </div>
              <p className="font-medium mt-2 text-gray-900 dark:text-white">
                {msg.subject}
              </p>
              <p className="mt-2 text-gray-700 dark:text-gray-300">{msg.message}</p>

              {msg.reply && (
                <div className="mt-4 pl-4 border-l-4 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-r-2xl">
                  <p className="text-sm text-emerald-600 font-medium">Admin reply</p>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">{msg.reply}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800">
        <h3 className="font-semibold mb-4">New message</h3>
        <form onSubmit={handleSend} className="space-y-4">
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl bg-transparent focus:border-emerald-500 outline-none"
            required
          />
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            rows={4}
            placeholder="Write your message..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl bg-transparent focus:border-emerald-500 outline-none resize-none"
            required
          />
          <button
            type="submit"
            disabled={sending}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            {sending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Message
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentMessages;
