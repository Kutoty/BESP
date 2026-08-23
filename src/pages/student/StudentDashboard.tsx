import { useState } from 'react';
import { useApplicationsStore } from '../../store/useApplicationsStore';
import { useRoleStore } from '../../store/useRoleStore';
import { useScholarsStore } from '../../store/useScholarsStore';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Upload,
  TrendingUp,
  Megaphone,
  BookOpen,
  Users,
  Building2,
  GraduationCap,
  UserCheck,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  formatKsh,
  getMeanGradeColour,
  formatGradeLabel,
  cbcCodeToBand,
  usesCbcGrading,
  levelDisplayName,
  PROGRESSION_ORDER,
  SENIOR_PATHWAYS,
  getNextGradeStep,
  parseGradeNumber,
  getAcademicCalendar,
  getCurrentTerm,
  formatDisplayDate,
  isUploadWindowOpen,
} from '../../lib/utils';
import type { SchoolLevel } from '../../types';

const PATH_ICONS: Record<SchoolLevel, typeof BookOpen> = {
  Primary: BookOpen,
  'Junior Secondary': Users,
  'Senior Secondary': Building2,
  University: GraduationCap,
  Alumni: UserCheck,
};

const PATH_SHORT: Record<SchoolLevel, string> = {
  Primary: 'Primary',
  'Junior Secondary': 'Junior Sec',
  'Senior Secondary': 'Senior Sec',
  University: 'University',
  Alumni: 'Alumni',
};

const StudentDashboard = () => {
  const { applications } = useApplicationsStore();
  const { currentUser } = useRoleStore();
  const { getScholarByEmail, setPathway } = useScholarsStore();
  const [selectedPathway, setSelectedPathway] = useState('');

  const scholar = currentUser?.email
    ? getScholarByEmail(currentUser.email)
    : undefined;
  const myData = applications.find((app) => app.email === currentUser?.email);

  if (!scholar && !myData) {
    return (
      <div className="py-20 text-center">
        <div className="text-5xl mb-4">🌿</div>
        <p className="text-xl font-medium text-gray-900 dark:text-white">
          Scholar profile not found
        </p>
        <p className="text-gray-500 mt-2">
          Contact your programme administrator if this is unexpected.
        </p>
      </div>
    );
  }

  const level = scholar?.schoolLevel || myData?.schoolLevel || 'Primary';
  const firstName = (scholar?.fullName || myData?.studentName || 'Scholar').split(
    ' '
  )[0];
  const grade = myData?.meanGrade || '—';
  const score = myData?.meanScore;
  const gradeDisplay =
    grade !== '—' && usesCbcGrading(level) ? cbcCodeToBand(grade) : grade;

  const currentIdx = PROGRESSION_ORDER.indexOf(level);
  const gradeNum = scholar ? parseGradeNumber(scholar.currentClass) : null;
  const nextStep = scholar
    ? getNextGradeStep(scholar.schoolLevel, scholar.currentClass)
    : null;

  const needsPathway =
    scholar &&
    scholar.schoolLevel === 'Junior Secondary' &&
    gradeNum === 9 &&
    !scholar.pathway;

  const handleSavePathway = () => {
    if (!scholar || !selectedPathway) {
      toast.error('Please select a pathway');
      return;
    }
    setPathway(scholar.id, selectedPathway);
    toast.success(
      `Pathway set to ${selectedPathway}. After your end-of-year results are approved, you will move to Grade 10 automatically.`
    );
  };

  const terms = getAcademicCalendar(level);
  const currentTerm = getCurrentTerm(level);
  const uploadOpen = isUploadWindowOpen(currentTerm);

  return (
    <div className="space-y-7 max-w-6xl">
      {/* Welcome header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-3xl p-7 sm:p-9 shadow-lg shadow-emerald-600/10">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Habari, {firstName}!
            </h1>
            <p className="mt-2 text-base sm:text-lg text-emerald-50/95">
              {scholar?.school || myData?.school} · {levelDisplayName(level)}
            </p>
            {scholar?.currentClass && (
              <p className="text-sm text-emerald-100/80 mt-1">
                {scholar.currentClass}
                {scholar.pathway ? ` · ${scholar.pathway}` : ''}
                {scholar.programme ? ` · ${scholar.programme}` : ''}
              </p>
            )}
          </div>
          <div className="sm:text-right shrink-0">
            <p className="text-xs uppercase tracking-wider text-emerald-100/70 mb-1">
              {formatGradeLabel(level)}
            </p>
            <p className="text-4xl sm:text-5xl font-bold">{grade}</p>
            {usesCbcGrading(level) && gradeDisplay !== '—' && (
              <p className="text-sm text-emerald-50 mt-1">{gradeDisplay}</p>
            )}
            {score != null && !usesCbcGrading(level) && (
              <p className="text-sm text-emerald-100/80 mt-1">{score}%</p>
            )}
          </div>
        </div>
      </div>

      {/* Pathway selection Grade 9 */}
      {needsPathway && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-semibold text-amber-900 dark:text-amber-200 text-lg">
            Choose your Senior Secondary pathway
          </h3>
          <p className="text-sm text-amber-800 dark:text-amber-300">
            You are in Grade 9 (end of Junior Secondary). Before moving to Grade
            10, select the pathway that matches your strengths. This decides the
            subjects you will take in Senior Secondary.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SENIOR_PATHWAYS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setSelectedPathway(p)}
                className={`px-4 py-3.5 rounded-2xl text-sm font-medium border-2 transition-all duration-200 ${
                  selectedPathway === p
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200 shadow-sm scale-[1.02]'
                    : 'border-amber-200 dark:border-amber-800 hover:border-emerald-400 hover:bg-white dark:hover:bg-gray-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleSavePathway}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-semibold transition"
          >
            Confirm pathway
          </button>
        </div>
      )}

      {scholar?.pathway &&
        scholar.schoolLevel === 'Junior Secondary' &&
        gradeNum === 9 && (
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-3xl px-5 py-4 text-sm text-emerald-900 dark:text-emerald-200">
            Your pathway is set to <strong>{scholar.pathway}</strong>. When your
            end-of-year results are approved, you will move to Senior Secondary
            Grade 10 automatically. Your subjects will follow this pathway.
          </div>
        )}

      {/* CBC pathway — equal grid, aligned */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <p className="text-sm font-medium text-gray-500">CBC pathway</p>
            <p className="text-xs text-gray-400 mt-0.5">Your learning journey</p>
          </div>
          {nextStep && nextStep.level !== 'Alumni' && (
            <p className="text-xs text-gray-500 text-right shrink-0">
              Next: {nextStep.currentClass}
              {nextStep.requiresPathway && !scholar?.pathway
                ? ' · choose pathway first'
                : ''}
            </p>
          )}
        </div>

        <div className="relative max-w-xl mx-auto">
          {/* connector line behind nodes */}
          <div className="absolute top-6 left-[10%] right-[10%] h-0.5 bg-gray-200 dark:bg-gray-700" />
          <div
            className="absolute top-6 left-[10%] h-0.5 bg-emerald-400 transition-all"
            style={{
              width:
                currentIdx <= 0
                  ? '0%'
                  : `calc(${(currentIdx / (PROGRESSION_ORDER.length - 1)) * 80}% )`,
            }}
          />

          <div className="relative grid grid-cols-5 gap-1">
            {PROGRESSION_ORDER.map((step, i) => {
              const Icon = PATH_ICONS[step];
              const done = i < currentIdx;
              const current = i === currentIdx;
              return (
                <div key={step} className="flex flex-col items-center text-center">
                  <div
                    className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      current
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 ring-4 ring-emerald-100 dark:ring-emerald-900'
                        : done
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <p
                    className={`mt-2.5 text-xs font-semibold ${
                      current
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : done
                        ? 'text-emerald-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {PATH_SHORT[step]}
                  </p>
                  {current && scholar?.currentClass ? (
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {scholar.currentClass}
                    </p>
                  ) : (
                    <p className="text-[10px] text-transparent mt-0.5">·</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Academic calendar — more visible terms */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-gray-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center">
              <Calendar className="w-4.5 h-4.5 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                Academic calendar
              </p>
              <p className="text-xs text-gray-500">
                {uploadOpen ? (
                  <span className="text-emerald-600 font-medium">
                    Upload window open · {currentTerm.label}
                  </span>
                ) : (
                  <span>Upload window closed · {currentTerm.label}</span>
                )}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 sm:text-right">
            Fees due {formatDisplayDate(currentTerm.feesDue)}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {terms.map((t) => {
            const active = t.id === currentTerm.id;
            const open = isUploadWindowOpen(t);
            return (
              <div
                key={t.id}
                className={`rounded-2xl px-4 py-4 text-sm border-2 transition-all ${
                  active
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/35 shadow-sm shadow-emerald-500/10'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`font-semibold ${
                      active
                        ? 'text-emerald-800 dark:text-emerald-200'
                        : 'text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {t.label}
                  </p>
                  {t.isFinalTerm && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                      Final
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1.5">
                  {formatDisplayDate(t.startDate)} – {formatDisplayDate(t.endDate)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Upload {formatDisplayDate(t.uploadOpen)} –{' '}
                  {formatDisplayDate(t.uploadClose)}
                </p>
                <p
                  className={`text-xs font-medium mt-2 ${
                    open
                      ? 'text-emerald-600'
                      : active
                      ? 'text-gray-500'
                      : 'text-gray-400'
                  }`}
                >
                  {open ? '● Upload window open' : '○ Upload window closed'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800 min-w-0">
          <p className="text-sm text-gray-500">Current Term Fees</p>
          <p className="text-xl font-bold mt-1.5 text-gray-900 dark:text-white break-words">
            {myData ? formatKsh(myData.currentTermFees) : '—'}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800 min-w-0">
          <p className="text-sm text-gray-500">Latest Results</p>
          <p className="text-base sm:text-lg font-bold mt-1.5 text-gray-900 dark:text-white break-words leading-snug">
            {myData?.currentTermResults || 'No upload yet'}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800 min-w-0">
          <p className="text-sm text-gray-500">Next Term Fees Due</p>
          <p className="text-xl font-bold mt-1.5 text-gray-900 dark:text-white break-words">
            {myData ? formatKsh(myData.amountRequested) : '—'}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800 min-w-0">
          <p className="text-sm text-gray-500 break-words">{formatGradeLabel(level)}</p>
          <p className={`text-xl font-bold mt-1.5 break-words ${getMeanGradeColour(grade)}`}>
            {gradeDisplay}
          </p>
        </div>
      </div>

      {/* Quick actions — strong hover */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/student/upload"
          className="group relative bg-white dark:bg-gray-900 rounded-3xl p-6 border-2 border-gray-100 dark:border-gray-800
            hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20
            hover:shadow-lg hover:shadow-emerald-600/10 hover:-translate-y-0.5
            active:scale-[0.99] transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mb-4
            group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/60 transition-colors">
            <Upload className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1.5 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
            Upload Term Results
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
            Submit CBC learning area levels and fee structure for your year
          </p>
          <ArrowRight className="w-4 h-4 text-emerald-600 mt-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
        </Link>

        <Link
          to="/student/performance"
          className="group relative bg-white dark:bg-gray-900 rounded-3xl p-6 border-2 border-gray-100 dark:border-gray-800
            hover:border-sky-400 hover:bg-sky-50/50 dark:hover:bg-sky-950/20
            hover:shadow-lg hover:shadow-sky-600/10 hover:-translate-y-0.5
            active:scale-[0.99] transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/50 flex items-center justify-center mb-4
            group-hover:bg-sky-100 dark:group-hover:bg-sky-900/60 transition-colors">
            <TrendingUp className="w-6 h-6 text-sky-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1.5 group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors">
            Performance Curve
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
            Track progress across terms at your current level
          </p>
          <ArrowRight className="w-4 h-4 text-sky-600 mt-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
        </Link>

        <Link
          to="/student/announcements"
          className="group relative bg-white dark:bg-gray-900 rounded-3xl p-6 border-2 border-gray-100 dark:border-gray-800
            hover:border-amber-400 hover:bg-amber-50/50 dark:hover:bg-amber-950/20
            hover:shadow-lg hover:shadow-amber-600/10 hover:-translate-y-0.5
            active:scale-[0.99] transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center mb-4
            group-hover:bg-amber-100 dark:group-hover:bg-amber-900/60 transition-colors">
            <Megaphone className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1.5 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
            Announcements
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
            Admin updates and your submission confirmations
          </p>
          <ArrowRight className="w-4 h-4 text-amber-600 mt-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
        </Link>
      </div>
    </div>
  );
};

export default StudentDashboard;
