import { useCallback, useEffect, useState } from "react";
import useStore from "@/store/store";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getOllamaList } from "@/utils/fetchData";
import DragAndDropUpload from "./FileDropper";
import { cn } from "@/lib/utils";
import ResetBtn from "./global/ResetBtn";
import { EventBus } from "@/utils/EventBus";

const Connected = () => {
  const [statementLoader, setStatementLoader] = useState(false);
  const llmGlobalURL = useStore((state) => state.llmURL);
  const model = useStore((state) => state.model);
  const update = useStore((state) => state.update);
  const [list, setList] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  const fetchList = useCallback(async () => {
    if (!llmGlobalURL) {
      setError("No connection url provided");
      return;
    }

    const [data, error] = await getOllamaList(llmGlobalURL);

    if (!data || error) {
      setError((error as Error)?.message ?? "Unable to get model list");
      return;
    }

    setList(data.models.map((e) => e.model));
    setError("");
  }, [llmGlobalURL]);

  useEffect(() => {
    queueMicrotask(() => {
      fetchList();
    });
    const unSub = EventBus.subscribe({
      eventName: "loading-data",
      cb: (e) => {
        setStatementLoader(e?.detail?.loading ?? false);
      },
    });
    return () => {
      if (unSub) unSub();
    };
  }, [fetchList]);

  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl z-10 relative">
      {statementLoader && (
        <div className="absolute top-0 left-0 h-full w-full z-10 grid place-content-center bg-black/50 backdrop-blur-2xl">
          <div className="loader"></div>{" "}
        </div>
      )}

      {error && (
        <div
          className="absolute top-5 right-5 z-9"
          title="run: ollama start in your local terminal and retry"
        >
          <ResetBtn onClick={fetchList} />
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              `h-2.5 w-2.5 rounded-full animate-pulse`,
              error ? "bg-red-300" : "bg-emerald-400",
            )}
          />
          <p
            className={cn(
              `text-sm font-medium tracking-wide`,
              error ? "text-red-300" : "text-emerald-400",
            )}
          >
            {error ? "Connection Inactive" : "Connection Active"}
          </p>
        </div>

        <h1
          className="text-3xl font-bold tracking-tight text-white"
          aria-live="assertive"
        >
          LLM Connected
        </h1>

        <p className="text-sm leading-relaxed text-slate-300">
          Your local Ollama instance is connected successfully. Select a model
          to start analyzing financial data securely on-device.
        </p>
      </div>

      <div className="mt-8 space-y-3">
        <label
          htmlFor="model-select"
          className="block text-sm font-medium text-slate-200"
        >
          Select Model
        </label>

        <Select
          value={model}
          onValueChange={(value) => value && update("model", value)}
        >
          <SelectTrigger
            id="model-select"
            className="h-12 w-full rounded-md border border-white/10 bg-black/20 text-white backdrop-blur-md transition-all focus:ring-2 focus:ring-blue-500"
          >
            <SelectValue placeholder="Choose an Ollama model" />
          </SelectTrigger>

          <SelectContent className="border border-white/10 bg-slate-900/95 text-white backdrop-blur-xl">
            <SelectGroup>
              <SelectLabel className="text-slate-400">
                Available Models
              </SelectLabel>

              {list.map((model) => (
                <SelectItem
                  key={model}
                  value={model}
                  className="cursor-pointer rounded-lg focus:bg-white/10"
                >
                  {model}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {error && (
          <p aria-live="polite" className="text-red-400 mt-4 mb-4">
            {error}
          </p>
        )}
      </div>

      {model && (
        <div
          aria-live="polite"
          className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 backdrop-blur-md"
        >
          <p className="text-sm text-emerald-200">
            Selected model:
            <span className="ml-1 font-semibold text-white">{model}</span>
          </p>
        </div>
      )}

      {model && <DragAndDropUpload />}
    </div>
  );
};

export default Connected;
