import { useEffect } from 'react'
import styled from 'styled-components'

import BottomNav from '../../components/BottomNav'
import {
  Card,
  Dashboard,
  Scroll,
  SectionTitle,
  Skeleton,
} from '../../components/Dashboard'
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
    <TxCard>
      <TxTop>
        <div>
          <TxBranch>{formatDate(tx.createdAt || tx.importedAt)}</TxBranch>
          <TxMeta>{meta || '—'}</TxMeta>
        </div>
        <TxAmount>{formatMoney(tx.totalAmount)}</TxAmount>
      </TxTop>
      <TxChips>
        <TxChip>{branch}</TxChip>
        {paymentMethod ? <TxChip>{paymentMethod}</TxChip> : null}
      </TxChips>
      {items.length ? (
        <TxItems>
          {items.map((item, index) => (
            <TxItem key={`${item.sku || item.name}-${index}`}>{formatItem(item)}</TxItem>
          ))}
        </TxItems>
      ) : null}
    </TxCard>
  )
}

function TransactionsSkeleton() {
  return (
    <Dashboard>
      <Scroll aria-busy="true" aria-label="載入中">
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
        <SectionTitle>交易紀錄</SectionTitle>

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
  font-size: 0.88rem;
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
