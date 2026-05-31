import { useState } from 'react';
import { TrendingUp, Award, Zap, Bell, CheckCircle, Flame, Star, BookOpen, AlertCircle, Quote } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';
import { Goal, UserProfile, DailyChallenge, Notification } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface DashboardProps {
  profile: UserProfile;
  goals: Goal[];
  challenges: DailyChallenge[];
  notifications: Notification[];
  onCompleteChallenge: (challengeId: string) => void;
  onClearNotifications: () => void;
  onMarkNotifRead: (id: string) => void;
}

export default function Dashboard({
  profile,
  goals,
  challenges,
  notifications,
  onCompleteChallenge,
  onClearNotifications,
  onMarkNotifRead
}: DashboardProps) {
  const { t, language } = useLanguage();
  const { theme } = useTheme();

  const [showNotifMenu, setShowNotifMenu] = useState(false);

  // Calculate currency format
  const formatCurrency = (val: number) => {
    return val.toLocaleString(language === 'pt' ? 'pt-BR' : 'en-US', {
      style: 'currency',
      currency: language === 'pt' ? 'BRL' : 'USD',
    });
  };

  const getLevelName = (level: number) => {
    if (level === 1) return t('streakLevel1');
    if (level === 2) return t('streakLevel2');
    if (level === 3) return t('streakLevel3');
    if (level === 4) return t('streakLevel4');
    if (level === 5) return t('streakLevel5');
    if (level === 6) return t('streakLevel6');
    return t('streakLevel7');
  };

  // Pre-load dynamic charts data
  const totalTargetNeeded = goals.reduce((sum, g) => sum + g.targetValue, 0);
  const activeCount = goals.filter((g) => !g.isCompleted).length;
  const completedCount = goals.filter((g) => g.isCompleted).length;

  // Let's create a realistic projection dataset based on monthly contributions
  const generateChartData = () => {
    // Standard evolution chart
    const data = [];
    const monthlySum = goals.reduce((sum, g) => sum + (g.isCompleted ? 0 : g.monthlyContribution), 0) || 150;
    let savedAccumulator = profile.totalSaved;

    // Simulate 6 months
    const monthsPt = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIndex = new Date().getMonth();

    for (let i = 0; i < 6; i++) {
      const idx = (currentMonthIndex + i) % 12;
      const monthLabel = language === 'pt' ? monthsPt[idx] : monthsEn[idx];
      data.push({
        name: monthLabel,
        [t('totalSaved')]: Math.round(savedAccumulator),
        projection: Math.round(savedAccumulator + (monthlySum * i))
      });
      savedAccumulator += monthlySum * 0.8; // add periodic savings increment
    }
    return data;
  };

  const chartData = generateChartData();

  // Pick random quote of the day based on date
  const quotes = [t('quote_1'), t('quote_2'), t('quote_3'), t('quote_4'), t('quote_5')];
  const activeQuoteIndex = new Date().getDate() % quotes.length;
  const activeQuote = quotes[activeQuoteIndex];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6" id="dashboard_panel">
      {/* Welcome Hero Panel */}
      <div className="bg-slate-900 border border-slate-850 dark:bg-slate-900/60 dark:border-slate-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden" id="dashboard_welcome">
        {/* Decorative backdrop blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none -ml-8 -mb-8" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-350 border border-emerald-500/25 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Zap size={12} className="text-emerald-400 animate-bounce" />
              {getLevelName(profile.level)}
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {t('welcomeBack')}, {profile.name}!
            </h1>
            <p className="text-slate-300 text-sm max-w-lg font-medium">
              {t('welcomeMsg')}
            </p>
          </div>

          {/* Gamified XP Progress Indicator */}
          <div className="w-full md:w-64 bg-white/5 dark:bg-black/20 p-4 rounded-2xl border border-white/10 dark:border-slate-800/80 space-y-2.5 shadow-sm">
            <div className="flex justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-200">
                <Star size={14} className="text-emerald-400 fill-emerald-400" />
                {t('levelTitle')} {profile.level}
              </span>
              <span className="text-slate-300">{profile.xp} / {profile.xpNeeded} XP</span>
            </div>
            
            {/* Custom XP Progress Bar */}
            <div className="w-full bg-white/10 dark:bg-slate-800 rounded-full h-3 overflow-hidden border border-white/5">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500 shadow-inner"
                style={{ width: `${Math.min(100, (profile.xp / profile.xpNeeded) * 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-emerald-400 text-right font-semibold tracking-wide">
              {t('xpLabel')}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Section Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="stats_grid">
        {/* Card 1: Total Saved */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-155 dark:border-slate-800/80 shadow-sm flex items-center gap-4 transition-all duration-300 hover:shadow-md">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450 rounded-2xl">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('totalSaved')}</p>
            <p className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {formatCurrency(profile.totalSaved)}
            </p>
          </div>
        </div>

        {/* Card 2: Streak counter */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-155 dark:border-slate-800/80 shadow-sm flex items-center gap-4 transition-all duration-300 hover:shadow-md">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-500 rounded-2xl">
            <Flame size={20} className="animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('savingsStreak')}</p>
            <p className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {profile.streak} {profile.streak >= 1 ? '🔥' : ''}
            </p>
          </div>
        </div>

        {/* Card 3: Active count */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-155 dark:border-slate-800/80 shadow-sm flex items-center gap-4 transition-all duration-300 hover:shadow-md">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-2xl">
            <Star size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('activeGoals')}</p>
            <p className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {activeCount}
            </p>
          </div>
        </div>

        {/* Card 4: Completed count */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-155 dark:border-slate-800/80 shadow-sm flex items-center gap-4 transition-all duration-300 hover:shadow-md">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/40 text-purple-600 rounded-2xl">
            <Award size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('completedGoals')}</p>
            <p className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {completedCount}
            </p>
          </div>
        </div>
      </div>

      {/* Main content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Middle Column: Graphic analysis and motivation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800/60 shadow-sm space-y-4 transition-all duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-850 dark:text-slate-100">{t('chartEvolution')}</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">{t('chartProjections')}</p>
              </div>
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-450">
                PROJETO
              </span>
            </div>

            {goals.length === 0 ? (
              <div className="h-64 flex flex-col justify-center items-center text-center p-4">
                <AlertCircle className="text-slate-400 dark:text-slate-500 mb-2" size={32} />
                <p className="text-sm text-slate-400 dark:text-slate-500 font-semibold">{t('noDataChart')}</p>
              </div>
            ) : (
              <div className="h-64 w-full text-slate-400">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorProj" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                        borderColor: theme === 'dark' ? '#1e293b' : '#e2e8f0',
                        borderRadius: '16px',
                        fontSize: '12px'
                      }}
                      labelStyle={{ fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey={t('totalSaved')} stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorSaved)" />
                    <Area type="monotone" dataKey="projection" stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorProj)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Motivation card */}
          <div className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-3xl border border-slate-150 dark:border-slate-800/50 shadow-sm flex gap-4 items-start relative overflow-hidden">
            <Quote size={40} className="text-emerald-500/5 dark:text-emerald-500/5 absolute -right-2 -bottom-2 transform rotate-180" />
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450 shrink-0">
              <Quote size={18} />
            </div>
            <div className="space-y-1">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{t('motivationalGreeting')}</h4>
              <p className="text-slate-700 dark:text-slate-300 text-sm italic font-medium leading-relaxed">
                "{activeQuote}"
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Challenges and Notifications */}
        <div className="space-y-6">
          {/* Daily Challenges */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-150 dark:border-slate-800/60 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-850 dark:text-slate-100 flex items-center gap-1.5">
              <Zap size={16} className="text-emerald-500 fill-emerald-500" />
              {t('todayChallengeTitle')}
            </h3>

            <div className="space-y-3">
              {challenges.map((ch) => (
                <div
                  key={ch.id}
                  className={`p-4 rounded-2xl border flex flex-col justify-between items-start gap-3 transition-all ${
                    ch.completed
                      ? 'bg-slate-50/55 dark:bg-slate-950/25 border-slate-100 dark:border-slate-850/60 opacity-60'
                      : 'bg-white dark:bg-slate-900 border-slate-150 dark:border-slate-800/80 hover:border-emerald-500 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <CheckCircle
                      className={`shrink-0 mt-0.5 ${ch.completed ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-700'}`}
                      size={16}
                    />
                    <p className="text-xs sm:text-sm font-semibold text-slate-705 dark:text-slate-205">
                      {t(ch.titleKey)}
                    </p>
                  </div>

                  <div className="flex justify-between items-center w-full mt-1">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded">
                      +{ch.rewardXp} XP
                    </span>

                    {!ch.completed ? (
                      <button
                        onClick={() => onCompleteChallenge(ch.id)}
                        className="text-[10px] font-bold px-3 py-1 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white cursor-pointer active:scale-95 transition-all shadow-sm hover:bg-emerald-500"
                      >
                        {t('completeChallengeBtn', { xp: ch.rewardXp })}
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {t('claimedChallenge')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications feed */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-150 dark:border-slate-800/60 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-850 dark:text-slate-100 flex items-center gap-1.5">
                <Bell size={16} className="text-emerald-500" />
                {t('notificationTitle')}
                {unreadCount > 0 && (
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                )}
              </h3>
              {notifications.length > 0 && (
                <button
                  onClick={onClearNotifications}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  {t('markAllRead')}
                </button>
              )}
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                  {t('noNotifications')}
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => onMarkNotifRead(notif.id)}
                    className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                      notif.read
                        ? 'bg-slate-50/50 dark:bg-slate-950/20 border-slate-100 dark:border-slate-850/60 opacity-60'
                        : 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-950/40'
                    }`}
                  >
                    <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200 mb-0.5">
                      <span>{t(notif.titleKey, notif.titleParams)}</span>
                      <span className="text-[10px] text-slate-450 font-normal">
                        {new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                      {t(notif.descKey, notif.descParams)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
