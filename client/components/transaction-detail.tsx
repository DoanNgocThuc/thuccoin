"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Copy, ExternalLink, Clock, Hash, Zap, Shield, AlertCircle, CheckCircle } from "lucide-react"
import Header from "@/components/header"
import { useState } from "react"

interface EtherscanTx {
  hash: string
  value: string
  to: string
  from: string
  timeStamp: string
  isError: string
  blockNumber: string
  gas: string
  gasPrice: string
  gasUsed: string
  nonce: string
  transactionIndex: string
  confirmations: string
  methodId: string
  functionName: string
}

interface TransactionDetailProps {
  hash: string
}

export default function TransactionDetail({ hash }: TransactionDetailProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  // Mock transaction data (in real app, fetch by hash)
  const transaction: EtherscanTx = {
    hash: hash,
    value: "1500000000000000000", // 1.5 ETH in wei
    to: "0x456def789abc123456789012345678901234567890",
    from: "0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4",
    timeStamp: "1705234567",
    isError: "0",
    blockNumber: "19123456",
    gas: "21000",
    gasPrice: "20000000000",
    gasUsed: "21000",
    nonce: "42",
    transactionIndex: "15",
    confirmations: "1234",
    methodId: "0xa9059cbb",
    functionName: "transfer(address,uint256)",
  }

  // Helper functions
  const formatEther = (wei: string): string => {
    return (Number.parseInt(wei) / 1e18).toFixed(6)
  }

  const formatGwei = (wei: string): string => {
    return (Number.parseInt(wei) / 1e9).toFixed(2)
  }

  const formatTimestamp = (timestamp: string): string => {
    return new Date(Number.parseInt(timestamp) * 1000).toLocaleString()
  }

  const calculateTxFee = (): string => {
    const gasUsed = Number.parseInt(transaction.gasUsed)
    const gasPrice = Number.parseInt(transaction.gasPrice)
    return ((gasUsed * gasPrice) / 1e18).toFixed(6)
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const getStatusColor = (isError: string): string => {
    return isError === "0"
      ? "bg-green-900/20 text-green-400 border-green-600"
      : "bg-red-900/20 text-red-400 border-red-600"
  }

  const getStatusText = (isError: string): string => {
    return isError === "0" ? "Success" : "Failed"
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" className="text-white hover:text-gray-300" asChild>
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
            <p className="text-gray-400">Complete information about this transaction</p>
          </div>

          {/* Status Card */}
          <Card className="bg-gray-900 border-gray-800 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-full ${transaction.isError === "0" ? "bg-green-900/20" : "bg-red-900/20"}`}
                  >
                    {transaction.isError === "0" ? (
                      <CheckCircle className="h-6 w-6 text-green-400" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-red-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white mb-1">
                      Transaction {getStatusText(transaction.isError)}
                    </div>
                    <div className="text-gray-400">
                      {formatTimestamp(transaction.timeStamp)} • {transaction.confirmations} confirmations
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(transaction.isError)}>
                  {getStatusText(transaction.isError)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Transaction Overview */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Transaction Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Transaction Hash</div>
                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded">
                      <span className="text-white font-mono text-sm break-all">{transaction.hash}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(transaction.hash, "hash")}
                        className="text-gray-400 hover:text-white ml-2"
                      >
                        <Copy className="h-4 w-4" />
                        {copiedField === "hash" ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-400 text-sm mb-1">Status</div>
                    <Badge variant="outline" className={getStatusColor(transaction.isError)}>
                      {getStatusText(transaction.isError)}
                    </Badge>
                  </div>

                  <div>
                    <div className="text-gray-400 text-sm mb-1">Block Number</div>
                    <div className="text-white">{transaction.blockNumber}</div>
                  </div>

                  <div>
                    <div className="text-gray-400 text-sm mb-1">Transaction Index</div>
                    <div className="text-white">{transaction.transactionIndex}</div>
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
                <CardTitle className="text-white">Transfer Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Value</div>
                    <div className="text-2xl font-bold text-white">{formatEther(transaction.value)} ETH</div>
                    <div className="text-gray-400 text-sm">
                      ≈ ${(Number.parseFloat(formatEther(transaction.value)) * 2500).toFixed(2)} USD
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-400 text-sm mb-1">From</div>
                    <div className="flex items-center justify-between bg-gray-800 p-3 rounded">
                      <span className="text-white font-mono text-sm break-all">{transaction.from}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(transaction.from, "from")}
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
                      <span className="text-white font-mono text-sm break-all">{transaction.to}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(transaction.to, "to")}
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
                    <span className="text-white">{Number.parseInt(transaction.gas).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Gas Used</span>
                    <span className="text-white">
                      {Number.parseInt(transaction.gasUsed).toLocaleString()} (
                      {((Number.parseInt(transaction.gasUsed) / Number.parseInt(transaction.gas)) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Gas Price</span>
                    <span className="text-white">{formatGwei(transaction.gasPrice)} Gwei</span>
                  </div>
                  <div className="border-t border-gray-700 pt-3">
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-400">Transaction Fee</span>
                      <span className="text-white">{calculateTxFee()} ETH</span>
                    </div>
                    <div className="text-right text-gray-400 text-sm">
                      ≈ ${(Number.parseFloat(calculateTxFee()) * 2500).toFixed(2)} USD
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Timestamp</div>
                    <div className="text-white flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {formatTimestamp(transaction.timeStamp)}
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-400 text-sm mb-1">Method ID</div>
                    <div className="text-white font-mono">{transaction.methodId || "N/A"}</div>
                  </div>

                  <div>
                    <div className="text-gray-400 text-sm mb-1">Function Name</div>
                    <div className="text-white font-mono">{transaction.functionName || "Transfer"}</div>
                  </div>

                  <div>
                    <div className="text-gray-400 text-sm mb-1">Confirmations</div>
                    <div className="text-white">{transaction.confirmations}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <Card className="bg-gray-900 border-gray-800 mt-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700" asChild>
                  <Link href={`https://etherscan.io/tx/${transaction.hash}`} target="_blank">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Etherscan
                  </Link>
                </Button>
                <Button variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700" asChild>
                  <Link href={`/transactions`}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to All Transactions
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
