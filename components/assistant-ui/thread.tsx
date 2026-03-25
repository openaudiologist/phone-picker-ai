"use client";

import type { FC, ReactNode } from "react";
import {
  ArrowDownIcon,
  LoaderIcon,
  ShieldIcon,
  Smartphone,
  UserIcon,
} from "lucide-react";
import {
  AuiIf,
  ErrorPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  getExternalStoreMessage,
  useAuiState,
} from "@assistant-ui/react";
import "@assistant-ui/react-markdown/styles/dot.css";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { MarkdownText } from "@/components/assistant-ui/markdown-text";
import { ToolFallback } from "@/components/assistant-ui/tool-fallback";
import {
  UserMessageAttachments,
} from "@/components/assistant-ui/attachment";
import { cn } from "@/lib/utils";
import type { ChatFlowMessage } from "@/types";

interface ThreadProps {
  welcomeFooter?: ReactNode;
  renderAccessory?: (message: ChatFlowMessage) => ReactNode;
}

export default function Thread({ welcomeFooter, renderAccessory }: ThreadProps) {
  return (
    <ThreadPrimitive.Root
      className="flex h-full flex-col bg-background text-sm"
      style={{
        ["--thread-max-width" as string]: "32rem",
        ["--accent-color" as string]: "hsl(var(--accent))",
        ["--accent-foreground" as string]: "hsl(var(--accent-foreground))",
      }}
    >
      <ThreadPrimitive.Viewport
        turnAnchor="top"
        className="relative flex flex-1 flex-col overflow-x-auto overflow-y-scroll scroll-smooth px-4 pt-4"
      >
        <AuiIf condition={(s) => s.thread.isEmpty}>
          <div className="flex flex-1 flex-col items-center justify-center">
            <ThreadWelcome />
            {welcomeFooter ? (
              <div className="mx-auto w-full max-w-[var(--thread-max-width)] py-4">
                {welcomeFooter}
              </div>
            ) : null}
          </div>
        </AuiIf>

        <ThreadPrimitive.Messages>
          {() => <ThreadMessage renderAccessory={renderAccessory} />}
        </ThreadPrimitive.Messages>

        <ThreadPrimitive.ViewportFooter className="sticky bottom-0 mx-auto flex w-full max-w-[var(--thread-max-width)] flex-col gap-4 overflow-visible pb-4">
          <ThreadScrollToBottom />
        </ThreadPrimitive.ViewportFooter>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
}

const ThreadMessage: FC<{
  renderAccessory?: (message: ChatFlowMessage) => ReactNode;
}> = ({ renderAccessory }) => {
  const role = useAuiState((s) => s.message.role);

  if (role === "user") return <UserMessage />;

  return <AssistantMessageWithAccessory renderAccessory={renderAccessory} />;
};

const AssistantMessageWithAccessory: FC<{
  renderAccessory?: (message: ChatFlowMessage) => ReactNode;
}> = ({ renderAccessory }) => {
  return (
    <MessagePrimitive.Root
      className="relative mx-auto w-full max-w-[var(--thread-max-width)] pt-2 fade-in slide-in-from-bottom-1 animate-in duration-150"
      data-role="assistant"
    >
      <div className="flex gap-3">
        <Avatar className="mt-0.5 size-8 shrink-0 border border-border/50">
          <AvatarFallback className="bg-[#60a5fa] text-white">
            <ShieldIcon className="size-4" />
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="break-words text-foreground">
            <MessagePrimitive.Parts
              components={{
                Text: MarkdownText,
                tools: { Fallback: ToolFallback },
              }}
            />
            <MessageError />
            <AuiIf
              condition={(s) =>
                s.thread.isRunning && s.message.content.length === 0
              }
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <LoaderIcon className="size-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </AuiIf>
          </div>




        </div>
      </div>

      <MessageAccessory renderAccessory={renderAccessory} />
    </MessagePrimitive.Root>
  );
};

const MessageAccessory: FC<{
  renderAccessory?: (message: ChatFlowMessage) => ReactNode;
}> = ({ renderAccessory }) => {
  if (!renderAccessory) return null;

  return (
    <MessagePrimitive.If assistant>
      <MessageAccessoryInner renderAccessory={renderAccessory} />
    </MessagePrimitive.If>
  );
};

const MessageAccessoryInner: FC<{
  renderAccessory: (message: ChatFlowMessage) => ReactNode;
}> = ({ renderAccessory }) => {
  const message = useAuiState((s) => s.message);
  const externalMessage = getExternalStoreMessage(message) as
    | ChatFlowMessage
    | undefined;
  if (!externalMessage) return null;

  const accessory = renderAccessory(externalMessage);
  if (!accessory) return null;

  return <div className="mt-1 pl-11">{accessory}</div>;
};

function ThreadWelcome() {
  return (
    <div className="mx-auto w-full max-w-[var(--thread-max-width)] py-4">
      <div className="mb-4 flex items-center gap-2">
        <Smartphone className="size-7 text-muted-foreground" />
      </div>
      <div className="text-2xl font-semibold">PhonePicker AI</div>
      <div className="text-2xl text-muted-foreground/65">
        Find your perfect phone for India
      </div>
    </div>
  );
}

function ThreadScrollToBottom() {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip="Scroll to bottom"
        variant="outline"
        className="absolute -top-12 z-10 self-center rounded-full p-4 disabled:invisible"
      >
        <ArrowDownIcon />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  );
}

function UserMessage() {
  return (
    <MessagePrimitive.Root
      className="mx-auto grid w-full max-w-[var(--thread-max-width)] auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] content-start gap-y-2 px-2 py-4 fade-in slide-in-from-bottom-1 animate-in duration-150"
      data-role="user"
    >
      <UserMessageAttachments />

      <div className="relative col-start-2 flex items-start gap-3 min-w-0">
        <div className="rounded-2xl bg-[#06233a] px-4 py-2.5 break-words text-foreground">
          <MessagePrimitive.Parts />
        </div>
        <Avatar className="mt-0.5 size-8 shrink-0 border border-border/50">
          <AvatarFallback className="bg-[#38bdf8] text-white">
            <UserIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
      </div>
    </MessagePrimitive.Root>
  );
}



function MessageError() {
  return (
    <MessagePrimitive.Error>
      <ErrorPrimitive.Root className="mt-2 rounded-md border border-destructive bg-destructive/10 p-3 text-destructive text-sm dark:bg-destructive/5 dark:text-red-200">
        <ErrorPrimitive.Message className="line-clamp-2" />
      </ErrorPrimitive.Root>
    </MessagePrimitive.Error>
  );
}


