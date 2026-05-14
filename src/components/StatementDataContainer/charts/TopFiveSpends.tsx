import { ChartComponent } from "@/components/global/charts/Chart";
import type { TSummary } from "@/types/component.types";
import type { ChartData } from "chart.js";

const TopFiveSpends = ({ data }: { data?: TSummary }) => {
  const chartData: ChartData["datasets"] = [
    {
      label: "Top Five Spends",
      data: data?.chart.top5Spending.map((item) => item.amount) ?? [],
      backgroundColor: "#FF7B5A",
      type: "bar",
      borderRadius: 3,
    },
  ];

  return (
    <div className="p-px rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl z-10">
      <div className="h-96 w-full rounded-sm p-5 md:p-10 bg-secondary-background">
        <ChartComponent
          title="Top 5 Spends"
          dataSet={chartData}
          labels={data?.chart.top5Spending?.map((e) => e.spend) ?? []}
        />
      </div>
    </div>
  );
};

export default TopFiveSpends;
