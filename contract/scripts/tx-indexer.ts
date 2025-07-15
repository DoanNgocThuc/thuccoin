// scripts/tx-indexer.ts
import { ethers } from "ethers";
import fs from "fs";

// Set up the local provider (Hardhat node)
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// Path to store all transactions
const outputFile = "./data/all-transactions.json";

// Load previous transactions if any
let allTxs: any[] = [];
if (fs.existsSync(outputFile)) {
  allTxs = JSON.parse(fs.readFileSync(outputFile, "utf-8"));
}

// Create a Set of already indexed tx hashes (avoid duplicates)
const knownHashes = new Set(allTxs.map((tx) => tx.hash));

async function indexNewBlock(blockNumber: number) {
  const block = await provider.getBlock(blockNumber);
  if (!block || !block.transactions) {
    console.warn(`Block ${blockNumber} not found or has no transactions.`);
    return;
  }
  const txs = await Promise.all(
    block.transactions.map((txHash) => provider.getTransaction(txHash))
  );
  const newTxs = txs.filter((tx) => tx && !knownHashes.has(tx.hash));

  if (newTxs.length > 0) {
    console.log(`🧾 New block #${blockNumber} | ${newTxs.length} new tx(s)`);

    allTxs.push(...newTxs);
    newTxs.forEach((tx) => {
      if (tx) knownHashes.add(tx.hash);
      else {
        console.warn(`Transaction not found`);
      }
    });

    fs.writeFileSync(outputFile, JSON.stringify(allTxs, null, 2));
  }
}

async function main() {
  const latest = await provider.getBlockNumber();
  console.log(`🔍 Starting from block ${latest}`);

  provider.on("block", async (blockNumber) => {
    await indexNewBlock(blockNumber);
  });
}

main().catch(console.error);
