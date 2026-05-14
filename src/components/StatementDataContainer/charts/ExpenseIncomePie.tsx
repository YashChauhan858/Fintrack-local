import PieChart from "@/components/global/charts/PieChart";
import type { TSummary } from "@/types/component.types";
import type { ChartData } from "chart.js";

const ExpenseIncomePie = ({ data }: { data?: TSummary }) => {
  const chartData: ChartData<"pie">["datasets"] = [
    {
      data: [data?.totalIncome ?? 0, data?.totalExpenses ?? 0],
      backgroundColor: ["#64FFDA", "#FF7B5A"],
      hoverOffset: 4,
    },
  ];
  return (
    <div className="p-px rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl z-10">
      <div className="h-96 w-full rounded-sm p-5 md:p-10">
        <PieChart
          title="Income - Expense"
          dataSet={chartData}
          labels={["Income", "Expense"]}
        />
      </div>
    </div>
  );
};

export default ExpenseIncomePie;
