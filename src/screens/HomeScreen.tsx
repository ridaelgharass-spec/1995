import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  X, 
  Trash2, 
  Calendar,
  ArrowRightLeft,
  Moon,
  Sun
} from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { CATEGORIES, getCategory } from '../constants';
import { Transaction } from '../models/types';
import { Storage } from '../storage/localStorage';

export default function HomeScreen() {
  const { 
    transactions, 
    addTransaction, 
    deleteTransaction, 
    allTimeTotals, 
    allTimeSavings,
    monthlyTotals,
    monthlySavings,
    dailyExpenseTotal,
    weeklyExpenseTotal,
    monthlyExpenseTotal,
    goals, 
    updateGoals,
    manualSavings,
    updateSavings,
    currentMonthBudget,
    weeklyThreshold,
    dailyThreshold,
    baseDailyThreshold,
    updateMonthlyBudget,
    todayTransactions,
    thisWeekTransactions,
    thisMonthTransactions
  } = useTransactions();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);
  const [listFilter, setListFilter] = useState<'all' | 'today' | 'week' | 'month'>('month');
  
  const displayTransactions = React.useMemo(() => {
    return listFilter === 'today' 
      ? todayTransactions 
      : listFilter === 'week' 
        ? thisWeekTransactions 
        : listFilter === 'month'
          ? thisMonthTransactions
          : transactions;
  }, [listFilter, todayTransactions, thisWeekTransactions, thisMonthTransactions, transactions]);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return Storage.loadDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    Storage.saveDarkMode(isDarkMode);
  }, [isDarkMode]);

  const quarterlyProgress = Math.min((allTimeSavings / (goals.quarterly || 1)) * 100, 100);
  const annualProgress = Math.min((allTimeSavings / (goals.annual || 1)) * 100, 100);

  const currentMonthName = new Date().toLocaleDateString('ar-EG', { month: 'long' });
  const dailySurplus = dailyExpenseTotal > dailyThreshold ? dailyExpenseTotal - dailyThreshold : 0;
  
  const weeklyStatus = weeklyExpenseTotal > weeklyThreshold ? 'exceeded' : (weeklyExpenseTotal > weeklyThreshold * 0.85 ? 'approaching' : 'ok');
  const monthlyExceeded = monthlyExpenseTotal > currentMonthBudget;

  const getStatusColor = (current: number, threshold: number) => {
    if (current > threshold) return 'text-rose-600 dark:text-rose-400';
    if (current > threshold * 0.85) return 'text-amber-600 dark:text-amber-400';
    return 'text-emerald-600 dark:text-emerald-400';
  };

  const getStatusBg = (current: number, threshold: number) => {
    if (current > threshold) return 'bg-rose-500 dark:bg-rose-600';
    if (current > threshold * 0.85) return 'bg-amber-500 dark:bg-amber-600';
    return 'bg-emerald-500 dark:bg-emerald-600';
  };

  const getStatusBorder = (current: number, threshold: number) => {
    if (current > threshold) return 'border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-900/10';
    if (current > threshold * 0.85) return 'border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-900/10';
    return 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900';
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-slate-50 dark:bg-slate-950 pb-24 relative overflow-x-hidden transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-sm border-b border-slate-100 dark:border-slate-800 transition-colors">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">أهلاً بك</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">إليك ملخص ميزانيتك اليوم</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title={isDarkMode ? "الوضع النهاري" : "الوضع الليلي"}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => setIsBudgetModalOpen(true)}
              className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
              title="ميزانية الشهر (البركة)"
            >
              <ArrowRightLeft size={20} />
            </button>
            <button 
              onClick={() => setIsGoalsModalOpen(true)}
              className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              title="الأهداف المالية"
            >
              <Wallet size={20} />
            </button>
            <button 
              onClick={() => setIsSavingsModalOpen(true)}
              className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
              title="المدخرات السابقة"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div className="bg-indigo-600 dark:bg-indigo-700 rounded-3xl p-6 text-white shadow-lg shadow-indigo-200 dark:shadow-none relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-indigo-100 text-sm mb-1 opacity-80">رصيد شهر {currentMonthName}</p>
            <h2 className="text-3xl font-bold mb-6">
              {monthlySavings.toLocaleString()} <span className="text-lg font-normal opacity-80">د.م.</span>
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1 bg-emerald-400/20 rounded-lg">
                    <TrendingUp size={14} className="text-emerald-300" />
                  </div>
                  <span className="text-xs text-indigo-100">دخل الشهر</span>
                </div>
                <p className="font-semibold">{monthlyTotals.income.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1 bg-rose-400/20 rounded-lg">
                    <TrendingDown size={14} className="text-rose-300" />
                  </div>
                  <span className="text-xs text-indigo-100">مصاريف الشهر</span>
                </div>
                <p className="font-semibold">{monthlyTotals.expense.toLocaleString()}</p>
              </div>
            </div>
          </div>
          {/* Decorative circle */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4 border border-emerald-100 dark:border-emerald-900/30">
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase mb-1">بركة شهر {currentMonthName}</p>
            <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100">{currentMonthBudget.toLocaleString()} <span className="text-xs font-normal">د.م.</span></p>
          </div>
          <div className={`rounded-2xl p-4 border ${dailySurplus > 0 ? 'bg-rose-100 dark:bg-rose-900/30 border-rose-200 dark:border-rose-900/50' : 'bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/20'}`}>
            <p className={`text-[10px] font-bold uppercase mb-1 ${dailySurplus > 0 ? 'text-rose-700 dark:text-rose-400' : 'text-rose-600 dark:text-rose-500'}`}>مصاريف اليوم</p>
            <p className={`text-lg font-bold ${dailySurplus > 0 ? 'text-rose-800 dark:text-rose-100' : 'text-rose-900 dark:text-rose-200'}`}>{dailyExpenseTotal.toLocaleString()} <span className="text-xs font-normal">د.م.</span></p>
          </div>
        </div>

        {/* Thresholds */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">العتبة الأسبوعية</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{weeklyThreshold.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-xs font-normal">د.م.</span></p>
          </div>
          <div className={`rounded-2xl p-4 border shadow-sm ${dailyThreshold < baseDailyThreshold ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`}>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">
              العتبة اليومية {dailyThreshold < baseDailyThreshold && <span className="text-amber-600 dark:text-amber-400">(معدلة)</span>}
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{dailyThreshold.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-xs font-normal">د.م.</span></p>
            {dailyThreshold < baseDailyThreshold && (
              <p className="text-[9px] text-amber-600 dark:text-amber-400 mt-1">تم خصم {Math.round(baseDailyThreshold - dailyThreshold)} د.م. لتغطية فائض سابق</p>
            )}
          </div>
        </div>

        {/* Alerts Section */}
        <div className="mt-4 space-y-3">
          {/* Daily Surplus Alert */}
          {dailySurplus > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-900 border-2 border-rose-500 dark:border-rose-600 rounded-2xl p-4 shadow-lg flex justify-between items-center relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                  <p className="text-[10px] font-bold uppercase text-rose-600 dark:text-rose-400">تنبيه: تجاوزت العتبة اليومية</p>
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">الفائض: {dailySurplus.toLocaleString()} د.م.</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">سيتم توزيع هذا الفائض على الأيام القادمة</p>
              </div>
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-400">
                <TrendingDown size={24} />
              </div>
            </motion.div>
          )}

          {/* Weekly Status Alert */}
          {weeklyStatus !== 'ok' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`bg-white dark:bg-slate-900 border-2 ${weeklyStatus === 'exceeded' ? 'border-rose-500 dark:border-rose-600' : 'border-amber-500 dark:border-amber-600'} rounded-2xl p-4 shadow-lg flex justify-between items-center`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 ${weeklyStatus === 'exceeded' ? 'bg-rose-500' : 'bg-amber-500'} rounded-full animate-pulse`} />
                  <p className={`text-[10px] font-bold uppercase ${weeklyStatus === 'exceeded' ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {weeklyStatus === 'exceeded' ? 'تنبيه: تجاوزت العتبة الأسبوعية' : 'تحذير: تقترب من العتبة الأسبوعية'}
                  </p>
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {weeklyStatus === 'exceeded' ? `تجاوزت بـ ${(weeklyExpenseTotal - weeklyThreshold).toLocaleString()} د.م.` : 'أنت قريب جداً من الحد الأقصى'}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  {weeklyStatus === 'exceeded' ? 'حاول تقليل المصاريف في الأيام القادمة' : `المتبقي: ${Math.max(0, weeklyThreshold - weeklyExpenseTotal).toLocaleString()} د.م.`}
                </p>
              </div>
              <div className={`w-12 h-12 ${weeklyStatus === 'exceeded' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'} rounded-2xl flex items-center justify-center`}>
                <Calendar size={24} />
              </div>
            </motion.div>
          )}

          {/* Monthly Budget Alert */}
          {monthlyExceeded && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-950 text-white rounded-2xl p-5 shadow-2xl flex justify-between items-center border-4 border-rose-600 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                  <p className="text-[10px] font-bold uppercase text-rose-400 tracking-wider">تنبيه حرج جداً</p>
                </div>
                <p className="text-xl font-black mb-1">تجاوزت ميزانية البركة!</p>
                <p className="text-xs text-slate-400">لقد استهلكت كامل ميزانية الشهر المحددة.</p>
              </div>
              <div className="w-14 h-14 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-900/50">
                <X size={32} strokeWidth={3} />
              </div>
            </motion.div>
          )}
        </div>

        {/* Summary & Comparison Section */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 px-1">ملخص الالتزام بالميزانية</h3>
          
          {/* Daily Comparison */}
          <div className={`rounded-2xl p-4 border shadow-sm transition-all duration-300 ${getStatusBorder(dailyExpenseTotal, dailyThreshold)}`}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">اليوم</span>
              <span className={`text-xs font-bold ${getStatusColor(dailyExpenseTotal, dailyThreshold)}`}>
                {dailyExpenseTotal.toLocaleString()} / {dailyThreshold.toLocaleString(undefined, { maximumFractionDigits: 0 })} د.م.
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((dailyExpenseTotal / (dailyThreshold || 1)) * 100, 100)}%` }}
                className={`h-full rounded-full transition-all duration-500 ${getStatusBg(dailyExpenseTotal, dailyThreshold)}`}
              />
            </div>
          </div>

          {/* Weekly Comparison */}
          <div className={`rounded-2xl p-4 border shadow-sm transition-all duration-300 ${getStatusBorder(weeklyExpenseTotal, weeklyThreshold)}`}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">الأسبوع (آخر 7 أيام)</span>
              <span className={`text-xs font-bold ${getStatusColor(weeklyExpenseTotal, weeklyThreshold)}`}>
                {weeklyExpenseTotal.toLocaleString()} / {weeklyThreshold.toLocaleString(undefined, { maximumFractionDigits: 0 })} د.م.
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((weeklyExpenseTotal / (weeklyThreshold || 1)) * 100, 100)}%` }}
                className={`h-full rounded-full transition-all duration-500 ${getStatusBg(weeklyExpenseTotal, weeklyThreshold)}`}
              />
            </div>
          </div>

          {/* Monthly Comparison */}
          <div className={`rounded-2xl p-4 border shadow-sm transition-all duration-300 ${getStatusBorder(monthlyExpenseTotal, currentMonthBudget)}`}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">الشهر (البركة)</span>
              <span className={`text-xs font-bold ${getStatusColor(monthlyExpenseTotal, currentMonthBudget)}`}>
                {monthlyExpenseTotal.toLocaleString()} / {currentMonthBudget.toLocaleString()} د.م.
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((monthlyExpenseTotal / (currentMonthBudget || 1)) * 100, 100)}%` }}
                className={`h-full rounded-full transition-all duration-500 ${getStatusBg(monthlyExpenseTotal, currentMonthBudget)}`}
              />
            </div>
          </div>
        </div>

        {/* Goals Section */}
        <div className="mt-8 space-y-4">
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">الهدف الربع سنوي</span>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{Math.round(quarterlyProgress)}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 mb-2">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${quarterlyProgress}%` }}
                className="bg-indigo-500 dark:bg-indigo-600 h-2 rounded-full"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
              <span>{allTimeSavings.toLocaleString()} د.م.</span>
              <span>هدف: {goals.quarterly.toLocaleString()} د.م.</span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">الهدف السنوي</span>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{Math.round(annualProgress)}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 mb-2">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${annualProgress}%` }}
                className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
              <span>{allTimeSavings.toLocaleString()} د.م.</span>
              <span>هدف: {goals.annual.toLocaleString()} د.م.</span>
            </div>
          </div>
        </div>
      </header>

      {/* Transactions List */}
      <main className="px-6 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            {listFilter === 'today' ? 'عمليات اليوم' : listFilter === 'week' ? 'عمليات الأسبوع' : listFilter === 'month' ? 'عمليات الشهر' : 'آخر العمليات'}
          </h3>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button 
              onClick={() => setListFilter('all')}
              className={`px-3 py-1 text-[10px] font-medium rounded-md transition-all ${listFilter === 'all' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
            >
              الكل
            </button>
            <button 
              onClick={() => setListFilter('month')}
              className={`px-3 py-1 text-[10px] font-medium rounded-md transition-all ${listFilter === 'month' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
            >
              الشهر
            </button>
            <button 
              onClick={() => setListFilter('week')}
              className={`px-3 py-1 text-[10px] font-medium rounded-md transition-all ${listFilter === 'week' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
            >
              الأسبوع
            </button>
            <button 
              onClick={() => setListFilter('today')}
              className={`px-3 py-1 text-[10px] font-medium rounded-md transition-all ${listFilter === 'today' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
            >
              اليوم
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {displayTransactions.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <ArrowRightLeft size={24} />
                </div>
                <p className="text-slate-500">لا توجد عمليات {listFilter === 'today' ? 'اليوم' : listFilter === 'week' ? 'هذا الأسبوع' : listFilter === 'month' ? 'هذا الشهر' : 'مسجلة بعد'}</p>
              </motion.div>
            ) : (
              displayTransactions.map((t) => (
                <TransactionItem 
                  key={t.id} 
                  transaction={t} 
                  onDelete={() => deleteTransaction(t.id)} 
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl shadow-indigo-200 flex items-center justify-center active:scale-90 transition-transform z-40"
      >
        <Plus size={28} />
      </button>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <AddTransactionModal 
            onClose={() => setIsModalOpen(false)} 
            onAdd={addTransaction} 
          />
        )}
      </AnimatePresence>

      {/* Goals Modal */}
      <AnimatePresence>
        {isGoalsModalOpen && (
          <EditGoalsModal 
            onClose={() => setIsGoalsModalOpen(false)} 
            goals={goals}
            onUpdate={updateGoals}
          />
        )}
      </AnimatePresence>

      {/* Budget Modal */}
      <AnimatePresence>
        {isBudgetModalOpen && (
          <EditBudgetModal 
            onClose={() => setIsBudgetModalOpen(false)} 
            currentBudget={currentMonthBudget}
            onUpdate={updateMonthlyBudget}
            monthName={currentMonthName}
          />
        )}
      </AnimatePresence>

      {/* Savings Modal */}
      <AnimatePresence>
        {isSavingsModalOpen && (
          <EditSavingsModal 
            onClose={() => setIsSavingsModalOpen(false)} 
            currentSavings={manualSavings}
            onUpdate={updateSavings}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function EditSavingsModal({ onClose, currentSavings, onUpdate }: { onClose: () => void, currentSavings: number, onUpdate: (a: number) => void }) {
  const [savings, setSavings] = useState(currentSavings.toString());
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numSavings = parseFloat(savings);
    if (isNaN(numSavings)) {
      setError('يرجى إدخال مبلغ صحيح');
      return;
    }

    onUpdate(numSavings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-4 sm:items-center">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">المدخرات السابقة</h3>
          <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400">
            <X size={20} />
          </button>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-bold text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 mr-1">أضف مدخراتك السابقة (خارج التطبيق)</label>
            <input 
              type="number" 
              value={savings}
              onChange={(e) => setSavings(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all"
              autoFocus
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-amber-600 dark:bg-amber-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-amber-100 dark:shadow-none active:scale-95 transition-all mt-4"
          >
            تحديث المدخرات
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function EditBudgetModal({ onClose, currentBudget, onUpdate, monthName }: { onClose: () => void, currentBudget: number, onUpdate: (a: number) => void, monthName: string }) {
  const [budget, setBudget] = useState(currentBudget.toString());
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numBudget = parseFloat(budget);
    if (isNaN(numBudget) || numBudget < 0) {
      setError('يرجى إدخال مبلغ صحيح (0 أو أكثر)');
      return;
    }

    onUpdate(numBudget);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-4 sm:items-center">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">ميزانية شهر {monthName}</h3>
          <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400">
            <X size={20} />
          </button>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-bold text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 mr-1">حدد ميزانية "البركة" لهذا الشهر</label>
            <input 
              type="number" 
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all"
              autoFocus
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-600 dark:bg-emerald-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-100 dark:shadow-none active:scale-95 transition-all mt-4"
          >
            تحديث الميزانية
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function EditGoalsModal({ onClose, goals, onUpdate }: { onClose: () => void, goals: any, onUpdate: (g: any) => void }) {
  const [quarterly, setQuarterly] = useState(goals.quarterly.toString());
  const [annual, setAnnual] = useState(goals.annual.toString());
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numQuarterly = parseFloat(quarterly);
    const numAnnual = parseFloat(annual);

    if (isNaN(numQuarterly) || numQuarterly < 0 || isNaN(numAnnual) || numAnnual < 0) {
      setError('يرجى إدخال مبالغ صحيحة (0 أو أكثر)');
      return;
    }

    onUpdate({
      quarterly: numQuarterly,
      annual: numAnnual
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-4 sm:items-center">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">تعديل الأهداف</h3>
          <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400">
            <X size={20} />
          </button>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-bold text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 mr-1">الهدف الربع سنوي (د.م.)</label>
            <input 
              type="number" 
              value={quarterly}
              onChange={(e) => setQuarterly(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 mr-1">الهدف السنوي (د.م.)</label>
            <input 
              type="number" 
              value={annual}
              onChange={(e) => setAnnual(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 dark:bg-indigo-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-100 dark:shadow-none active:scale-95 transition-all mt-4"
          >
            تحديث الأهداف
          </button>
        </form>
      </motion.div>
    </div>
  );
}

const TransactionItem = React.memo(({ transaction, onDelete }: { transaction: Transaction, onDelete: () => void }) => {
  const category = getCategory(transaction.category);
  const Icon = category.icon;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-slate-900 p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-slate-100 dark:border-slate-800 group transition-colors"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${category.color}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-slate-800 dark:text-slate-200 truncate">{transaction.title}</h4>
        <div className="flex flex-col gap-0.5">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <Calendar size={10} />
            {new Date(transaction.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })}
          </p>
          {transaction.note && (
            <p className="text-[10px] text-slate-500 dark:text-slate-400 italic truncate">
              {transaction.note}
            </p>
          )}
        </div>
      </div>
      <div className="text-left">
        <p className={`font-bold ${transaction.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
          {transaction.type === 'income' ? '+' : '-'} {transaction.amount.toLocaleString()}
        </p>
        <button 
          onClick={onDelete}
          className="text-rose-400 dark:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
});

function AddTransactionModal({ onClose, onAdd }: { onClose: () => void, onAdd: (t: any) => void }) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('food');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!amount || amount.trim() === '') {
      setError('يرجى إدخال المبلغ');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('يرجى إدخال مبلغ صحيح أكبر من صفر');
      return;
    }

    if (!title || title.trim() === '') {
      setError('يرجى إدخال وصف للعملية');
      return;
    }
    
    onAdd({
      title: title.trim(),
      amount: numAmount,
      type,
      category,
      note: note.trim() || undefined,
      date: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-4 sm:items-center">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">إضافة عملية جديدة</h3>
          <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400">
            <X size={20} />
          </button>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-bold text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 pb-4">
          {/* Type Toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${type === 'expense' ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
            >
              مصروف
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${type === 'income' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
            >
              دخل
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 mr-1">المبلغ</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-2xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                  autoFocus
                />
                <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-slate-400 dark:text-slate-500">د.م.</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 mr-1">الوصف</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثلاً: غداء، راتب، إيجار..."
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 mr-1">ملاحظة (اختياري)</label>
              <textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="أضف تفاصيل إضافية هنا..."
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all resize-none h-24 placeholder:text-slate-300 dark:placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 mr-1">الفئة</label>
              <div className="grid grid-cols-4 gap-3">
                {CATEGORIES.map((cat) => {
                  const CatIcon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${category === cat.id ? 'bg-indigo-50 dark:bg-indigo-900/40 ring-2 ring-indigo-500' : 'bg-slate-50 dark:bg-slate-800'}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.color}`}>
                        <CatIcon size={18} />
                      </div>
                      <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 dark:bg-indigo-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-100 dark:shadow-none active:scale-95 transition-all mt-4"
          >
            حفظ العملية
          </button>
        </form>
      </motion.div>
    </div>
  );
}
