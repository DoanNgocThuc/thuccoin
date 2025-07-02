"use client";

import type React from "react";

import { useState } from "react";
import { ethers } from "ethers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  FileText,
  Key,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import Header from "@/components/header";
import { useWallet } from "@/lib/context/WalletContext";

type AccessMethod = "mnemonic" | "privatekey";

export default function AccessWalletComponent() {
  const [accessMethod, setAccessMethod] = useState<AccessMethod>("mnemonic");
  const [mnemonic, setMnemonic] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { setWallet } = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      let wallet;

      if (accessMethod === "mnemonic") {
        if (!mnemonic.trim()) {
          setError("Please enter your recovery phrase");
          setIsLoading(false);
          return;
        }

        // Validate if it's 12 words
        const words = mnemonic.trim().split(/\s+/);
        if (words.length !== 12) {
          setError("Mnemonic should be exactly 12 words");
          setIsLoading(false);
          return;
        }

        wallet = ethers.Wallet.fromPhrase(mnemonic.trim());
      } else {
        if (!privateKey.trim()) {
          setError("Please enter your private key");
          setIsLoading(false);
          return;
        }

        if (
          !privateKey.trim().startsWith("0x") ||
          privateKey.trim().length !== 66
        ) {
          setError("Private key must start with 0x and be 66 characters long");
          setIsLoading(false);
          return;
        }

        wallet = new ethers.Wallet(privateKey.trim());
      }

      // You can now use wallet.address, wallet.privateKey, etc.
      console.log("Wallet Address:", wallet.address);

      alert(`✅ Wallet accessed!\n\nAddress:\n${wallet.address}`);
      setWallet({
        address: wallet.address,
        privateKey: wallet.privateKey,
      });

      // Optionally: redirect or store address in state/context
    } catch (err) {
      console.error(err);
      setError("Invalid credentials. Please check and try again.");
    } finally {
      setIsLoading(false);
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

        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Access Wallet</h1>
            <p className="text-gray-400">
              Enter your credentials to access your wallet
            </p>
          </div>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-center">
                Login to Your Wallet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Method Selection */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={accessMethod === "mnemonic" ? "default" : "outline"}
                  className={`flex-1 ${
                    accessMethod === "mnemonic"
                      ? "bg-white text-black"
                      : "bg-transparent text-white border-gray-600"
                  }`}
                  onClick={() => setAccessMethod("mnemonic")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Recovery Phrase
                </Button>
                <Button
                  type="button"
                  variant={
                    accessMethod === "privatekey" ? "default" : "outline"
                  }
                  className={`flex-1 ${
                    accessMethod === "privatekey"
                      ? "bg-white text-black"
                      : "bg-transparent text-white border-gray-600"
                  }`}
                  onClick={() => setAccessMethod("privatekey")}
                >
                  <Key className="h-4 w-4 mr-2" />
                  Private Key
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {accessMethod === "mnemonic" ? (
                  <div className="space-y-2">
                    <Label htmlFor="mnemonic" className="text-white">
                      Recovery Phrase (Recommended)
                    </Label>
                    <Textarea
                      id="mnemonic"
                      placeholder="Enter your 12-word recovery phrase..."
                      value={mnemonic}
                      onChange={(e) => setMnemonic(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 min-h-[100px]"
                      disabled={isLoading}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="privatekey" className="text-white">
                      Private Key
                    </Label>
                    <div className="relative">
                      <Input
                        id="privatekey"
                        type={showPrivateKey ? "text" : "password"}
                        placeholder="Enter your private key..."
                        value={privateKey}
                        onChange={(e) => setPrivateKey(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 pr-12"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        onClick={() => setShowPrivateKey(!showPrivateKey)}
                      >
                        {showPrivateKey ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-black hover:bg-gray-200 py-6"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                      Accessing...
                    </div>
                  ) : (
                    "Access Wallet"
                  )}
                </Button>
              </form>

              {/* Help Link */}
              <div className="text-center pt-4 border-t border-gray-800">
                <Link
                  href="/create-wallet"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Don't have a wallet? Create one
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
