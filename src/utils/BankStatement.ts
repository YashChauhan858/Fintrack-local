import type {
  IAiHeadersAnalysis,
  IChartData,
  TSummary,
  IDailySpendPercentage,
  ITransaction,
  Transaction,
  ITaggedExpense,
  ITaggedIncome,
} from "@/types/component.types";

class BankStatementAnalyzer {
  private data: Transaction[];
  private mapping: IAiHeadersAnalysis;

  constructor(data: Transaction[], mapping: IAiHeadersAnalysis) {
    this.data = data;
    this.mapping = mapping;
  }

  private getCreditAmount(entry: Transaction): number {
    const credit = parseFloat(entry[this.mapping.credit]) || 0;
    return credit;
  }

  private getDebitAmount(entry: Transaction): number {
    const debit = parseFloat(entry[this.mapping.debit]) || 0;
    return debit;
  }

  private getDate(entry: Transaction): string {
    return entry[this.mapping.date];
  }

  private totalIncome(): number {
    return this.data.reduce(
      (sum, entry) => sum + this.getCreditAmount(entry),
      0,
    );
  }

  private totalExpenses(): number {
    return this.data.reduce(
      (sum, entry) => sum + this.getDebitAmount(entry),
      0,
    );
  }

  private netSavings(): number {
    return this.totalIncome() - this.totalExpenses();
  }

  private netCashFlow(): number {
    return this.totalIncome() - this.totalExpenses();
  }

  private savingsRate(): number {
    const income = this.totalIncome();
    if (income === 0) return 0;
    return (this.netSavings() / income) * 100;
  }

  private averageDailySpending(): number {
    const days = this.getTotalDaysInRange();
    const totalExpenses = this.totalExpenses();
    return days > 0 ? totalExpenses / days : 0;
  }

  private averageDailyIncome(): number {
    const days = this.getTotalDaysInRange();
    const totalIncome = this.totalIncome();
    return days > 0 ? totalIncome / days : 0;
  }

  private getTotalDaysInRange(): number {
    if (!this.data || this.data.length < 2) return 0;

    const startDate = new Date(this.getDate(this.data[0]));
    const endDate = new Date(this.getDate(this.data[this.data.length - 1]));
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 0;

    const diffInMilliseconds = endDate.getTime() - startDate.getTime();
    const diffInDays =
      Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24)) + 1;
    return diffInDays;
  }

  private zeroSpendDays(): number {
    const spendByDate: Record<string, number> = {};

    for (const entry of this.data) {
      const date = this.getDate(entry);
      const debit = this.getDebitAmount(entry);

      spendByDate[date] = (spendByDate[date] || 0) + debit;
    }

    return Object.values(spendByDate).filter((spend) => spend === 0).length;
  }

  private highestExpense(): { amount: number; description: string } {
    let maxAmount = 0;
    let description = "";

    for (const entry of this.data) {
      const debit = this.getDebitAmount(entry);
      if (debit > maxAmount) {
        maxAmount = debit;
        description = entry[this.mapping.description] || "";
      }
    }

    return { amount: maxAmount, description };
  }

  private highestIncome(): { amount: number; description: string } {
    let maxAmount = 0;
    let description = "";

    for (const entry of this.data) {
      const credit = this.getCreditAmount(entry);
      if (credit > maxAmount) {
        maxAmount = credit;
        description = entry[this.mapping.description] || "";
      }
    }

    return { amount: maxAmount, description };
  }

  private getExpenseDataForCharts(): IChartData[] {
    return this.data.map((item) => ({
      date: this.getDate(item),
      amount: this.getDebitAmount(item) || 0,
    }));
  }

  private getIncomeDataForCharts(): IChartData[] {
    return this.data.map((item) => ({
      date: this.getDate(item),
      amount: this.getCreditAmount(item) || 0,
    }));
  }

  public getIncomeWithTag(): ITaggedIncome {
    if (!this.data?.some((item) => item?.tag?.trim())) {
      return { income: 0, taggedIncome: {}, error: "No tagged income found" };
    }

    let income = 0;
    const taggedIncome: Record<string, number> = {};

    this.data?.forEach((item) => {
      const credit = this.getCreditAmount(item);

      if (credit <= 0) return;

      const tag = item?.tag?.trim();
      if (tag) {
        taggedIncome[tag] = (taggedIncome[tag] || 0) + credit;
      } else {
        income += credit;
      }
    });

    if (Object.keys(taggedIncome).length === 0)
      return { income, taggedIncome: {}, error: "No tagged income found" };

    return { income, taggedIncome, error: "" };
  }

  public getExpenseWithTag(): ITaggedExpense {
    if (!this.data?.some((item) => item?.tag?.trim())) {
      return { expense: 0, taggedExpense: {}, error: "No tagged income found" };
    }

    let expense = 0;
    const taggedExpense: Record<string, number> = {};

    this.data?.forEach((item) => {
      const credit = this.getDebitAmount(item);

      if (credit <= 0) return;

      const tag = item.tag?.trim();
      if (tag) {
        taggedExpense[tag] = (taggedExpense[tag] || 0) + credit;
      } else {
        expense += credit;
      }
    });

    if (Object.keys(taggedExpense).length === 0)
      return { expense, taggedExpense: {}, error: "No tagged expense found" };

    return { expense, taggedExpense, error: "" };
  }

  public getDailySpendPercentage(): IDailySpendPercentage[] {
    const income = this.totalIncome() || 1; // avoid division by zero
    const dailyExpenseMap: Record<string, number> = {};

    for (const entry of this.data) {
      const date = entry[this.mapping.date];
      const debit = this.getDebitAmount(entry);

      if (debit > 0) {
        dailyExpenseMap[date] = (dailyExpenseMap[date] || 0) + debit;
      }
    }

    const result: IDailySpendPercentage[] = Object.keys(dailyExpenseMap).map(
      (date) => ({
        date,
        spendPercentage: parseFloat(
          ((dailyExpenseMap[date] / income) * 100).toFixed(2),
        ),
      }),
    );

    return result;
  }

  private getTopMerchantSpend(topN: number = 5): ITransaction[] {
    const spendingMap: Record<string, number> = {};
    for (const entry of this.data) {
      const account = entry[this.mapping.description] || "";
      const debit = this.getDebitAmount(entry);

      if (debit > 0) {
        const narration = account.trim().toLowerCase();
        spendingMap[narration] = (spendingMap[narration] || 0) + debit;
      }
    }

    const sortedSpending = Object.entries(spendingMap)
      .sort(([, amountA], [, amountB]) => amountB - amountA)
      .map(([spend, amount]) => ({ spend, amount }));

    const topMerchants = sortedSpending.slice(0, topN);
    const others = sortedSpending.slice(topN);

    const othersTotal = others.reduce((sum, item) => sum + item.amount, 0);

    if (othersTotal > 0) {
      topMerchants.push({ spend: "Others", amount: othersTotal });
    }

    return topMerchants;
  }

  public analyze(): TSummary {
    return {
      totalIncome: this.totalIncome(),
      totalExpenses: this.totalExpenses(),
      netSavings: this.netSavings(),
      netCashFlow: this.netCashFlow(),
      savingsRate: this.savingsRate(),
      averageDailySpending: this.averageDailySpending(),
      averageDailyIncome: this.averageDailyIncome(),
      zeroSpendDays: this.zeroSpendDays(),
      highestExpense: this.highestExpense(),
      highestIncome: this.highestIncome(),

      startDate: this.data.length > 0 ? this.getDate(this.data[0]) : null,
      endDate:
        this.data.length > 0
          ? this.getDate(this.data[this.data.length - 1])
          : null,
      chart: {
        expense: this.getExpenseDataForCharts(),
        income: this.getIncomeDataForCharts(),
        dailySpend: this.getDailySpendPercentage(),
        top5Spending: this.getTopMerchantSpend(5),
        top10Spending: this.getTopMerchantSpend(10),
        taggedIncome: this.getIncomeWithTag(),
        taggedExpense: this.getExpenseWithTag(),
      },
    };
  }
}

export default BankStatementAnalyzer;
