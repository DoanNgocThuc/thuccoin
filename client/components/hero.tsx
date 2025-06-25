import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Shield, Zap, Globe } from "lucide-react"

export default function Hero() {
  return (
    <main className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Your Gateway to
          <br />
          Digital Assets
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
          Buy, sell, swap, and manage your cryptocurrency portfolio with ThucCoin. The most secure and user-friendly
          crypto platform.
        </p>

        {/* Main Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-6 w-full sm:w-auto"
            asChild
          >
            <Link href="/create-wallet" className="flex items-center gap-2">
              Create a new wallet
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="bg-transparent text-white border-gray-600 hover:bg-gray-900 text-lg px-8 py-6 w-full sm:w-auto"
            asChild
          >
            <Link href="/access-wallet">Already have a wallet? Access Wallet</Link>
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-white mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Bank-Level Security</h3>
            <p className="text-gray-400">
              Your assets are protected with military-grade encryption and multi-signature technology.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
          <CardContent className="p-6 text-center">
            <Zap className="h-12 w-12 text-white mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
            <p className="text-gray-400">Execute trades and swaps in seconds with our optimized trading engine.</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
          <CardContent className="p-6 text-center">
            <Globe className="h-12 w-12 text-white mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Global Access</h3>
            <p className="text-gray-400">Trade 500+ cryptocurrencies from anywhere in the world, 24/7.</p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Section */}
      <div className="text-center border-t border-gray-800 pt-16">
        <h2 className="text-3xl font-bold text-white mb-8">Trusted by millions worldwide</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-3xl font-bold text-white mb-2">10M+</div>
            <div className="text-gray-400">Active Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">$50B+</div>
            <div className="text-gray-400">Trading Volume</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">500+</div>
            <div className="text-gray-400">Cryptocurrencies</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">99.9%</div>
            <div className="text-gray-400">Uptime</div>
          </div>
        </div>
      </div>
    </main>
  )
}
