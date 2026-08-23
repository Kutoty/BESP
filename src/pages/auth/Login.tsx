import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoleStore } from '../../store/useRoleStore';
import { useScholarsStore } from '../../store/useScholarsStore';
import { Leaf, Loader2 } from 'lucide-react';
import type { Role, User } from '../../types';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { setRole } = useRoleStore();
  const { getScholarByEmail } = useScholarsStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (selectedRole === 'admin') {
        if (email === 'admin@mara.org' && password === 'admin123') {
          const user: User = {
            id: 999,
            name: 'Sarah Kimani',
            email: 'admin@mara.org',
            role: 'admin',
          };
          setRole('admin', user);
          navigate('/admin');
        } else {
          setError('Invalid admin credentials.');
        }
        setLoading(false);
        return;
      }

      // Student: must already be registered by admin
      const scholar = getScholarByEmail(email);
      if (!scholar) {
        setError(
          'No scholar account found for this email. Only students registered by an administrator can sign in.'
        );
        setLoading(false);
        return;
      }

      if (scholar.status === 'Exited' || scholar.schoolLevel === 'Alumni') {
        setError('This scholar has exited the programme and can no longer sign in.');
        setLoading(false);
        return;
      }

      if (password !== scholar.password) {
        setError('Incorrect password. Use the password issued by the administrator.');
        setLoading(false);
        return;
      }

      const user: User = {
        id: scholar.id,
        name: scholar.fullName,
        email: scholar.email,
        role: 'student',
        schoolLevel: scholar.schoolLevel,
        scholarId: scholar.id,
      };
      setRole('student', user);
      navigate('/student');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md p-8 sm:p-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-600/30">
            <Leaf className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center">
            Mara Conservancy
          </h1>
          <p className="text-emerald-600 font-medium mt-1">Scholars Programme</p>
        </div>

        <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-100 mb-6">
          Sign in to your portal
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              I am a
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['student', 'admin'] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`py-3 rounded-2xl font-medium capitalize transition-all ${
                    selectedRole === role
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={
                selectedRole === 'admin' ? 'admin@mara.org' : 'aisha.m@email.com'
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-850 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-850 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/40 px-4 py-3 rounded-2xl">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-2xl font-semibold text-base flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 text-center space-y-1.5">
          <p className="font-medium text-gray-600 dark:text-gray-400">Demo accounts</p>
          <p>Admin → admin@mara.org / admin123</p>
          <p>Primary → aisha.m@email.com / student123</p>
          <p>Junior Sec → mary.w@email.com / student123</p>
          <p>Senior Sec → john.okoro@email.com / student123</p>
          <p>University → ahmed.h@email.com / student123</p>
          <p className="mt-2 text-gray-400">
            New students can only be added by an administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
