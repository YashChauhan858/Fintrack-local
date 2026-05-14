import { createPortal } from "react-dom";
import { useState, useMemo } from "react";
import { XIcon, SearchIcon, ChevronDownIcon } from "lucide-react";
import { formatCurrency } from "@/utils/utils";
import type { ITagModalProps, Transaction } from "@/types/component.types";
import useStore from "@/store/store";

const TagModal = ({ isOpen, onClose }: ITagModalProps) => {
  const update = useStore((state) => state.update);

  const parsedData = useStore((state) => state.parsedData) as
    | Transaction[]
    | null;

  const [tag, setTag] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [amount, setAmount] = useState<number | string>("");
  const [condition, setCondition] = useState<string>("equal");

  const addTag = (filteredData: Transaction[]) => {
    if (!tag || !parsedData || filteredData.length === 0) return;

    const updatedParsedData = parsedData.map((originalItem) => {
      // Stringify to compare objects as object is dynamic
      if (
        filteredData.some(
          (e) => JSON.stringify(e) === JSON.stringify(originalItem),
        ) &&
        tag
      ) {
        return {
          ...originalItem,
          tag: tag?.trim(),
        };
      }
      return originalItem;
    });

    update("parsedData", updatedParsedData);
  };

  const columnHeaders = useMemo(() => {
    if (parsedData && parsedData.length > 0) {
      return [...Object.keys(parsedData[0]).filter((e) => e !== "tag"), "tag"];
    } else {
      return [];
    }
  }, [parsedData]);

  const filteredData = useMemo(() => {
    if (!parsedData) return [];

    let dataToFilter = [...parsedData];

    if (searchTerm) {
      dataToFilter = dataToFilter.filter((row) =>
        JSON.stringify(row).toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (amount !== "" && !isNaN(Number(amount))) {
      const numericAmount = Number(amount);
      dataToFilter = dataToFilter.filter((row) => {
        let rowAmountKey = Object.keys(row).find(
          (key) => key.toLowerCase() === "amount",
        );
        if (!rowAmountKey) {
          rowAmountKey = Object.keys(row).find(
            (key) => typeof row[key] === "number",
          );
        }

        if (rowAmountKey && typeof row[rowAmountKey] === "number") {
          const rowValue = row[rowAmountKey] as number;
          switch (condition) {
            case "equal":
              return rowValue === numericAmount;
            case "greater": // Strictly greater
              return rowValue > numericAmount;
            case "smaller": // Strictly smaller
              return rowValue < numericAmount;
            case "greater_equal":
              return rowValue >= numericAmount;
            case "smaller_equal":
              return rowValue <= numericAmount;
            default:
              return true;
          }
        }
        return false;
      });
    }

    return dataToFilter;
  }, [searchTerm, amount, condition, parsedData]);

  const header = useStore((state) => state.aiHeaderInterpretation);

  const debit = header
    ? filteredData.reduce(
        (prev, curr) => prev + Number(curr[header["debit"]] ?? 0),
        0,
      )
    : null;
  const credit = header
    ? filteredData.reduce(
        (prev, curr) => prev + Number(curr[header["credit"]] ?? 0),
        0,
      )
    : null;

  const isTagAllButtonDisabled = !(
    (searchTerm.trim() !== "" || amount !== "") &&
    filteredData.length > 0
  );

  const cellValue = (row: Transaction, header: string) => {
    if (!header || !row) return "";

    if (typeof row[header] === "number") return formatCurrency(row[header]);
    return row[header] ?? "";
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed top-0 left-0 h-full w-full flex bg-black/50 items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-[70vw] min-h-[60vh] max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-text-primary">
            Tag & Filter Data
          </h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          >
            <XIcon size={24} />
          </button>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-1">
            <label
              htmlFor="searchTerm"
              className="block text-sm font-medium text-text-secondary mb-1"
            >
              Search
            </label>
            <div className="relative">
              <input
                id="searchTerm"
                type="text"
                name="search"
                placeholder="Search all fields..."
                className="w-full border border-slate-600 p-2 pl-10 placeholder-text-black rounded focus:outline-none text-black"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
              <SearchIcon
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-text-secondary mb-1"
            >
              Amount
            </label>
            <input
              id="amount"
              type="number"
              placeholder="Enter amount"
              name="amount"
              className="w-full border border-slate-600 p-2 placeholder-text-black rounded focus:outline-none text-black"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="condition"
              className="block text-sm font-medium text-text-secondary mb-1"
            >
              Condition
            </label>
            <div className="relative">
              <select
                id="condition"
                className="w-full border border-slate-600 p-2 pr-8 placeholder-text-black rounded focus:outline-none text-black appearance-none"
                value={condition}
                name="condition"
                onChange={(e) => setCondition(e.target.value)}
              >
                <option value="equal">Equal</option>
                <option value="greater">Greater</option>{" "}
                <option value="smaller">Smaller</option>{" "}
                <option value="greater_equal">Greater than or equal</option>{" "}
                <option value="smaller_equal">
                  Smaller than or equal
                </option>{" "}
              </select>
              <ChevronDownIcon
                size={20}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none"
              />
            </div>
          </div>
        </form>

        <div className="mb-4 flex gap-4 justify-start">
          <input
            id="tag_name"
            type="text"
            placeholder="Enter tag name"
            className="w-40 border border-slate-600 p-2 placeholder-text-black rounded focus:outline-none text-black disabled:opacity-50 disabled:cursor-not-allowed"
            value={tag}
            onChange={(e) => {
              setTag(e.target.value);
            }}
            disabled={isTagAllButtonDisabled}
          />
          <button
            onClick={() => addTag(filteredData)}
            disabled={isTagAllButtonDisabled}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tag All ({filteredData.length})
          </button>
        </div>

        <div className="grow overflow-auto">
          {columnHeaders.length > 0 && filteredData.length > 0 ? (
            <table className="min-w-full divide-y divide-slate-700 text-text-primary ">
              <thead className="bg-black sticky top-0">
                <tr>
                  {columnHeaders.map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-secondary-background divide-y divide-slate-600">
                {filteredData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-slate-700/50">
                    {columnHeaders.map((header) => (
                      <td
                        key={header}
                        title={row[header] ?? ""}
                        className={`px-6 py-4 whitespace-nowrap text-sm max-w-64 truncate`}
                      >
                        {cellValue(row, header)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot className="sticky bottom-0 bg-black">
                <tr>
                  <td className="text-sm text-white pl-6">Total</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className="text-sm text-white pl-6">
                    {debit ? formatCurrency(debit ?? null) : "N/A"}
                  </td>
                  <td className="text-sm text-white pl-6">
                    {credit ? formatCurrency(credit ?? null) : "N/A"}
                  </td>
                  <td></td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          ) : (
            <div className="flex items-center justify-center h-full text-text-secondary">
              {(!parsedData || parsedData.length === 0) &&
              !searchTerm &&
              amount === "" ? (
                <p>
                  Upload data and it will appear here. Then use filters to
                  search.
                </p>
              ) : (
                <p>No data found matching your criteria.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default TagModal;
