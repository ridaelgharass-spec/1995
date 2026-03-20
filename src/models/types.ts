export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  month: number;
  year: number;
  note?: string;
}

export interface FinancialGoals {
  quarterly: number;
  annual: number;
}

export interface Category {
  id: string;
  name: string;
  icon: any;
  color: string;
}
