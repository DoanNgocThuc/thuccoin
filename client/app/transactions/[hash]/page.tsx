import TransactionDetail from "@/components/transaction-detail"

export default async function TransactionDetailPage({
  params,
}: {
  params: { hash: string }
}) {
  const hash = params.hash
  return <TransactionDetail hash={hash} />
}
