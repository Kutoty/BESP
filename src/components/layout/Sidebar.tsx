import { Link, useLocation } from 'react-router-dom';
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
  Leaf,
  UserPlus,
} from 'lucide-react';

const Sidebar = () => {
  const { currentRole, currentUser } = useRoleStore();
  const { messages } = useMessagesStore();
  const { applications } = useApplicationsStore();
  const { unreadCountFor } = useAnnouncementsStore();
  const location = useLocation();

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
    <aside className="hidden md:flex w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen fixed left-0 top-0 flex-col z-40">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-sm">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
              Mara Conservancy
            </h1>
            <p className="text-xs text-emerald-600 font-medium">Scholars Programme</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 overflow-y-auto sidebar-scroll">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const badge = 'badge' in item ? (item.badge as number) : 0;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all relative ${
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
  );
};

export default Sidebar;
