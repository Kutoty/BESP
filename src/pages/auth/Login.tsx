import { useState } from 'react';
import { useRoleStore } from '../../store/useRoleStore';
import { useScholarsStore } from '../../store/useScholarsStore';
import { toast } from 'sonner';
import { Eye, EyeOff, Leaf, Shield, GraduationCap } from 'lucide-react';

const DEMO_ADMIN = {
  id: 0,
  name: 'Programme Admin',
  email: 'admin@borana.org',
  role: 'admin' as const,
  password: 'admin123',
};

const Login = () => {
  const { setRole } = useRoleStore();
  const { getScholarByEmail } = useScholarsStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    window.setTimeout(() => {
      const emailNorm = email.trim().toLowerCase();

      if (emailNorm === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
        setRole('admin', {
          id: DEMO_ADMIN.id,
          name: DEMO_ADMIN.name,
          email: DEMO_ADMIN.email,
          role: 'admin',
        });
        toast.success('Welcome back — BESP admin portal');
        setLoading(false);
        return;
      }

      const scholar = getScholarByEmail?.(emailNorm);
      if (scholar && scholar.password === password) {
        setRole('student', {
          id: scholar.id,
          name: scholar.fullName,
          email: scholar.email,
          role: 'student',
          schoolLevel: scholar.schoolLevel,
          scholarId: scholar.id,
        });
        toast.success(`Karibu, ${scholar.fullName.split(' ')[0]}`);
        setLoading(false);
        return;
      }

      // Fallback if your BESP login used fixed demo students instead of scholars store:
      // if (emailNorm === 'student@demo.com' && password === 'student123') { ... }

      toast.error('Invalid email or password');
      setLoading(false);
    }, 400);
  };

  const fillDemo = (type: 'admin' | 'student') => {
    if (type === 'admin') {
      setEmail(DEMO_ADMIN.email);
      setPassword(DEMO_ADMIN.password);
    } else {
      setEmail('aisha.m@email.com');
      setPassword('student123');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 dark:bg-gray-950">
      {/* Left — conservancy image */}
      <div className="relative lg:w-[52%] min-h-[42vh] lg:min-h-screen overflow-hidden">
        <img
          src="/borana-landscape.jpg"
          alt="Borana Conservancy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/25" />
         <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-10 lg:p-12 text-white min-h-[42vh] lg:min-h-screen">
          <div className="flex items-center gap-3">
            <div className="w-50 h-20 flex items-center justify-center overflow-hidden mx-auto">
              <img
                src="/Conservancy+logo+III.png"
                alt="Borana Conservancy"
                className="w-100 h-20 object-contain"
              />
            </div>
    
          </div>

          <div className="max-w-md space-y-4 pb-4 lg:pb-8">
          
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Borana Education Support Programme
            </h1>
            <p className="text-base sm:text-lg text-white/85 leading-relaxed">
              Education sets young people free. Bursaries and progress tracking
              for scholars from communities around Borana Conservancy.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/20">
                <GraduationCap className="w-3.5 h-3.5" />
                Scholar bursaries
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/20">
                <Leaf className="w-3.5 h-3.5" />
                Conservation education
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/20">
                <Shield className="w-3.5 h-3.5" />
                Community schools
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-14">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Sign in
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Sign in to the BESP scholar portal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold shadow-lg shadow-emerald-600/20 transition"
            >
              {loading ? 'Signing in…' : 'Sign in to BESP'}
            </button>
          </form>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Demo access
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="flex-1 text-left text-sm px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-400 transition"
              >
                <span className="font-medium">Admin</span>
                <span className="block text-xs text-gray-500 mt-0.5">
                  admin@borana.org
                </span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('student')}
                className="flex-1 text-left text-sm px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-400 transition"
              >
                <span className="font-medium">Scholar</span>
                <span className="block text-xs text-gray-500 mt-0.5">
                  aisha.m@email.com
                </span>
              </button>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400">
            Part of{' '}
            <a
              href="http://boranaconservancy.com"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-600 hover:underline"
            >
              Borana Conservancy
            </a>
            {' · '}
            Laikipia, Kenya.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;