import { Transaction } from '../models/types';

export const FinanceLogic = {
  calculateTotals: (transactions: Transaction[]) => {
    return transactions.reduce(
      (acc, t) => {
        if (t.type === 'income') acc.income += t.amount;
        else acc.expense += t.amount;
        return acc;
      },
      { income: 0, expense: 0 }
    );
  },

  getDailyTotal: (transactions: Transaction[], dateStr: string) => {
    return transactions
      .filter(t => {
        return t.type === 'expense' && t.date.startsWith(dateStr);
      })
      .reduce((sum, t) => sum + t.amount, 0);
  },

  getWeeklyTotal: (transactions: Transaction[]) => {
    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7; // Monday is 0
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    
    return transactions
      .filter(t => {
        const tDate = new Date(t.date);
        return t.type === 'expense' && tDate >= startOfWeek;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  },

  getMonthlyTotal: (transactions: Transaction[], month: number, year: number) => {
    return transactions
      .filter(t => t.type === 'expense' && t.month === month && t.year === year)
      .reduce((sum, t) => sum + t.amount, 0);
  },

  calculatePastSurplus: (transactions: Transaction[], baseDailyThreshold: number) => {
    let totalSurplus = 0;
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayExpenses = transactions
        .filter(t => t.type === 'expense' && t.date.startsWith(dateStr))
        .reduce((sum, t) => sum + t.amount, 0);
      
      const surplus = Math.max(0, dayExpenses - baseDailyThreshold);
      totalSurplus += surplus;
    }
    return totalSurplus;
  }
};
