export interface IAiHeadersAnalysis {
  credit: string;
  debit: string;
  date: string;
  account: string;
  description: string;
}

export interface IChartData {
  date: string;
  amount: number;
}

export type TSummary = {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  netCashFlow: number;
  savingsRate: number;
  averageDailySpending: number;
  averageDailyIncome: number;
  zeroSpendDays: number;
  highestExpense: { amount: number; description: string };
  highestIncome: { amount: number; description: string };
  startDate: string | null;
  endDate: string | null;
  chart: {
    income: IChartData[];
    expense: IChartData[];
    dailySpend: IDailySpendPercentage[];
    top5Spending: ITransaction[];
    top10Spending: ITransaction[];
    taggedIncome: ITaggedIncome;
    taggedExpense: ITaggedExpense;
  };
};

export interface IDailySpendPercentage {
  date: string;
  spendPercentage: number;
}

export interface ITransaction {
  spend: string;
  amount: number;
}

export type Transaction = {
  [key: string]: any;
};

export interface ITaggedExpense {
  expense: number;
  taggedExpense: Record<string, number>;
  error: string;
}

export interface ITaggedIncome {
  income: number;
  taggedIncome: Record<string, number>;
  error: string;
}

export interface IConfirmTagAllModalProps {
  isOpen: boolean;
  onClose: () => void;
  filteredData: Transaction[];
  itemCount: number;
}

export interface ITagModalProps {
  isOpen: boolean;
  onClose: () => void;
}
