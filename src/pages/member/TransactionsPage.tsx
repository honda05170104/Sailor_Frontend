import { useEffect } from 'react'
import styled from 'styled-components'

import { EmptyCard, Skeleton } from '../../components/Dashboard'
import {
  ItemAmount,
  ItemCard,
  ItemChip,
  ItemChips,
  ItemList,
  ItemMeta,
  ItemName,
  ItemTop,
} from '../../components/ItemCard'
import PageLayout from '../../components/PageLayout'
import { useAppDispatch, useAppSelector } from '../../customHooks/useApp'
import { getTransactions } from '../../redux/features/user'
import type { Transaction } from '../../utils/user'

function formatMoney(amount?: number) {
  const value = amount ?? 0
  const formatted = Math.abs(value).toLocaleString()
  return value < 0 ? `-$${formatted}` : `$${formatted}`
}

function formatDate(value?: string) {
  if (!value?.trim()) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('zh-TW')
}

function formatItem(item: NonNullable<Transaction['items']>[number]) {
  const name = item.name?.trim() || '未命名'
  if (name === '點數增加' || name === '儲值金增加') return '點數增加'
  if (name === '點數扣除' || name === '儲值金扣除') return '點數扣除'
  return `${name} × ${item.quantity ?? 0}`
}

function TransactionCard({ tx }: { tx: Transaction }) {
  const items = tx.items ?? []
  const branch = tx.branch?.name?.trim() || '—'
  const status = tx.orderStatusLabel?.trim() || '已完成'
  const paymentMethod = tx.paymentMethod?.trim()
  const meta = [tx.txnNo?.trim(), status]
    .filter((value): value is string => Boolean(value && value !== '—'))
    .join(' · ')

  return (
    <ItemCard>
      <ItemTop>
        <div>
          <ItemName>{formatDate(tx.createdAt || tx.importedAt)}</ItemName>
          <ItemMeta>{meta || '—'}</ItemMeta>
        </div>
        <ItemAmount>{formatMoney(tx.totalAmount)}</ItemAmount>
      </ItemTop>
      <ItemChips>
        <ItemChip>{branch}</ItemChip>
        {paymentMethod ? <ItemChip>{paymentMethod}</ItemChip> : null}
      </ItemChips>
      {items.length ? (
        <TxItems>
          {items.map((item, index) => (
            <TxItem key={`${item.sku || item.name}-${index}`}>{formatItem(item)}</TxItem>
          ))}
        </TxItems>
      ) : null}
    </ItemCard>
  )
}

export default function TransactionsPage() {
  const dispatch = useAppDispatch()
  const { data, loading } = useAppSelector((state) => state.userReducer.getTransactions)
  const transactions = data?.transactions ?? []

  useEffect(() => {
    void dispatch(getTransactions())
  }, [dispatch])

  const pending = loading && !data

  return (
    <PageLayout title="交易紀錄" nav busy={pending}>
      {pending ? (
        <ItemList>
          <Skeleton $variant="wide" />
          <Skeleton $variant="wide" />
          <Skeleton $variant="wide" />
        </ItemList>
      ) : transactions.length ? (
        <ItemList>
          {transactions.map((tx) => (
            <TransactionCard key={tx.id} tx={tx} />
          ))}
        </ItemList>
      ) : (
        <EmptyCard>尚無交易紀錄</EmptyCard>
      )}
    </PageLayout>
  )
}

const TxItems = styled.ul`
  display: grid;
  gap: 0.45rem;
  margin: 0.9rem 0 0;
  padding: 0.85rem 0 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  list-style: none;
`

const TxItem = styled.li`
  font-size: 0.88rem;
`
