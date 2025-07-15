"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useWallet } from "@/lib/context/WalletContext";

export default function Header() {
  const { address } = useWallet();

  return (
    <header className="border-b border-gray-800 bg-black">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-white hover:text-gray-300 transition-colors"
          >
            ThucCoin
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList className="space-x-6">
                <NavigationMenuItem>
                  <Link
                    href={address ? "/send-token" : "/access-wallet"}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    Send-token
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link
                    href={address ? "/swap-token" : "/access-wallet"}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    Swap tokens
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link
                    href="/transactions"
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    Transactions
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link
                    href="/resources"
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    Resources
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link
                    href="/product"
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    Product
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Access Wallet Button */}
          <Button
            variant="outline"
            className="bg-white text-black hover:bg-gray-200 border-white"
            asChild
          >
            <Link href={address ? "/wallet" : "/access-wallet"}>
              Access my wallet
            </Link>
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="md:hidden text-white hover:text-gray-300"
            size="icon"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </nav>
      </div>
    </header>
  );
}
