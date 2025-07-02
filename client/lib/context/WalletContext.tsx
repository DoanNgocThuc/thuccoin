"use client"

import React, { createContext, useContext, useState } from "react"

interface WalletContextProps {
  address: string | null
  privateKey: string | null
  setWallet: (wallet: { address: string; privateKey: string }) => void
  clearWallet: () => void
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined)

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null)
  const [privateKey, setPrivateKey] = useState<string | null>(null)

  const setWallet = ({ address, privateKey }: { address: string; privateKey: string }) => {
    setAddress(address)
    setPrivateKey(privateKey)
  }

  const clearWallet = () => {
    setAddress(null)
    setPrivateKey(null)
  }

  return (
    <WalletContext.Provider value={{ address, privateKey, setWallet, clearWallet }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) throw new Error("useWallet must be used within WalletProvider")
  return context
}
