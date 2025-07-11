"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowUpDown, Settings, Info, AlertTriangle, TrendingUp, Zap } from "lucide-react"
import Header from "@/components/header"
import { ethers } from "ethers"
import ThucTokenABI from "@/lib/abis/ThucToken.json"
import ExchangeABI from "@/lib/abis/ThucTokenExchange.json"
import { useWallet } from "@/lib/context/WalletContext"


interface Token {
  symbol: string
  name: string
  balance: string
  price: number
  icon: string
  featured?: boolean
}

interface SwapData {
  fromToken: string
  toToken: string
  fromAmount: string
  toAmount: string
}

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function SwapTokens() {
  const [swapData, setSwapData] = useState<SwapData>({
    fromToken: "ETH",
    toToken: "THC",
    fromAmount: "",
    toAmount: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [slippage, setSlippage] = useState("0.5")
  const [showSettings, setShowSettings] = useState(false)
  const TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  const EXCHANGE_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
  const { privateKey } = useWallet()

  // Mock token data
  const tokens: Token[] = [
    {
      symbol: "THC",
      name: "ThucCoin",
      balance: "1,250.00",
      price: 2.45,
      icon: "🪙",
      featured: true,
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      balance: "2.4567",
      price: 2500.0,
      icon: "⟠",
      featured: true,
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      balance: "0.1234",
      price: 44000.0,
      icon: "₿",
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      balance: "1,250.00",
      price: 1.0,
      icon: "💵",
    },
    {
      symbol: "USDT",
      name: "Tether",
      balance: "500.00",
      price: 1.0,
      icon: "💰",
    },
    {
      symbol: "BNB",
      name: "Binance Coin",
      balance: "5.67",
      price: 310.0,
      icon: "🟡",
    },
  ]

  // Get exchange rate between tokens
  const getExchangeRate = (from: string, to: string): number => {
    const fromToken = tokens.find((t) => t.symbol === from)
    const toToken = tokens.find((t) => t.symbol === to)
    if (!fromToken || !toToken) return 0
    return fromToken.price / toToken.price
  }

  // Calculate swap amounts
  useEffect(() => {
    if (swapData.fromAmount && swapData.fromToken && swapData.toToken) {
      const rate = getExchangeRate(swapData.fromToken, swapData.toToken)
      const toAmount = (Number.parseFloat(swapData.fromAmount) * rate).toFixed(6)
      setSwapData((prev) => ({ ...prev, toAmount }))
    }
  }, [swapData.fromAmount, swapData.fromToken, swapData.toToken])

  const handleSwapDirection = () => {
    setSwapData((prev) => ({
      fromToken: prev.toToken,
      toToken: prev.fromToken,
      fromAmount: prev.toAmount,
      toAmount: prev.fromAmount,
    }))
  }

  const handleMaxAmount = () => {
    const token = tokens.find((t) => t.symbol === swapData.fromToken)
    if (token) {
      setSwapData((prev) => ({ ...prev, fromAmount: token.balance.replace(/,/g, "") }))
    }
  }

  const handleSwap = async () => {
  if (!swapData.fromAmount || isLoading) return
  if (!privateKey) {
    alert("Wallet private key not found. Please connect your wallet.")
    return
  }
  setIsLoading(true)

  try {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/")
    const signer = new ethers.Wallet(privateKey, provider)

    const token = new ethers.Contract(TOKEN_ADDRESS, ThucTokenABI.abi, signer)
    const exchange = new ethers.Contract(EXCHANGE_ADDRESS, ExchangeABI.abi, signer)
    console.log("Using token contract:", token.address)

    const fromAmountParsed = ethers.parseUnits(swapData.fromAmount, 18)

    if (swapData.fromToken === "ETH" && swapData.toToken === "THC") {
      // ETH → THC: Buy tokens
      const tx = await exchange.buyTokens({ value: fromAmountParsed })
      await tx.wait()
      alert("Swap successful: ETH → THC")
    } else if (swapData.fromToken === "THC" && swapData.toToken === "ETH") {
      // THC → ETH: Sell tokens
      // Step 1: Approve exchange to spend THC
      const approvalTx = await token.approve(EXCHANGE_ADDRESS, fromAmountParsed)
      await approvalTx.wait()

      // Step 2: Call sellTokens
      const tx = await exchange.sellTokens(fromAmountParsed)
      await tx.wait()
      alert("Swap successful: THC → ETH")
    } else {
      alert("This swap pair is not supported on-chain.")
    }
  } catch (error) {
    console.error(error)
    alert("Swap failed. Check the console for details.")
  } finally {
    setIsLoading(false)
  }
}


  const fromToken = tokens.find((t) => t.symbol === swapData.fromToken)
  const toToken = tokens.find((t) => t.symbol === swapData.toToken)
  const exchangeRate = getExchangeRate(swapData.fromToken, swapData.toToken)
  const priceImpact = Number.parseFloat(swapData.fromAmount) > 100 ? 2.1 : 0.5
  const estimatedGas = "0.0023"

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" className="text-white hover:text-gray-300" asChild>
            <Link href="/wallet" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Wallet
            </Link>
          </Button>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <ArrowUpDown className="h-10 w-10" />
              Swap Tokens
            </h1>
            <p className="text-gray-400">Trade your tokens instantly with the best rates</p>
          </div>

          {/* Featured Tokens */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-gray-400">Featured Pairs</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
                onClick={() => setSwapData((prev) => ({ ...prev, fromToken: "ETH", toToken: "THC" }))}
              >
                ETH → THC
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
                onClick={() => setSwapData((prev) => ({ ...prev, fromToken: "THC", toToken: "ETH" }))}
              >
                THC → ETH
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
                onClick={() => setSwapData((prev) => ({ ...prev, fromToken: "THC", toToken: "USDC" }))}
              >
                THC → USDC
              </Button>
            </div>
          </div>

          {/* Swap Interface */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Swap</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-gray-400 hover:text-white"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Settings Panel */}
              {showSettings && (
                <div className="bg-gray-800 p-4 rounded-lg space-y-3">
                  <div>
                    <Label className="text-white text-sm">Slippage Tolerance</Label>
                    <div className="flex gap-2 mt-2">
                      {["0.1", "0.5", "1.0"].map((value) => (
                        <Button
                          key={value}
                          variant={slippage === value ? "default" : "outline"}
                          size="sm"
                          className={
                            slippage === value
                              ? "bg-white text-black"
                              : "bg-transparent border-gray-600 text-white hover:bg-gray-700"
                          }
                          onClick={() => setSlippage(value)}
                        >
                          {value}%
                        </Button>
                      ))}
                      <Input
                        placeholder="Custom"
                        value={slippage}
                        onChange={(e) => setSlippage(e.target.value)}
                        className="w-20 bg-gray-700 border-gray-600 text-white text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* From Token */}
              <div className="space-y-2">
                <Label className="text-white">From</Label>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <Select
                      value={swapData.fromToken}
                      onValueChange={(value) => setSwapData((prev) => ({ ...prev, fromToken: value }))}
                    >
                      <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {tokens.map((token) => (
                          <SelectItem key={token.symbol} value={token.symbol} className="text-white">
                            <div className="flex items-center gap-2">
                              <span>{token.icon}</span>
                              <span>{token.symbol}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMaxAmount}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      MAX
                    </Button>
                  </div>
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={swapData.fromAmount}
                    onChange={(e) => setSwapData((prev) => ({ ...prev, fromAmount: e.target.value }))}
                    className="bg-transparent border-none text-2xl font-bold text-white placeholder-gray-500 p-0 h-auto"
                  />
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span className="text-gray-400">
                      Balance: {fromToken?.balance} {fromToken?.symbol}
                    </span>
                    <span className="text-gray-400">
                      ≈ ${((Number.parseFloat(swapData.fromAmount) || 0) * (fromToken?.price || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Swap Direction Button */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSwapDirection}
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 rounded-full"
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>

              {/* To Token */}
              <div className="space-y-2">
                <Label className="text-white">To</Label>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <Select
                      value={swapData.toToken}
                      onValueChange={(value) => setSwapData((prev) => ({ ...prev, toToken: value }))}
                    >
                      <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {tokens.map((token) => (
                          <SelectItem key={token.symbol} value={token.symbol} className="text-white">
                            <div className="flex items-center gap-2">
                              <span>{token.icon}</span>
                              <span>{token.symbol}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="text-2xl font-bold text-white">{swapData.toAmount || "0.0"}</div>
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span className="text-gray-400">
                      Balance: {toToken?.balance} {toToken?.symbol}
                    </span>
                    <span className="text-gray-400">
                      ≈ ${((Number.parseFloat(swapData.toAmount) || 0) * (toToken?.price || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Exchange Rate Info */}
              {swapData.fromAmount && (
                <div className="bg-gray-800 p-4 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Exchange Rate</span>
                    <span className="text-white">
                      1 {swapData.fromToken} = {exchangeRate.toFixed(6)} {swapData.toToken}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Price Impact</span>
                    <span className={`${priceImpact > 2 ? "text-red-400" : "text-green-400"}`}>
                      {priceImpact.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Estimated Gas</span>
                    <span className="text-white">{estimatedGas} ETH</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Minimum Received</span>
                    <span className="text-white">
                      {(Number.parseFloat(swapData.toAmount) * (1 - Number.parseFloat(slippage) / 100)).toFixed(6)}{" "}
                      {swapData.toToken}
                    </span>
                  </div>
                </div>
              )}

              {/* Price Impact Warning */}
              {priceImpact > 2 && (
                <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-yellow-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-semibold">High Price Impact</span>
                  </div>
                  <p className="text-yellow-300 text-sm mt-1">
                    This swap has a price impact of {priceImpact.toFixed(2)}%. Consider reducing the amount.
                  </p>
                </div>
              )}

              {/* THC Feature Highlight */}
              {(swapData.fromToken === "THC" || swapData.toToken === "THC") && (
                <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Zap className="h-4 w-4" />
                    <span className="text-sm font-semibold">ThucCoin (THC) Trading</span>
                  </div>
                  <p className="text-blue-300 text-sm mt-1">
                    You're trading ThucCoin! Enjoy lower fees and faster transactions on our native token.
                  </p>
                </div>
              )}

              {/* Swap Button */}
              <Button
                onClick={handleSwap}
                disabled={!swapData.fromAmount || !swapData.toAmount || isLoading}
                className="w-full bg-white text-black hover:bg-gray-200 py-6 text-lg font-semibold"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                    Swapping...
                  </div>
                ) : (
                  `Swap ${swapData.fromToken} for ${swapData.toToken}`
                )}
              </Button>

              {/* Disclaimer */}
              <div className="text-center text-xs text-gray-500">
                <div className="flex items-center justify-center gap-1">
                  <Info className="h-3 w-3" />
                  <span>Powered by ThucCoin DEX • Slippage: {slippage}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
