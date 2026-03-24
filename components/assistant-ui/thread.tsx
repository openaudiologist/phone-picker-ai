"use client";

import type { ReactNode } from "react";
import {
  AuiIf,
  ThreadPrimitive,
  getExternalStoreMessage,
} from "@assistant-ui/react";
import AssistantBubble from "../chat/AssistantBubble";
import UserBubble from "../chat/UserBubble";
import type { ChatFlowMessage } from "@/types";

interface ThreadProps {
  footer?: ReactNode;
  emptyState?: ReactNode;
  renderAccessory?: (message: ChatFlowMessage) => ReactNode;
}

export default function Thread({
  footer,
  emptyState,
  renderAccessory,
}: ThreadProps) {
  return (
    <ThreadPrimitive.Root className="surface-shell flex min-h-0 flex-1 flex-col overflow-hidden rounded-none sm:rounded-[34px]">
      <ThreadPrimitive.Viewport className="app-scrollbar flex flex-1 flex-col overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <ThreadPrimitive.Empty>
          {emptyState ?? (
            <div className="flex min-h-[320px] items-center justify-center text-center">
              <div className="glass-card max-w-sm px-5 py-6">
                <p className="section-kicker mb-3">Conversation ready</p>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.7 }}>
                  Your guided phone search will unfold here — clean, conversational, and gloriously form-free.
                </p>
              </div>
            </div>
          )}
        </ThreadPrimitive.Empty>

        <ThreadPrimitive.Messages>
          {({ message }) => {
            const externalMessage = getExternalStoreMessage(message) as
              | ChatFlowMessage
              | undefined;
            const accessory = externalMessage
              ? renderAccessory?.(externalMessage)
              : null;

            if (message.role === "user") {
              return <UserBubble accessory={accessory} />;
            }

            return <AssistantBubble accessory={accessory} />;
          }}
        </ThreadPrimitive.Messages>

        <AuiIf condition={(state) => !state.thread.isEmpty}>
          <div className="min-h-6 grow" />
        </AuiIf>

        <ThreadPrimitive.ViewportFooter className="sticky bottom-0 mt-5 border-t border-white/5 bg-[linear-gradient(180deg,rgba(13,8,24,0.55),rgba(13,8,24,0.95))] px-1 pb-1 pt-4 backdrop-blur-2xl">
          <div className="relative flex flex-col gap-3">
            <ThreadPrimitive.ScrollToBottom
              className="absolute -top-12 right-2 inline-flex h-9 items-center justify-center rounded-full border border-white/10 bg-[rgba(18,10,35,0.92)] px-3 text-xs text-[rgba(255,255,255,0.65)] shadow-[0_12px_28px_rgba(6,4,15,0.34)] transition hover:border-white/20 hover:text-white"
            >
              Latest
            </ThreadPrimitive.ScrollToBottom>
            {footer}
          </div>
        </ThreadPrimitive.ViewportFooter>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
}
