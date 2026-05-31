import { useState, FormEvent } from 'react';
import { Mail, Lock, User, ArrowRight, Sun, Moon, Globe, AlertCircle, Sparkles } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';
import { UserProfile } from '../types';
import Logo from './Logo';

interface AuthProps {
  onAuthSuccess: (profile: UserProfile) => void;
}

type AuthMode = 'login' | 'register' | 'forgot';

export default function Auth({ onAuthSuccess }: AuthProps) {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLanguageToggle = () => {
    setLanguage(language === 'pt' ? 'en' : 'pt');
  };

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email) {
      setErrorMsg(t('error') + ': Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setErrorMsg(t('error') + ': Invalid email format');
      return;
    }

    if (mode !== 'forgot' && (!password || password.length < 6)) {
      setErrorMsg(t('error') + ': Password must be at least 6 characters');
      return;
    }

    if (mode === 'register' && !name) {
      setErrorMsg(t('error') + ': Name is required');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (mode === 'forgot') {
        setSuccessMsg(t('fakeRecoverySuccess'));
        return;
      }

      // Successful simulated auth
      const defaultName = mode === 'register' ? name : email.split('@')[0];
      const newUser: UserProfile = {
        email,
        name: defaultName.charAt(0).toUpperCase() + defaultName.slice(1),
        level: 1,
        xp: 0,
        xpNeeded: 100,
        streak: 3, // starting with a small streak to keep them motivated!
        totalSaved: 0,
        joinedAt: new Date().toISOString(),
      };

      if (rememberMe) {
        localStorage.setItem('cacador_metas_profile', JSON.stringify(newUser));
      }
      onAuthSuccess(newUser);
    }, 1200);
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    setTimeout(() => {
      setLoading(false);
      const googleUser: UserProfile = {
        email: 'investor.hunter@gmail.com',
        name: 'Hunter Master',
        level: 2,
        xp: 120,
        xpNeeded: 250,
        streak: 5,
        totalSaved: 1540,
        joinedAt: new Date().toISOString(),
      };
      localStorage.setItem('cacador_metas_profile', JSON.stringify(googleUser));
      setSuccessMsg(t('fakeGoogleSuccess'));
      setTimeout(() => {
        onAuthSuccess(googleUser);
      }, 500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden" id="auth_container">
      {/* Absolute Header Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-3 z-20">
        <button
          onClick={handleLanguageToggle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-200 shadow-sm hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
          title="Switch Language"
          id="btn_lang_toggle"
        >
          <Globe size={13} />
          <span>{language === 'pt' ? 'BR ↔ EN' : 'EN ↔ PT'}</span>
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-200 shadow-sm hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
          id="btn_theme_toggle"
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>

      {/* Decorative Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Logo size="lg" className="mx-auto mb-2" />
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          {t('appName')}
        </h2>
        <p className="mt-1.5 text-center text-sm text-gray-500 dark:text-zinc-400 font-medium">
          {t('appSlogan')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white dark:bg-zinc-900 py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-150 dark:border-zinc-800/80 transition-all duration-300">
          <h3 className="text-xl font-bold text-gray-800 dark:text-zinc-100 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-emerald-500 rounded-full inline-block" />
            {mode === 'login' && t('welcomeBack')}
            {mode === 'register' && t('registerTitle')}
            {mode === 'forgot' && t('recoverPassword')}
          </h3>

          {errorMsg && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm flex items-start gap-2.5 shadow-sm" id="auth_error">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-sm flex items-start gap-2.5 shadow-sm" id="auth_success">
              <Sparkles size={18} className="shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleFormSubmit}>
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-1.5">
                  {t('namePlaceholder')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-zinc-500">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="João Silva"
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent text-sm transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-1.5">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-zinc-500">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('emailPlaceholder')}
                  className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                    Senha / Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setErrorMsg(''); setSuccessMsg(''); }}
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      {t('forgotPassword')}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-zinc-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent text-sm transition-all"
                  />
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 dark:border-zinc-800 rounded-md"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-600 dark:text-zinc-300 font-medium">
                  {t('rememberMe')}
                </label>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 flex justify-center items-center px-4 py-2 bg-emerald-600 dark:bg-emerald-500 text-white rounded-xl text-sm font-semibold shadow-md active:bg-emerald-700 dark:hover:bg-emerald-400 hover:bg-emerald-500 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 cursor-pointer"
                id="btn_auth_submit"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {mode === 'login' && t('loginBtn')}
                      {mode === 'register' && t('registerBtn')}
                      {mode === 'forgot' && t('recoverBtn')}
                    </span>
                    <ArrowRight size={16} className="ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>

          {mode !== 'forgot' && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase font-semibold">
                  <span className="px-2 bg-white dark:bg-zinc-900 text-gray-400">
                    {t('or')}
                  </span>
                </div>
              </div>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-gray-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-xs font-bold rounded-xl text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-900 shadow-sm transition-all focus:outline-none cursor-pointer"
                  id="btn_google_signin"
                >
                  {/* Flat Vector Google Icon */}
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" width="24" height="24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>{t('googleSignIn')}</span>
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            {mode === 'login' && (
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {t('noAccount')}
              </button>
            )}

            {mode === 'register' && (
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {t('haveAccount')}
              </button>
            )}

            {mode === 'forgot' && (
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {t('haveAccount')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
