import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
  LineController,
  BarElement,
  BarController,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { formatCurrency, formatNumberWithSuffix } from "@/utils/utils";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  BarController,
);
interface ChartComponentProps {
  dataSet: ChartData["datasets"];
  title?: string;
  labels: string[];
  xAxisText?: string;
  yAxisText?: string;
  legend?: boolean;
  ySuffix?: boolean;
}
export const ChartComponent: React.FC<ChartComponentProps> = ({
  dataSet,
  title,
  labels,
  xAxisText,
  yAxisText,
  legend = false,
  ySuffix = false,
}) => {
  // Prepare chart data
  const chartData: ChartData = {
    labels: labels,
    datasets: dataSet,
  };

  // Chart options
  const options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index", // show tooltip for all elements at same index
      intersect: false, // trigger tooltip even if not directly intersecting
    },
    plugins: {
      legend: {
        display: legend,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: yAxisText,
          color: "#8892B0",
        },
        grid: {
          display: false,
        },
        border: {
          color: "#8892B0",
          z: 1,
        },
        ticks: {
          color: "#8892B0",
          callback: function (value) {
            if (typeof value === "number") {
              return ySuffix
                ? formatNumberWithSuffix(value)
                : formatCurrency(value, 0);
            }
            return value;
          },
        },
      },
      x: {
        title: {
          display: true,
          text: xAxisText,
          color: "#8892B0",
        },
        grid: {
          display: false,
        },
        border: {
          color: "#8892B0",
          z: 1,
        },
        ticks: {
          color: "#8892B0",
          autoSkip: true,
          maxRotation: 0, // Keep horizontal
          minRotation: 0,
          autoSkipPadding: 20, // Minimum padding between labels
          // maxTicksLimit: 8, // Maximum number of ticks to show
          callback: function (value) {
            const label = this.getLabelForValue(Number(value));
            const maxLength = 15; // Adjust as needed
            return label.length > maxLength
              ? label.substring(0, maxLength) + "..."
              : label;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-full flex flex-col">
      {title && (
        <h2 className="text-lg font-semibold text-white mb-4 ml-6">{title}</h2>
      )}
      <div className="h-full w-full -ml-4 md:m-0">
        <Chart type={"line"} data={chartData} options={options} />
      </div>
    </div>
  );
};
