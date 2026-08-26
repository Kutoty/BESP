import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useRoleStore } from '../../store/useRoleStore';
import { useMessagesStore } from '../../store/useMessagesStore';
import { useApplicationsStore } from '../../store/useApplicationsStore';
import { useAnnouncementsStore } from '../../store/useAnnouncementsStore';
import {
  Award,
  Home,
  BarChart3,
  Bell,
  Megaphone,
  MessageCircle,
  TrendingUp,
  Upload,
  UserPlus,
  X,
} from 'lucide-react';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MobileDrawer = ({ open, onClose }: MobileDrawerProps) => {
  const { currentRole, currentUser } = useRoleStore();
  const { messages } = useMessagesStore();
  const { applications } = useApplicationsStore();
  const { unreadCountFor } = useAnnouncementsStore();
  const location = useLocation();

  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (path: string) => {
    if (path === '/admin' || path === '/student') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const email = currentUser?.email || '';
  const unreadMessages = messages.filter((m) => !m.read).length;
  const pendingUploads = applications.filter((app) => app.status === 'Pending').length;
  const myUnreadReplies = messages.filter(
    (m) => m.email === email && m.reply && !m.replyRead
  ).length;
  const studentUnreadAnn = unreadCountFor(email, 'student');
  const adminUnreadAnn = unreadCountFor(email, 'admin');

  const adminNav = [
    { icon: Award, label: 'My Students', path: '/admin' },
    { icon: UserPlus, label: 'Add Scholar', path: '/admin/add-scholar' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    {
      icon: Bell,
      label: 'Notifications',
      path: '/admin/notifications',
      badge: pendingUploads + adminUnreadAnn,
    },
    { icon: Megaphone, label: 'Announcements', path: '/admin/announcements' },
    { icon: MessageCircle, label: 'Messages', path: '/admin/messages', badge: unreadMessages },
  ];

  const studentNav = [
    { icon: Home, label: 'Dashboard', path: '/student' },
    { icon: Upload, label: 'Upload Results', path: '/student/upload' },
    { icon: TrendingUp, label: 'Performance', path: '/student/performance' },
    {
      icon: Megaphone,
      label: 'Announcements',
      path: '/student/announcements',
      badge: studentUnreadAnn,
    },
    {
      icon: MessageCircle,
      label: 'Messages',
      path: '/student/messages',
      badge: myUnreadReplies,
    },
  ];

  const navItems = currentRole === 'admin' ? adminNav : studentNav;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[min(100%,18rem)] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!open}
      >
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800 flex items-start justify-between gap-2">
          <div className="flex flex-col items-center flex-1 gap-1.5 min-w-0">
            <div className="w-[140px] h-11 flex items-center justify-center overflow-hidden px-2">
              <img
                src="/Conservancy+logo+III.png"
                alt="Borana Conservancy"
                className="h-9 w-auto max-w-full object-contain"
              />
            </div>
            <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 tracking-wide text-center">
              Education Programme
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto sidebar-scroll">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const badge = 'badge' in item ? (item.badge as number) : 0;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all ${
                      active
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                    {badge > 0 && (
                      <span
                        className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center ${
                          active ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
                        }`}
                      >
                        {badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="m-4 p-4 bg-gray-50 dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Signed in as</p>
          <p className="font-semibold text-gray-900 dark:text-white truncate">
            {currentUser?.name ?? currentRole}
          </p>
          <p className="text-xs text-emerald-600 mt-0.5 capitalize">
            {currentRole} Portal
          </p>
        </div>
      </aside>
    </>
  );
};

export default MobileDrawer;