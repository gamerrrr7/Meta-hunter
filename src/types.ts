export type GoalCategory =
  | 'gaming'
  | 'technology'
  | 'travel'
  | 'vehicle'
  | 'home'
  | 'education'
  | 'investment'
  | 'emergency_fund'
  | 'custom';

export interface Goal {
  id: string;
  name: string;
  category: GoalCategory;
  targetValue: number;
  currentSaved: number;
  monthlyContribution: number;
  targetDate: string;
  notes?: string;
  createdAt: string;
  isCompleted: boolean;
  iconName: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  priority: 'low' | 'medium' | 'high';
}

export interface Notification {
  id: string;
  type: 'achievement' | 'goal' | 'saving' | 'system';
  titleKey: string; // Translation dictionary key or raw string fallback
  titleParams?: Record<string, string | number>;
  descKey: string;
  descParams?: Record<string, string | number>;
  date: string;
  read: boolean;
}

export interface AchievementBadge {
  id: string;
  titleKey: string;
  descKey: string;
  iconName: string;
  xpValue: number;
  unlocked: boolean;
  unlockedAt?: string;
  conditionType: 'create_goal' | 'complete_goal' | 'streak_30' | 'streak_100' | 'save_1k' | 'save_10k' | 'save_100k';
}

export interface DailyChallenge {
  id: string;
  titleKey: string;
  rewardXp: number;
  completed: boolean;
  type: 'save_today' | 'review_goals' | 'add_objective';
}

export interface UserProfile {
  email: string;
  name: string;
  level: number;
  xp: number;
  xpNeeded: number;
  streak: number;
  totalSaved: number;
  lastDailyClaim?: string;
  joinedAt: string;
}
