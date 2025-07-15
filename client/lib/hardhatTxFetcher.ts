// lib/hardhatTxFetcher.ts
import { ethers } from "ethers";

export async function getLocalTransactionHistory(
  walletAddress: string,
  providerUrl = "http://127.0.0.1:8545/" // default Hardhat URL
): Promise<any[]> {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
  const latestBlock = await provider.getBlockNumber();

  const transactions: any[] = [];

  // Scan last N blocks (e.g., 1000 blocks)
  for (let i = latestBlock; i > latestBlock - 1000 && i >= 0; i--) {
    const block = await provider.getBlock(i, true);

    if (block && block.transactions) {
      block.transactions.forEach((tx: any) => {
        if (
          tx.from?.toLowerCase() === walletAddress.toLowerCase() ||
          tx.to?.toLowerCase() === walletAddress.toLowerCase()
        ) {
          transactions.push({
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: tx.value.toString(),
            gas: tx.gasLimit.toString(),
            gasPrice: tx.gasPrice?.toString() || "",
            nonce: tx.nonce.toString(),
            blockNumber: tx.blockNumber.toString(),
            timeStamp: Date.now().toString(),
            isError: "0",
            gasUsed: tx.gasLimit.toString(),
            transactionIndex: tx.transactionIndex.toString(),
            confirmations: (latestBlock - tx.blockNumber).toString(),
            methodId: tx.data?.slice(0, 10),
            functionName: "",
          });
        }
      });
    }
  }

  return transactions;
}
