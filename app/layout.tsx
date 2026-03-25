import type { Metadata } from "next";
import { DM_Mono, Inter, Public_Sans } from "next/font/google";
import Script from "next/script";
import { Providers } from "@/components/providers";
import "./globals.css";
import { cn } from "@/lib/utils";

const publicSans = Public_Sans({subsets:['latin'],variable:'--font-sans'});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "PhonePicker AI — Find Your Perfect Phone",
  description:
    "Free AI-powered phone recommender for India. Get 3 personalised picks with Amazon prices in under 60 seconds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("dark", "font-sans", publicSans.variable)}>
      <head>
        <Script
          id="google-tag-manager-loader"
          src="https://www.googletagmanager.com/gtag/js?id=G-9HJHRE901E"
          strategy="beforeInteractive"
        />
        <Script id="google-tag-init" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = window.gtag || gtag;
            gtag('js', new Date());
            gtag('config', 'G-9HJHRE901E');
          `}
        </Script>
      </head>
      <body className={`${publicSans.variable} ${dmMono.variable} min-h-screen font-sans antialiased`}>
        <Providers>
          <main className="min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
