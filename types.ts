export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // ISO string
  notes?: string;
  createdAt: number;
}

export interface FinancialPlan {
  id: string;
  userId: string;
  name: string;
  startDate: string;
  endDate: string;
  targetIncome: number;
  targetSavings: number;
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  isSystem?: boolean; // 'NA' is system and cannot be deleted
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  currency: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export enum AppRoute {
  DASHBOARD = '/',
  TRANSACTIONS = '/transactions',
  BUDGET = '/budget',
  SETTINGS = '/settings',
  ABOUT = '/about',
  LOGIN = '/login',
  REGISTER = '/register',
}