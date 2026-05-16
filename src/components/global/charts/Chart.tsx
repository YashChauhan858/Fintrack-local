import {
  type ChartData,
  type ChartOptions,
  type ChartType,
  type Chart as ChartJS,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { formatCurrency, formatNumberWithSuffix } from "@/utils/utils";
import { useMemo, useRef, useState } from "react";

interface ChartComponentProps {
  dataSet: ChartData["datasets"];
  title?: string;
  labels: string[];
  xAxisText?: string;
  yAxisText?: string;
  legend?: boolean;
  ySuffix?: boolean;
  zoom?: boolean;
}

export const ChartComponent: React.FC<ChartComponentProps> = ({
  dataSet,
  title,
  labels,
  xAxisText,
  yAxisText,
  legend = false,
  ySuffix = false,
  zoom = true,
}) => {
  const chartRef = useRef<ChartJS<ChartType> | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  // Prepare chart data
  const chartData: ChartData = {
    labels: labels,
    datasets: dataSet,
  };

  const handleZoomReset = () => {
    chartRef?.current?.resetZoom();
  };
  const options = useMemo(() => {
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
        ...(zoom
          ? {
              zoom: {
                pan: {
                  enabled: true,
                  mode: "x",
                  modifierKey: "shift",
                },
                zoom: {
                  drag: {
                    enabled: true,
                  },
                  mode: "x",
                  onZoomComplete: (ctx) => {
                    if (!ctx || !ctx?.chart) return;
                    setIsZoomed(ctx.chart?.isZoomedOrPanned());
                  },
                },
              },
            }
          : {
              zoom: undefined,
            }),
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
    return options;
  }, [legend, xAxisText, yAxisText, ySuffix, zoom]);

  return (
    <div className="w-full h-full flex flex-col">
      {title && (
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white mb-4 ml-6">
            {title}
          </h2>
          {isZoomed && (
            <button
              onClick={handleZoomReset}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-sm border border-[#2A3441] bg-[#151B23] hover:bg-[#1B2430] active:scale-[0.98] transition-all duration-200 text-sm font-medium text-[#D6E1FF]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 2v6h6" />
                <path d="M21 12A9 9 0 0 0 6 5.3L3 8" />
                <path d="M21 22v-6h-6" />
                <path d="M3 12a9 9 0 0 0 15 6.7L21 16" />
              </svg>
            </button>
          )}
        </div>
      )}
      <div className="h-full w-full -ml-4 md:m-0">
        <Chart
          ref={chartRef}
          type={"line"}
          data={chartData}
          options={options}
        />
      </div>
    </div>
  );
};
