import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function AppFooterNotice() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-2 z-50 flex justify-center px-3 sm:bottom-3 sm:px-4">
      <Card
        role="note"
        aria-label="PhonePicker AI disclaimer"
        className="pointer-events-auto max-w-[min(960px,calc(100vw-1.5rem))] border-border/70 bg-background/88 px-2 py-1 text-[8px] leading-none text-muted-foreground shadow-lg backdrop-blur-md sm:max-w-[min(1100px,calc(100vw-2rem))] sm:px-3 sm:py-1.5 sm:text-[10px]"
      >
        <p className="whitespace-nowrap text-center">
          Amazon Associate · Earnings from qualifying purchases. <Link
            href="/privacy"
            className="underline underline-offset-2 hover:text-foreground"
          >Privacy Policy</Link>
        </p>
      </Card>
    </div>
  );
}