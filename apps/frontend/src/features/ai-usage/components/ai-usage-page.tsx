import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import {
  spendGroups,
  spendModelMix,
  spendWorkspace,
} from "@/mocks/ai-usage.mock";
import { SpendMapPanel } from "./spend-map-panel";

export function AiUsagePage() {
  return (
    <AppBody>
      <PageHeading
        title="AI Usage"
        currentPage="AI Usage"
        description="Where this month's AI spend goes, by model, team, agent and API key."
      />
      <SpendMapPanel
        workspace={spendWorkspace}
        groups={spendGroups}
        modelMix={spendModelMix}
      />
    </AppBody>
  );
}
