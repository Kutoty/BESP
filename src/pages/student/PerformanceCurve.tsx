import { useApplicationsStore } from '../../store/useApplicationsStore';
import { useRoleStore } from '../../store/useRoleStore';
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
import { TrendingUp, Award } from 'lucide-react';
import {
  scoreToDisplayGrade,
  getMeanGradeColour,
  formatGradeLabel,
  cbcCodeToBand,
  usesCbcGrading,
} from '../../lib/utils';
import type { SchoolLevel } from '../../types';

const PerformanceCurve = () => {
  const { applications } = useApplicationsStore();
  const { currentUser } = useRoleStore();
  const { getScholarByEmail } = useScholarsStore();

  const scholar = currentUser?.email
    ? getScholarByEmail(currentUser.email)
    : undefined;
  const level: SchoolLevel =
    scholar?.schoolLevel || currentUser?.schoolLevel || 'Primary';

  const myApplications = applications.filter(
    (app) => app.email === currentUser?.email
  );

  const currentScore =
    myApplications.length > 0
      ? Math.round(
          myApplications.reduce((sum, app) => sum + app.meanScore, 0) /
            myApplications.length
        )
      : 72;

  const currentGrade = scoreToDisplayGrade(currentScore, level);
  const gradeLabel = usesCbcGrading(level)
    ? cbcCodeToBand(currentGrade)
    : currentGrade;

  const performanceData = [
    { term: 'Term 1 2025', score: 65 },
    { term: 'Term 2 2025', score: 70 },
    { term: 'Term 1 2026', score: 74 },
    { term: 'Current', score: currentScore },
  ];

  return (
    <div className="max-w-4xl space-y-8">
      <p className="text-gray-600 dark:text-gray-400">
        Track your progress at{' '}
        <span className="font-medium text-emerald-700 dark:text-emerald-400">
          {level}
        </span>{' '}
        level under the Kenyan CBC framework.
      </p>

      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 sm:p-10 border border-gray-100 dark:border-gray-800 text-center">
        <Award className="w-14 h-14 text-emerald-600 mx-auto mb-4" />
        <p className="text-sm text-gray-500">{formatGradeLabel(level)}</p>
        <p
          className={`text-5xl sm:text-6xl font-bold mt-3 ${getMeanGradeColour(
            currentGrade
          )}`}
        >
          {currentGrade}
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
          {currentScore}% · {gradeLabel}
        </p>
        <p className="mt-4 text-emerald-700 dark:text-emerald-400 text-sm">
          Keep building your competencies. The conservancy is proud of your work.
        </p>
      </div>

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
  const num = typeof value === 'number' ? value : Number(value) || 0;
  // use `num` instead of `value` below
  const g = scoreToDisplayGrade(num, level);
return [`${num}% (${g})`, 'Performance'];
  // ...
  return [/* same as before */, 'Performance'];
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
    </div>
  );
};

export default PerformanceCurve;
