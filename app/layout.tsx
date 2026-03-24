import type { Metadata } from "next";
import { Outfit, DM_Mono } from "next/font/google";
import Script from "next/script";
import CosmicBg from "../components/CosmicBg";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

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
    <html lang="en" className="dark">
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
      <body className={`${outfit.variable} ${dmMono.variable} font-sans antialiased`}>
        <CosmicBg />
        <main style={{ position: "relative", zIndex: 1 }}>{children}</main>
      </body>
    </html>
  );
}
