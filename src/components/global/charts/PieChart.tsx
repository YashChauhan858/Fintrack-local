import { type ChartData, type ChartOptions } from "chart.js";
import { Pie } from "react-chartjs-2";
import { formatCurrency } from "@/utils/utils";

interface ChartComponentProps {
  dataSet: ChartData<"pie">["datasets"];
  title?: string;
  labels: string[];
  legend?: boolean;
}

const PieChart = ({
  dataSet,
  title,
  labels,
  legend = false,
}: ChartComponentProps) => {
  // Prepare chart data
  const chartData: ChartData<"pie"> = {
    labels: labels,
    datasets: dataSet,
  };

  // Chart options
  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: legend,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
            if (context.raw !== null && typeof context.raw === "number") {
              label += formatCurrency(context.raw, 0);
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-full flex flex-col">
      {title && (
        <h2 className="text-lg font-semibold text-white/70 mb-4 ml-6">
          {title}
        </h2>
      )}

      <div className="h-full w-full">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PieChart;
