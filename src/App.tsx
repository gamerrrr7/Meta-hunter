import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Target,
  ShoppingBag,
  Calculator,
  GraduationCap,
  Trophy,
  Sparkles,
  LogOut,
  Bell,
  Sun,
  Moon,
  Globe,
  Menu,
  X,
  CreditCard,
  Phone,
  HelpCircle
} from 'lucide-react';
import { LanguageProvider, useLanguage } from './components/LanguageContext';
import { ThemeProvider, useTheme } from './components/ThemeContext';
import { UserProfile, Goal, GoalCategory, WishlistItem, DailyChallenge, Notification, AchievementBadge } from './types';
import Logo from './components/Logo';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import GoalTracker from './components/GoalTracker';
import Wishlist from './components/Wishlist';
import Calculators from './components/Calculators';
import Education from './components/Education';
import Trophies from './components/Trophies';
import AIAssistant from './components/AIAssistant';

// Initial Badges Setup Seed
const initialBadges: AchievementBadge[] = [
  {
    id: 'first_goal',
    titleKey: 'badge_create_goal',
    descKey: 'badge_create_goal_desc',
    iconName: 'create_goal',
    xpValue: 50,
    unlocked: false,
    conditionType: 'create_goal',
  },
  {
    id: 'complete_goal',
    titleKey: 'badge_complete_goal',
    descKey: 'badge_complete_goal_desc',
    iconName: 'complete_goal',
    xpValue: 100,
    unlocked: false,
    conditionType: 'complete_goal',
  },
  {
    id: 'streak_30',
    titleKey: 'badge_streak_30',
    descKey: 'badge_streak_30_desc',
    iconName: 'streak_30',
    xpValue: 150,
    unlocked: false,
    conditionType: 'streak_30',
  },
  {
    id: 'streak_100',
    titleKey: 'badge_streak_100',
    descKey: 'badge_streak_100_desc',
    iconName: 'streak_100',
    xpValue: 250,
    unlocked: false,
    conditionType: 'streak_100',
  },
  {
    id: 'save_1k',
    titleKey: 'badge_save_1k',
    descKey: 'badge_save_1k_desc',
    iconName: 'save_1k',
    xpValue: 50,
    unlocked: false,
    conditionType: 'save_1k',
  },
  {
    id: 'save_10k',
    titleKey: 'badge_save_10k',
    descKey: 'badge_save_10k_desc',
    iconName: 'save_10k',
    xpValue: 100,
    unlocked: false,
    conditionType: 'save_10k',
  },
  {
    id: 'save_100k',
    titleKey: 'badge_save_100k',
    descKey: 'badge_save_100k_desc',
    iconName: 'save_100k',
    xpValue: 300,
    unlocked: false,
    conditionType: 'save_100k',
  }
];

// Initial Challenges Seed
const initialChallenges: DailyChallenge[] = [
  { id: 'ch1', titleKey: 'challenge_save_today', rewardXp: 20, completed: false, type: 'save_today' },
  { id: 'ch2', titleKey: 'challenge_review_goals', rewardXp: 15, completed: false, type: 'review_goals' },
  { id: 'ch3', titleKey: 'challenge_add_objective', rewardXp: 15, completed: false, type: 'add_objective' }
];

function InnerApp() {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  // Navigation / Drawer status
  const [activeTab, setActiveTab] = useState<'dashboard' | 'goals' | 'wishlist' | 'calculators' | 'education' | 'trophies' | 'ai'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // States
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [badges, setBadges] = useState<AchievementBadge[]>(initialBadges);

  // Load state from LocalStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('cacador_metas_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }

    const savedGoals = localStorage.getItem('cacador_metas_goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }

    const savedWish = localStorage.getItem('cacador_metas_wishlist');
    if (savedWish) {
      setWishlist(JSON.parse(savedWish));
    }

    const savedNotifs = localStorage.getItem('cacador_metas_notifications');
    if (savedNotifs) {
      setNotifications(JSON.parse(savedNotifs));
    }

    const savedBadges = localStorage.getItem('cacador_metas_badges');
    if (savedBadges) {
      setBadges(JSON.parse(savedBadges));
    } else {
      setBadges(initialBadges);
    }

    const savedChallenges = localStorage.getItem('cacador_metas_challenges');
    const lastChallengeReset = localStorage.getItem('cacador_metas_challenge_reset');
    const todayStr = new Date().toDateString();

    if (savedChallenges && lastChallengeReset === todayStr) {
      setChallenges(JSON.parse(savedChallenges));
    } else {
      setChallenges(initialChallenges);
      localStorage.setItem('cacador_metas_challenges', JSON.stringify(initialChallenges));
      localStorage.setItem('cacador_metas_challenge_reset', todayStr);
    }
  }, []);

  // Save states helper
  const saveStateToLocalStorage = (
    updatedProfile: UserProfile,
    updatedGoals: Goal[],
    updatedWish: WishlistItem[],
    updatedNotifs: Notification[],
    updatedBadges: AchievementBadge[],
    updatedChallenges: DailyChallenge[]
  ) => {
    localStorage.setItem('cacador_metas_profile', JSON.stringify(updatedProfile));
    localStorage.setItem('cacador_metas_goals', JSON.stringify(updatedGoals));
    localStorage.setItem('cacador_metas_wishlist', JSON.stringify(updatedWish));
    localStorage.setItem('cacador_metas_notifications', JSON.stringify(updatedNotifs));
    localStorage.setItem('cacador_metas_badges', JSON.stringify(updatedBadges));
    localStorage.setItem('cacador_metas_challenges', JSON.stringify(updatedChallenges));
  };

  // Gamification: Add XP and handle Level Ups
  const grantXpAndLevelUp = (currentProfile: UserProfile, xpAmount: number, currentNotifs: Notification[]) => {
    let newXp = currentProfile.xp + xpAmount;
    let newLevel = currentProfile.level;
    let newXpNeeded = currentProfile.xpNeeded;
    const addedNotifications = [...currentNotifs];

    while (newXp >= newXpNeeded) {
      newXp -= newXpNeeded;
      newLevel += 1;
      newXpNeeded = Math.round(newXpNeeded * 1.5); // level progression scale multiplier

      // Inject visual Level Up notification alert
      const levelNotif: Notification = {
        id: 'lvl-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
        type: 'system',
        titleKey: 'notif_level_up',
        titleParams: {},
        descKey: 'notif_level_up_desc',
        descParams: { level: newLevel },
        date: new Date().toISOString(),
        read: false,
      };
      addedNotifications.unshift(levelNotif);
    }

    return {
      updatedProfile: {
        ...currentProfile,
        level: newLevel,
        xp: newXp,
        xpNeeded: newXpNeeded,
      },
      updatedNotifs: addedNotifications,
    };
  };

  // Gamification: Audit Badge Unlock Statuses
  const auditAchievements = (
    currentProfile: UserProfile,
    currentGoals: Goal[],
    currentBadges: AchievementBadge[],
    currentNotifs: Notification[],
    actionType?: 'create_goal' | 'complete_goal'
  ) => {
    let xpGrantedAccumulator = 0;
    const updatedBadges = currentBadges.map((badge) => {
      if (badge.unlocked) return badge;

      let shouldUnlock = false;

      switch (badge.conditionType) {
        case 'create_goal':
          if (actionType === 'create_goal' || currentGoals.length >= 1) shouldUnlock = true;
          break;
        case 'complete_goal':
          if (actionType === 'complete_goal' || currentGoals.some((g) => g.isCompleted)) shouldUnlock = true;
          break;
        case 'streak_30':
          if (currentProfile.streak >= 30) shouldUnlock = true;
          break;
        case 'streak_100':
          if (currentProfile.streak >= 100) shouldUnlock = true;
          break;
        case 'save_1k':
          if (currentProfile.totalSaved >= 1000) shouldUnlock = true;
          break;
        case 'save_10k':
          if (currentProfile.totalSaved >= 10000) shouldUnlock = true;
          break;
        case 'save_100k':
          if (currentProfile.totalSaved >= 100000) shouldUnlock = true;
          break;
      }

      if (shouldUnlock) {
        xpGrantedAccumulator += badge.xpValue;
        
        // Push Achievement Notification
        const achievementNotif: Notification = {
          id: 'ach-' + Date.now() + '-' + badge.id,
          type: 'achievement',
          titleKey: 'notif_achievement',
          titleParams: {},
          descKey: 'notif_achievement_desc',
          descParams: { badge: t(badge.titleKey), xp: badge.xpValue },
          date: new Date().toISOString(),
          read: false,
        };
        currentNotifs.unshift(achievementNotif);

        return {
          ...badge,
          unlocked: true,
          unlockedAt: new Date().toISOString(),
        };
      }

      return badge;
    });

    // Award total XP accumulated from recently unlocked cards
    let finalProfile = currentProfile;
    let finalNotifs = currentNotifs;

    if (xpGrantedAccumulator > 0) {
      const res = grantXpAndLevelUp(currentProfile, xpGrantedAccumulator, currentNotifs);
      finalProfile = res.updatedProfile;
      finalNotifs = res.updatedNotifs;
    }

    return {
      finalProfile,
      updatedBadges,
      finalNotifs,
    };
  };

  // Callback: Register/Login success
  const handleAuthSuccess = (newProfile: UserProfile) => {
    setProfile(newProfile);
    // Initialize standard challenges
    setChallenges(initialChallenges);
    setBadges(initialBadges);
    saveStateToLocalStorage(newProfile, [], [], [], initialBadges, initialChallenges);
  };

  // Callback: Create Goal
  const handleAddGoal = (goalData: Omit<Goal, 'id' | 'createdAt' | 'isCompleted'>) => {
    if (!profile) return;

    const newGoal: Goal = {
      ...goalData,
      id: 'goal-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      isCompleted: false,
    };

    const updatedGoals = [...goals, newGoal];

    // Create Goal Notification
    const notif: Notification = {
      id: 'notif-' + Date.now(),
      type: 'goal',
      titleKey: 'notif_goal_created',
      titleParams: {},
      descKey: 'notif_goal_created_desc',
      descParams: { name: newGoal.name, date: new Date(newGoal.targetDate).toLocaleDateString() },
      date: new Date().toISOString(),
      read: false,
    };
    const updatedNotifs = [notif, ...notifications];

    // Grant small create goal XP (+20 XP)
    const { updatedProfile, updatedNotifs: nextNotifs } = grantXpAndLevelUp(profile, 20, updatedNotifs);

    // Audit Achievements
    const auditRes = auditAchievements(updatedProfile, updatedGoals, badges, nextNotifs, 'create_goal');

    setProfile(auditRes.finalProfile);
    setGoals(updatedGoals);
    setNotifications(auditRes.finalNotifs);
    setBadges(auditRes.updatedBadges);

    saveStateToLocalStorage(
      auditRes.finalProfile,
      updatedGoals,
      wishlist,
      auditRes.finalNotifs,
      auditRes.updatedBadges,
      challenges
    );
  };

  // Callback: Add progress contribution savings to goal
  const handleAddProgress = (goalId: string, amount: number) => {
    if (!profile) return;

    let isGoalCompletedSuccess = false;
    let completedGoalName = '';

    const updatedGoals = goals.map((g) => {
      if (g.id !== goalId) return g;

      const newSaved = g.currentSaved + amount;
      const completed = newSaved >= g.targetValue;
      
      if (completed && !g.isCompleted) {
        isGoalCompletedSuccess = true;
        completedGoalName = g.name;
      }

      return {
        ...g,
        currentSaved: Math.min(g.targetValue, newSaved),
        isCompleted: completed,
      };
    });

    // Add saving transaction Notification
    const nameOfGoal = goals.find((g) => g.id === goalId)?.name || '';
    const progressNotif: Notification = {
      id: 'notif-p-' + Date.now(),
      type: 'saving',
      titleKey: 'notif_goal_progress',
      titleParams: {},
      descKey: 'notif_goal_progress_desc',
      descParams: { amount, name: nameOfGoal },
      date: new Date().toISOString(),
      read: false,
    };
    const updatedNotifs = [progressNotif, ...notifications];

    // Update overall total Saved tracker
    const nextTotalSaved = profile.totalSaved + amount;
    
    // Grant XP (+15 XP for any contribution, +100 bonus XP for completing a goal!)
    let profileXpGained = 15;
    if (isGoalCompletedSuccess) {
      profileXpGained += 100;

      // Add completed goal Notification
      const compNotif: Notification = {
        id: 'notif-c-' + Date.now(),
        type: 'goal',
        titleKey: 'badge_complete_goal',
        titleParams: {},
        descKey: 'badge_complete_goal_desc',
        descParams: {},
        date: new Date().toISOString(),
        read: false,
      };
      updatedNotifs.unshift(compNotif);
    }

    let currentProfileState = {
      ...profile,
      totalSaved: nextTotalSaved,
    };

    const { updatedProfile, updatedNotifs: nextNotifs } = grantXpAndLevelUp(
      currentProfileState,
      profileXpGained,
      updatedNotifs
    );

    // Audit Achievements
    const auditRes = auditAchievements(
      updatedProfile,
      updatedGoals,
      badges,
      nextNotifs,
      isGoalCompletedSuccess ? 'complete_goal' : undefined
    );

    setProfile(auditRes.finalProfile);
    setGoals(updatedGoals);
    setNotifications(auditRes.finalNotifs);
    setBadges(auditRes.updatedBadges);

    saveStateToLocalStorage(
      auditRes.finalProfile,
      updatedGoals,
      wishlist,
      auditRes.finalNotifs,
      auditRes.updatedBadges,
      challenges
    );
  };

  // Callback: Delete Goal
  const handleDeleteGoal = (goalId: string) => {
    if (!profile) return;
    const updatedGoals = goals.filter((g) => g.id !== goalId);
    setGoals(updatedGoals);
    saveStateToLocalStorage(profile, updatedGoals, wishlist, notifications, badges, challenges);
  };

  // Callback: Register Shopping Wish
  const handleAddWish = (wishData: Omit<WishlistItem, 'id'>) => {
    if (!profile) return;

    const newWish: WishlistItem = {
      ...wishData,
      id: 'wish-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    };

    const updatedWish = [...wishlist, newWish];
    setWishlist(updatedWish);

    saveStateToLocalStorage(profile, goals, updatedWish, notifications, badges, challenges);
  };

  // Callback: Delete Shopping Wish
  const handleDeleteWish = (wishId: string) => {
    if (!profile) return;
    const updatedWish = wishlist.filter((w) => w.id !== wishId);
    setWishlist(updatedWish);
    saveStateToLocalStorage(profile, goals, updatedWish, notifications, badges, challenges);
  };

  // Callback: Convert Desire into Active Goal
  const handleConvertWishToGoal = (wish: WishlistItem, category: GoalCategory, monthlyContribution: number) => {
    if (!profile) return;

    // Remove from wish
    const updatedWish = wishlist.filter((w) => w.id !== wish.id);

    // Prompt default date to be +12 months initially
    const defaultDate = new Date();
    defaultDate.setMonth(defaultDate.getMonth() + 12);
    const dateStr = defaultDate.toISOString().split('T')[0];

    // Add Goal
    const newGoal: Goal = {
      id: 'goal-c-' + Date.now(),
      name: wish.name,
      category,
      targetValue: wish.price,
      currentSaved: 0,
      monthlyContribution,
      targetDate: dateStr,
      createdAt: new Date().toISOString(),
      isCompleted: false,
      iconName: category,
    };

    const updatedGoals = [...goals, newGoal];

    // Notification
    const notif: Notification = {
      id: 'notif-con-' + Date.now(),
      type: 'goal',
      titleKey: 'notif_goal_created',
      titleParams: {},
      descKey: 'notif_goal_created_desc',
      descParams: { name: newGoal.name, date: new Date(newGoal.targetDate).toLocaleDateString() },
      date: new Date().toISOString(),
      read: false,
    };
    const updatedNotifs = [notif, ...notifications];

    // Grant conversion XP helper (+25 XP!)
    const { updatedProfile, updatedNotifs: nextNotifs } = grantXpAndLevelUp(profile, 25, updatedNotifs);

    // Audit Achievements
    const auditRes = auditAchievements(updatedProfile, updatedGoals, badges, nextNotifs, 'create_goal');

    setProfile(auditRes.finalProfile);
    setWishlist(updatedWish);
    setGoals(updatedGoals);
    setNotifications(auditRes.finalNotifs);
    setBadges(auditRes.updatedBadges);

    saveStateToLocalStorage(
      auditRes.finalProfile,
      updatedGoals,
      updatedWish,
      auditRes.finalNotifs,
      auditRes.updatedBadges,
      challenges
    );
  };

  // Callback: Daily challenge completed claim
  const handleCompleteChallenge = (challengeId: string) => {
    if (!profile) return;

    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge || challenge.completed) return;

    const updatedChallenges = challenges.map((c) => {
      if (c.id !== challengeId) return c;
      return { ...c, completed: true };
    });

    // Add Streak if applicable
    let finalStreak = profile.streak;
    if (challenge.type === 'save_today') {
      finalStreak += 1;
    }

    let intermediateProfile = {
      ...profile,
      streak: finalStreak,
    };

    // Grant challenge XP
    const { updatedProfile, updatedNotifs } = grantXpAndLevelUp(
      intermediateProfile,
      challenge.rewardXp,
      notifications
    );

    // Audit Achievements
    const auditRes = auditAchievements(updatedProfile, goals, badges, updatedNotifs);

    setProfile(auditRes.finalProfile);
    setChallenges(updatedChallenges);
    setNotifications(auditRes.finalNotifs);
    setBadges(auditRes.updatedBadges);

    saveStateToLocalStorage(
      auditRes.finalProfile,
      goals,
      wishlist,
      auditRes.finalNotifs,
      auditRes.updatedBadges,
      updatedChallenges
    );
  };

  // Callback: Set notifications as read
  const handleClearNotifications = () => {
    if (!profile) return;
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    saveStateToLocalStorage(profile, goals, wishlist, updated, badges, challenges);
  };

  // Callback: Mark individual notification as read
  const handleMarkNotifRead = (id: string) => {
    if (!profile) return;
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    saveStateToLocalStorage(profile, goals, wishlist, updated, badges, challenges);
  };

  // Callback: Log Out
  const handleLogout = () => {
    localStorage.removeItem('cacador_metas_profile');
    localStorage.removeItem('cacador_metas_goals');
    localStorage.removeItem('cacador_metas_notifications');
    localStorage.removeItem('cacador_metas_wishlist');
    localStorage.removeItem('cacador_metas_challenges');
    setProfile(null);
    setGoals([]);
    setWishlist([]);
    setNotifications([]);
    setBadges(initialBadges);
    setChallenges(initialChallenges);
    setActiveTab('dashboard');
  };

  // Guard clause: redirect to authenticating cards if profile is undefined/empty
  if (!profile) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-300" id="cacador_metas_root">
      {/* 2. Responsive Side Navigation Rail bar */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-b md:border-b-0 md:border-r border-slate-150 dark:border-slate-800/80 shrink-0 md:h-screen sticky top-0 flex flex-col justify-between z-30 shadow-xs md:shadow-none">
        
        {/* Top Header Rail brand logo detail */}
        <div className="px-5 py-4 flex md:flex-col justify-between items-center md:items-start gap-4">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <h1 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white leading-none">
              {t('appName')}
            </h1>
          </div>

          {/* Core global quick buttons / switches */}
          <div className="flex items-center gap-2.5 md:w-full md:justify-between md:border-t md:border-slate-100 md:dark:border-slate-800/60 md:pt-3.5">
            {/* Theme trigger */}
            <button
               onClick={toggleTheme}
               className="p-1 px-2 border border-slate-200 dark:border-slate-800/80 shadow-xs rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition text-slate-500 dark:text-slate-400 cursor-pointer text-xs flex gap-1 items-center font-bold"
               title="Theme option"
            >
              {theme === 'light' ? <Moon size={13} /> : <Sun size={13} />}
              <span className="text-[10px] uppercase font-bold">{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>

            {/* Language switches click */}
            <button
              onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
              className="p-1 px-2 border border-slate-205 dark:border-slate-800/80 shadow-xs rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition text-slate-500 dark:text-slate-400 cursor-pointer text-[10px] font-bold flex gap-1 items-center uppercase"
            >
              <Globe size={11} />
              <span>{language === 'pt' ? 'EN' : 'PT'}</span>
            </button>

            {/* Mobile Nav toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-xl border border-slate-200 dark:border-slate-800/80 hover:bg-slate-55"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Tab Selection buttons list */}
        <nav className={`px-3 py-1 space-y-1.5 shrink-0 grow overflow-y-auto ${mobileMenuOpen ? 'block' : 'hidden'} md:block pb-5`}>
          {/* Btn 1: Dashboard */}
          <button
            onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
            className={`w-full h-11 px-4 text-xs font-bold rounded-xl flex items-center gap-3 transition cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-slate-50 dark:bg-slate-800/40 text-slate-900 dark:text-white border-l-2 border-emerald-500'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850/50'
            }`}
          >
            <LayoutDashboard size={16} />
            <span>{t('navDashboard')}</span>
          </button>

          {/* Btn 2: Goals */}
          <button
            onClick={() => { setActiveTab('goals'); setMobileMenuOpen(false); }}
            className={`w-full h-11 px-4 text-xs font-bold rounded-xl flex items-center gap-3 transition cursor-pointer ${
              activeTab === 'goals'
                ? 'bg-slate-50 dark:bg-slate-800/40 text-slate-900 dark:text-white border-l-2 border-emerald-500'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850/50'
            }`}
          >
            <Target size={16} />
            <span>{t('navGoals')}</span>
          </button>

          {/* Btn 3: Wishlist */}
          <button
            onClick={() => { setActiveTab('wishlist'); setMobileMenuOpen(false); }}
            className={`w-full h-11 px-4 text-xs font-bold rounded-xl flex items-center gap-3 transition cursor-pointer ${
              activeTab === 'wishlist'
                ? 'bg-slate-50 dark:bg-slate-800/40 text-slate-900 dark:text-white border-l-2 border-emerald-500'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850/50'
            }`}
          >
            <ShoppingBag size={16} />
            <span>{t('navWishlist')}</span>
          </button>

          {/* Btn 4: Calculators */}
          <button
            onClick={() => { setActiveTab('calculators'); setMobileMenuOpen(false); }}
            className={`w-full h-11 px-4 text-xs font-bold rounded-xl flex items-center gap-3 transition cursor-pointer ${
              activeTab === 'calculators'
                ? 'bg-slate-50 dark:bg-slate-800/40 text-slate-900 dark:text-white border-l-2 border-emerald-500'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850/50'
            }`}
          >
            <Calculator size={16} />
            <span>{t('navCalculators')}</span>
          </button>

          {/* Btn 5: Education */}
          <button
            onClick={() => { setActiveTab('education'); setMobileMenuOpen(false); }}
            className={`w-full h-11 px-4 text-xs font-bold rounded-xl flex items-center gap-3 transition cursor-pointer ${
              activeTab === 'education'
                ? 'bg-slate-50 dark:bg-slate-800/40 text-slate-900 dark:text-white border-l-2 border-emerald-500'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850/50'
            }`}
          >
            <GraduationCap size={16} />
            <span>{t('navEducation')}</span>
          </button>

          {/* Btn 6: Trophies achievements */}
          <button
            onClick={() => { setActiveTab('trophies'); setMobileMenuOpen(false); }}
            className={`w-full h-11 px-4 text-xs font-bold rounded-xl flex items-center gap-3 transition cursor-pointer ${
              activeTab === 'trophies'
                ? 'bg-slate-50 dark:bg-slate-800/40 text-slate-900 dark:text-white border-l-2 border-emerald-500'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850/50'
            }`}
          >
            <Trophy size={16} />
            <span>{t('navTrophies')}</span>
          </button>

          {/* Btn 7: AI Assistant */}
          <button
            onClick={() => { setActiveTab('ai'); setMobileMenuOpen(false); }}
            className={`w-full h-11 px-4 text-xs font-bold rounded-xl flex items-center gap-3 transition cursor-pointer ${
              activeTab === 'ai'
                ? 'bg-slate-55 dark:bg-slate-800 text-slate-900 dark:text-white border-l-2 border-emerald-500 font-extrabold'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850/50'
            }`}
          >
            <Sparkles size={16} className="text-amber-500" />
            <span>Hunter AI</span>
          </button>
        </nav>

        {/* User logout footer trigger */}
        <div className="p-4 border-t border-slate-150 dark:border-slate-800/80 hidden md:block">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold">
              <p className="text-slate-900 dark:text-white truncate font-extrabold max-w-[124px]">{profile.name}</p>
              <p className="text-[10px] text-slate-400 truncate max-w-[124px]">{profile.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 border border-slate-200 dark:border-slate-800 hover:border-red-400/40 hover:text-red-500 rounded-xl transition cursor-pointer flex justify-center items-center"
              title="Logout session"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

      </aside>

      {/* 3. Main content canvas viewport layout */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto h-screen md:pb-24">
        {activeTab === 'dashboard' && (
          <Dashboard
            profile={profile}
            goals={goals}
            challenges={challenges}
            notifications={notifications}
            onCompleteChallenge={handleCompleteChallenge}
            onClearNotifications={handleClearNotifications}
            onMarkNotifRead={handleMarkNotifRead}
          />
        )}

        {activeTab === 'goals' && (
          <GoalTracker
            goals={goals}
            onAddGoal={handleAddGoal}
            onAddProgress={handleAddProgress}
            onDeleteGoal={handleDeleteGoal}
          />
        )}

        {activeTab === 'wishlist' && (
          <Wishlist
            wishlist={wishlist}
            onAddWish={handleAddWish}
            onDeleteWish={handleDeleteWish}
            onConvertWishToGoal={handleConvertWishToGoal}
          />
        )}

        {activeTab === 'calculators' && <Calculators />}

        {activeTab === 'education' && <Education />}

        {activeTab === 'trophies' && <Trophies profile={profile} badges={badges} />}

        {activeTab === 'ai' && <AIAssistant />}

        {/* Unified high-end footer with disclaimer text */}
        <footer className="mt-12 py-6 border-t border-gray-150 dark:border-zinc-800/80 text-center text-[11px] text-gray-400 space-y-2.5 max-w-4xl mx-auto">
          <p className="font-semibold text-gray-500 dark:text-zinc-500">
            {t('footerDisclaimer')}
          </p>
          <div className="flex justify-center gap-4 text-[10px] font-bold text-gray-500 hover:text-emerald-500">
            <span className="hover:underline cursor-pointer">{t('about')}</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">{t('contact')}</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">{t('privacyPolicy')}</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">{t('termsOfUse')}</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <InnerApp />
      </LanguageProvider>
    </ThemeProvider>
  );
}
