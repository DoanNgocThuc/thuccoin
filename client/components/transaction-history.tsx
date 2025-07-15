"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  ExternalLink,
  Filter,
  Hash,
  Clock,
} from "lucide-react";
import Header from "@/components/header";
import { useWallet } from "@/lib/context/WalletContext";
import { useEffect } from "react";
import { getLocalTransactionHistory } from "@/lib/hardhatTxFetcher";

interface EtherscanTx {
  hash: string;
  value: string;
  to: string;
  from: string;
  timeStamp: string;
  isError: string;
  blockNumber: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  nonce: string;
  transactionIndex: string;
  confirmations: string;
  methodId: string;
  functionName: string;
}

export default function TransactionHistory() {
  const [searchHash, setSearchHash] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { address } = useWallet();
  const [transactions, setTransactions] = useState<EtherscanTx[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!address) return;

      setLoading(true);
      setError(null);

      try {
        const txs = await getLocalTransactionHistory(address);
        setTransactions(txs);
      } catch (err: any) {
        console.error("Error fetching local transactions:", err);
        setError("Failed to fetch transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [address]);

  // Mock wallet address
  const walletAddress = address || "0x1234567890abcdef1234567890abcdef12345678"; // Replace with actual wallet address or mock for testing

  // Mock transaction data

  // Helper functions
  const formatEther = (wei: string): string => {
    return (Number.parseInt(wei) / 1e18).toFixed(4);
  };

  const formatTimestamp = (timestamp: string): string => {
    return new Date(Number.parseInt(timestamp) * 1000).toLocaleString();
  };

  const getTransactionType = (tx: EtherscanTx): "sent" | "received" => {
    return tx.from.toLowerCase() === walletAddress.toLowerCase()
      ? "sent"
      : "received";
  };

  const getStatusColor = (isError: string): string => {
    return isError === "0"
      ? "bg-green-900/20 text-green-400 border-green-600"
      : "bg-red-900/20 text-red-400 border-red-600";
  };

  const getStatusText = (isError: string): string => {
    return isError === "0" ? "Success" : "Failed";
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      searchHash === "" ||
      tx.hash.toLowerCase().includes(searchHash.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      (filterType === "sent" && getTransactionType(tx) === "sent") ||
      (filterType === "received" && getTransactionType(tx) === "received");
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
            <Link
              href={address ? "/wallet" : "/"}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Wallet
            </Link>
          </Button>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
              <Hash className="h-10 w-10" />
              Transaction History
            </h1>
            <p className="text-gray-400">View all your wallet transactions</p>
          </div>

          {/* Filters */}
          <Card className="bg-gray-900 border-gray-800 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by transaction hash..."
                      value={searchHash}
                      onChange={(e) => setSearchHash(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 pl-10"
                    />
                  </div>
                </div>

                {/* Filter */}
                <div className="flex gap-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all" className="text-white">
                        All Transactions
                      </SelectItem>
                      <SelectItem value="sent" className="text-white">
                        Sent
                      </SelectItem>
                      <SelectItem value="received" className="text-white">
                        Received
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loading/Error State */}
          {loading && (
            <div className="text-center py-8 text-gray-400">
              Loading transactions...
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-red-400">Error: {error}</div>
          )}

          {!loading && !error && (
            <Card className="bg-gray-900 border-gray-800">
              {/* Transaction List */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    Transactions
                    <Badge
                      variant="outline"
                      className="bg-gray-800 text-gray-300 border-gray-600"
                    >
                      {filteredTransactions.length} total
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {paginatedTransactions.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      No transactions found
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {paginatedTransactions.map((tx) => {
                        const txType = getTransactionType(tx);
                        return (
                          <Link
                            key={tx.hash}
                            href={`/transactions/${tx.hash}`}
                            className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                {/* Type Icon */}
                                <div
                                  className={`p-2 rounded-full ${
                                    txType === "sent"
                                      ? "bg-red-900/20"
                                      : "bg-green-900/20"
                                  }`}
                                >
                                  {txType === "sent" ? (
                                    <ArrowUpRight className="h-4 w-4 text-red-400" />
                                  ) : (
                                    <ArrowDownLeft className="h-4 w-4 text-green-400" />
                                  )}
                                </div>

                                {/* Transaction Info */}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-white font-medium">
                                      {txType === "sent" ? "Sent" : "Received"}{" "}
                                      {formatEther(tx.value)} ETH
                                    </span>
                                    <Badge
                                      variant="outline"
                                      className={getStatusColor(tx.isError)}
                                    >
                                      {getStatusText(tx.isError)}
                                    </Badge>
                                  </div>
                                  <div className="text-gray-400 text-sm">
                                    {txType === "sent" ? "To" : "From"}:{" "}
                                    {txType === "sent" ? tx.to : tx.from}
                                  </div>
                                  <div className="flex items-center gap-4 text-gray-500 text-xs mt-1">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {formatTimestamp(tx.timeStamp)}
                                    </span>
                                    <span>Block #{tx.blockNumber}</span>
                                    <span>
                                      Hash: {tx.hash.substring(0, 10)}...
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Arrow */}
                              <ExternalLink className="h-4 w-4 text-gray-400" />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800">
                      <div className="text-sm text-gray-400">
                        Showing {startIndex + 1}-
                        {Math.min(
                          startIndex + itemsPerPage,
                          filteredTransactions.length
                        )}{" "}
                        of {filteredTransactions.length} transactions
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage(Math.max(1, currentPage - 1))
                          }
                          disabled={currentPage === 1}
                          className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                        >
                          Previous
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((page) => (
                            <Button
                              key={page}
                              variant={
                                page === currentPage ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className={
                                page === currentPage
                                  ? "bg-white text-black"
                                  : "bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                              }
                            >
                              {page}
                            </Button>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage(
                              Math.min(totalPages, currentPage + 1)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
