import { ethers } from "ethers";

// Create a new random wallet
export function createNewWallet() {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    mnemonic: wallet.mnemonic ? wallet.mnemonic.phrase : null,
    privateKey: wallet.privateKey,
  };
}

// Recover wallet from mnemonic
export function loadWalletFromMnemonic(mnemonic: string) {
  const mnemonicObj = ethers.Mnemonic.fromPhrase(mnemonic);
  const hdNodeWallet = ethers.HDNodeWallet.fromMnemonic(mnemonicObj);
  const wallet = new ethers.Wallet(hdNodeWallet.privateKey);
  return wallet;
}

// Recover wallet from private key
export function loadWalletFromPrivateKey(privateKey: string) {
  const wallet = new ethers.Wallet(privateKey);
  return wallet;
}
