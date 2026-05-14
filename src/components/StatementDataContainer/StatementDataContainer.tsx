import MetaData from "./charts/MetaData";
import Income from "./charts/Income";
import ExpenseIncomePie from "./charts/ExpenseIncomePie";
import ExpenseIncome from "./charts/ExpenseIncome";
import Expense from "./charts/Expense";
import DailySpend from "./charts/DailySpend";
import TopFiveSpends from "./charts/TopFiveSpends";
import TopTenSpends from "./charts/TopTenSpends";
import TaggedIncomePie from "./charts/TaggedIncomePie";
import TaggedExpensePie from "./charts/TaggedExpensePie";
import useStore from "@/store/store";

const StatementDataContainer = () => {
  const data = useStore((state) => state.summery);

  return (
    <div className="max-w-240 w-full flex flex-col overflow-y-scroll py-5 gap-4 min-h-screen">
      <div className="grid grid-cols-1">
        <MetaData data={data ?? undefined} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-4">
        <Income data={data ?? undefined} />
        <ExpenseIncomePie data={data ?? undefined} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <div className="block_1">
          <ExpenseIncome data={data ?? undefined} />
        </div>
        <div className="block_2">
          <Expense data={data ?? undefined} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {" "}
        <div>
          <DailySpend data={data ?? undefined} />
        </div>
        <div>
          <TopFiveSpends data={data ?? undefined} />
        </div>
      </div>
      <div>
        <TopTenSpends data={data ?? undefined} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <TaggedIncomePie />
        <TaggedExpensePie />
      </div>
    </div>
  );
};

export default StatementDataContainer;
