"use client";

import type { ReactNode } from "react";
import { MessagePartPrimitive, MessagePrimitive } from "@assistant-ui/react";
import { SparklesIcon } from "@/components/ui/sparkles";

interface AssistantBubbleProps {
  accessory?: ReactNode;
}

export default function AssistantBubble({ accessory }: AssistantBubbleProps) {
  return (
    <MessagePrimitive.Root className="mb-5 flex w-full justify-start" data-role="assistant">
      <div className="flex max-w-[95%] items-start gap-3 sm:max-w-[88%]">
        <div
          className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          style={{
            background: "linear-gradient(135deg, rgba(139,92,246,0.22), rgba(96,165,250,0.18))",
            border: "0.5px solid rgba(167,139,250,0.35)",
            color: "#c4b5fd",
            boxShadow: "0 10px 26px rgba(91,33,182,0.22)",
          }}
        >
          <SparklesIcon size={16} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div
            className="glass-card px-4 py-3.5 sm:px-5"
            style={{
              borderRadius: 24,
              background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.035))",
            }}
          >
            <div className="section-kicker mb-2">PhonePicker AI</div>
            <MessagePrimitive.Parts>
              {({ part }) => {
                if (part.type !== "text") return null;

                return (
                  <p
                    style={{
                      margin: 0,
                      whiteSpace: "pre-wrap",
                      color: "rgba(255,255,255,0.86)",
                      fontSize: 14,
                      lineHeight: 1.72,
                    }}
                  >
                    <MessagePartPrimitive.Text />
                    <MessagePartPrimitive.InProgress>
                      <span style={{ color: "rgba(255,255,255,0.45)" }}> ●</span>
                    </MessagePartPrimitive.InProgress>
                  </p>
                );
              }}
            </MessagePrimitive.Parts>
          </div>

          {accessory ? <div className="pl-0.5">{accessory}</div> : null}
        </div>
      </div>
    </MessagePrimitive.Root>
  );
}
