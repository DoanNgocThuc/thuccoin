"use client";
// to be continue. Now is placeholder code
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Copy,
  Eye,
  EyeOff,
  Wallet,
  Send,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import Header from "@/components/header";
import { useWallet } from "@/lib/context/WalletContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface Token {
  symbol: string;
  name: string;
  balance: string;
  usdValue: string;
  change24h: string;
  isPositive: boolean;
}

interface Transaction {
  id: string;
  type: "send" | "receive";
  amount: string;
  token: string;
  to?: string;
  from?: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  hash: string;
}

export default function WalletDashboard() {
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { address: walletAddress, privateKey } = useWallet();
  const router = useRouter();
  // for unauthenticated access, redirect to access wallet page
  useEffect(() => {
    if (!walletAddress || !privateKey) {
      router.push("/access-wallet");
    }
  }, [walletAddress, privateKey]);

  const tokens: Token[] = [
    {
      symbol: "ETH",
      name: "Ethereum",
      balance: "2.4567",
      usdValue: "6,142.50",
      change24h: "+5.2%",
      isPositive: true,
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      balance: "0.1234",
      usdValue: "5,432.10",
      change24h: "-2.1%",
      isPositive: false,
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      balance: "1,250.00",
      usdValue: "1,250.00",
      change24h: "0.0%",
      isPositive: true,
    },
  ];

  const transactions: Transaction[] = [
    {
      id: "1",
      type: "receive",
      amount: "0.5",
      token: "ETH",
      from: "0x123...abc",
      timestamp: "2024-01-15 14:30",
      status: "completed",
      hash: "0xabc123def456...",
    },
    {
      id: "2",
      type: "send",
      amount: "100.0",
      token: "USDC",
      to: "0x456...def",
      timestamp: "2024-01-15 12:15",
      status: "completed",
      hash: "0xdef456abc123...",
    },
    {
      id: "3",
      type: "receive",
      amount: "0.0234",
      token: "BTC",
      from: "0x789...ghi",
      timestamp: "2024-01-14 18:45",
      status: "completed",
      hash: "0x789ghi456jkl...",
    },
    {
      id: "4",
      type: "send",
      amount: "0.25",
      token: "ETH",
      to: "0xabc...123",
      timestamp: "2024-01-14 16:20",
      status: "pending",
      hash: "0x123abc789def...",
    },
    {
      id: "5",
      type: "send",
      amount: "50.0",
      token: "USDC",
      to: "0xdef...456",
      timestamp: "2024-01-13 10:30",
      status: "failed",
      hash: "0x456def123abc...",
    },
  ];

  const totalUsdValue = tokens.reduce(
    (sum, token) => sum + Number.parseFloat(token.usdValue.replace(/,/g, "")),
    0
  );

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-900/20 text-green-400 border-green-600";
      case "pending":
        return "bg-yellow-900/20 text-yellow-400 border-yellow-600";
      case "failed":
        return "bg-red-900/20 text-red-400 border-red-600";
      default:
        return "bg-gray-900/20 text-gray-400 border-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="text-white hover:text-gray-300"
            asChild
          >
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Wallet className="h-10 w-10" />
                My Wallet
              </h1>
              <p className="text-gray-400">Manage your digital assets</p>
            </div>
            <Button
              variant="outline"
              className="bg-transparent text-white border-gray-600 hover:bg-gray-900"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Total Balance */}
          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardContent className="p-8 text-center">
              <div className="text-sm text-gray-400 mb-2">
                Total Portfolio Value
              </div>
              <div className="text-5xl font-bold text-white mb-4">
                $
                {totalUsdValue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className="text-green-400 text-lg">
                +$234.56 (2.1%) today
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Wallet Info & Tokens */}
            <div className="lg:col-span-2 space-y-6">
              {/* Wallet Address */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    Wallet Address
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(walletAddress ?? "", "address")
                      }
                      className="text-gray-400 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                      {copiedField === "address" ? "Copied!" : "Copy"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-white font-mono text-sm break-all">
                      {walletAddress}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Private Key */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    Private Key
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPrivateKey(!showPrivateKey)}
                        className="text-gray-400 hover:text-white"
                      >
                        {showPrivateKey ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        {showPrivateKey ? "Hide" : "Show"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(privateKey ?? "", "private")
                        }
                        className="text-gray-400 hover:text-white"
                        disabled={!showPrivateKey}
                      >
                        <Copy className="h-4 w-4" />
                        {copiedField === "private" ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-white font-mono text-sm break-all">
                      {showPrivateKey ? privateKey : "•".repeat(64)}
                    </p>
                  </div>
                  <p className="text-red-400 text-sm mt-2 font-semibold">
                    ⚠️ Never share your private key with anyone
                  </p>
                </CardContent>
              </Card>

              {/* Token Balances */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Token Balances</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tokens.map((token) => (
                      <div
                        key={token.symbol}
                        className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {token.symbol}
                            </span>
                          </div>
                          <div>
                            <div className="text-white font-semibold">
                              {token.name}
                            </div>
                            <div className="text-gray-400 text-sm">
                              {token.symbol}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-semibold">
                            {token.balance} {token.symbol}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">
                              ${token.usdValue}
                            </span>
                            <span
                              className={`text-sm ${
                                token.isPositive
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {token.change24h}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Actions & Transactions */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full bg-white text-black hover:bg-gray-200 justify-start"
                    asChild
                  >
                    <Link href="/send">
                      <Send className="h-4 w-4 mr-2" />
                      Send Tokens
                    </Link>
                  </Button>
                  <Button
                    className="w-full bg-white text-black hover:bg-gray-200 justify-start"
                    asChild
                  >
                    <Link href="/receive">
                      <Download className="h-4 w-4 mr-2" />
                      Receive Tokens
                    </Link>
                  </Button>
                  <Button
                    className="w-full bg-white text-black hover:bg-gray-200 justify-start"
                    asChild
                  >
                    <Link href="/swap">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Swap Tokens
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    Transaction History
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                      asChild
                    >
                      <Link href="/transactions">
                        View All
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              tx.type === "send"
                                ? "bg-red-900/20"
                                : "bg-green-900/20"
                            }`}
                          >
                            {tx.type === "send" ? (
                              <ArrowUpRight className="h-4 w-4 text-red-400" />
                            ) : (
                              <ArrowDownLeft className="h-4 w-4 text-green-400" />
                            )}
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">
                              {tx.type === "send" ? "Sent" : "Received"}{" "}
                              {tx.amount} {tx.token}
                            </div>
                            <div className="text-gray-400 text-xs">
                              {tx.type === "send"
                                ? `To: ${tx.to}`
                                : `From: ${tx.from}`}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {tx.timestamp}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant="outline"
                            className={`text-xs ${getStatusColor(tx.status)}`}
                          >
                            {tx.status}
                          </Badge>
                          <div className="text-gray-400 text-xs mt-1">
                            {tx.hash.substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
