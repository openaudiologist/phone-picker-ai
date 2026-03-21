import type { Metadata } from "next";
import { Sora, DM_Mono } from "next/font/google";
import CosmicBg from "@/components/CosmicBg";
import "./globals.css";

const sora = Sora({
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
      <body className={`${sora.variable} ${dmMono.variable} font-sans antialiased`}>
        <CosmicBg />
        <main style={{ position: "relative", zIndex: 1 }}>{children}</main>
      </body>
    </html>
  );
}
