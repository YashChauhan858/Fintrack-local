import { useState } from "react";
import useStore from "../store/store";

export default function LLMConfigForm() {
  const globalLLMURL = useStore((state) => state.llmURL);
  const update = useStore((state) => state.update);

  const [error, setError] = useState("");
  const [llmURL, setllmURL] = useState(globalLLMURL ?? "");

  const submit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (llmURL) {
      update("llmURL", llmURL);
    } else {
      setError("Please enter valid input");
    }
  };

  return (
    <div className="p-8 relative w-full max-w-160 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl z-10">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-4xl font-bold tracking-tight text-white"
          aria-live="polite"
        >
          Connect Local LLM
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Securely analyze financial statements and transaction data using your
          locally running AI model. Your data stays on your machine for maximum
          privacy and control.
        </p>
      </div>

      <form className="space-y-5" onSubmit={submit}>
        <div>
          <label
            className="mb-2 block text-sm font-medium text-slate-300"
            htmlFor="llm-url"
          >
            LLM URL
          </label>

          <input
            aria-describedby="llm-url-help llm-url-error"
            aria-invalid={!!error}
            id="llm-url"
            type="url"
            inputMode="url"
            value={llmURL}
            onChange={({ target: { value } }) => setllmURL(value)}
            placeholder="Enter URL"
            className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20"
          />
          {error && (
            <p id="llm-url-error" role="alert" className="text-red-400 mt-4">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="h-14 w-full rounded-2xl bg-blue-400 cursor-pointer text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.01] hover:shadow-lg hover:shadow-cyan-500/20"
        >
          Continue
        </button>
      </form>

      {/* Form */}

      {/* Footer Hint */}
      <div className="mt-6 rounded-2xl border border-white/5 bg-black/20 p-4">
        <p className="text-xs leading-5 text-slate-400" id="llm-url-help">
          Example:
          <span className="ml-1 font-medium text-slate-300">
            http://localhost:11434
          </span>
        </p>
      </div>
    </div>
  );
}
