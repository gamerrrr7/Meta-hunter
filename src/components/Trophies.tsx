import { Trophy, Award, Lock, Sparkles, Check, Flame, Star, Shield, ShieldCheck } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { AchievementBadge, UserProfile } from '../types';

interface TrophiesProps {
  profile: UserProfile;
  badges: AchievementBadge[];
}

export default function Trophies({ profile, badges }: TrophiesProps) {
  const { t, language } = useLanguage();

  const getBadgeIcon = (iconName: string, unlocked: boolean) => {
    const color = unlocked
      ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60'
      : 'text-gray-300 dark:text-zinc-700 bg-gray-150/55 dark:bg-zinc-850/30 border-gray-250 dark:border-zinc-800/40';

    switch (iconName) {
      case 'create_goal':
        return <Trophy size={28} className={color} />;
      case 'complete_goal':
        return <Award size={28} className={color} />;
      case 'streak_30':
        return <Flame size={28} className={color} />;
      case 'streak_100':
        return <Sparkles size={28} className={color} />;
      case 'save_1k':
        return <Star size={28} className={color} />;
      case 'save_10k':
        return <Shield size={28} className={color} />;
      default:
        return <ShieldCheck size={28} className={color} />;
    }
  };

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-6" id="trophies_panel">
      {/* Showroom page summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">{t('achievementsTitle')}</h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400 font-semibold">{t('achievementsSubtitle')}</p>
        </div>

        {/* Aggregate statistics badge */}
        <div className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 shadow-sm border border-amber-300 rounded-xl text-xs font-bold text-gray-950 flex items-center gap-1.5 shrink-0 select-none">
          <Trophy size={15} />
          <span>
            {unlockedCount} / {badges.length} {language === 'pt' ? 'Desbloqueados' : 'Unlocked'}
          </span>
        </div>
      </div>

      {/* Gamification Level stats overview */}
      <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-150 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row justify-between gap-6 relative overflow-hidden">
        {/* Ambient background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 dark:bg-amber-400/10 blur-xl rounded-full" />

        <div className="space-y-3.5 flex-1 relative z-10">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-amber-500 dark:text-amber-400">
              {language === 'pt' ? 'Nível Ativo de Economia' : 'Current Savings Tier'}
            </span>
            <h3 className="text-xl font-bold font-black text-gray-900 dark:text-white leading-snug">
              {t('levelTitle')} {profile.level} —{' '}
              <strong className="text-emerald-600 dark:text-emerald-400">
                {profile.level === 1 && t('streakLevel1')}
                {profile.level === 2 && t('streakLevel2')}
                {profile.level === 3 && t('streakLevel3')}
                {profile.level === 4 && t('streakLevel4')}
                {profile.level === 5 && t('streakLevel5')}
                {profile.level === 6 && t('streakLevel6')}
                {profile.level >= 7 && t('streakLevel7')}
              </strong>
            </h3>
          </div>

          <div className="space-y-1.5 w-full">
            <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-zinc-400">
              <span>{profile.xp} / {profile.xpNeeded} XP</span>
              <span>
                {Math.max(0, profile.xpNeeded - profile.xp)} {t('xpLabel')}
              </span>
            </div>

            <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-3 overflow-hidden border border-gray-200/50 dark:border-zinc-900">
              <div
                className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (profile.xp / profile.xpNeeded) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Badges achievements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="badges_showroom_grid">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${
              badge.unlocked
                ? 'bg-white dark:bg-zinc-900/40 border-gray-150 dark:border-zinc-805/70 shadow-sm'
                : 'bg-gray-50/60 dark:bg-zinc-950/15 border-gray-100 dark:border-zinc-850 border-dashed opacity-60'
            }`}
          >
            {/* Visual badge round medallion */}
            <div className="shrink-0 relative">
              <div className="p-3 rounded-2xl border flex items-center justify-center shadow-inner">
                {getBadgeIcon(badge.iconName, badge.unlocked)}
              </div>
              {badge.unlocked && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border border-white dark:border-zinc-900 shadow">
                  <Check size={9} strokeWidth={4} />
                </div>
              )}
            </div>

            {/* Informational description */}
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-gray-900 dark:text-zinc-100 leading-tight">
                {t(badge.titleKey)}
              </h4>
              <p className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400 leading-normal">
                {t(badge.descKey)}
              </p>
              <div className="flex gap-2.5 items-center pt-2">
                <span className="text-[10px] font-extrabold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                  +{badge.xpValue} XP
                </span>
                {badge.unlocked && badge.unlockedAt && (
                  <span className="text-[9px] font-semibold text-gray-400">
                    {t('unlockedAtDate', {
                      date: new Date(badge.unlockedAt).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US'),
                    })}
                  </span>
                )}
                {!badge.unlocked && (
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-0.5">
                    <Lock size={9} />
                    {t('locked')}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
