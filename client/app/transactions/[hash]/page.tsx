import TransactionDetail from "@/components/transaction-detail"

export default function TransactionDetailPage({ params }: { params: { hash: string } }) {
  return <TransactionDetail hash={params.hash} />
}
