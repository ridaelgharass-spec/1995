import React, { useState, useEffect } from 'react';
import { Transaction, FinancialGoals } from '../models/types';
import { Storage } from '../storage/localStorage';
import { FinanceLogic } from '../logic/finance';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<FinancialGoals>({ quarterly: 5000, annual: 20000 });
  const [monthlyBudgets, setMonthlyBudgets] = useState<Record<string, number>>({});
  const [manualSavings, setManualSavings] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const { currentMonth, currentYear, currentMonthKey } = React.useMemo(() => {
    const d = new Date();
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    return {
      currentMonth: m,
      currentYear: y,
      currentMonthKey: `${y}-${m.toString().padStart(2, '0')}`
    };
  }, []); // Only once on mount, or could be updated if app stays open for days

  useEffect(() => {
    const init = async () => {
      const t = await Storage.loadTransactions();
      const g = await Storage.loadGoals({ quarterly: 5000, annual: 20000 });
      const b = await Storage.loadBudgets();
      const s = await Storage.loadSavings();
      setTransactions(t);
      setGoals(g);
      setMonthlyBudgets(b);
      setManualSavings(s);
      setIsLoaded(true);
    };
    init();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      Storage.saveTransactions(transactions);
      Storage.saveGoals(goals);
      Storage.saveBudgets(monthlyBudgets);
      Storage.saveSavings(manualSavings);
    }
  }, [transactions, goals, monthlyBudgets, manualSavings, isLoaded]);

  const addTransaction = React.useCallback(async (t: Omit<Transaction, 'id' | 'month' | 'year'>) => {
    if (!t.amount || t.amount <= 0) {
      console.error('Invalid transaction amount:', t.amount);
      return;
    }
    const nowTime = new Date();
    const newTransaction: Transaction = { 
      ...t, 
      id: crypto.randomUUID(),
      month: nowTime.getMonth() + 1, // 1-12
      year: nowTime.getFullYear()
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
  }, []);

  const deleteTransaction = React.useCallback(async (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateGoals = React.useCallback((newGoals: Partial<FinancialGoals>) => {
    setGoals(prev => ({ ...prev, ...newGoals }));
  }, []);

  const updateMonthlyBudget = React.useCallback((amount: number) => {
    setMonthlyBudgets(prev => ({ ...prev, [currentMonthKey]: amount }));
  }, [currentMonthKey]);

  const updateSavings = React.useCallback((amount: number) => {
    setManualSavings(amount);
  }, []);

  const totals = React.useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const dailyExpenseTotal = FinanceLogic.getDailyTotal(transactions, todayStr);
    const weeklyExpenseTotal = FinanceLogic.getWeeklyTotal(transactions);
    const monthlyExpenseTotal = FinanceLogic.getMonthlyTotal(transactions, currentMonth, currentYear);

    const nowTime = new Date();
    const dayOfWeek = (nowTime.getDay() + 6) % 7;
    const startOfWeek = new Date(nowTime);
    startOfWeek.setDate(nowTime.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const todayTransactions = transactions.filter(t => 
      t.date.startsWith(todayStr)
    );

    const thisWeekTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate >= startOfWeek;
    });

    const thisMonthTransactions = transactions.filter(t => {
      return t.month === currentMonth && t.year === currentYear;
    });

    const allTimeTotals = FinanceLogic.calculateTotals(transactions);
    const monthlyTotals = FinanceLogic.calculateTotals(thisMonthTransactions);

    return {
      dailyExpenseTotal,
      weeklyExpenseTotal,
      monthlyExpenseTotal,
      todayTransactions,
      thisWeekTransactions,
      thisMonthTransactions,
      allTimeTotals,
      monthlyTotals
    };
  }, [transactions, currentMonth, currentYear]);

  const thresholds = React.useMemo(() => {
    const currentMonthBudget = monthlyBudgets[currentMonthKey] || 0;
    const weeklyThreshold = currentMonthBudget / 4;
    const baseDailyThreshold = weeklyThreshold / 7;

    const totalPastSurplus = FinanceLogic.calculatePastSurplus(totals.thisMonthTransactions, baseDailyThreshold);
    const dailyThreshold = Math.max(0, baseDailyThreshold - (totalPastSurplus / 7));

    return {
      currentMonthBudget,
      weeklyThreshold,
      dailyThreshold,
      baseDailyThreshold
    };
  }, [monthlyBudgets, currentMonthKey, totals.thisMonthTransactions]);

  const savings = React.useMemo(() => ({
    allTime: manualSavings + (totals.allTimeTotals.income - totals.allTimeTotals.expense),
    monthly: totals.monthlyTotals.income - totals.monthlyTotals.expense
  }), [manualSavings, totals.allTimeTotals, totals.monthlyTotals]);

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    allTimeTotals: totals.allTimeTotals,
    allTimeSavings: savings.allTime,
    monthlyTotals: totals.monthlyTotals,
    monthlySavings: savings.monthly,
    dailyExpenseTotal: totals.dailyExpenseTotal,
    weeklyExpenseTotal: totals.weeklyExpenseTotal,
    monthlyExpenseTotal: totals.monthlyExpenseTotal,
    todayTransactions: totals.todayTransactions,
    thisWeekTransactions: totals.thisWeekTransactions,
    thisMonthTransactions: totals.thisMonthTransactions,
    goals,
    updateGoals,
    manualSavings,
    updateSavings,
    currentMonthBudget: thresholds.currentMonthBudget,
    weeklyThreshold: thresholds.weeklyThreshold,
    dailyThreshold: thresholds.dailyThreshold,
    baseDailyThreshold: thresholds.baseDailyThreshold,
    updateMonthlyBudget
  };
};
