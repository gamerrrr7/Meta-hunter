import { useState, FormEvent } from 'react';
import { ShoppingBag, Plus, Trash2, ArrowRightLeft, Sparkles, Star, AlertCircle, X } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { WishlistItem, GoalCategory } from '../types';

interface WishlistProps {
  wishlist: WishlistItem[];
  onAddWish: (wish: Omit<WishlistItem, 'id'>) => void;
  onDeleteWish: (wishId: string) => void;
  onConvertWishToGoal: (wish: WishlistItem, category: GoalCategory, monthlyContribution: number) => void;
}

export default function Wishlist({ wishlist, onAddWish, onDeleteWish, onConvertWishToGoal }: WishlistProps) {
  const { t, language } = useLanguage();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Conversion Prompt State
  const [convertingWish, setConvertingWish] = useState<WishlistItem | null>(null);
  const [convertCat, setConvertCat] = useState<GoalCategory>('gaming');
  const [convertMonthly, setConvertMonthly] = useState('200');

  const formatCurrency = (val: number) => {
    return val.toLocaleString(language === 'pt' ? 'pt-BR' : 'en-US', {
      style: 'currency',
      currency: language === 'pt' ? 'BRL' : 'USD',
    });
  };

  const handleAddSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    onAddWish({
      name,
      price: parseFloat(price),
      priority,
    });

    setName('');
    setPrice('');
    setPriority('medium');
  };

  const handleConversionSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!convertingWish || !convertMonthly) return;

    onConvertWishToGoal(convertingWish, convertCat, parseFloat(convertMonthly));
    setConvertingWish(null);
  };

  return (
    <div className="space-y-6" id="wishlist_panel">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">{t('wishlistTitle')}</h2>
        <p className="text-xs text-gray-500 dark:text-zinc-400 font-semibold">{t('wishlistSubtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Create wishlist item Desires Form */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800/60 shadow-sm space-y-4 h-fit">
          <h3 className="text-sm font-bold text-slate-850 dark:text-slate-100 flex items-center gap-1.5 pb-2.5 border-b border-slate-100 dark:border-slate-850">
            <ShoppingBag size={16} className="text-emerald-500" />
            {language === 'pt' ? 'Adicionar Desejo' : 'Add Wish Desire'}
          </h3>

          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                {t('itemName')} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: PlayStation 5"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                {t('itemPrice')} *
              </label>
              <input
                type="number"
                required
                min="1"
                step="any"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ex: 4000"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                {t('priority')}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
              >
                <option value="low">{t('priority_low')}</option>
                <option value="medium">{t('priority_medium')}</option>
                <option value="high">{t('priority_high')}</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-emerald-600 dark:bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 cursor-pointer shadow flex justify-center items-center gap-1.5 active:scale-98 transition-all"
            >
              <Plus size={16} />
              <span>{t('add')}</span>
            </button>
          </form>
        </div>

        {/* Right Side: List of Wishes cards */}
        <div className="lg:col-span-2 space-y-4">
          {wishlist.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl shadow-sm">
              <ShoppingBag className="mx-auto text-slate-300 dark:text-slate-700 mb-2.5" size={40} />
              <p className="text-sm font-bold text-slate-500 dark:text-slate-405">
                {t('wishlistEmpty')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-150 dark:border-slate-800/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300"
                >
                  <div className="space-y-1.5">
                    {/* Priority Tag badges selector */}
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          item.priority === 'high'
                            ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-950/40'
                            : item.priority === 'medium'
                            ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-500 dark:text-amber-400 border border-amber-100 dark:border-amber-950/40'
                            : 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-105 dark:border-blue-950/40'
                        }`}
                      >
                        {t(`priority_${item.priority}`)}
                      </span>

                      <button
                        onClick={() => onDeleteWish(item.id)}
                        className="text-slate-400 dark:text-slate-500 hover:text-red-500 p-1 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-950 dark:text-white">{item.name}</h4>
                    <p className="text-lg font-black text-emerald-600 dark:text-emerald-450">
                      {formatCurrency(item.price)}
                    </p>
                  </div>

                  {/* Convert Click trigger panel */}
                  <button
                    onClick={() => setConvertingWish(item)}
                    className="w-full mt-4 h-9 flex justify-center items-center gap-1.5 py-1.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 dark:hover:bg-emerald-500 cursor-pointer transition-all shadow-sm active:scale-98"
                  >
                    <ArrowRightLeft size={13} />
                    <span>{t('convertToGoal')}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Goal Conversion dialog prompt form */}
      {convertingWish && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-40 animate-in fade-in duration-200">
          <form
            onSubmit={handleConversionSubmit}
            className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-150 dark:border-zinc-800 p-6 w-full max-w-sm space-y-4 shadow-xl text-gray-950 dark:text-white"
            id="convert_wish_modal"
          >
            <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-zinc-800">
              <h3 className="font-bold text-base text-gray-800 dark:text-zinc-100 flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                {t('convertToGoal')}
              </h3>
              <button
                type="button"
                onClick={() => setConvertingWish(null)}
                className="text-gray-400 dark:text-zinc-500 hover:text-gray-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-600 dark:text-zinc-300 font-semibold leading-relaxed">
              {language === 'pt'
                ? `Vamos converter seu desejo '${convertingWish.name}' (preço ${formatCurrency(
                    convertingWish.price
                  )}) em um planejamento real de meta física.`
                : `We are upgrading your desire '${convertingWish.name}' (${formatCurrency(
                    convertingWish.price
                  )}) into a trackable financial milestone.`}
            </p>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-1">
                  {t('goalCategory')}
                </label>
                <select
                  value={convertCat}
                  onChange={(e) => setConvertCat(e.target.value as GoalCategory)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs"
                >
                  <option value="gaming">{t('cat_gaming')}</option>
                  <option value="technology">{t('cat_technology')}</option>
                  <option value="travel">{t('cat_travel')}</option>
                  <option value="vehicle">{t('cat_vehicle')}</option>
                  <option value="home">{t('cat_home')}</option>
                  <option value="education">{t('cat_education')}</option>
                  <option value="investment">{t('cat_investment')}</option>
                  <option value="emergency_fund">{t('cat_emergency_fund')}</option>
                  <option value="custom">{t('cat_custom')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-1">
                  {t('monthlyContribution')} *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={convertMonthly}
                  onChange={(e) => setConvertMonthly(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setConvertingWish(null)}
                className="px-3.5 py-1.5 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 text-[11px] font-bold cursor-pointer"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white text-[11px] font-bold cursor-pointer"
              >
                {language === 'pt' ? 'Ativar Meta' : 'Activate Goal'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
