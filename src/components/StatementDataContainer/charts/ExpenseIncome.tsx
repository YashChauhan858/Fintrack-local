import { ChartComponent } from "@/components/global/charts/Chart";
import type { TSummary } from "@/types/component.types";
import type { ChartData } from "chart.js";

const ExpenseIncome = ({ data }: { data?: TSummary }) => {
  const chartData: ChartData["datasets"] = [
    {
      label: "Total Income",
      data: data?.chart.income.map((item) => item.amount) ?? [],
      backgroundColor: "#64FFDA",
      borderColor: "#64FFDA",
      borderWidth: 1,
      type: "bar",
      borderRadius: 3,
    },
    {
      label: "Total Expense",
      data: data?.chart.expense.map((item) => -1 * item.amount) ?? [],
      backgroundColor: "#FF7B5A",
      borderColor: "#FF7B5A",
      borderWidth: 1,
      type: "bar",
      borderRadius: 3,
    },
  ];

  return (
    <div className="p-px rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl z-10">
      <div className="h-96 w-full rounded-sm p-5 md:p-10 bg-secondary-background">
        <ChartComponent
          title="Income - Expense"
          dataSet={chartData}
          labels={data?.chart.expense?.map((e) => e.date) ?? []}
        />
      </div>
    </div>
  );
};

export default ExpenseIncome;
