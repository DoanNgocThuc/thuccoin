// lib/etherscan.ts
export async function getTransactionHistory(address: string): Promise<any[]> {
  const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY

  const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`

  const res = await fetch(url)
  const data = await res.json()

  if (data.status !== "1") {
    throw new Error("Failed to fetch transactions")
  }

  return data.result // this is an array of transactions
}
