import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Quantir - Chaos Refined Into Equations",
  description: "AI-powered Solana analytics for Pump.fun tokens. Real-time pattern recognition, profitable wallet tracking, and market insights.",
  keywords: ["crypto", "AI", "Solana", "Pump.fun", "analytics", "trading", "DeFi"],
  openGraph: {
    title: "Quantir - Chaos Refined Into Equations",
    description: "Real-time AI pattern recognition for Pump.fun tokens.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
