import { useMemo, useState } from 'react';
import { useScholarsStore } from '../../store/useScholarsStore';
import { useApplicationsStore } from '../../store/useApplicationsStore';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  UserPlus,
  BookOpen,
  Users,
  Building2,
  GraduationCap,
  UserCheck,
  FileUp,
  FileX,
  LayoutGrid,
} from 'lucide-react';
import {
  getLevelBadgeClasses,
  getStatusBadgeClasses,
} from '../../lib/utils';
import type { SchoolLevel } from '../../types';

const LEVEL_ICONS: Record<SchoolLevel, typeof BookOpen> = {
  Primary: BookOpen,
  'Junior Secondary': Users,
  'Senior Secondary': Building2,
  University: GraduationCap,
  Alumni: UserCheck,
};

const LEVEL_ICON_BG: Record<SchoolLevel, string> = {
  Primary: 'bg-sky-500 text-white',
  'Junior Secondary': 'bg-amber-500 text-white',
  'Senior Secondary': 'bg-rose-500 text-white',
  University: 'bg-emerald-600 text-white',
  Alumni: 'bg-slate-500 text-white',
};

const PATH_LEVELS: SchoolLevel[] = [
  'Primary',
  'Junior Secondary',
  'Senior Secondary',
  'University',
  'Alumni',
];

const MyStudents = () => {
  const { scholars } = useScholarsStore();
  const { applications } = useApplicationsStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'All' | SchoolLevel>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const uploadedEmails = useMemo(() => {
    return new Set(applications.map((a) => a.email.toLowerCase()));
  }, [applications]);

  const counts: Record<SchoolLevel, number> = {
    Primary: scholars.filter((s) => s.schoolLevel === 'Primary').length,
    'Junior Secondary': scholars.filter(
      (s) => s.schoolLevel === 'Junior Secondary'
    ).length,
    'Senior Secondary': scholars.filter(
      (s) => s.schoolLevel === 'Senior Secondary'
    ).length,
    University: scholars.filter((s) => s.schoolLevel === 'University').length,
    Alumni: scholars.filter((s) => s.schoolLevel === 'Alumni').length,
  };

  const filtered = scholars.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (activeTab === 'All') return s.schoolLevel !== 'Alumni';
    return s.schoolLevel === activeTab;
  });

  const shortLabel = (level: SchoolLevel) =>
    level === 'Junior Secondary'
      ? 'Junior Sec'
      : level === 'Senior Secondary'
      ? 'Senior Sec'
      : level;

  const hasUploaded = (email: string) =>
    uploadedEmails.has(email.toLowerCase());

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-gray-600 dark:text-gray-400">
          Click a scholar to open their full profile and results.
        </p>
        <Link
          to="/admin/add-scholar"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-medium transition shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Add Scholar
        </Link>
      </div>

      {/* CBC pathway = filters + search (single control) */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-gray-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-gray-500">CBC pathway</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Tap a stage to filter the list
            </p>
          </div>
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-3.5 top-3 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search scholars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-900 text-sm focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-950 outline-none transition"
            />
          </div>
        </div>

        <div className="relative max-w-2xl mx-auto">
          <div className="absolute top-7 left-[8%] right-[8%] h-0.5 bg-gray-200 dark:bg-gray-700" />
          <div className="relative grid grid-cols-6 gap-1">
            {/* All */}
            <div className="flex flex-col items-center text-center">
              <button
                type="button"
                onClick={() => setActiveTab('All')}
                title="All scholars"
                className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  activeTab === 'All'
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-lg ring-4 ring-gray-200 dark:ring-gray-700'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <LayoutGrid className="w-6 h-6" strokeWidth={2.25} />
              </button>
              <p
                className={`mt-2.5 text-xs font-semibold ${
                  activeTab === 'All'
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-400'
                }`}
              >
                All
              </p>
              <p className="text-lg font-bold tabular-nums mt-0.5 text-gray-900 dark:text-white">
                {scholars.filter((s) => s.schoolLevel !== 'Alumni').length}
              </p>
            </div>

            {PATH_LEVELS.map((level) => {
              const Icon = LEVEL_ICONS[level];
              const count = counts[level];
              const active = activeTab === level;
              return (
                <div key={level} className="flex flex-col items-center text-center">
                  <button
                    type="button"
                    onClick={() => setActiveTab(level)}
                    title={shortLabel(level)}
                    className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-all ${
                      LEVEL_ICON_BG[level]
                    } ${
                      active
                        ? 'ring-4 ring-offset-2 ring-gray-300 dark:ring-gray-600 dark:ring-offset-gray-900 scale-105'
                        : 'opacity-80 hover:opacity-100 hover:scale-[1.03]'
                    }`}
                  >
                    <Icon className="w-6 h-6" strokeWidth={2.25} />
                  </button>
                  <p
                    className={`mt-2.5 text-xs font-semibold ${
                      active
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-500'
                    }`}
                  >
                    {shortLabel(level)}
                  </p>
                  <p
                    className={`text-lg font-bold tabular-nums mt-0.5 ${
                      count > 0
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-300'
                    }`}
                  >
                    {count}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/80">
              <tr>
                <th className="px-5 py-4 text-left font-medium text-gray-600 dark:text-gray-300">
                  Scholar
                </th>
                <th className="px-5 py-4 text-left font-medium text-gray-600 dark:text-gray-300">
                  Level
                </th>
                <th className="px-5 py-4 text-left font-medium text-gray-600 dark:text-gray-300">
                  Class
                </th>
                <th className="px-5 py-4 text-left font-medium text-gray-600 dark:text-gray-300">
                  School
                </th>
                <th className="px-5 py-4 text-left font-medium text-gray-600 dark:text-gray-300">
                  Upload
                </th>
                <th className="px-5 py-4 text-left font-medium text-gray-600 dark:text-gray-300">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-16 text-center text-gray-500"
                  >
                    No scholars found
                  </td>
                </tr>
              ) : (
                filtered.map((s) => {
                  const uploaded = hasUploaded(s.email);
                  return (
                    <tr
                      key={s.id}
                      onClick={() => navigate(`/admin/scholar/${s.id}`)}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {s.fullName}
                        </p>
                        <p className="text-xs text-gray-500">{s.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${getLevelBadgeClasses(
                            s.schoolLevel
                          )}`}
                        >
                          {s.schoolLevel}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-600 dark:text-gray-400">
                        {s.currentClass}
                        {s.pathway ? (
                          <span className="block text-xs text-gray-400">
                            {s.pathway}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-5 py-4 text-gray-600 dark:text-gray-400">
                        {s.school}
                      </td>
                      <td className="px-5 py-4">
                        {s.schoolLevel === 'Alumni' ? (
                          <span className="text-xs text-gray-400">—</span>
                        ) : uploaded ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            <FileUp className="w-3 h-3" />
                            Uploaded
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            <FileX className="w-3 h-3" />
                            Not yet
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClasses(
                            s.status
                          )}`}
                        >
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyStudents;
