import { useParams, useNavigate } from 'react-router-dom';
import { useScholarsStore } from '../../store/useScholarsStore';
import { useApplicationsStore } from '../../store/useApplicationsStore';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  ArrowLeft,
  Award,
  Calendar,
  School,
  MapPin,
  User,
  FileText,
  Eye,
  TrendingUp,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  formatKsh,
  getStatusBadgeClasses,
  getMeanGradeColour,
  levelDisplayName,
  PROGRESSION_ORDER,
  cbcCodeToBand,
  usesCbcGrading,
  getNextGradeStep,
  scoreToDisplayGrade,
  formatGradeLabel,
} from '../../lib/utils';

const ScholarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { scholars } = useScholarsStore();
  const { applications, updateApplicationStatus } = useApplicationsStore();

  const scholar = scholars.find((s) => s.id === Number(id));

  if (!scholar) {
    return (
      <div className="py-20 text-center text-red-600">Scholar not found</div>
    );
  }

  const scholarApps = applications
    .filter((a) => a.email.toLowerCase() === scholar.email.toLowerCase())
    .sort((a, b) => b.id - a.id);
  const latest = scholarApps[0];
  const currentIdx = PROGRESSION_ORDER.indexOf(scholar.schoolLevel);
  const nextStep = getNextGradeStep(scholar.schoolLevel, scholar.currentClass);
  const isCbc = usesCbcGrading(scholar.schoolLevel);

  const gradeDisplay = latest
    ? isCbc
      ? cbcCodeToBand(latest.meanGrade) || latest.meanGrade
      : latest.meanGrade
    : '—';

  const performanceData =
    scholarApps.length > 0
      ? [...scholarApps]
          .reverse()
          .map((app, i) => ({
            term:
              app.currentTermResults?.split('—')[0]?.trim() ||
              app.currentTermResults?.split('-')[0]?.trim() ||
              `Upload ${i + 1}`,
            score: app.meanScore,
          }))
      : [
          { term: 'Term 1 2025', score: 65 },
          { term: 'Term 2 2025', score: 70 },
          { term: 'Term 1 2026', score: 74 },
          { term: 'Current', score: 72 },
        ];

  const openDocument = (doc: {
    name: string;
    dataUrl: string;
    type: string;
  }) => {
    if (!doc.dataUrl) {
      toast.info(
        `Preview not available for "${doc.name}" (demo placeholder file).`
      );
      return;
    }
    const win = window.open();
    if (win) {
      if (doc.type.startsWith('image/')) {
        win.document.write(
          `<img src="${doc.dataUrl}" style="max-width:100%" />`
        );
      } else {
        win.document.write(
          `<iframe src="${doc.dataUrl}" width="100%" height="100%" style="border:none"></iframe>`
        );
      }
    } else {
      const a = document.createElement('a');
      a.href = doc.dataUrl;
      a.download = doc.name;
      a.click();
    }
  };

  const handleApprove = (appId: number, name: string) => {
    updateApplicationStatus(appId, 'Approved');
    toast.success(`Upload approved for ${name}`);
  };

  const handleReject = (appId: number, name: string) => {
    updateApplicationStatus(appId, 'Rejected');
    toast.error(`Upload rejected for ${name}`);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <button
        onClick={() => navigate('/admin')}
        className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Students
      </button>

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-3xl p-8">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{scholar.fullName}</h1>
            <p className="mt-1 opacity-90">{scholar.email}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                {levelDisplayName(scholar.schoolLevel)}
              </span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                {scholar.currentClass}
              </span>
              {scholar.pathway && (
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {scholar.pathway}
                </span>
              )}
              {scholar.programme && (
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {scholar.programme}
                </span>
              )}
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm opacity-80">
              {formatGradeLabel(scholar.schoolLevel)}
            </p>
            <p className="text-3xl font-bold mt-1">{gradeDisplay}</p>
            {latest && (
              <p className="text-sm opacity-80 mt-1">{latest.meanGrade}</p>
            )}
          </div>
        </div>
      </div>

      {/* Pathway */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800">
        <p className="text-sm font-medium text-gray-500 mb-3">CBC pathway</p>
        <div className="flex flex-wrap items-center gap-2">
          {PROGRESSION_ORDER.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  i < currentIdx
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : i === currentIdx
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                }`}
              >
                {step === 'Alumni' ? 'Exit / Alumni' : step}
              </span>
              {i < PROGRESSION_ORDER.length - 1 && (
                <span className="text-gray-300">→</span>
              )}
            </div>
          ))}
        </div>
        {nextStep && nextStep.level !== 'Alumni' && (
          <p className="text-xs text-gray-500 mt-3">
            Next year: {nextStep.currentClass}
            {nextStep.requiresPathway && !scholar.pathway
              ? ' — waiting for student to choose a pathway'
              : ''}
            {nextStep.requiresPathway && scholar.pathway
              ? ` — pathway set (${scholar.pathway})`
              : ''}
          </p>
        )}
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800">
          <School className="w-6 h-6 text-emerald-600 mb-2" />
          <p className="text-xs text-gray-500">School</p>
          <p className="font-semibold mt-1">{scholar.school}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800">
          <MapPin className="w-6 h-6 text-emerald-600 mb-2" />
          <p className="text-xs text-gray-500">Region</p>
          <p className="font-semibold mt-1">{scholar.region}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800">
          <Calendar className="w-6 h-6 text-emerald-600 mb-2" />
          <p className="text-xs text-gray-500">Joined</p>
          <p className="font-semibold mt-1">{scholar.dateJoined}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800">
          <User className="w-6 h-6 text-emerald-600 mb-2" />
          <p className="text-xs text-gray-500">Status</p>
          <span
            className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClasses(
              scholar.status
            )}`}
          >
            {scholar.status}
          </span>
        </div>
      </div>

      {/* Latest results + fees */}
      {latest ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 space-y-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h3 className="font-semibold flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              Latest results
            </h3>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClasses(
                latest.status
              )}`}
            >
              {latest.status}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Results</p>
              <p className="font-medium mt-1">{latest.currentTermResults}</p>
            </div>
            <div>
              <p className="text-gray-500">Performance</p>
              <p
                className={`font-bold text-lg mt-1 ${getMeanGradeColour(
                  latest.meanGrade
                )}`}
              >
                {gradeDisplay}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Next fees due</p>
              <p className="font-medium mt-1">
                {formatKsh(latest.amountRequested)}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-1">
            <div>
              <p className="text-gray-500">Current term fees</p>
              <p className="font-medium mt-1">
                {formatKsh(latest.currentTermFees || 0)}
              </p>
            </div>
            {latest.isEndOfYear && (
              <div>
                <p className="text-gray-500">Assessment type</p>
                <p className="font-medium mt-1 text-emerald-700 dark:text-emerald-400">
                  End of year
                </p>
              </div>
            )}
          </div>

          {latest.status === 'Pending' && (
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() =>
                  handleApprove(latest.id, latest.studentName)
                }
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
              >
                <CheckCircle className="w-5 h-5" />
                Approve upload
              </button>
              <button
                onClick={() => handleReject(latest.id, latest.studentName)}
                className="flex-1 py-3 border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
              >
                <XCircle className="w-5 h-5" />
                Reject upload
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 text-center text-gray-500 text-sm">
          No term uploads yet for this scholar.
        </div>
      )}

      {/* Performance curve */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800">
        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          Mean Score Trend Over Terms (%)
        </h3>
        <ResponsiveContainer width="100%" height={360}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="term" tick={{ fontSize: 12 }} />
            <YAxis domain={[40, 100]} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: any) => {
                const g = scoreToDisplayGrade(value, scholar.schoolLevel);
                const extra = isCbc ? cbcCodeToBand(g) : g;
                return [
                  isCbc ? extra : `${value}% (${extra})`,
                  'Performance',
                ];
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Documents */}
      {latest && latest.documents && latest.documents.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            Documents
          </h3>
          <div className="space-y-2">
            {latest.documents.map((doc, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-2xl"
              >
                <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-sm truncate flex-1">{doc.name}</span>
                <button
                  type="button"
                  onClick={() => openDocument(doc)}
                  className="flex items-center gap-1 text-xs text-emerald-600 hover:underline"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Open
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload history */}
      {scholarApps.length > 1 && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold mb-4">Upload history</h3>
          <div className="space-y-2">
            {scholarApps.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 text-sm"
              >
                <span className="truncate">{app.currentTermResults}</span>
                <span
                  className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(
                    app.status
                  )}`}
                >
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScholarDetail;
