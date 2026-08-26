import { useMemo } from 'react';
import { useApplicationsStore } from '../../store/useApplicationsStore';
import { useScholarsStore } from '../../store/useScholarsStore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Wallet,
  CircleAlert,
  Banknote,
  TrendingUp,
  Download,
  PiggyBank,
} from 'lucide-react';
import { formatKsh } from '../../lib/utils';
import type { SchoolLevel } from '../../types';

const LEVEL_BAR: Record<string, string> = {
  Primary: '#0ea5e9',
  'Junior Sec': '#f59e0b',
  'Senior Sec': '#f43f5e',
  University: '#059669',
};

const AnalyticsDashboard = () => {
  const { applications } = useApplicationsStore();
  const { scholars } = useScholarsStore();

  const paidApps = applications.filter((a) => a.feeStatus === 'Paid');
  const pendingFeeApps = applications.filter((a) => a.feeStatus !== 'Paid');

  const paidAmount = paidApps.reduce(
    (s, a) => s + (a.sponsorshipAmount || a.amountRequested || 0),
    0
  );
  const pendingAmount = pendingFeeApps.reduce(
    (s, a) => s + (a.amountRequested || 0),
    0
  );
  const totalSponsored = applications.reduce(
    (s, a) => s + (a.sponsorshipAmount || a.amountRequested || 0),
    0
  );
  const totalRequested = applications.reduce(
    (s, a) => s + (a.amountRequested || 0),
    0
  );

  const byLevelFees = useMemo(() => {
    const levels: SchoolLevel[] = [
      'Primary',
      'Junior Secondary',
      'Senior Secondary',
      'University',
    ];
    return levels.map((level) => {
      const apps = applications.filter((a) => a.schoolLevel === level);
      const amount = apps.reduce(
        (s, a) => s + (a.sponsorshipAmount || a.amountRequested || 0),
        0
      );
      const short =
        level === 'Junior Secondary'
          ? 'Junior Sec'
          : level === 'Senior Secondary'
          ? 'Senior Sec'
          : level;
      return {
        name: short,
        amount,
        count: apps.length,
        fill: LEVEL_BAR[short],
      };
    });
  }, [applications]);

  const activeCount = scholars.filter(
    (s) => s.schoolLevel !== 'Alumni' && s.status === 'Active'
  ).length;

  const paidPct = applications.length
    ? Math.round((paidApps.length / applications.length) * 100)
    : 0;

  const exportCsv = () => {
    const rows = [
      [
        'Student',
        'Email',
        'Level',
        'School',
        'Region',
        'Amount requested',
        'Sponsorship',
        'Fee status',
        'Upload status',
      ].join(','),
      ...applications.map((a) =>
        [
          `"${a.studentName}"`,
          a.email,
          a.schoolLevel,
          `"${a.school}"`,
          a.region,
          a.amountRequested,
          a.sponsorshipAmount ?? '',
          a.feeStatus ?? 'Pending',
          a.status,
        ].join(',')
      ),
    ];
    const blob = new Blob([rows.join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scholartrack-fees-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-gray-600 dark:text-gray-400">
            Money and fee coverage across the programme — ready for funder
            reporting.
          </p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-medium transition shrink-0"
        >
          <Download className="w-4 h-4" />
          Download fees CSV
        </button>
      </div>

      {/* Money KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border-2 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800 p-5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-3 shadow-md">
            <Banknote className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
            Total in view
          </p>
          <p className="text-2xl sm:text-3xl font-bold mt-1 text-emerald-950 dark:text-emerald-50 tabular-nums">
            {formatKsh(totalSponsored)}
          </p>
          <p className="text-xs text-emerald-700/70 dark:text-emerald-400 mt-1">
            Sponsorship + fee amounts linked to uploads
          </p>
        </div>

        <div className="rounded-3xl border-2 border-sky-200 bg-sky-50 dark:bg-sky-950/30 dark:border-sky-800 p-5">
          <div className="w-11 h-11 rounded-2xl bg-sky-500 text-white flex items-center justify-center mb-3 shadow-md">
            <Wallet className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">
            Fees paid
          </p>
          <p className="text-2xl sm:text-3xl font-bold mt-1 text-sky-950 dark:text-sky-50 tabular-nums">
            {formatKsh(paidAmount)}
          </p>
          <p className="text-xs text-sky-700/70 dark:text-sky-400 mt-1">
            {paidApps.length} record{paidApps.length === 1 ? '' : 's'} marked paid
          </p>
        </div>

        <div className="rounded-3xl border-2 border-rose-200 bg-rose-50 dark:bg-rose-950/30 dark:border-rose-800 p-5">
          <div className="w-11 h-11 rounded-2xl bg-rose-500 text-white flex items-center justify-center mb-3 shadow-md">
            <CircleAlert className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-300">
            Fees not paid
          </p>
          <p className="text-2xl sm:text-3xl font-bold mt-1 text-rose-950 dark:text-rose-50 tabular-nums">
            {formatKsh(pendingAmount)}
          </p>
          <p className="text-xs text-rose-700/70 dark:text-rose-400 mt-1">
            {pendingFeeApps.length} record{pendingFeeApps.length === 1 ? '' : 's'}{' '}
            still pending
          </p>
        </div>

        <div className="rounded-3xl border-2 border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-3 shadow-md">
            <PiggyBank className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300">
            Requested (fees due)
          </p>
          <p className="text-2xl sm:text-3xl font-bold mt-1 text-amber-950 dark:text-amber-50 tabular-nums">
            {formatKsh(totalRequested)}
          </p>
          <p className="text-xs text-amber-800/70 dark:text-amber-400 mt-1">
            {activeCount} active scholars in programme
          </p>
        </div>
      </div>

      {/* Paid vs pending visual */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              Fee coverage split
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Share of upload records marked paid vs still pending
            </p>
          </div>
          <p className="text-sm font-semibold text-emerald-600">{paidPct}% paid</p>
        </div>
        <div className="h-4 rounded-full overflow-hidden flex bg-gray-100 dark:bg-gray-800">
          <div
            className="bg-emerald-500 transition-all"
            style={{
              width: applications.length
                ? `${(paidApps.length / applications.length) * 100}%`
                : '0%',
            }}
          />
          <div
            className="bg-rose-400 transition-all"
            style={{
              width: applications.length
                ? `${(pendingFeeApps.length / applications.length) * 100}%`
                : '0%',
            }}
          />
        </div>
        <div className="flex flex-wrap gap-4 text-xs">
          <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Paid · {paidApps.length} · {formatKsh(paidAmount)}
          </span>
          <span className="inline-flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            Not paid · {pendingFeeApps.length} · {formatKsh(pendingAmount)}
          </span>
        </div>
      </div>

      {/* Amount by level */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <p className="font-semibold text-gray-900 dark:text-white">
            Amount by CBC level
          </p>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={byLevelFees}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(v) =>
                v >= 1000 ? `${Math.round(v / 1000)}k` : String(v)
              }
            />
            <Tooltip
              formatter={(value: any) => [formatKsh(value), 'Amount']}
              cursor={{ fill: 'rgba(16,185,129,0.06)' }}
              contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }}
            />
            <Bar dataKey="amount" radius={[10, 10, 0, 0]} maxBarSize={52}>
              {byLevelFees.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
