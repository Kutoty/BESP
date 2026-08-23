import { useParams, useNavigate } from 'react-router-dom';
import { useApplicationsStore } from '../../store/useApplicationsStore';
import { useScholarsStore } from '../../store/useScholarsStore';
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
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  formatKsh,
  getStatusBadgeClasses,
  getMeanGradeColour,
  usesCbcGrading,
  cbcCodeToBand,
  formatGradeLabel,
} from '../../lib/utils';

const StudentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { applications, updateApplicationStatus } = useApplicationsStore();
  const { getScholarByEmail } = useScholarsStore();

  const student = applications.find((app) => app.id === Number(id));

  if (!student) {
    return (
      <div className="py-20 text-center text-red-600">Student not found</div>
    );
  }

  const scholar = getScholarByEmail(student.email);
  const backTo = scholar ? `/admin/scholar/${scholar.id}` : '/admin';

  const isCbc = usesCbcGrading(student.schoolLevel);
  const gradeDisplay = isCbc
    ? cbcCodeToBand(student.meanGrade) || student.meanGrade
    : student.meanGrade;

  const relatedApps = applications
    .filter((a) => a.email.toLowerCase() === student.email.toLowerCase())
    .sort((a, b) => a.id - b.id);

  const performanceData =
    relatedApps.length > 0
      ? relatedApps.map((app, i) => ({
          term:
            app.currentTermResults?.split('—')[0]?.trim() ||
            app.currentTermResults?.split('-')[0]?.trim() ||
            `Term ${i + 1}`,
          score: app.meanScore,
        }))
      : [
          { term: 'Term 1 2025', score: 65 },
          { term: 'Term 2 2025', score: 70 },
          { term: 'Term 3 2025', score: 74 },
          { term: 'Current', score: student.meanScore },
        ];

  const handleApprove = () => {
    updateApplicationStatus(student.id, 'Approved');
    toast.success(`Upload approved for ${student.studentName}`);
  };

  const handleReject = () => {
    updateApplicationStatus(student.id, 'Rejected');
    toast.error(`Upload rejected for ${student.studentName}`);
  };

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

  return (
    <div className="max-w-4xl space-y-8">
      <button
        onClick={() => navigate(backTo)}
        className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to scholar profile
      </button>

      {/* Header — same spirit as student performance page */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 sm:p-10 border border-gray-100 dark:border-gray-800 text-center">
        <Award className="w-14 h-14 text-emerald-600 mx-auto mb-4" />
        <p className="text-sm text-gray-500">{student.studentName}</p>
        <p className="text-sm text-gray-400 mt-1">
          {student.school} · {student.schoolLevel}
          {scholar?.currentClass ? ` · ${scholar.currentClass}` : ''}
        </p>
        <p
          className={`text-5xl sm:text-6xl font-bold mt-4 ${getMeanGradeColour(
            student.meanGrade
          )}`}
        >
          {student.meanGrade}
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
          {isCbc
            ? gradeDisplay
            : `${student.meanScore}% · ${formatGradeLabel(student.schoolLevel)}`}
        </p>
        <p className="mt-3 text-sm text-gray-500">{student.currentTermResults}</p>
        <span
          className={`inline-block mt-4 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClasses(
            student.status
          )}`}
        >
          {student.status}
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800">
          <Calendar className="w-8 h-8 text-emerald-600 mb-3" />
          <p className="text-sm text-gray-500">Current Term Fees</p>
          <p className="text-2xl font-bold mt-1">
            {formatKsh(student.currentTermFees || 0)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800">
          <Calendar className="w-8 h-8 text-emerald-600 mb-3" />
          <p className="text-sm text-gray-500">Next Term Fees Due</p>
          <p className="text-2xl font-bold mt-1">
            {formatKsh(student.amountRequested)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800">
          <Award className="w-8 h-8 text-emerald-600 mb-3" />
          <p className="text-sm text-gray-500">
            {formatGradeLabel(student.schoolLevel)}
          </p>
          <p
            className={`text-2xl font-bold mt-1 ${getMeanGradeColour(
              student.meanGrade
            )}`}
          >
            {gradeDisplay}
          </p>
        </div>
      </div>

      {/* Performance curve — same style as student dash */}
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
              formatter={(value) => {
  const num = typeof value === 'number' ? value : 0;
  return [formatKsh(num), 'Amount'];
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
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-600" />
          Documents
        </h3>
        {student.documents && student.documents.length > 0 ? (
          <div className="space-y-2">
            {student.documents.map((doc, i) => (
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
        ) : (
          <p className="text-sm text-gray-500">No documents attached.</p>
        )}
      </div>

      {/* Approve / Reject when pending */}
      {student.status === 'Pending' && (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleApprove}
            className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
          >
            <CheckCircle className="w-5 h-5" />
            Approve
          </button>
          <button
            onClick={handleReject}
            className="flex-1 py-3.5 border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
          >
            <XCircle className="w-5 h-5" />
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentDetail;
