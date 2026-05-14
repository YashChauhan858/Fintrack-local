import { formatNumberWithSuffix } from "@/utils/utils";
import type { TSummary } from "@/types/component.types";
import { useState } from "react";
import TagModal from "../model/TagModel";

const MetaData = ({ data }: { data?: TSummary }) => {
  const [showTagModal, setShowTagModal] = useState(false);

  const {
    averageDailySpending,
    highestExpense,
    highestIncome,
    netSavings,
    totalExpenses,
    totalIncome,
    startDate,
    endDate,
    netCashFlow,
    zeroSpendDays,
    averageDailyIncome,
    savingsRate,
  } = data ?? {};

  const metadata = [
    { label: "Start Date", value: startDate },
    { label: "End Date", value: endDate },
    { label: "Total Income", value: totalIncome },
    { label: "Total Expenses", value: totalExpenses },
    { label: "Net Savings", value: netSavings },
    { label: "Net Cash Flow", value: netCashFlow },
    { label: "Highest Income", value: highestIncome?.amount },
    { label: "Highest Expense", value: highestExpense?.amount },
    { label: "Avg Daily Income", value: averageDailyIncome },
    { label: "Avg Daily Spending", value: averageDailySpending },
    {
      label: "Savings Rate (%)",
      value: savingsRate,
    },
    { label: "Zero Spend Days", value: zeroSpendDays },
  ];

  return (
    <div className="p-4 sm:p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl z-10">
      <TagModal isOpen={showTagModal} onClose={() => setShowTagModal(false)} />
      <h2 className="text-xl font-semibold text-white mb-4 pl-2">Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metadata.map((item) => (
          <div
            key={item.label}
            className="meta_data flex justify-between p-3 bg-secondary-background rounded-lg text-white"
          >
            <strong className="font-bold text-white/80">{item.label}</strong>
            <span className="text-white/50 font-normal">
              {["Start Date", "End Date"].includes(item.label)
                ? item?.value
                : formatNumberWithSuffix(Number(item?.value ?? 0))}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right">
        <button
          onClick={() => setShowTagModal(true)}
          className="ml-2 text-sm text-white border border-white px-4 py-2 rounded-sm cursor-pointer"
        >
          Tag
        </button>
      </div>
    </div>
  );
};

export default MetaData;
