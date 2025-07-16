"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Copy,
  Hash,
  Zap,
  AlertCircle,
} from "lucide-react";
import Header from "@/components/header";
import { useState, useEffect } from "react";

interface TransactionData {
  hash: string;
  blockNumber: number;
  transactionIndex: number;
  nonce: number;
  from: string;
  to: string;
  value: string;
  gasLimit: string;
  gasPrice: string;
  data: string;
  gasUsed?: string;
  timeStamp?: string;
  confirmations?: string;
  methodId?: string;
  functionName?: string;
  isError?: string; // This might not exist in local tx
}

interface TransactionDetailProps {
  hash: string;
}

export default function TransactionDetail({ hash }: TransactionDetailProps) {
  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/transactions");
        const allTx = await res.json();

        const foundTx = allTx.find((tx: TransactionData) => tx.hash === hash);
        if (!foundTx) {
          setError("Transaction not found");
        } else {
          setTransaction(foundTx);
        }
      } catch (err) {
        setError("Failed to load transaction");
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [hash]);

  // Helper functions
  const formatEther = (wei: string): string => {
    return (Number.parseInt(wei) / 1e18).toFixed(6);
  };

  const formatGwei = (wei: string): string => {
    return (Number.parseInt(wei) / 1e9).toFixed(2);
  };

  const calculateTxFee = (): string => {
    if (!transaction) return "0.000000";
    const gasUsed = Number.parseInt(transaction.gasUsed || "0");
    const gasPrice = Number.parseInt(transaction.gasPrice);
    return ((gasUsed * gasPrice) / 1e18).toFixed(6);
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const getStatusColor = (isError: string): string => {
    return isError === "0"
      ? "bg-green-900/20 text-green-400 border-green-600"
      : "bg-red-900/20 text-red-400 border-red-600";
  };

  const getStatusText = (isError: string): string => {
    return isError === "0" ? "Success" : "Failed";
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
            <Link href="/transactions" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Transactions
            </Link>
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
              <Hash className="h-10 w-10" />
              Transaction Details
            </h1>
            <p className="text-gray-400">
              Complete information about this transaction
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-gray-400">Loading transaction details...</p>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {error && (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Error</h2>
                <p className="text-gray-400">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Transaction Content */}
          {transaction && !loading && !error && (
            <>
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Transaction Overview */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Transaction Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="text-gray-400 text-sm mb-1">
                          Transaction Hash
                        </div>
                        <div className="flex items-center justify-between bg-gray-800 p-3 rounded">
                          <span className="text-white font-mono text-sm break-all">
                            {transaction.hash}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(transaction.hash, "hash")
                            }
                            className="text-gray-400 hover:text-white ml-2"
                          >
                            <Copy className="h-4 w-4" />
                            {copiedField === "hash" ? "Copied!" : "Copy"}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <div className="text-gray-400 text-sm mb-1">
                          Block Number
                        </div>
                        <div className="text-white">
                          {transaction.blockNumber}
                        </div>
                      </div>

                      <div>
                        <div className="text-gray-400 text-sm mb-1">
                          Transaction Index
                        </div>
                        <div className="text-white">
                          {transaction.transactionIndex}
                        </div>
                      </div>

                      <div>
                        <div className="text-gray-400 text-sm mb-1">Nonce</div>
                        <div className="text-white">{transaction.nonce}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Transfer Details */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Transfer Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="text-gray-400 text-sm mb-1">Value</div>
                        <div className="text-2xl font-bold text-white">
                          {formatEther(transaction.value)} ETH
                        </div>
                        <div className="text-gray-400 text-sm">
                          ≈ $
                          {(
                            Number.parseFloat(formatEther(transaction.value)) *
                            2500
                          ).toFixed(2)}{" "}
                          USD
                        </div>
                      </div>

                      <div>
                        <div className="text-gray-400 text-sm mb-1">From</div>
                        <div className="flex items-center justify-between bg-gray-800 p-3 rounded">
                          <span className="text-white font-mono text-sm break-all">
                            {transaction.from}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(transaction.from, "from")
                            }
                            className="text-gray-400 hover:text-white ml-2"
                          >
                            <Copy className="h-4 w-4" />
                            {copiedField === "from" ? "Copied!" : "Copy"}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <div className="text-gray-400 text-sm mb-1">To</div>
                        <div className="flex items-center justify-between bg-gray-800 p-3 rounded">
                          <span className="text-white font-mono text-sm break-all">
                            {transaction.to}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(transaction.to, "to")
                            }
                            className="text-gray-400 hover:text-white ml-2"
                          >
                            <Copy className="h-4 w-4" />
                            {copiedField === "to" ? "Copied!" : "Copy"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Gas Details */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Gas Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Gas Limit</span>
                        <span className="text-white">
                          {Number.parseInt(
                            transaction.gasLimit
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Gas Used</span>
                        <span className="text-white">
                          {Number.parseInt(
                            transaction.gasUsed || "0"
                          ).toLocaleString()}{" "}
                          (
                          {(
                            (Number.parseInt(transaction.gasUsed || "0") /
                              Number.parseInt(transaction.gasLimit)) *
                            100
                          ).toFixed(1)}
                          %)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Gas Price</span>
                        <span className="text-white">
                          {formatGwei(transaction.gasPrice)} Gwei
                        </span>
                      </div>
                      <div className="border-t border-gray-700 pt-3">
                        <div className="flex justify-between font-semibold">
                          <span className="text-gray-400">Transaction Fee</span>
                          <span className="text-white">
                            {calculateTxFee()} ETH
                          </span>
                        </div>
                        <div className="text-right text-gray-400 text-sm">
                          ≈ $
                          {(Number.parseFloat(calculateTxFee()) * 2500).toFixed(
                            2
                          )}{" "}
                          USD
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
