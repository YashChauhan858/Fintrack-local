import type {
  IAiHeadersAnalysis,
  Transaction,
  TSummary,
} from "@/types/component.types";
import { create } from "zustand";

interface IState {
  llmURL: string;
  model: string;
  summery: TSummary | null;
  parsedData: Transaction[] | null;
  aiHeaderInterpretation: IAiHeadersAnalysis | null;
}

interface IActions {
  update: <T extends keyof IState>(key: T, value: IState[T]) => void;
}

type Store = IState & IActions;

const useStore = create<Store>()((set) => ({
  llmURL: "",
  model: "",
  summery: null,
  parsedData: null,
  aiHeaderInterpretation: null,
  update: (key, value) =>
    set((state) => {
      return { ...state, [key]: value };
    }),
}));

export default useStore;
