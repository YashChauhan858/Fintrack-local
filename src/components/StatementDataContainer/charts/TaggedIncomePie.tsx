import PieChart from "@/components/global/charts/PieChart";
import useStore from "@/store/store";
import BankStatementAnalyzer from "@/utils/BankStatement";
import { getRandomHexColors } from "@/utils/utils";
import type { ChartData } from "chart.js";
import { useMemo } from "react";

const TaggedIncomePie = () => {
  const parsedData = useStore((state) => state.parsedData);
  const headers = useStore((state) => state.aiHeaderInterpretation);

  const chartOptions = useMemo(() => {
    if (!parsedData || !headers) return { error: "No data available" };
    const analyze = new BankStatementAnalyzer(parsedData, headers);
    const income = analyze.getIncomeWithTag();

    if (income.error) return { error: income.error };

    const taggedIncome = Object?.entries(income?.taggedIncome);
    const colors = getRandomHexColors(taggedIncome?.length);
    const chartData: ChartData<"pie">["datasets"] = [
      {
        data: [income?.income ?? 0, ...taggedIncome.map((income) => income[1])],
        backgroundColor: ["#64FFDA", ...colors],
        hoverOffset: 4,
      },
    ];

    return {
      chartData,
      labels: ["Income", ...taggedIncome.map((income) => income[0])],
    };
  }, [parsedData, headers]);

  if (chartOptions?.error)
    return (
      <div className="p-px rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl z-10">
        <div className="h-96 w-full  rounded-sm p-10">
          <h2 className="text-lg font-semibold text-white/70 mb-4 ml-6">
            Income with Tags
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
          title="Income with Tags"
          dataSet={chartOptions?.chartData ?? []}
          labels={chartOptions.labels ?? []}
        />
      </div>
    </div>
  );
};

export default TaggedIncomePie;
