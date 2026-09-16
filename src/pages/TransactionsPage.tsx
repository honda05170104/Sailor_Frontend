import { useEffect } from 'react'
import styled from 'styled-components'

import BottomNav from '../components/BottomNav'
import {
  Card,
  Dashboard,
  Eyebrow,
  PlaceholderText,
  Scroll,
  Skeleton,
} from '../components/Dashboard'
import { useAppDispatch, useAppSelector } from '../customHooks/useApp'
import { getTransactions } from '../redux/features/user'
import type { Transaction } from '../utils/user'

function formatMoney(amount?: number) {
  return `$${(amount ?? 0).toLocaleString()}`
}

function formatDateTime(value?: string) {
  if (!value?.trim()) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${year}/${month}/${day} ${hour}:${minute}`
}

function statusChips(tx: Transaction) {
  return [tx.orderStatus, tx.paymentStatus, tx.shippingStatus].filter(
    (value): value is string => Boolean(value?.trim()),
  )
}

function TransactionCard({ tx }: { tx: Transaction }) {
  const chips = statusChips(tx)
  const items = tx.items ?? []
  const foot = [tx.paymentMethod, tx.staff, tx.invoice ? `發票 ${tx.invoice}` : null]
    .filter((value): value is string => Boolean(value?.trim()))
    .join(' · ')
  const meta = [
    tx.orderNo ? `訂單 ${tx.orderNo}` : null,
    tx.pickupNo ? `取餐 ${tx.pickupNo}` : null,
    formatDateTime(tx.createdAt || tx.importedAt),
  ]
    .filter((value): value is string => Boolean(value))
    .join(' · ')

  return (
    <TxCard>
      <TxTop>
        <div>
          <TxBranch>{tx.branch?.name || <PlaceholderText>門市</PlaceholderText>}</TxBranch>
          <TxMeta>{meta || '—'}</TxMeta>
        </div>
        <TxAmount>{formatMoney(tx.totalAmount)}</TxAmount>
      </TxTop>
      {chips.length ? (
        <TxChips>
          {chips.map((chip) => (
            <TxChip key={chip}>{chip}</TxChip>
          ))}
        </TxChips>
      ) : null}
      {items.length ? (
        <TxItems>
          {items.map((item, index) => (
            <TxItem key={`${item.sku || item.name}-${index}`}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatMoney(item.subtotal)}</span>
            </TxItem>
          ))}
        </TxItems>
      ) : null}
      {foot ? <TxFoot>{foot}</TxFoot> : null}
      {tx.note?.trim() ? <TxFoot>{tx.note}</TxFoot> : null}
    </TxCard>
  )
}

function TransactionsSkeleton() {
  return (
    <Dashboard>
      <Scroll aria-busy="true" aria-label="載入中">
        <TxHeader>
          <Skeleton $variant="eyebrow" />
          <Skeleton $variant="title" />
        </TxHeader>
        <TxList>
          <Skeleton $variant="wide" />
          <Skeleton $variant="wide" />
          <Skeleton $variant="wide" />
        </TxList>
      </Scroll>
      <BottomNav />
    </Dashboard>
  )
}

export default function TransactionsPage() {
  const dispatch = useAppDispatch()
  const { data, loading } = useAppSelector((state) => state.userReducer.getTransactions)
  const transactions = data?.transactions ?? []

  useEffect(() => {
    void dispatch(getTransactions())
  }, [dispatch])

  if (loading && !data) {
    return <TransactionsSkeleton />
  }

  return (
    <Dashboard>
      <Scroll>
        <TxHeader>
          <Eyebrow>消費紀錄</Eyebrow>
          <TxTitle>交易紀錄</TxTitle>
          <TxCount>
            {transactions.length ? `共 ${transactions.length} 筆` : '尚無紀錄'}
          </TxCount>
        </TxHeader>

        {transactions.length ? (
          <TxList>
            {transactions.map((tx) => (
              <TransactionCard key={tx.id} tx={tx} />
            ))}
          </TxList>
        ) : (
          <TxEmpty>尚無交易紀錄</TxEmpty>
        )}
      </Scroll>

      <BottomNav />
    </Dashboard>
  )
}

const TxHeader = styled.header`
  margin: 0.15rem 0 1rem;
`

const TxTitle = styled.h1`
  margin: 0;
  font-size: clamp(1.6rem, 6vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.15;
`

const TxCount = styled.p`
  margin: 0.35rem 0 0;
  color: var(--dash-muted);
  font-size: 0.82rem;
`

const TxList = styled.div`
  display: grid;
  gap: 0.85rem;
`

const TxCard = styled(Card)`
  padding: 1rem 1.1rem 1.05rem;
`

const TxTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
`

const TxBranch = styled.p`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.03em;
`

const TxMeta = styled.p`
  margin: 0.3rem 0 0;
  color: var(--dash-muted);
  font-size: 0.78rem;
`

const TxAmount = styled.p`
  margin: 0;
  flex: 0 0 auto;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: -0.03em;
`

const TxChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.75rem;
`

const TxChip = styled.span`
  padding: 0.28rem 0.6rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: #d1d1d6;
  font-size: 0.72rem;
`

const TxItems = styled.ul`
  display: grid;
  gap: 0.45rem;
  margin: 0.9rem 0 0;
  padding: 0.85rem 0 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  list-style: none;
`

const TxItem = styled.li`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.88rem;

  span:last-child {
    flex: 0 0 auto;
    font-weight: 650;
  }
`

const TxFoot = styled.p`
  margin: 0.7rem 0 0;
  color: var(--dash-muted);
  font-size: 0.78rem;
`

const TxEmpty = styled(Card)`
  display: grid;
  place-items: center;
  min-height: 11rem;
  padding: 1.5rem 1.1rem;
  color: var(--dash-muted);
  font-size: 0.88rem;
  text-align: center;
`
