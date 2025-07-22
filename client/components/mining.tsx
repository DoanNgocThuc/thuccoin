"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Coins,
  TrendingUp,
  Shield,
  Users,
  Zap,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Star,
} from "lucide-react";
import Header from "@/components/header";
import ProofOfStakeABI from "@/lib/abis/ProofOfStake.json";
import { ethers } from "ethers";
import { useWallet } from "@/lib/context/WalletContext";

interface StakingPool {
  id: string;
  name: string;
  apy: number;
  minStake: string;
  lockPeriod: string;
  totalStaked: string;
  validators: number;
  risk: "Low" | "Medium" | "High";
  featured?: boolean;
}

interface StakingPosition {
  id: string;
  pool: string;
  amount: string;
  rewards: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Pending" | "Completed";
}

export default function MiningPage() {
  const { address, privateKey } = useWallet()
  const [userBalance, setUserBalance] = useState("0.0") // In ETH
  const [selectedPool, setSelectedPool] = useState<string>("");
  const [stakeAmount, setStakeAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);

  // Mock data
  
  const totalRewardsEarned = "45.67";
  const activeStakes = "500.00";

  const stakingPools: StakingPool[] = [
    {
      id: "pool1",
      name: "ETH Pool",
      apy: 12.5,
      minStake: "100",
      lockPeriod: "30 days",
      totalStaked: "2,500,000",
      validators: 150,
      risk: "Low",
      featured: true,
    },
    {
      id: "pool2",
      name: "High Yield Validator",
      apy: 18.2,
      minStake: "500",
      lockPeriod: "90 days",
      totalStaked: "1,200,000",
      validators: 75,
      risk: "Medium",
      featured: true,
    },
    {
      id: "pool3",
      name: "Premium Staking Pool",
      apy: 25.0,
      minStake: "1000",
      lockPeriod: "180 days",
      totalStaked: "800,000",
      validators: 45,
      risk: "High",
    },
    {
      id: "pool4",
      name: "Flexible Staking",
      apy: 8.5,
      minStake: "50",
      lockPeriod: "No lock",
      totalStaked: "3,100,000",
      validators: 200,
      risk: "Low",
    },
  ];

  const stakingPositions: StakingPosition[] = [
    {
      id: "1",
      pool: "ThucCoin Genesis Pool",
      amount: "300.00",
      rewards: "12.45",
      startDate: "2024-01-15",
      endDate: "2024-02-14",
      status: "Active",
    },
    {
      id: "2",
      pool: "High Yield Validator",
      amount: "200.00",
      rewards: "8.22",
      startDate: "2024-01-10",
      endDate: "2024-04-10",
      status: "Active",
    },
  ];

  const selectedPoolData = stakingPools.find(
    (pool) => pool.id === selectedPool
  );

  const calculateRewards = (): number => {
    if (!selectedPoolData || !stakeAmount) return 0;
    const amount = Number.parseFloat(stakeAmount);
    const apy = selectedPoolData.apy / 100;
    return (amount * apy) / 12; // Monthly rewards
  };

  const getRiskColor = (risk: string): string => {
    switch (risk) {
      case "Low":
        return "bg-green-900/20 text-green-400 border-green-600";
      case "Medium":
        return "bg-yellow-900/20 text-yellow-400 border-yellow-600";
      case "High":
        return "bg-red-900/20 text-red-400 border-red-600";
      default:
        return "bg-gray-900/20 text-gray-400 border-gray-600";
    }
  };

  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_POS_ADDRESS || "";

  async function handleStake() {
    try {
      setIsStaking(true)

      if (!privateKey) throw new Error("Wallet not connected")

      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545")
      const wallet = new ethers.Wallet(privateKey, provider)
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ProofOfStakeABI.abi, wallet)

      const amountInEther = ethers.parseEther(stakeAmount)

      const tx = await contract.stake({ value: amountInEther })
      await tx.wait()

      alert("Staking successful!")
      setStakeAmount("")
      setSelectedPool("")
    } catch (error: any) {
      console.error("Staking failed:", error)
      alert("Staking failed: " + (error.message || "Unknown error"))
    } finally {
      setIsStaking(false)
    }
  }

  useEffect(() => {
  async function fetchBalance() {
    if (!address) return
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545")
    const balance = await provider.getBalance(address)
    setUserBalance(ethers.formatEther(balance))
  }
  fetchBalance()
}, [address])


  const handleMaxAmount = () => {
  setStakeAmount(userBalance)
}

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
            <Link href="/wallet" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Wallet
            </Link>
          </Button>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <Coins className="h-12 w-12" />
              ETH Mining (Proof of Stake)
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Stake your ThucCoin tokens to secure the network and earn rewards
              through our Proof of Stake consensus mechanism
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {userBalance} ETH
                </div>
                <div className="text-gray-400 text-sm">Available Balance</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {activeStakes} ETH
                </div>
                <div className="text-gray-400 text-sm">Currently Staked</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {totalRewardsEarned} ETH
                </div>
                <div className="text-gray-400 text-sm">
                  Total Rewards Earned
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  15.2%
                </div>
                <div className="text-gray-400 text-sm">Average APY</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Staking Pools */}
            <div className="lg:col-span-2 space-y-6">
              {/* Featured Pools */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    Featured Staking Pools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stakingPools
                      .filter((pool) => pool.featured)
                      .map((pool) => (
                        <div
                          key={pool.id}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                            selectedPool === pool.id
                              ? "border-blue-500 bg-blue-900/10"
                              : "border-gray-700 bg-gray-800 hover:border-gray-600"
                          }`}
                          onClick={() => setSelectedPool(pool.id)}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="text-lg font-semibold text-white">
                                {pool.name}
                              </div>
                              <Badge
                                variant="outline"
                                className={getRiskColor(pool.risk)}
                              >
                                {pool.risk} Risk
                              </Badge>
                            </div>
                            <div className="text-2xl font-bold text-green-400">
                              {pool.apy}% APY
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-gray-400">Min Stake</div>
                              <div className="text-white">
                                {pool.minStake} ETH
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-400">Lock Period</div>
                              <div className="text-white">
                                {pool.lockPeriod}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-400">Total Staked</div>
                              <div className="text-white">
                                {Number.parseInt(
                                  pool.totalStaked
                                ).toLocaleString()}{" "}
                                ETH
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-400">Validators</div>
                              <div className="text-white">
                                {pool.validators}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* All Pools */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">
                    All Staking Pools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stakingPools.map((pool) => (
                      <div
                        key={pool.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedPool === pool.id
                            ? "border-blue-500 bg-blue-900/10"
                            : "border-gray-700 bg-gray-800 hover:border-gray-600"
                        }`}
                        onClick={() => setSelectedPool(pool.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="font-semibold text-white">
                                {pool.name}
                              </div>
                              <div className="text-sm text-gray-400">
                                Min: {pool.minStake} ETH • {pool.lockPeriod}
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className={getRiskColor(pool.risk)}
                            >
                              {pool.risk}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-green-400">
                              {pool.apy}%
                            </div>
                            <div className="text-sm text-gray-400">APY</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Current Positions */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">
                    Your Staking Positions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stakingPositions.map((position) => (
                      <div
                        key={position.id}
                        className="p-4 bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold text-white">
                            {position.pool}
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              position.status === "Active"
                                ? "bg-green-900/20 text-green-400 border-green-600"
                                : "bg-yellow-900/20 text-yellow-400 border-yellow-600"
                            }
                          >
                            {position.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-gray-400">Staked Amount</div>
                            <div className="text-white">
                              {position.amount} ETH
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400">Rewards Earned</div>
                            <div className="text-green-400">
                              {position.rewards} ETH
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400">Start Date</div>
                            <div className="text-white">
                              {position.startDate}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400">End Date</div>
                            <div className="text-white">{position.endDate}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Staking Interface */}
            <div className="space-y-6">
              {/* Stake Interface */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Stake ETH Tokens</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Pool Selection */}
                  <div className="space-y-2">
                    <Label className="text-white">Select Staking Pool</Label>
                    <Select
                      value={selectedPool}
                      onValueChange={setSelectedPool}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Choose a pool..." />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {stakingPools.map((pool) => (
                          <SelectItem
                            key={pool.id}
                            value={pool.id}
                            className="text-white"
                          >
                            <div className="flex items-center justify-between w-full">
                              <span>{pool.name}</span>
                              <span className="text-green-400 ml-4">
                                {pool.apy}% APY
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Amount Input */}
                  <div className="space-y-2">
                    <Label className="text-white">Stake Amount</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="0.0"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
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
                    <div className="text-sm text-gray-400">
                      Available: {userBalance} ETH
                    </div>
                  </div>

                  {/* Pool Details */}
                  {selectedPoolData && (
                    <div className="bg-gray-800 p-4 rounded-lg space-y-2">
                      <div className="text-white font-semibold mb-2">
                        Pool Details
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">APY</span>
                          <span className="text-green-400">
                            {selectedPoolData.apy}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Lock Period</span>
                          <span className="text-white">
                            {selectedPoolData.lockPeriod}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Minimum Stake</span>
                          <span className="text-white">
                            {selectedPoolData.minStake} ETH
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Risk Level</span>
                          <Badge
                            variant="outline"
                            className={getRiskColor(selectedPoolData.risk)}
                          >
                            {selectedPoolData.risk}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rewards Calculator */}
                  {stakeAmount && selectedPoolData && (
                    <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-blue-400 mb-2">
                        <Calculator className="h-4 w-4" />
                        <span className="font-semibold">Estimated Rewards</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-300">Monthly</span>
                          <span className="text-white">
                            {calculateRewards().toFixed(4)} ETH
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-300">Yearly</span>
                          <span className="text-white">
                            {(calculateRewards() * 12).toFixed(2)} ETH
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stake Button */}
                  <Button
                    onClick={handleStake}
                    disabled={!selectedPool || !stakeAmount || isStaking}
                    className="w-full bg-white text-black hover:bg-gray-200 py-6 text-lg font-semibold"
                  >
                    {isStaking ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                        Staking...
                      </div>
                    ) : (
                      `Stake ${stakeAmount || "0"} ETH`
                    )}
                  </Button>

                  {/* Warning */}
                  <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-yellow-400 mb-1">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-semibold">
                        Important Notice
                      </span>
                    </div>
                    <p className="text-yellow-300 text-sm">
                      Staked tokens will be locked for the specified period.
                      Early withdrawal may result in penalties.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Network Stats */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Network Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Total Staked</span>
                        <span className="text-white">7.6M ETH (76%)</span>
                      </div>
                      <Progress value={76} className="h-2" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Active Validators</span>
                      <span className="text-white">470</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Network APY</span>
                      <span className="text-green-400">15.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Block Time</span>
                      <span className="text-white">3.2s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Network Security</span>
                      <span className="text-green-400">High</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    Staking Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="text-white">Earn passive income</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-400" />
                      <span className="text-white">Secure the network</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-400" />
                      <span className="text-white">
                        Governance participation
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-400" />
                      <span className="text-white">Compound rewards</span>
                    </div>
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
