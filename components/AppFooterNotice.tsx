import Link from "next/link";
import { Info } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function AppFooterNotice() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-2 z-50 flex justify-center px-3 sm:bottom-3 sm:px-4">
      <Card
        size="sm"
        role="note"
        aria-label="PhonePicker AI disclaimer"
        className="pointer-events-auto max-w-[min(960px,calc(100vw-1.5rem))] border-border/70 bg-background/88 px-3 py-2 text-[11px] leading-4 text-muted-foreground shadow-lg backdrop-blur-md sm:max-w-[min(1100px,calc(100vw-2rem))] sm:px-4"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-start justify-center gap-2 sm:items-center">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary sm:mt-0" />
            <p>
              Amazon Associate · Earnings from qualifying purchases.{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-2 hover:text-foreground"
              >
                Privacy&nbsp;Policy
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}