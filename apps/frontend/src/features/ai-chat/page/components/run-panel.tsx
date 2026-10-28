import { CheckIcon, CircleIcon, PlugIcon } from "lucide-react";

import {
  Attachment,
  AttachmentContent,
  AttachmentGroup,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { Badge } from "@/components/ui/badge";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Message,
  MessageContent,
  MessageHeader,
} from "@/components/ui/message";
import { Spinner } from "@/components/ui/spinner";
import { Trace, TraceIcon, TraceLine, TraceTitle } from "@/components/ui/trace";
import { aiChatModels } from "@/mocks/ai-chat.mock";
import { AssistantAvatar, ThinkingIndicator } from "./chat-message";
import type { ConnectedRun } from "../types/connected-apps";
import { getApp, getMode } from "../utils/connected-apps";
import { AppLogo } from "./app-logo";

export function RunPanel({
  run,
  connected,
  onConnect,
}: {
  run: ConnectedRun;
  connected: string[];
  onConnect: (appId: string) => void;
}) {
  const mode = getMode(run.modeId);
  const model = aiChatModels.find((item) => item.value === run.modelId);

  return (
    <article
      className="flex flex-col gap-6"
      aria-label={`Jawaban untuk: ${run.prompt}`}
    >
      <Message align="end">
        <MessageContent>
          {run.files.length > 0 && (
            <AttachmentGroup className="justify-end">
              {run.files.map((file) => (
                <Attachment key={file.id} size="sm">
                  <AttachmentContent>
                    <AttachmentTitle>{file.name}</AttachmentTitle>
                  </AttachmentContent>
                </Attachment>
              ))}
            </AttachmentGroup>
          )}
          <Bubble align="end">
            <BubbleContent className="whitespace-pre-line">
              {run.prompt}
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>

      <Message>
        <AssistantAvatar />
        <MessageContent>
          <MessageHeader className="gap-2 px-0">
            <Badge variant="secondary">{mode.label}</Badge>
            {model?.label}
          </MessageHeader>
          <Trace aria-label="Langkah kerja">
            {mode.steps.map((step, index) => {
              const status =
                index < run.stepIndex
                  ? "done"
                  : index === run.stepIndex
                    ? "running"
                    : "pending";
              return (
                <div key={step}>
                  <TraceLine status={status === "done" ? undefined : status}>
                    <TraceIcon>
                      {status === "done" ? (
                        <CheckIcon className="text-primary-text" />
                      ) : status === "running" ? (
                        <Spinner />
                      ) : (
                        <CircleIcon />
                      )}
                    </TraceIcon>
                    <TraceTitle>{step}</TraceTitle>
                  </TraceLine>
                </div>
              );
            })}
          </Trace>

          {run.status !== "working" && (
            <Bubble variant="ghost">
              <BubbleContent
                className="whitespace-pre-line"
                aria-busy={run.status === "answering" || undefined}
              >
                {run.answer || <ThinkingIndicator label="Menulis jawaban…" />}
              </BubbleContent>
            </Bubble>
          )}

          {run.status === "done" && (
            <section
              aria-label="Sumber yang dipakai"
              className="flex flex-col gap-2"
            >
              <h3 className="text-xs font-medium text-muted-foreground">
                Sumber
              </h3>
              <ItemGroup className="gap-2">
                {run.receipts.map((receipt) => {
                  const app = getApp(receipt.appId);
                  const isConnected = connected.includes(receipt.appId);
                  return (
                    <Item
                      key={receipt.appId}
                      variant="outline"
                      size="xs"
                      role="listitem"
                    >
                      <ItemMedia>
                        <AppLogo
                          appId={receipt.appId}
                          muted={receipt.state === "skipped"}
                        />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>{app?.name}</ItemTitle>
                        <ItemDescription>
                          {receipt.state === "read"
                            ? `Dibaca · ${receipt.items} ${app?.reads}`
                            : "Dilewati · belum terhubung"}
                        </ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        {receipt.state === "read" ? (
                          <CheckIcon
                            className="size-4 text-primary-text"
                            aria-label="Dibaca"
                          />
                        ) : isConnected ? (
                          <Badge variant="secondary">
                            Terhubung · kirim ulang
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onConnect(receipt.appId)}
                          >
                            <PlugIcon data-icon="inline-start" />
                            Hubungkan
                          </Button>
                        )}
                      </ItemActions>
                    </Item>
                  );
                })}
              </ItemGroup>
            </section>
          )}
        </MessageContent>
      </Message>
    </article>
  );
}
