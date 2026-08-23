import { useState } from 'react';
import { useScholarsStore } from '../../store/useScholarsStore';
import { toast } from 'sonner';
import { UserPlus, Loader2 } from 'lucide-react';
import type { SchoolLevel } from '../../types';
import { levelDisplayName } from '../../lib/utils';

const LEVELS: SchoolLevel[] = [
  'Primary',
  'Junior Secondary',
  'Senior Secondary',
  'University',
];

const AddScholar = () => {
  const { addScholar, scholars } = useScholarsStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: 'student123',
    school: '',
    schoolLevel: 'Primary' as SchoolLevel,
    currentClass: '',
    region: 'Rift Valley',
    pathway: '',
    programme: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim() || !form.school.trim() || !form.currentClass.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (scholars.some((s) => s.email.toLowerCase() === form.email.toLowerCase())) {
      toast.error('A scholar with this email already exists');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      addScholar({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password || 'student123',
        school: form.school.trim(),
        schoolLevel: form.schoolLevel,
        currentClass: form.currentClass.trim(),
        region: form.region.trim() || 'Rift Valley',
        pathway: form.schoolLevel === 'Senior Secondary' ? form.pathway || undefined : undefined,
        programme: form.schoolLevel === 'University' ? form.programme || undefined : undefined,
      });
      toast.success(`${form.fullName} has been registered as a scholar`);
      setForm({
        fullName: '',
        email: '',
        password: 'student123',
        school: '',
        schoolLevel: 'Primary',
        currentClass: '',
        region: 'Rift Valley',
        pathway: '',
        programme: '',
      });
      setLoading(false);
    }, 400);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <p className="text-gray-600 dark:text-gray-400">
        Register a new scholar into the programme. Only administrators can add students.
        The student will sign in with the email and password you set.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2">Full name *</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl bg-transparent focus:border-emerald-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl bg-transparent focus:border-emerald-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Temporary password</label>
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl bg-transparent focus:border-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Education level *</label>
            <select
              name="schoolLevel"
              value={form.schoolLevel}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl bg-transparent focus:border-emerald-500 outline-none"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {levelDisplayName(l)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Current class / year *
            </label>
            <input
              name="currentClass"
              value={form.currentClass}
              onChange={handleChange}
              placeholder="e.g. Grade 6, Grade 8, Year 2"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl bg-transparent focus:border-emerald-500 outline-none"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2">School / Institution *</label>
            <input
              name="school"
              value={form.school}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl bg-transparent focus:border-emerald-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Region</label>
            <input
              name="region"
              value={form.region}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl bg-transparent focus:border-emerald-500 outline-none"
            />
          </div>
          {form.schoolLevel === 'Senior Secondary' && (
            <div>
              <label className="block text-sm font-medium mb-2">Pathway</label>
              <select
                name="pathway"
                value={form.pathway}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl bg-transparent focus:border-emerald-500 outline-none"
              >
                <option value="">Select pathway</option>
                <option value="STEM">STEM</option>
                <option value="Social Sciences">Social Sciences</option>
                <option value="Arts and Sports Science">Arts and Sports Science</option>
              </select>
            </div>
          )}
          {form.schoolLevel === 'University' && (
            <div>
              <label className="block text-sm font-medium mb-2">Programme</label>
              <input
                name="programme"
                value={form.programme}
                onChange={handleChange}
                placeholder="e.g. BSc Computer Science"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl bg-transparent focus:border-emerald-500 outline-none"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <UserPlus className="w-5 h-5" />
          )}
          Register Scholar
        </button>
      </form>
    </div>
  );
};

export default AddScholar;
