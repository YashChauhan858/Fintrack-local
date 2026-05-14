import PieChart from "@/components/global/charts/PieChart";
import useStore from "@/store/store";
import BankStatementAnalyzer from "@/utils/BankStatement";
import { getRandomHexColors } from "@/utils/utils";
import type { ChartData } from "chart.js";
import { useMemo } from "react";

const TaggedExpensePie = () => {
  const parsedData = useStore((state) => state.parsedData);
  const headers = useStore((state) => state.aiHeaderInterpretation);

  const chartOptions = useMemo(() => {
    if (!parsedData || !headers) return { error: "No data available" };
    const analyze = new BankStatementAnalyzer(parsedData, headers);
    const expense = analyze.getExpenseWithTag();

    if (expense.error) return { error: expense.error };

    const taggedexpense = Object?.entries(expense?.taggedExpense);
    const colors = getRandomHexColors(taggedexpense?.length);
    const chartData: ChartData<"pie">["datasets"] = [
      {
        data: [
          expense?.expense ?? 0,
          ...taggedexpense.map((expense) => expense[1]),
        ],
        backgroundColor: ["#64FFDA", ...colors],
        hoverOffset: 4,
      },
    ];

    return {
      chartData,
      labels: ["Income", ...taggedexpense.map((expense) => expense[0])],
    };
  }, [parsedData, headers]);

  if (chartOptions?.error)
    return (
      <div className="p-px rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl z-10">
        <div className="h-96 w-full  rounded-sm p-10">
          <h2 className="text-lg font-semibold text-white/70 mb-4 ml-6">
            Expense with Tags
          </h2>
          <div className="h-full w-full flex items-center justify-center">
            <p className="">{chartOptions.error}</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="p-px rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl z-10">
      <div className="h-96 w-full rounded-sm p-10">
        <PieChart
          title="Expense with Tags"
          dataSet={chartOptions?.chartData ?? []}
          labels={chartOptions.labels ?? []}
        />
      </div>
    </div>
  );
};

export default TaggedExpensePie;
