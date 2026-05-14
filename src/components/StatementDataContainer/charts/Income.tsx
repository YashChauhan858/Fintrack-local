import { ChartComponent } from "@/components/global/charts/Chart";
import type { TSummary } from "@/types/component.types";
import type { ChartData } from "chart.js";

const Income = ({ data }: { data?: TSummary }) => {
  const chartData: ChartData["datasets"] = [
    {
      label: "Income",
      data: data?.chart.income.map((item) => item.amount) ?? [],
      backgroundColor: "#64FFDA",
      borderColor: "#64FFDA",
      borderWidth: 1,
      type: "line",
    },
  ];

  return (
    <div className="p-px rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl z-10">
      <div className="h-96 w-full p-7 pb-12">
        <ChartComponent
          title="Income"
          dataSet={chartData}
          labels={data?.chart.income?.map((e) => e.date) ?? []}
          ySuffix
        />
      </div>
    </div>
  );
};

export default Income;
