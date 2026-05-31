import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';
import { Scale, BarChart2, TrendingUp, DollarSign, Calendar, Percent, Info, AlertOctagon } from 'lucide-react';

export default function Calculators() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();

  // Tab State: 'savings' or 'investment'
  const [activeTab, setActiveTab] = useState<'savings' | 'investment'>('savings');

  // Savings Calculator State
  const [savInitial, setSavInitial] = useState('1000');
  const [savMonthly, setSavMonthly] = useState('200');
  const [savMonths, setSavMonths] = useState('24');
  // Assume a default monthly yield of 0.5% (approx 6.17% p.a. for standard educational savings)
  const monthlyRateSavings = 0.005;

  // Investment Simulator State
  const [invInitial, setInvInitial] = useState('1000');
  const [invContribution, setInvContribution] = useState('500');
  const [invRate, setInvRate] = useState('8'); // 8% p.a.
  const [invYears, setInvYears] = useState('5');

  // Currency helper
  const formatCurrency = (val: number) => {
    return val.toLocaleString(language === 'pt' ? 'pt-BR' : 'en-US', {
      style: 'currency',
      currency: language === 'pt' ? 'BRL' : 'USD',
      maximumFractionDigits: 0,
    });
  };

  // 1. Compute Savings Calculator Output values
  const calculateSavings = () => {
    const init = parseFloat(savInitial) || 0;
    const monthly = parseFloat(savMonthly) || 0;
    const totalMonths = parseInt(savMonths) || 12;

    let balance = init;
    let totalInvested = init;
    const data = [];

    // Push initial
    data.push({
      name: `Month 0`,
      [t('totalInvested')]: Math.round(totalInvested),
      [t('finalBalance')]: Math.round(balance),
    });

    for (let m = 1; m <= totalMonths; m++) {
      // Add monthly savings + monthly yield
      balance = (balance + monthly) * (1 + monthlyRateSavings);
      totalInvested += monthly;

      // Only push periodic labels to avoid squeezing x-axis label ticks
      if (totalMonths <= 24 || m % Math.ceil(totalMonths / 6) === 0 || m === totalMonths) {
        data.push({
          name: language === 'pt' ? `Mês ${m}` : `Mo ${m}`,
          [t('totalInvested')]: Math.round(totalInvested),
          [t('finalBalance')]: Math.round(balance),
        });
      }
    }

    const profit = Math.max(0, balance - totalInvested);

    return {
      finalBalance: balance,
      totalInvested,
      profitEarned: profit,
      chartData: data,
    };
  };

  // 2. Compute Compound Interest Growth Output values
  const calculateInvestment = () => {
    const init = parseFloat(invInitial) || 0;
    const monthly = parseFloat(invContribution) || 0;
    const rateAnnual = (parseFloat(invRate) || 8) / 100;
    const rateMonthly = Math.pow(1 + rateAnnual, 1 / 12) - 1;
    const totalYears = parseInt(invYears) || 5;
    const totalMonths = totalYears * 12;

    let balance = init;
    let totalInvested = init;
    const data = [];

    data.push({
      name: `Yr 0`,
      [t('totalInvested')]: Math.round(totalInvested),
      [t('finalBalance')]: Math.round(balance),
    });

    for (let m = 1; m <= totalMonths; m++) {
      balance = (balance + monthly) * (1 + rateMonthly);
      totalInvested += monthly;

      // Push only annual markings to keep charting elegant
      if (m % 12 === 0) {
        const year = m / 12;
        data.push({
          name: language === 'pt' ? `Ano ${year}` : `Yr ${year}`,
          [t('totalInvested')]: Math.round(totalInvested),
          [t('finalBalance')]: Math.round(balance),
        });
      }
    }

    const profit = Math.max(0, balance - totalInvested);

    return {
      finalBalance: balance,
      totalInvested,
      profitEarned: profit,
      chartData: data,
    };
  };

  const savResult = calculateSavings();
  const invResult = calculateInvestment();

  return (
    <div className="space-y-6" id="calculators_panel">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">{t('navCalculators')}</h2>
        <p className="text-xs text-gray-500 dark:text-zinc-400 font-semibold">{t('calcSavingsDesc')}</p>
      </div>

      {/* Tabs list switches */}
      <div className="flex bg-gray-100 dark:bg-zinc-900 p-1 rounded-xl self-start max-w-sm border border-gray-200 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab('savings')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-4 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'savings'
              ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-gray-500 dark:text-zinc-400'
          }`}
        >
          <BarChart2 size={15} />
          <span>{language === 'pt' ? 'Economias' : 'Savings'}</span>
        </button>
        <button
          onClick={() => setActiveTab('investment')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-4 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'investment'
              ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-gray-500 dark:text-zinc-400'
          }`}
        >
          <TrendingUp size={15} />
          <span>{language === 'pt' ? 'Juros Compostos' : 'Compound Interest'}</span>
        </button>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Input Form parameters */}
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-150 dark:border-zinc-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-800 dark:text-zinc-100 flex items-center gap-2 pb-2.5 border-b border-gray-100 dark:border-zinc-850">
            {activeTab === 'savings' ? <Scale size={18} /> : <TrendingUp size={18} />}
            {activeTab === 'savings' ? t('calcSavingsTitle') : t('calcInvestmentTitle')}
          </h3>

          {activeTab === 'savings' ? (
            /* Savings Tab Inputs */
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-gray-400 mb-1.5 flex items-center gap-1">
                  <DollarSign size={12} />
                  {t('initialAmount')}
                </label>
                <input
                  type="number"
                  value={savInitial}
                  onChange={(e) => setSavInitial(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-250 dark:border-zinc-800/80 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-gray-400 mb-1.5 flex items-center gap-1">
                  <DollarSign size={12} />
                  {t('monthlyContributionLabel')}
                </label>
                <input
                  type="number"
                  value={savMonthly}
                  onChange={(e) => setSavMonthly(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-250 dark:border-zinc-800/80 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-gray-400 mb-1.5 flex items-center gap-1">
                  <Calendar size={12} />
                  {t('periodMonths')}
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={savMonths}
                  onChange={(e) => setSavMonths(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-250 dark:border-zinc-800/80 rounded-xl text-sm"
                />
              </div>

              {/* Informative Rate explanation badge */}
              <div className="p-3 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-500/10 rounded-xl text-[11px] text-emerald-800 dark:text-emerald-400 leading-relaxed font-semibold">
                ℹ️ Assumimos um rendimento educativo simulado de 0,5% ao mês (equivalente a poupança protegida) sobre o saldo acumulado.
              </div>
            </div>
          ) : (
            /* Investment Tab Inputs */
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-gray-400 mb-1.5 flex items-center gap-1">
                  <DollarSign size={12} />
                  {t('initialAmount')}
                </label>
                <input
                  type="number"
                  value={invInitial}
                  onChange={(e) => setInvInitial(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-250 dark:border-zinc-800/80 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-gray-400 mb-1.5 flex items-center gap-1">
                  <DollarSign size={12} />
                  {t('monthlyContributionLabel')}
                </label>
                <input
                  type="number"
                  value={invContribution}
                  onChange={(e) => setInvContribution(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-250 dark:border-zinc-800/80 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-gray-400 mb-1.5 flex items-center gap-1">
                  <Percent size={12} />
                  {t('annualInterestRate')}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={invRate}
                  onChange={(e) => setInvRate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-250 dark:border-zinc-800/80 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-gray-400 mb-1.5 flex items-center gap-1">
                  <Calendar size={12} />
                  {t('periodYears')}
                </label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={invYears}
                  onChange={(e) => setInvYears(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-250 dark:border-zinc-800/80 rounded-xl text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Middle + Right): Computed results, beautiful AreaCharts plots, and mandatory disclaimers */}
        <div className="lg:col-span-2 space-y-6">
          {/* Result Numerical Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="sim_results_summary">
            {/* Box 1: Final Balance */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-4 rounded-2xl shadow-sm text-center">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">{t('finalBalance')}</p>
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                {formatCurrency(activeTab === 'savings' ? savResult.finalBalance : invResult.finalBalance)}
              </p>
            </div>

            {/* Box 2: Total Invested */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-4 rounded-2xl shadow-sm text-center">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">{t('totalInvested')}</p>
              <p className="text-xl font-black text-gray-800 dark:text-zinc-200">
                {formatCurrency(activeTab === 'savings' ? savResult.totalInvested : invResult.totalInvested)}
              </p>
            </div>

            {/* Box 3: Rendimento */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-4 rounded-2xl shadow-sm text-center">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">{t('profitEarned')}</p>
              <p className="text-xl font-black text-amber-500 dark:text-amber-400">
                {formatCurrency(activeTab === 'savings' ? savResult.profitEarned : invResult.profitEarned)}
              </p>
            </div>
          </div>

          {/* Graphical Growth Plot visualization card */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-3">
            <h4 className="text-sm font-extrabold text-gray-800 dark:text-zinc-100 uppercase tracking-widest">
              {language === 'pt' ? 'Gráfico de Crescimento Acumulado' : 'Cumulative Growth Plot'}
            </h4>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={activeTab === 'savings' ? savResult.chartData : invResult.chartData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="invColorBal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="invColorDep" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.10} />
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#27272a' : '#f3f4f6'} />
                  <XAxis dataKey="name" stroke="#a1a1aa" fontSize={10} tickLine={false} />
                  <YAxis stroke="#a1a1aa" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff',
                      borderColor: theme === 'dark' ? '#27272a' : '#e4e4e7',
                      borderRadius: '12px',
                    }}
                    labelStyle={{ fontWeight: 'bold' }}
                  />
                  <Area
                    type="monotone"
                    dataKey={t('finalBalance')}
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#invColorBal)"
                  />
                  <Area
                    type="monotone"
                    dataKey={t('totalInvested')}
                    stroke="#94a3b8"
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill="url(#invColorDep)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Mandatory Professional Legal Disclaimer alert container */}
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-4 rounded-xl flex items-start gap-3">
            <AlertOctagon size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h5 className="text-xs font-bold text-amber-700 dark:text-amber-400">
                {t('footerDisclaimerTitle')}
              </h5>
              <p className="text-[11px] text-amber-600 dark:text-amber-500 font-semibold leading-relaxed">
                {t('simulatorDisclaimer')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
