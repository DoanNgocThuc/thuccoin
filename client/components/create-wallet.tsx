"use client";
import { ethers } from "ethers";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Copy,
  Eye,
  EyeOff,
  Shield,
  AlertTriangle,
} from "lucide-react";
import Header from "@/components/header";

interface WalletKeys {
  privateKey: string;
  publicKey: string;
  mnemonic: string;
}

export default function CreateWalletComponent() {
  const [walletKeys, setWalletKeys] = useState<WalletKeys | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const generateWallet = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const wallet = ethers.Wallet.createRandom();

    try {
      await fundWallet(wallet.address);
    } catch (error) {
      console.error("❌ Failed to fund wallet:", error);
    }

    setWalletKeys({
      privateKey: wallet.privateKey,
      publicKey: wallet.address,
      mnemonic: wallet.mnemonic?.phrase ?? "",
    });

    setIsGenerating(false);
  };

  const fundWallet = async (toAddress: string) => {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");

    // Paste your Hardhat account[0] private key here
    const hardhatPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    const funder = new ethers.Wallet(hardhatPrivateKey, provider);

    const tx = await funder.sendTransaction({
      to: toAddress,
      value: ethers.parseEther("10"),
    });

    await tx.wait();
    console.log("✅ Wallet funded!", tx.hash);
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

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Create Your Wallet
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Generate a new cryptocurrency wallet with secure keys and recovery
              phrase
            </p>
          </div>

          {!walletKeys ? (
            <Card className="bg-gray-900 border-gray-800 max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
                  <Shield className="h-6 w-6" />
                  Secure Wallet Generation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-200">
                      <p className="font-semibold mb-1">
                        Important Security Notice:
                      </p>
                      <ul className="space-y-1 text-yellow-300">
                        <li>
                          • Your keys will be generated locally in your browser
                        </li>
                        <li>
                          • Store your private key and mnemonic phrase securely
                        </li>
                        <li>• Never share your private key with anyone</li>
                        <li>• ThucCoin cannot recover lost keys or phrases</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={generateWallet}
                  disabled={isGenerating}
                  className="w-full bg-white text-black hover:bg-gray-200 text-lg py-6"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                      Generating Secure Wallet...
                    </div>
                  ) : (
                    "Generate New Wallet"
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="bg-green-900/20 border border-green-600 rounded-lg p-4 text-center">
                <p className="text-green-200 font-semibold">
                  🎉 Your wallet has been successfully generated!
                </p>
                <p className="text-green-300 text-sm mt-1">
                  Please save all the information below in a secure location.
                </p>
              </div>

              {/* Mnemonic Phrase */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    Recovery Phrase (Mnemonic)
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(walletKeys.mnemonic, "mnemonic")
                      }
                      className="text-gray-400 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                      {copiedField === "mnemonic" ? "Copied!" : "Copy"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-white font-mono text-lg leading-relaxed">
                      {walletKeys.mnemonic}
                    </p>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">
                    Write down these 12 words in order. You'll need them to
                    recover your wallet.
                  </p>
                </CardContent>
              </Card>

              {/* Public Key */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    Public Key
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(walletKeys.publicKey, "public")
                      }
                      className="text-gray-400 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                      {copiedField === "public" ? "Copied!" : "Copy"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-white font-mono text-sm break-all">
                      {walletKeys.publicKey}
                    </p>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">
                    Your public address for receiving cryptocurrency.
                  </p>
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
                          copyToClipboard(walletKeys.privateKey, "private")
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
                      {showPrivateKey ? walletKeys.privateKey : "•".repeat(64)}
                    </p>
                  </div>
                  <p className="text-red-400 text-sm mt-2 font-semibold">
                    ⚠️ Never share your private key. Anyone with this key can
                    access your funds.
                  </p>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  className="bg-white text-black hover:bg-gray-200 flex-1"
                  asChild
                >
                  <Link href="/access-wallet">Access My Wallet</Link>
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent text-white border-gray-600 hover:bg-gray-900 flex-1"
                  onClick={() => setWalletKeys(null)}
                >
                  Generate Another Wallet
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
