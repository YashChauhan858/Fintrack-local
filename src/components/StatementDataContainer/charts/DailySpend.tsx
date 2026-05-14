import { ChartComponent } from "@/components/global/charts/Chart";
import type { TSummary } from "@/types/component.types";
import type { ChartData } from "chart.js";

const DailySpend = ({ data }: { data?: TSummary }) => {
  const chartData: ChartData["datasets"] = [
    {
      label: "DailySpend",
      data: data?.chart.dailySpend.map((item) => item.spendPercentage) ?? [],
      backgroundColor: "#FF7B5A",
      borderColor: "#FF7B5A",
      borderWidth: 1,
      type: "line",
    },
  ];

  return (
    <div className="p-px rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl z-10">
      <div className="h-96 w-full rounded-sm p-5 md:p-10 bg-secondary-background">
        <ChartComponent
          title="Daily Spend (%)"
          dataSet={chartData}
          labels={data?.chart.dailySpend?.map((e) => e.date) ?? []}
        />
      </div>
    </div>
  );
};

export default DailySpend;
