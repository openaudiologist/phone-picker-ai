"use client";

import { useEffect, useRef, useState, type FC, type ReactNode } from "react";
import {
  ArrowDownIcon,
  LoaderIcon,
  Smartphone,
  UserIcon,
} from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { SmartPhone01Icon } from "@hugeicons/core-free-icons";
import {
  AuiIf,
  ErrorPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  getExternalStoreMessage,
  useAuiState,
} from "@assistant-ui/react";

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
  welcomeHeader?: ReactNode;
  welcomeFooter?: ReactNode;
  renderAccessory?: (message: ChatFlowMessage) => ReactNode;
  scrollAnchorMessageId?: string | null;
  scrollAnchorTurnKey?: string | null;
}

export default function Thread({ welcomeHeader, welcomeFooter, renderAccessory, scrollAnchorMessageId, scrollAnchorTurnKey }: ThreadProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);

  return (
    <ThreadPrimitive.Root
      className="flex h-full min-h-0 flex-col overflow-hidden bg-background text-sm"
      style={{
        ["--thread-max-width" as string]: "32rem",
        ["--accent-color" as string]: "var(--accent)",
        ["--accent-foreground" as string]: "var(--accent-foreground)",
      }}
    >
      <ThreadPrimitive.Viewport
        ref={viewportRef}
        turnAnchor="top"
        autoScroll={false}
        scrollToBottomOnRunStart={false}
        scrollToBottomOnInitialize={false}
        scrollToBottomOnThreadSwitch={false}
        data-slot="thread-viewport"
        className="relative flex min-h-0 flex-1 flex-col overflow-x-auto overflow-y-auto px-4 pt-4"
      >
        <ThreadAssistantTurnScroller
          viewportRef={viewportRef}
          scrollAnchorMessageId={scrollAnchorMessageId}
          scrollAnchorTurnKey={scrollAnchorTurnKey}
        />
        <AuiIf condition={(s) => s.thread.isEmpty}>
          <div className="flex flex-1 flex-col items-center justify-center">
            {welcomeHeader ? (
              <div className="mx-auto w-full max-w-[var(--thread-max-width)] pb-4">
                {welcomeHeader}
              </div>
            ) : null}
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

        <ThreadPrimitive.ViewportFooter className="sticky bottom-0 mx-auto flex w-full max-w-[var(--thread-max-width)] flex-col gap-4 overflow-visible pb-8">
          <ThreadScrollToBottom />
        </ThreadPrimitive.ViewportFooter>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
}

function ThreadAssistantTurnScroller({
  viewportRef,
  scrollAnchorMessageId,
  scrollAnchorTurnKey,
}: {
  viewportRef: React.RefObject<HTMLDivElement | null>;
  scrollAnchorMessageId?: string | null;
  scrollAnchorTurnKey?: string | null;
}) {
  const previousAnchorRef = useRef<string | null>(null);
  const previousTurnKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!scrollAnchorMessageId) {
      previousAnchorRef.current = null;
      previousTurnKeyRef.current = null;
      return;
    }

    const previousAnchor = previousAnchorRef.current;
    const previousTurnKey = previousTurnKeyRef.current;

    if (
      previousAnchor === scrollAnchorMessageId &&
      previousTurnKey === (scrollAnchorTurnKey ?? null)
    ) {
      return;
    }

    previousAnchorRef.current = scrollAnchorMessageId;
    previousTurnKeyRef.current = scrollAnchorTurnKey ?? null;

    const runScroll = (behavior: ScrollBehavior) => {
      const viewport = viewportRef.current;
      if (!viewport) {
        return;
      }

      const target = Array.from(
        viewport.querySelectorAll<HTMLElement>("[data-message-id]")
      ).find((element) => element.dataset.messageId === scrollAnchorMessageId);

      if (!target) {
        return;
      }

      const viewportTop = viewport.getBoundingClientRect().top;
      const targetTop = target.getBoundingClientRect().top;
      const nextScrollTop = viewport.scrollTop + (targetTop - viewportTop) - 8;

      if (Math.abs(viewport.scrollTop - nextScrollTop) < 4) {
        return;
      }

      viewport.scrollTo({
        top: Math.max(0, nextScrollTop),
        behavior,
      });
    };

    let frameTwo = 0;
    const frameOne = requestAnimationFrame(() => {
      frameTwo = requestAnimationFrame(() => {
        runScroll(previousAnchor ? "smooth" : "instant");
      });
    });

    return () => {
      cancelAnimationFrame(frameOne);
      cancelAnimationFrame(frameTwo);
    };
  }, [scrollAnchorMessageId, scrollAnchorTurnKey, viewportRef]);

  return null;
}

function useMessageVerticalAlignment() {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isMultiline, setIsMultiline] = useState(false);

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const measure = () => {
      const style = window.getComputedStyle(node);
      const lineHeight = Number.parseFloat(style.lineHeight);
      const height = node.getBoundingClientRect().height;
      const nextIsMultiline = Number.isFinite(lineHeight) && lineHeight > 0
        ? height > lineHeight * 1.5
        : height > 28;

      setIsMultiline((currentValue) =>
        currentValue === nextIsMultiline ? currentValue : nextIsMultiline
      );
    };

    measure();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(measure);
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return { contentRef, isMultiline };
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
  const { contentRef, isMultiline } = useMessageVerticalAlignment();

  return (
    <MessagePrimitive.Root
      className="relative mx-auto w-full max-w-[var(--thread-max-width)] pt-2 fade-in slide-in-from-bottom-1 animate-in duration-150"
      data-role="assistant"
    >
      <div className={cn("flex gap-3", isMultiline ? "items-start" : "items-center") }>
        <Avatar
          className={cn(
            "size-8 shrink-0 border border-border/50",
            isMultiline ? "mt-0.5 self-start" : "self-center"
          )}
        >
          <AvatarFallback className="bg-primary text-primary-foreground">
            <HugeiconsIcon icon={SmartPhone01Icon} className="size-4" />
          </AvatarFallback>
        </Avatar>

        <div ref={contentRef} className="min-w-0 flex-1">
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

  return <div className="mt-4 pl-0 sm:pl-11">{accessory}</div>;
};

function ThreadWelcome() {
  return (
    <div className="mx-auto w-full max-w-[var(--thread-max-width)] py-4">
      <div className="mb-4 flex items-center gap-2">
        <Smartphone className="size-7 text-muted-foreground" />
      </div>
      <div className="text-2xl font-semibold">PhonePicker AI</div>
      <div className="text-2xl text-muted-foreground/65">
        Find your perfect phone
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
  const { contentRef, isMultiline } = useMessageVerticalAlignment();

  return (
    <MessagePrimitive.Root
      className="mx-auto grid w-full max-w-[var(--thread-max-width)] auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] content-start gap-y-2 px-2 py-4 fade-in slide-in-from-bottom-1 animate-in duration-150"
      data-role="user"
    >
      <UserMessageAttachments />

      <div className={cn("relative col-start-2 flex gap-3 min-w-0", isMultiline ? "items-start" : "items-center")}>
        <div
          ref={contentRef}
          className="rounded-xl bg-secondary px-4 py-2.5 break-words text-secondary-foreground"
        >
          <MessagePrimitive.Parts />
        </div>
        <Avatar
          className={cn(
            "size-8 shrink-0 border border-border/50",
            isMultiline ? "mt-0.5 self-start" : "self-center"
          )}
        >
          <AvatarFallback className="bg-accent text-accent-foreground">
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
      <ErrorPrimitive.Root className="mt-2 rounded-lg border border-destructive bg-destructive/10 p-3 text-destructive text-sm dark:bg-destructive/5 dark:text-destructive-foreground">
        <ErrorPrimitive.Message className="line-clamp-2" />
      </ErrorPrimitive.Root>
    </MessagePrimitive.Error>
  );
}


