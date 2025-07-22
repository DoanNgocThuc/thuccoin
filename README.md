# Blockchain Wallet dApp

A decentralized application (dApp) with Ethereum wallet, token, staking, and transaction tracking functionality.

## 🛠️ Pre-requisites

Make sure the following are installed on your system:

- [Node.js](https://nodejs.org/)
- [Hardhat](https://hardhat.org/)

## 🚀 Getting Started

### 1️⃣ Add Environment Variables

Create a `.env` file in the **client** directory with the following content:

```env
NEXT_PUBLIC_THC_TOKEN_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_EXCHANGE_TOKEN_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
NEXT_PUBLIC_POS_ADDRESS=0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
NEXT_PUBLIC_ETHERSCAN_API_KEY=H99QJK7A6JWBWTFVYXACQ5JKQAJC4835S8
```

### 2️⃣ Run the App in 3 Terminals

You’ll need to prepare **three separate terminals** to run the development setup.

---

#### 🧪 Terminal 1: Hardhat Node

1. Navigate to the `contract` folder:

   ```bash
   cd contract
   ```

2. Run the following commands:

   ```bash
   npx hardhat clean
   npx hardhat compile
   npx hardhat node
   ```

---

#### 📡 Terminal 2: Transaction Indexer

1. In another terminal, also navigate to the `contract` folder:

   ```bash
   cd contract
   ```

2. Run the indexer script:

   ```bash
   npx ts-node scripts/tx-indexer.ts
   ```

---

#### 🌐 Terminal 3: Frontend Client

1. Navigate to the `client` folder:

   ```bash
   cd client
   ```
2. Install dependencies:
```bash
   npm i
   ```

3. Start the development server:

   ```bash
   npm i
   ```

---

Your dApp should now be running locally. Visit `http://localhost:3000` in your browser to interact with it.

---

## 📄 License

This project is licensed under the MIT License.
