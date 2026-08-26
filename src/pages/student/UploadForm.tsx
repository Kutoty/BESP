import { useState, useMemo, useEffect } from 'react';
import { useApplicationsStore } from '../../store/useApplicationsStore';
import { useRoleStore } from '../../store/useRoleStore';
import { useScholarsStore } from '../../store/useScholarsStore';
import { toast } from 'sonner';
import { Save, Upload, FileText, Loader2, X } from 'lucide-react';
import {
  subjectsForLevel,
  usesCbcGrading,
  CBC_LEVELS,
  cbcCodeToLabel,
  cbcCodeToBand,
  cbcLevelToApproxPercent,
  percentageToMeanGrade,
  formatGradeLabel,
  getAcademicCalendar,
  getCurrentTerm,
  formatDisplayDate,
  isUploadWindowOpen,
} from '../../lib/utils';
import type { DocumentFile, SchoolLevel } from '../../types';

const UploadForm = () => {
  const { addApplication } = useApplicationsStore();
  const { currentUser } = useRoleStore();
  const { getScholarByEmail } = useScholarsStore();

  const scholar = currentUser?.email
    ? getScholarByEmail(currentUser.email)
    : undefined;
  const level: SchoolLevel =
    scholar?.schoolLevel || currentUser?.schoolLevel || 'Primary';
  const isCbc = usesCbcGrading(level);

  const subjectNames = useMemo(
    () => subjectsForLevel(level, scholar?.pathway),
    [level, scholar?.pathway]
  );
  const terms = useMemo(() => getAcademicCalendar(level), [level]);
  const currentTerm = useMemo(() => getCurrentTerm(level), [level]);

  // CBC: store performance level codes (EE1, ME2, …)
  // Senior/University: store percentage strings
  const [scores, setScores] = useState<Record<string, string>>(() =>
    Object.fromEntries(subjectNames.map((s) => [s, '']))
  );
  const [term, setTerm] = useState(() => getCurrentTerm().label);
  const [currentTermFees, setCurrentTermFees] = useState('');
  const [nextTermFees, setNextTermFees] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<DocumentFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEndOfYear, setIsEndOfYear] = useState(false);

  useEffect(() => {
    const cur = getCurrentTerm(level);
    setTerm(cur.label);
    setIsEndOfYear(cur.isFinalTerm);
  }, [level]);

  const calculateSummary = () => {
    if (isCbc) {
      const codes = subjectNames.map((s) => scores[s]).filter(Boolean);
      if (codes.length === 0) return { meanScore: 0, meanGrade: '—', label: '—' };
      const avgPct =
        codes.reduce((sum, c) => sum + cbcLevelToApproxPercent(c), 0) /
        codes.length;
      // Overall band = mode / average mapped back
      const meanScore = Math.round(avgPct);
      // Pick the CBC level closest to average points
      const avgPoints =
        codes.reduce((sum, c) => {
          const lvl = CBC_LEVELS.find((l) => l.code === c);
          return sum + (lvl?.points ?? 0);
        }, 0) / codes.length;
      const closest =
        CBC_LEVELS.reduce((best, l) =>
          Math.abs(l.points - avgPoints) < Math.abs(best.points - avgPoints)
            ? l
            : best
        );
      return {
        meanScore,
        meanGrade: closest.code,
        label: closest.band,
      };
    }
    // Percentage-based
    const nums = subjectNames
      .map((s) => parseFloat(scores[s]) || 0)
      .filter((n) => n > 0);
    if (nums.length === 0) return { meanScore: 0, meanGrade: '—', label: '—' };
    const meanScore = Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
    const meanGrade = percentageToMeanGrade(meanScore);
    return { meanScore, meanGrade, label: meanGrade };
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const converted: DocumentFile[] = [];
    for (const file of files) {
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      converted.push({ name: file.name, dataUrl, type: file.type });
    }
    setUploadedFiles((prev) => [...prev, ...converted]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!term.trim() || subjectNames.some((s) => !scores[s])) {
      toast.error(
        isCbc
          ? 'Please fill in the term and select a performance level for every learning area'
          : 'Please fill in the term and all subject scores'
      );
      return;
    }
    if (!nextTermFees) {
      toast.error('Please enter the next term fees due');
      return;
    }

    setIsSubmitting(true);
    const { meanScore, meanGrade, label } = calculateSummary();

    setTimeout(() => {
      addApplication({
        scholarId: scholar?.id,
        studentName: currentUser?.name || 'Student',
        email: currentUser?.email || '',
        school: scholar?.school || 'School',
        schoolLevel: level,
        course: scholar?.currentClass || scholar?.programme || 'General',
        meanScore,
        meanGrade,
        appliedDate: new Date().toISOString().split('T')[0],
        amountRequested: parseInt(nextTermFees, 10) || 0,
        region: scholar?.region || 'Rift Valley',
        currentTermFees: parseInt(currentTermFees, 10) || 0,
        currentTermResults: `${term} — ${label} (${meanGrade})`,
        nextPaymentDate: 'Next term',
        documents:
          uploadedFiles.length > 0
            ? uploadedFiles
            : [{ name: 'result_slip.pdf', dataUrl: '', type: 'application/pdf' }],
        isEndOfYear,
      });

      toast.success('Term results submitted. Awaiting admin verification.');
      setTerm('');
      setScores(Object.fromEntries(subjectNames.map((s) => [s, ''])));
      setCurrentTermFees('');
      setNextTermFees('');
      setUploadedFiles([]);
      setIsEndOfYear(false);
      setIsSubmitting(false);
    }, 700);
  };

  const summary = calculateSummary();

  return (
    <div className="max-w-3xl">
      <p className="text-gray-600 dark:text-gray-400 mb-2">
        Submit results for verification ·{' '}
        <span className="font-medium text-emerald-700 dark:text-emerald-400">
          {level}
          {scholar?.currentClass ? ` · ${scholar.currentClass}` : ''}
        </span>
      </p>
      <p className="text-sm text-gray-500 mb-6">
        {isCbc
          ? 'Primary and Junior Secondary use KNEC competency performance levels (Exceeding / Meeting / Approaching / Below Expectations), not percentage marks.'
          : 'Senior Secondary and University use mean letter grades (A–E) based on percentage scores.'}
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 space-y-8"
      >
        <div>
          <label className="block text-sm font-medium mb-2">Term / Semester</label>
          <select
            value={term}
            onChange={(e) => {
              const value = e.target.value;
              setTerm(value);
              const match = terms.find((t) => t.label === value);
              if (match) setIsEndOfYear(match.isFinalTerm);
            }}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl bg-transparent focus:border-emerald-500 outline-none"
            required
          >
            {terms.map((t) => (
              <option key={t.id} value={t.label}>
                {t.label}
                {t.isFinalTerm ? ' (end of year)' : ''}
              </option>
            ))}
          </select>
          {currentTerm && (
            <p className="text-xs text-gray-500 mt-2">
              Upload window for {currentTerm.label}:{' '}
              {formatDisplayDate(currentTerm.uploadOpen)} –{' '}
              {formatDisplayDate(currentTerm.uploadClose)}
              {isUploadWindowOpen(currentTerm) ? ' · open now' : ' · currently closed'}
              {' · '}Fees due {formatDisplayDate(currentTerm.feesDue)}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <label className="block text-sm font-medium">
              {isCbc
                ? 'Learning area performance levels (KNEC)'
                : 'Subject scores (out of 100)'}
            </label>
            {summary.meanGrade !== '—' && (
              <span className="text-sm font-semibold text-emerald-600">
                Overall: {summary.label}
                {isCbc ? ` (${summary.meanGrade})` : ` · ${summary.meanGrade}`}
              </span>
            )}
          </div>

          <div className="space-y-3">
            {subjectNames.map((name) => (
              <div
                key={name}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
              >
                <span className="sm:w-52 text-sm font-medium shrink-0" title={name}>
                  {name}
                </span>
                {isCbc ? (
                  <select
                    value={scores[name] || ''}
                    onChange={(e) =>
                      setScores((prev) => ({ ...prev, [name]: e.target.value }))
                    }
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl bg-transparent focus:border-emerald-500 outline-none text-sm"
                    required
                  >
                    <option value="">Select performance level</option>
                    {CBC_LEVELS.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.label} ({l.code})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={scores[name] || ''}
                    onChange={(e) =>
                      setScores((prev) => ({ ...prev, [name]: e.target.value }))
                    }
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl bg-transparent focus:border-emerald-500 outline-none"
                    placeholder="75"
                    required
                  />
                )}
              </div>
            ))}
          </div>

          {isCbc && (
            <p className="mt-3 text-xs text-gray-500">
              KNEC scale: EE1 (highest) → BE2 (lowest). Learners are placed in
              bands: Exceeding, Meeting, Approaching, or Below Expectations —
              not ranked by marks.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Current Term Fees Paid (KSh)
            </label>
            <input
              type="number"
              min={0}
              value={currentTermFees}
              onChange={(e) => setCurrentTermFees(e.target.value)}
              placeholder="14500"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl bg-transparent focus:border-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Next Term Fees Due (KSh)
            </label>
            <input
              type="number"
              min={0}
              value={nextTermFees}
              onChange={(e) => setNextTermFees(e.target.value)}
              placeholder="18500"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl bg-transparent focus:border-emerald-500 outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Upload Official Documents
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl p-8 text-center">
            <Upload className="mx-auto w-10 h-10 text-gray-400 mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Report / assessment slip and fee structure (PDF or JPG)
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="mt-4 inline-block px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl cursor-pointer text-sm font-medium transition-colors"
            >
              Choose Files
            </label>
          </div>
          {uploadedFiles.length > 0 && (
            <div className="mt-3 space-y-2">
              {uploadedFiles.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-2xl"
                >
                  <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-sm truncate flex-1">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isEndOfYear}
            onChange={(e) => setIsEndOfYear(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            This is my end-of-year assessment for this grade.
            <span className="block text-xs text-gray-500 mt-0.5">
              After approval, you will move to the next year automatically. Final terms are pre-selected when you pick Term 3 / Semester 2.
            </span>
          </span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Submit for Admin Verification
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
