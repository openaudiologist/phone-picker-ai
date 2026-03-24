"use client";

import type { ReactNode } from "react";
import { MessagePrimitive, MessagePartPrimitive } from "@assistant-ui/react";

interface UserBubbleProps {
  accessory?: ReactNode;
}

export default function UserBubble({ accessory }: UserBubbleProps) {
  return (
    <MessagePrimitive.Root className="mb-5 flex w-full justify-end" data-role="user">
      <div className="flex max-w-[92%] flex-col items-end gap-2 sm:max-w-[72%]">
        <div
          className="px-4 py-2.5"
          style={{
            borderRadius: 999,
            background: "linear-gradient(135deg, rgba(139,92,246,0.92), rgba(99,102,241,0.88))",
            border: "1px solid rgba(196,181,253,0.24)",
            boxShadow: "0 14px 32px rgba(79,70,229,0.2)",
          }}
        >
          <MessagePrimitive.Parts>
            {({ part }) => {
              if (part.type !== "text") return null;

              return (
                <p
                  style={{
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    color: "rgba(255,255,255,0.98)",
                    fontSize: 12,
                    lineHeight: 1.5,
                    fontWeight: 500,
                  }}
                >
                  <MessagePartPrimitive.Text />
                </p>
              );
            }}
          </MessagePrimitive.Parts>
        </div>
        {accessory ? <div className="w-full">{accessory}</div> : null}
      </div>
    </MessagePrimitive.Root>
  );
}
