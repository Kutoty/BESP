import { LogOut, Bell } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useLocation, Link } from 'react-router-dom';
import { useRoleStore } from '../../store/useRoleStore';
import { useMessagesStore } from '../../store/useMessagesStore';
import { useApplicationsStore } from '../../store/useApplicationsStore';
import { useAnnouncementsStore } from '../../store/useAnnouncementsStore';

const pageTitles: Record<string, string> = {
  '/student': 'Dashboard',
  '/student/upload': 'Upload Term Results & Fees',
  '/student/performance': 'My Performance Curve',
  '/student/announcements': 'Announcements',
  '/student/messages': 'Messages',
  '/admin': 'My Students',
  '/admin/add-scholar': 'Add Scholar',
  '/admin/applications': 'Pending Term Uploads',
  '/admin/analytics': 'Analytics Dashboard',
  '/admin/notifications': 'Notifications',
  '/admin/announcements': 'Announcements',
  '/admin/messages': 'Student Messages',
};

const TopBar = () => {
  const location = useLocation();
  const { currentRole, currentUser, logout } = useRoleStore();
  const { messages } = useMessagesStore();
  const { applications } = useApplicationsStore();
  const { unreadCountFor } = useAnnouncementsStore();

  const getPageTitle = () => {
    if (location.pathname.startsWith('/admin/student/')) return 'Upload Details';
    if (location.pathname.startsWith('/admin/scholar/')) return 'Scholar Profile';
    return (
      pageTitles[location.pathname] ??
      (currentRole === 'admin' ? 'Admin Portal' : 'Student Portal')
    );
  };

  const email = currentUser?.email || '';
  let notifCount = 0;
  let notifLink = '/student/announcements';

  if (currentRole === 'admin') {
    const pending = applications.filter((a) => a.status === 'Pending').length;
    const unreadMsgs = messages.filter((m) => !m.read).length;
    const unreadAnn = unreadCountFor(email, 'admin');
    notifCount = pending + unreadMsgs + unreadAnn;
    notifLink = '/admin/notifications';
  } else {
    const myUnreadReplies = messages.filter(
      (m) => m.email === email && m.reply && !m.replyRead
    ).length;
    const unreadAnn = unreadCountFor(email, 'student');
    notifCount = myUnreadReplies + unreadAnn;
    notifLink =
      myUnreadReplies > 0 ? '/student/messages' : '/student/announcements';
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout();
    }
  };

  return (
    <header className="h-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 fixed right-0 left-0 md:left-72 top-0 z-30">
      <h2 className="font-semibold text-lg sm:text-xl text-gray-900 dark:text-white truncate pr-4">
        {getPageTitle()}
      </h2>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          to={notifLink}
          className="relative p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          {notifCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
              {notifCount > 9 ? '9+' : notifCount}
            </span>
          )}
        </Link>

        <ThemeToggle />

        <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-700">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[140px]">
              {currentUser?.name ?? `${currentRole} Portal`}
            </p>
            <p className="text-xs text-gray-500">Mara Conservancy</p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium hidden lg:inline">Sign out</span>
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="sm:hidden p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl"
          aria-label="Sign out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
