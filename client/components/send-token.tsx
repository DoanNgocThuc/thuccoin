"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, Scan, BookOpen, AlertCircle, Clock, Zap, Shield } from "lucide-react"
import Header from "@/components/header"
import { ethers } from "ethers"
import { useWallet } from "@/lib/context/WalletContext"
import ThucTokenABI from "@/lib/abis/ThucToken.json"
import { useEffect } from "react"

interface EtherscanTx {
  hash: string
  value: string
  to: string
  from: string
  timeStamp: string
  isError: string
  // ...more if needed
}


interface Token {
  symbol: string
  name: string
  balance: string
  price: number
  icon: string
}

interface RecentRecipient {
  address: string
  name: string
  lastUsed: string
}

interface SendData {
  recipient: string
  token: string
  amount: string
  memo: string
}

export default function SendToken() {
  const [sendData, setSendData] = useState<SendData>({
    recipient: "",
    token: "THC",
    amount: "",
    memo: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showRecents, setShowRecents] = useState(false)
  const { address: senderAddress, privateKey } = useWallet()
  const thucTokenAddress = process.env.NEXT_PUBLIC_THC_TOKEN_ADDRESS!

  const [transactions, setTransactions] = useState<EtherscanTx[]>([])
const { address: walletAddress } = useWallet()



  // Mock token data
  const tokens: Token[] = [
    { symbol: "THC", name: "ThucCoin", balance: "1,250.00", price: 2.45, icon: "🪙" },
    { symbol: "ETH", name: "Ethereum", balance: "2.4567", price: 2500.0, icon: "⟠" },
  ]

  // Mock recent recipients
  const recentRecipients: RecentRecipient[] = [
    { address: "0x123...abc", name: "Alice's Wallet", lastUsed: "2 days ago" },
    { address: "0x456...def", name: "Bob's Address", lastUsed: "1 week ago" },
    { address: "0x789...ghi", name: "Exchange Wallet", lastUsed: "2 weeks ago" },
  ]

  const selectedToken = tokens.find((t) => t.symbol === sendData.token)
  const usdValue = selectedToken ? Number.parseFloat(sendData.amount || "0") * selectedToken.price : 0
  const estimatedFee = sendData.token === "THC" ? "0.001" : sendData.token === "ETH" ? "0.0023" : "0.0015"
  const estimatedFeeUsd = Number.parseFloat(estimatedFee) * (tokens.find((t) => t.symbol === "ETH")?.price || 2500)

  const validateAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  }

  const handleInputChange = (field: keyof SendData, value: string) => {
    setSendData((prev) => ({ ...prev, [field]: value }))
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleMaxAmount = () => {
    if (selectedToken) {
      const maxAmount = selectedToken.balance.replace(/,/g, "")
      setSendData((prev) => ({ ...prev, amount: maxAmount }))
    }
  }

  const handleRecentRecipient = (address: string) => {
    setSendData((prev) => ({ ...prev, recipient: address }))
    setShowRecents(false)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!sendData.recipient.trim()) {
      newErrors.recipient = "Recipient address is required"
    } else if (!validateAddress(sendData.recipient)) {
      newErrors.recipient = "Please enter a valid Ethereum address"
    }

    if (!sendData.amount.trim()) {
      newErrors.amount = "Amount is required"
    } else if (Number.parseFloat(sendData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0"
    } else if (
      selectedToken &&
      Number.parseFloat(sendData.amount) > Number.parseFloat(selectedToken.balance.replace(/,/g, ""))
    ) {
      newErrors.amount = "Insufficient balance"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSend = async () => {
  if (!validateForm()) return
  if (!privateKey) return alert("Wallet not loaded")

  try {
    setIsLoading(true)

    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/") // update if needed
    const wallet = new ethers.Wallet(privateKey, provider)

    const tokenContract = new ethers.Contract(
      thucTokenAddress,
      ThucTokenABI.abi,
      wallet
    )

    const amountInWei = ethers.parseUnits(sendData.amount, 18) // THC uses 18 decimals

    const tx = await tokenContract.transfer(sendData.recipient, amountInWei)
    await tx.wait()

    alert(`Transaction successful! Hash: ${tx.hash}`)
    setSendData({ recipient: "", token: "THC", amount: "", memo: "" })
  } catch (err: any) {
    console.error("Transaction failed", err)
    alert(`Error: ${err.message || "Transaction failed"}`)
  } finally {
    setIsLoading(false)
  }
}

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
              <Send className="h-10 w-10" />
              Send Tokens
            </h1>
            <p className="text-gray-400">Transfer your tokens to any wallet address</p>
          </div>

          {/* Send Form */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Send Transaction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Token Selection */}
              <div className="space-y-2">
                <Label className="text-white">Select Token</Label>
                <Select value={sendData.token} onValueChange={(value) => handleInputChange("token", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {tokens.map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol} className="text-white">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <span>{token.icon}</span>
                            <span>{token.symbol}</span>
                            <span className="text-gray-400 text-sm">({token.name})</span>
                          </div>
                          <span className="text-gray-400 text-sm ml-4">Balance: {token.balance}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedToken && (
                  <div className="text-sm text-gray-400">
                    Available: {selectedToken.balance} {selectedToken.symbol} (≈ $
                    {(Number.parseFloat(selectedToken.balance.replace(/,/g, "")) * selectedToken.price).toFixed(2)})
                  </div>
                )}
              </div>

              {/* Recipient Address */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Recipient Address</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowRecents(!showRecents)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <BookOpen className="h-4 w-4 mr-1" />
                      Recents
                    </Button>
                  </div>
                </div>
                <Input
                  placeholder="0x... (Enter recipient's wallet address)"
                  value={sendData.recipient}
                  onChange={(e) => handleInputChange("recipient", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 font-mono"
                />
                {errors.recipient && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {errors.recipient}
                  </div>
                )}

                {/* Recent Recipients */}
                {showRecents && (
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 space-y-2">
                    <div className="text-sm text-gray-400 mb-2">Recent Recipients</div>
                    {recentRecipients.map((recipient, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 hover:bg-gray-700 rounded cursor-pointer"
                        onClick={() => handleRecentRecipient(recipient.address)}
                      >
                        <div>
                          <div className="text-white text-sm">{recipient.name}</div>
                          <div className="text-gray-400 text-xs font-mono">{recipient.address}</div>
                        </div>
                        <div className="text-gray-500 text-xs">{recipient.lastUsed}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label className="text-white">Amount</Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={sendData.amount}
                    onChange={(e) => handleInputChange("amount", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 pr-16"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMaxAmount}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300"
                  >
                    MAX
                  </Button>
                </div>
                {errors.amount && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {errors.amount}
                  </div>
                )}
                {sendData.amount && <div className="text-sm text-gray-400">≈ ${usdValue.toFixed(2)} USD</div>}
              </div>

              {/* Memo (Optional) */}
              <div className="space-y-2">
                <Label className="text-white">Memo (Optional)</Label>
                <Textarea
                  placeholder="Add a note for this transaction..."
                  value={sendData.memo}
                  onChange={(e) => handleInputChange("memo", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 min-h-[80px]"
                />
                <div className="text-xs text-gray-500">This memo is only visible to you</div>
              </div>

              {/* Transaction Summary */}
              {sendData.amount && sendData.recipient && (
                <div className="bg-gray-800 p-4 rounded-lg space-y-3">
                  <div className="text-white font-semibold mb-2">Transaction Summary</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sending</span>
                      <span className="text-white">
                        {sendData.amount} {sendData.token} (≈ ${usdValue.toFixed(2)})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">To</span>
                      <span className="text-white font-mono">{sendData.recipient.substring(0, 10)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Network Fee</span>
                      <span className="text-white">
                        {estimatedFee} ETH (≈ ${estimatedFeeUsd.toFixed(2)})
                      </span>
                    </div>
                    <div className="border-t border-gray-700 pt-2">
                      <div className="flex justify-between font-semibold">
                        <span className="text-gray-400">Total Cost</span>
                        <span className="text-white">
                          {sendData.amount} {sendData.token} + {estimatedFee} ETH
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* THC Benefits */}
              {sendData.token === "THC" && (
                <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-blue-400 mb-2">
                    <Zap className="h-4 w-4" />
                    <span className="text-sm font-semibold">ThucCoin Benefits</span>
                  </div>
                  <div className="space-y-1 text-blue-300 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>Faster confirmation times</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-3 w-3" />
                      <span>Lower network fees</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Send Button */}
              <Button
                onClick={handleSend}
                disabled={!sendData.recipient || !sendData.amount || isLoading}
                className="w-full bg-white text-black hover:bg-gray-200 py-6 text-lg font-semibold"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                    Sending Transaction...
                  </div>
                ) : (
                  `Send ${sendData.amount || "0"} ${sendData.token}`
                )}
              </Button>

              {/* Security Notice */}
              <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-3">
                <div className="flex items-center gap-2 text-yellow-400 mb-1">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-semibold">Security Reminder</span>
                </div>
                <p className="text-yellow-300 text-sm">
                  Double-check the recipient address. Transactions cannot be reversed once confirmed.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
