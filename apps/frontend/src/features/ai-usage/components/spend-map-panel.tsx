"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import type {
  SpendDimension,
  SpendGroup,
  SpendItem,
  SpendModelMix,
  SpendWorkspace,
} from "../types/ai-usage";
import { scopeGroupToModel } from "../utils/spend";
import { SpendDetailCard } from "./spend-detail-card";
import { SpendMapCard } from "./spend-map-card";

const ALL_MODELS = "all";

type SpendMapPanelProps = {
  workspace: SpendWorkspace;
  groups: SpendGroup[];
  modelMix: SpendModelMix;
};

function topByCost(items: SpendItem[]) {
  return [...items].sort((a, b) => b.cost - a.cost)[0];
}

export function SpendMapPanel({
  workspace,
  groups,
  modelMix,
}: SpendMapPanelProps) {
  const [modelId, setModelId] = useState(ALL_MODELS);
  const [groupId, setGroupId] = useState<SpendDimension>("teams");
  const [itemId, setItemId] = useState<string>();
  const [detailsOpen, setDetailsOpen] = useState(false);

  const models = groups.find((group) => group.id === "models")?.items ?? [];
  const model = models.find((entry) => entry.id === modelId);
  const flowGroups = groups
    .filter((group) => group.id !== "models")
    .map((group) =>
      model ? scopeGroupToModel(group, model, modelMix) : group,
    );

  const itemSlots = Math.max(
    ...groups
      .filter((group) => group.id !== "models")
      .map((group) => group.items.length),
  );

  const selectedGroup =
    flowGroups.find((group) => group.id === groupId) ?? flowGroups[0];
  const selectedItem =
    selectedGroup?.items.find((item) => item.id === itemId) ??
    (selectedGroup && topByCost(selectedGroup.items));

  if (!selectedGroup || !selectedItem) return null;

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <SpendMapCard
        workspace={workspace}
        models={models}
        modelId={modelId}
        onModelChange={setModelId}
        groups={flowGroups}
        itemSlots={itemSlots}
        selectedGroup={selectedGroup}
        selectedItem={selectedItem}
        onSelectGroup={(group) => {
          setGroupId(group.id);
          setItemId(topByCost(group.items)?.id);
        }}
        onSelectItem={(item) => setItemId(item.id)}
        onOpenDetails={(item) => {
          setItemId(item.id);
          setDetailsOpen(true);
        }}
      />
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xl">
          <DialogDescription className="sr-only">
            Usage details for {selectedItem.name}
          </DialogDescription>
          <SpendDetailCard
            workspace={workspace}
            group={selectedGroup}
            item={selectedItem}
            model={model}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
