import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function AppFooterNotice() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-2 z-50 flex justify-center px-3 sm:bottom-3 sm:px-4">
      <Card
        size="sm"
        role="note"
        aria-label="PhonePicker AI disclaimer"
        className="pointer-events-auto max-w-[min(960px,calc(100vw-1.5rem))] border-border/70 bg-background/88 px-2.5 py-1.5 text-[10px] leading-tight text-muted-foreground shadow-lg backdrop-blur-md sm:max-w-[min(1100px,calc(100vw-2rem))] sm:px-3 sm:py-2 sm:text-[11px]"
      >
        <p className="text-center">
          Amazon Associate · Earnings from qualifying purchases.{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Privacy&nbsp;Policy
          </Link>
        </p>
      </Card>
    </div>
  );
}