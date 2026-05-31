import { useState, FormEvent } from 'react';
import {
  Gamepad2,
  Laptop,
  Plane,
  Car,
  Home as HomeIcon,
  GraduationCap,
  TrendingUp,
  Shield,
  Target,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  Search,
  ChevronRight,
  Info,
  Layers,
  Sparkles,
  HelpCircle,
  X
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { Goal, GoalCategory } from '../types';

interface GoalTrackerProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'isCompleted'>) => void;
  onAddProgress: (goalId: string, amount: number) => void;
  onDeleteGoal: (goalId: string) => void;
}

export default function GoalTracker({ goals, onAddGoal, onAddProgress, onDeleteGoal }: GoalTrackerProps) {
  const { t, language } = useLanguage();

  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [category, setCategory] = useState<GoalCategory>('gaming');
  const [targetValue, setTargetValue] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [notes, setNotes] = useState('');

  // Add progress modal
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [addAmount, setAddAmount] = useState('');

  // Scenario Comparison Tool
  const [compareA, setCompareA] = useState('200');
  const [compareB, setCompareB] = useState('500');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  const formatCurrency = (val: number) => {
    return val.toLocaleString(language === 'pt' ? 'pt-BR' : 'en-US', {
      style: 'currency',
      currency: language === 'pt' ? 'BRL' : 'USD',
    });
  };

  const getCategoryIcon = (cat: GoalCategory) => {
    switch (cat) {
      case 'gaming':
        return <Gamepad2 size={18} />;
      case 'technology':
        return <Laptop size={18} />;
      case 'travel':
        return <Plane size={18} />;
      case 'vehicle':
        return <Car size={18} />;
      case 'home':
        return <HomeIcon size={18} />;
      case 'education':
        return <GraduationCap size={18} />;
      case 'investment':
        return <TrendingUp size={18} />;
      case 'emergency_fund':
        return <Shield size={18} />;
      default:
        return <Target size={18} />;
    }
  };

  const categoriesList: { value: GoalCategory; labelKey: string }[] = [
    { value: 'gaming', labelKey: 'cat_gaming' },
    { value: 'technology', labelKey: 'cat_technology' },
    { value: 'travel', labelKey: 'cat_travel' },
    { value: 'vehicle', labelKey: 'cat_vehicle' },
    { value: 'home', labelKey: 'cat_home' },
    { value: 'education', labelKey: 'cat_education' },
    { value: 'investment', labelKey: 'cat_investment' },
    { value: 'emergency_fund', labelKey: 'cat_emergency_fund' },
    { value: 'custom', labelKey: 'cat_custom' },
  ];

  const handleCreateSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!goalName || !targetValue || !monthlyContribution || !targetDate) return;

    onAddGoal({
      name: goalName,
      category,
      targetValue: parseFloat(targetValue),
      currentSaved: parseFloat(currentValue || '0'),
      monthlyContribution: parseFloat(monthlyContribution),
      targetDate,
      notes,
      iconName: category
    });

    // Reset fields
    setGoalName('');
    setCategory('gaming');
    setTargetValue('');
    setCurrentValue('');
    setMonthlyContribution('');
    setTargetDate('');
    setNotes('');
    setIsOpenAdd(false);
  };

  const handleAddSavingsSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedGoalId || !addAmount) return;

    onAddProgress(selectedGoalId, parseFloat(addAmount));
    setAddAmount('');
    setSelectedGoalId(null);
  };

  // Compute stats helper
  const calculateGoalMetrics = (goal: Goal) => {
    const remaining = Math.max(0, goal.targetValue - goal.currentSaved);
    const percentage = Math.min(100, Math.round((goal.currentSaved / goal.targetValue) * 100));
    
    // Remaining months based on monthly contribution
    const monthsRemaining = goal.monthlyContribution > 0 ? Math.ceil(remaining / goal.monthlyContribution) : 0;
    
    // Estimates
    const daySavings = Math.round(goal.targetValue / 30);
    const weeklySavings = Math.round(goal.targetValue / 4);

    // Faster Option 1: extra contribution (e.g. 20% higher or fixed R$ 100/mo)
    const extraContribution = Math.round(goal.monthlyContribution * 1.3);
    const monthsWithExtra = extraContribution > 0 ? Math.ceil(remaining / extraContribution) : 0;
    const monthsSaved1 = Math.max(0, monthsRemaining - monthsWithExtra);

    // Faster Option 2: double contribution
    const doubleContribution = Math.round(goal.monthlyContribution * 2);
    const monthsWithDouble = doubleContribution > 0 ? Math.ceil(remaining / doubleContribution) : 0;
    const monthsSaved2 = Math.max(0, monthsRemaining - monthsWithDouble);

    return {
      remaining,
      percentage,
      monthsRemaining,
      daySavings,
      weeklySavings,
      extraContribution,
      monthsWithExtra,
      monthsSaved1,
      doubleContribution,
      monthsWithDouble,
      monthsSaved2
    };
  };

  const filteredGoals = goals.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6" id="goal_tracker_panel">
      {/* Header controls layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">{t('navGoals')}</h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400 font-semibold">{t('appSlogan')}</p>
        </div>

        <button
          onClick={() => setIsOpenAdd(!isOpenAdd)}
          className="flex items-center gap-1.5 px-4 h-11 bg-emerald-600 dark:bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-500 hover:scale-102 cursor-pointer shadow active:scale-98 transition-all"
          id="btn_open_goal_form"
        >
          {isOpenAdd ? <X size={16} /> : <Plus size={16} />}
          <span>{isOpenAdd ? t('cancel') : t('createGoal')}</span>
        </button>
      </div>

      {/* Goal creation Form Area */}
      {isOpenAdd && (
        <form
          onSubmit={handleCreateSubmit}
          className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-emerald-100 dark:border-zinc-800 shadow-lg space-y-4 animate-in fade-in duration-200"
          id="add_goal_form"
        >
          <h3 className="text-lg font-bold text-gray-800 dark:text-zinc-100 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
            {t('createGoal')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-1">
                {t('goalName')} *
              </label>
              <input
                type="text"
                required
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                placeholder={t('goalPlaceholder')}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm text-gray-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-1">
                {t('goalCategory')}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GoalCategory)}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm text-gray-950 dark:text-white"
              >
                {categoriesList.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {t(cat.labelKey)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-1">
                {t('targetValue')} *
              </label>
              <input
                type="number"
                required
                min="0.01"
                step="any"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder="Ex: 5000"
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm text-gray-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-1">
                {t('currentValue')}
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                placeholder="Ex: 250"
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm text-gray-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-1">
                {t('monthlyContribution')} *
              </label>
              <input
                type="number"
                required
                min="1"
                step="any"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                placeholder="Ex: 500"
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm text-gray-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-1">
                {t('targetDate')} *
              </label>
              <input
                type="date"
                required
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm text-gray-950 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-1">
                {t('notes')}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder={t('notesPlaceholder')}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm text-gray-950 dark:text-white"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => setIsOpenAdd(false)}
              className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 text-xs font-bold rounded-xl cursor-pointer"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 dark:bg-emerald-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow hover:bg-emerald-500"
            >
              {t('save')}
            </button>
          </div>
        </form>
      )}

      {/* Dynamic Scenario comparison widget */}
      <div className="bg-slate-50 dark:bg-slate-900/15 border border-slate-150 dark:border-slate-800/80 p-6 rounded-3xl space-y-3">
        <h3 className="text-sm font-bold text-slate-850 dark:text-slate-100 flex items-center gap-1.5">
          <Layers size={16} className="text-emerald-500" />
          {t('compareTitle')}
        </h3>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
          {t('compareDesc')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-400 uppercase tracking-widest block"></label>
            <input
              type="number"
              value={compareA}
              onChange={(e) => setCompareA(e.target.value)}
              placeholder={t('scenarioPlaceholderA')}
              className="px-3 py-2 w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-400 uppercase tracking-widest block"></label>
            <input
              type="number"
              value={compareB}
              onChange={(e) => setCompareB(e.target.value)}
              placeholder={t('scenarioPlaceholderB')}
              className="px-3 py-2 w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs"
            />
          </div>
        </div>

        {/* Compute simulation delta dynamically over selection */}
        {goals.map((g) => {
          const valA = parseFloat(compareA) || 1;
          const valB = parseFloat(compareB) || 1;
          const left = Math.max(0, g.targetValue - g.currentSaved);

          const durationA = Math.ceil(left / valA);
          const durationB = Math.ceil(left / valB);
          const monthDelta = Math.abs(durationB - durationA);

          if (g.isCompleted) return null;

          return (
            <div key={`comp-${g.id}`} className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl flex flex-wrap justify-between items-center text-xs gap-2 border border-slate-100 dark:border-slate-850/60 shadow-xs">
              <span className="font-bold text-slate-700 dark:text-slate-200">{g.name}</span>
              <div className="flex gap-4 text-slate-500 dark:text-slate-400 font-semibold">
                <span>
                  A: <strong className="text-slate-800 dark:text-slate-100">{durationA}m</strong>
                </span>
                <span>
                  B: <strong className="text-slate-800 dark:text-slate-100">{durationB}m</strong>
                </span>
                <span>
                  {t('compareDifference')}{' '}
                  <strong className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                    {monthDelta}m
                  </strong>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Goals Filter / search bar */}
      <div className="bg-slate-100 dark:bg-slate-900/30 p-3 rounded-xl flex items-center gap-2.5 border border-slate-200 dark:border-slate-800/60">
        <Search size={16} className="text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'pt' ? 'Filtrar por nome de meta...' : 'Filter goals by name...'}
          className="bg-transparent border-none text-xs w-full focus:outline-none focus:ring-0 text-slate-700 dark:text-slate-205"
        />
      </div>

      {/* Sub-Goals List */}
      <div className="grid grid-cols-1 gap-6" id="goals_cards_container">
        {filteredGoals.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl">
            <Target className="mx-auto text-slate-300 dark:text-slate-700 mb-2.5" size={40} />
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">
              {language === 'pt' ? 'Nenhuma meta encontrada' : 'No goals found'}
            </p>
            <p className="text-xs text-slate-400 font-medium">
              {language === 'pt'
                ? 'Comece criando um objetivo financeiro acima!'
                : 'Get started by creating a financial goal above!'}
            </p>
          </div>
        ) : (
          filteredGoals.map((g) => {
            const metrics = calculateGoalMetrics(g);
            return (
              <div
                key={g.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-150 dark:border-slate-800/60 shadow-sm p-5 sm:p-6 transition-all duration-300 hover:shadow-md relative overflow-hidden flex flex-col justify-between"
              >
                {/* Visual completion overlay decoration */}
                {g.isCompleted && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white font-bold text-[10px] px-3.5 py-1 uppercase rounded-bl-xl tracking-wider shadow z-10">
                    {t('success')}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  {/* Category Title / Heading */}
                  <div className="flex gap-3 items-center">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-2xl shrink-0 shadow-sm">
                      {getCategoryIcon(g.category)}
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {g.name}
                      </h4>
                      <p className="text-xs font-semibold text-slate-400 dark:text-slate-550">
                        {t(`cat_${g.category}`)} • {t('estimatedCompletion')}:{' '}
                        <strong className="text-slate-750 dark:text-slate-300">
                          {new Date(g.targetDate).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US')}
                        </strong>
                      </p>
                    </div>
                  </div>

                  {/* Actions (contribute, delete) */}
                  <div className="flex items-center gap-2 self-end sm:self-auto z-10">
                    {!g.isCompleted && (
                      <button
                        onClick={() => setSelectedGoalId(g.id)}
                        className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-500 cursor-pointer transition-all shadow-sm flex items-center gap-1"
                      >
                        <Plus size={14} />
                        <span>{t('addProgress')}</span>
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteGoal(g.id)}
                      className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl cursor-pointer transition-all"
                      title={t('delete')}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Progress bars indicator */}
                <div className="mt-5 space-y-2">
                  <div className="flex justify-between items-end text-xs font-semibold">
                    <span className="text-slate-500 dark:text-slate-400">
                      {formatCurrency(g.currentSaved)} / {formatCurrency(g.targetValue)}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-450 bg-emerald-50/70 dark:bg-emerald-950/35 px-2.5 py-1 rounded-xl font-bold">
                      {metrics.percentage}% {t('percentageCompleted')}
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-200/30 dark:border-slate-900">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${metrics.percentage}%` }}
                    />
                  </div>
                </div>

                {/* Metrics Breakdown */}
                {!g.isCompleted && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/60">
                    {/* Shortcuts panel */}
                    <div className="bg-slate-50/60 dark:bg-slate-950/25 p-4 rounded-2xl border border-slate-100 dark:border-slate-850/60 text-xs space-y-1.5 animate-in fade-in">
                      <p className="font-bold text-slate-700 dark:text-slate-350 flex items-center gap-1">
                        <Calendar size={13} className="text-emerald-500" />
                        {t('estimatedCompletion')}
                      </p>
                      <ul className="space-y-1 font-semibold text-slate-500 dark:text-slate-405">
                        <li>
                          {t('monthsRemaining')}:{' '}
                          <strong className="text-slate-800 dark:text-slate-205">{metrics.monthsRemaining}</strong>
                        </li>
                        <li>
                          {t('remainingAmount')}:{' '}
                          <strong className="text-slate-800 dark:text-slate-205">{formatCurrency(metrics.remaining)}</strong>
                        </li>
                      </ul>
                    </div>

                    {/* Projections shortcut daily/weekly */}
                    <div className="bg-slate-50/60 dark:bg-slate-950/25 p-4 rounded-2xl border border-slate-100 dark:border-slate-850/60 text-xs space-y-1.5 animate-in fade-in">
                      <p className="font-bold text-slate-700 dark:text-slate-350 flex items-center gap-1">
                        <Info size={13} className="text-emerald-600" />
                        {language === 'pt' ? 'Atalhos de Economia' : 'Savings Shortcuts'}
                      </p>
                      <ul className="space-y-1 font-semibold text-slate-500 dark:text-slate-405">
                        <li>
                          {t('weeklySavingsNeeded')}:{' '}
                          <strong className="text-slate-850 dark:text-slate-200">
                            {formatCurrency(metrics.weeklySavings)}
                          </strong>
                        </li>
                        <li>
                          {t('dailySavingsNeeded')}:{' '}
                          <strong className="text-slate-850 dark:text-slate-200">
                            {formatCurrency(metrics.daySavings)}
                          </strong>
                        </li>
                      </ul>
                    </div>

                    {/* Scenarios Accelerators */}
                    <div className="bg-emerald-50/10 dark:bg-emerald-950/5 p-4 rounded-2xl border border-emerald-500/10 dark:border-slate-800/80 text-xs space-y-1.5 animate-in fade-in">
                      <p className="font-bold text-emerald-700 dark:text-emerald-450 flex items-center gap-1">
                        <Sparkles size={13} className="text-emerald-500" />
                        {t('fasterScenarios')}
                      </p>
                      <ul className="space-y-1 font-semibold text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                        <li>
                          ⚡ {t('fasterOption1', { amount: Math.round(g.monthlyContribution * 0.3) })}:{' '}
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            {t('fasterResult', {
                              months: metrics.monthsWithExtra,
                              saved: Math.max(0, metrics.monthsRemaining - metrics.monthsWithExtra),
                            })}
                          </span>
                        </li>
                        <li className="mt-1">
                          🔥 {t('fasterOption2', { amount: Math.round(g.monthlyContribution) })}:{' '}
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            {t('fasterResult', {
                              months: metrics.monthsWithDouble,
                              saved: Math.max(0, metrics.monthsRemaining - metrics.monthsWithDouble),
                            })}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
                {g.notes && (
                  <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-550 italic mt-3 bg-slate-50/40 dark:bg-slate-950/20 px-2.5 py-1.5 rounded-lg border border-slate-100/50 dark:border-slate-850/50">
                    🗒️ {g.notes}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Savings addition form pop-up modal */}
      {selectedGoalId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-40 animate-in fade-in duration-200">
          <form
            onSubmit={handleAddSavingsSubmit}
            className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-150 dark:border-zinc-800 p-6 w-full max-w-sm space-y-4 shadow-xl text-gray-950 dark:text-white"
            id="add_savings_modal"
          >
            <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-zinc-800">
              <h3 className="font-bold text-base text-gray-800 dark:text-zinc-100">{t('addProgress')}</h3>
              <button
                type="button"
                onClick={() => setSelectedGoalId(null)}
                className="text-gray-400 dark:text-zinc-500 hover:text-gray-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-1.5">
                {t('amountToSave')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 font-bold">
                  $
                </div>
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  placeholder="Ex: 150"
                  className="w-full pl-8 pr-3 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex gap-2.5 justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedGoalId(null)}
                className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 text-xs font-bold cursor-pointer"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
              >
                {t('save')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
