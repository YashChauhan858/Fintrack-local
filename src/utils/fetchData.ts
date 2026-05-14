import useStore from "@/store/store";
import { type ListResponse } from "ollama/browser";
import { generatePrompt } from "./prompt";
import type {
  IAiHeadersAnalysis,
  Transaction,
  TSummary,
} from "@/types/component.types";
import { parseCsv } from "@/utils/utils";
import BankStatementAnalyzer from "./BankStatement";

function extract(response: string): any {
  const match = response.match(/<mapping>\s*([\s\S]*?)\s*<\/mapping>/);
  if (!match) throw new Error("No <mapping> tag found in response");
  return JSON.parse(match[1]);
}

const testHeader = [
  "paisa aya",
  "paisa gaya",
  "paise aane ke date",
  "paise jaane ke date",
  "address",
];

export const headerAnalyzer = async (
  header: string[] = testHeader,
): Promise<[IAiHeadersAnalysis | null, null | unknown]> => {
  const model = useStore.getState().model;
  if (!model) return [null, new Error("No model provided.")];

  const { Ollama } = await import("ollama/browser");
  const ollama = new Ollama();

  try {
    const data = await ollama.chat({
      model: model,
      messages: [
        {
          role: "user",
          content: generatePrompt(header),
        },
      ],
    });
    return [extract(data?.message.content), null];
  } catch (error) {
    return [null, error];
  }
};

export const getOllamaList = async (
  host: string,
): Promise<[ListResponse | null, null | unknown]> => {
  if (!host?.trim()) {
    return [null, new Error("No Host provided")];
  }
  const { Ollama } = await import("ollama/browser");

  try {
    const ollama = new Ollama({
      host: host.trim(),
    });
    const list = await ollama.list();

    return [list, null];
  } catch (error) {
    return [null, error];
  }
};

export const handleFile = async (
  files: File,
): Promise<
  [
    {
      summery: TSummary | null;
      parsedData: Transaction[] | null;
      aiHeaderInterpretation: IAiHeadersAnalysis;
    } | null,
    null | unknown,
  ]
> => {
  try {
    const parsedData = await parseCsv(files);

    const headers = Object.keys(parsedData[0] || {});

    const [aiHeaderInterpretation, error] = await headerAnalyzer(headers);

    if (!aiHeaderInterpretation || error) return [null, error];

    const bankStatement = new BankStatementAnalyzer(
      parsedData,
      aiHeaderInterpretation,
    );

    const summery = bankStatement.analyze();
    console.log({ aiHeaderInterpretation });
    return [{ summery, parsedData, aiHeaderInterpretation }, null];
  } catch (error) {
    return [null, error];
  }
};
