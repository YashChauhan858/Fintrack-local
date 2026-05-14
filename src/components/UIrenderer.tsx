import useStore from "@/store/store";
import StatementDataContainer from "./StatementDataContainer/StatementDataContainer";

import { lazy, Suspense } from "react";
import LLMConfigForm from "./LLMConfigForm";
const Connected = lazy(() => import("@/components/Connected"));

const UIrenderer = () => {
  const llmUrl = useStore((state) => state.llmURL);
  const summery = useStore((state) => state.summery);

  if (summery) return <StatementDataContainer />;

  if (llmUrl)
    return (
      <Suspense fallback="...loading">
        <Connected />
      </Suspense>
    );

  return <LLMConfigForm />;
};

export default UIrenderer;
