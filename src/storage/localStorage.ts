const STORAGE_KEYS = {
  TRANSACTIONS: 'masarif_transactions',
  GOALS: 'masarif_goals',
  BUDGETS: 'masarif_budgets',
  SAVINGS: 'masarif_savings',
  DARK_MODE: 'darkMode'
};

export const Storage = {
  saveTransactions: async (transactions: any[]) => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },
  loadTransactions: async (): Promise<any[]> => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : [];
  },
  saveGoals: async (goals: any) => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  },
  loadGoals: async (defaultGoals: any): Promise<any> => {
    const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
    return saved ? JSON.parse(saved) : defaultGoals;
  },
  saveBudgets: async (budgets: Record<string, number>) => {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  },
  loadBudgets: async (): Promise<Record<string, number>> => {
    const saved = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    return saved ? JSON.parse(saved) : {};
  },
  saveSavings: async (amount: number) => {
    localStorage.setItem(STORAGE_KEYS.SAVINGS, JSON.stringify(amount));
  },
  loadSavings: async (): Promise<number> => {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVINGS);
    return saved ? JSON.parse(saved) : 0;
  },
  saveDarkMode: (isDark: boolean) => {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(isDark));
  },
  loadDarkMode: (defaultValue: boolean): boolean => {
    const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    return saved ? JSON.parse(saved) : defaultValue;
  }
};
