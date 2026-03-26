import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Privacy Policy — PhonePicker AI",
  description:
    "Privacy policy for PhonePicker AI, an AI-powered phone recommender for India.",
};

export default function PrivacyPage() {
  return (
    <div className="h-dvh overflow-y-auto">
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-10 pb-24">
      <div className="space-y-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to PhonePicker AI
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: March 2026
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium">Overview</h2>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            PhonePicker AI is a free, AI-powered phone recommendation tool for
            Indian buyers. We do not require any account, login, or personal
            information to use this service.
          </p>
          <p>
            This policy explains what data is collected when you visit and use
            PhonePicker AI.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium">Data We Collect</h2>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground">
              No personal data is collected or stored.
            </strong>{" "}
            We do not use accounts, databases, or cookies to identify you. Your
            phone preference answers are processed in-memory and discarded when
            you close the page.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium">Analytics</h2>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            We use <strong className="text-foreground">Google Analytics</strong>{" "}
            (Google Tag Manager) to understand how visitors use the site. Google
            Analytics collects:
          </p>
          <ul className="list-inside list-disc space-y-1 pl-2">
            <li>Pages visited and session duration</li>
            <li>Device type, browser, and screen resolution</li>
            <li>Approximate geographic location (country/city level)</li>
            <li>Referral source (how you arrived at the site)</li>
          </ul>
          <p>
            This data is anonymised and aggregated. Google Analytics may set
            cookies on your device. You can opt out using the{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Google Analytics Opt-out Browser Add-on
            </a>
            .
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium">
            Amazon Affiliate Program Disclosure
          </h2>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            PhonePicker AI is a participant in the{" "}
            <strong className="text-foreground">
              Amazon Services LLC Associates Program
            </strong>
            , an affiliate advertising program designed to provide a means for
            sites to earn advertising fees by advertising and linking to
            Amazon.in.
          </p>
          <p>
            <strong className="text-foreground">
              As an Amazon Associate, we earn from qualifying purchases.
            </strong>
          </p>
          <p>
            When you click an Amazon link on this site, a cookie may be set by
            Amazon to track the referral. This is standard for the Amazon
            Associates Program and is governed by{" "}
            <a
              href="https://www.amazon.in/gp/help/customer/display.html?nodeId=201909000"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Amazon&apos;s Conditions of Use
            </a>{" "}
            and{" "}
            <a
              href="https://www.amazon.in/gp/help/customer/display.html?nodeId=200534380"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Privacy Notice
            </a>
            .
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium">Third-Party Services</h2>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            This site uses the following third-party services which may process
            data according to their own privacy policies:
          </p>
          <ul className="list-inside list-disc space-y-1 pl-2">
            <li>
              <strong className="text-foreground">Anthropic (Claude AI)</strong>{" "}
              — processes your phone preferences server-side to generate
              recommendations. Your preferences are not stored.
            </li>
            <li>
              <strong className="text-foreground">YouTube Data API</strong> —
              optionally fetches public video metadata for review insights. No
              user data is sent to YouTube.
            </li>
            <li>
              <strong className="text-foreground">Amazon.in</strong> — affiliate
              product links. Amazon&apos;s own tracking applies when you visit
              their site.
            </li>
            <li>
              <strong className="text-foreground">Google Analytics</strong> —
              anonymised usage analytics as described above.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium">Your Rights</h2>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Since we do not collect personal data, there is nothing to delete or
            export. If you have questions about this policy, you can reach us
            via the project&apos;s GitHub repository.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium">Changes to This Policy</h2>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            We may update this policy from time to time. Changes will be
            reflected on this page with an updated &ldquo;Last updated&rdquo;
            date.
          </p>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
