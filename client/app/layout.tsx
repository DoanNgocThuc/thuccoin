import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/lib/context/WalletContext";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ThucCoin - Your Gateway to Digital Assets",
  description:
    "Buy, sell, swap, and manage your cryptocurrency portfolio with ThucCoin. The most secure and user-friendly crypto platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
