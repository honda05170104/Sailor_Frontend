import { useEffect, useMemo } from 'react'
import styled from 'styled-components'

import BottomNav from '../components/BottomNav'
import {
  Card,
  Dashboard,
  Scroll,
  Skeleton,
} from '../components/Dashboard'
import { useAppDispatch, useAppSelector } from '../customHooks/useApp'
import { getCoupons } from '../redux/features/user'
import type { Coupon } from '../utils/user'

const STATUS_LABELS: Record<string, string> = {
  available: '可使用',
  used: '已使用',
  expired: '已過期',
}

function formatDate(value?: string | null) {
  if (!value?.trim()) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}

function formatCouponValue(coupon: Coupon) {
  if (coupon.type === 'percent') return `${coupon.value}%`
  return `$${(coupon.value ?? 0).toLocaleString()}`
}

function statusLabel(status?: string) {
  if (!status?.trim()) return '優惠券'
  return STATUS_LABELS[status] ?? status
}

function couponMeta(coupon: Coupon) {
  const parts: string[] = []
  if (coupon.minSpend) parts.push(`滿 $${coupon.minSpend.toLocaleString()}`)
  else parts.push('無消費門檻')

  if (coupon.status === 'used' && coupon.usedAt) {
    parts.push(`${formatDate(coupon.usedAt)} 使用`)
  } else if (coupon.expiresAt) {
    parts.push(`${formatDate(coupon.expiresAt)} 到期`)
  }

  return parts.join(' · ')
}

function sortCoupons(coupons: Coupon[]) {
  return [...coupons].sort((a, b) => {
    const order = (status: string) => (status === 'available' ? 0 : 1)
    return order(a.status) - order(b.status)
  })
}

function CouponCard({ coupon }: { coupon: Coupon }) {
  const muted = coupon.status !== 'available'

  return (
    <ItemCard $muted={muted}>
      <ItemTop>
        <div>
          <ItemName>{coupon.name}</ItemName>
          {coupon.description?.trim() ? <ItemMeta>{coupon.description}</ItemMeta> : null}
          <ItemMeta>{couponMeta(coupon)}</ItemMeta>
        </div>
        <ItemAmount>{formatCouponValue(coupon)}</ItemAmount>
      </ItemTop>
      <ItemChips>
        <ItemChip>{statusLabel(coupon.status)}</ItemChip>
      </ItemChips>
    </ItemCard>
  )
}

function CouponsSkeleton() {
  return (
    <Dashboard>
      <Scroll aria-busy="true" aria-label="載入中">
        <PageHeader>
          <Skeleton $variant="title" />
        </PageHeader>
        <ItemList>
          <Skeleton $variant="wide" />
          <Skeleton $variant="wide" />
        </ItemList>
      </Scroll>
      <BottomNav />
    </Dashboard>
  )
}

export default function CouponsPage() {
  const dispatch = useAppDispatch()
  const { data, loading } = useAppSelector((state) => state.userReducer.getCoupons)
  const coupons = useMemo(() => sortCoupons(data?.coupons ?? []), [data?.coupons])

  useEffect(() => {
    void dispatch(getCoupons())
  }, [dispatch])

  if (loading && !data) {
    return <CouponsSkeleton />
  }

  return (
    <Dashboard>
      <Scroll>
        <PageHeader>
          <PageTitle>優惠券</PageTitle>
        </PageHeader>

        {coupons.length ? (
          <ItemList>
            {coupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} />
            ))}
          </ItemList>
        ) : (
          <EmptyCard>尚無優惠券</EmptyCard>
        )}
      </Scroll>

      <BottomNav />
    </Dashboard>
  )
}

const PageHeader = styled.header`
  margin: 0.15rem 0 1rem;
`

const PageTitle = styled.h1`
  margin: 0;
  font-size: clamp(1.6rem, 6vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.15;
`

const ItemList = styled.div`
  display: grid;
  gap: 0.85rem;
`

const ItemCard = styled(Card)<{ $muted?: boolean }>`
  padding: 1rem 1.1rem 1.05rem;
  opacity: ${({ $muted }) => ($muted ? 0.55 : 1)};
`

const ItemTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
`

const ItemName = styled.p`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.03em;
`

const ItemMeta = styled.p`
  margin: 0.3rem 0 0;
  color: var(--dash-muted);
  font-size: 0.78rem;
`

const ItemAmount = styled.p`
  margin: 0;
  flex: 0 0 auto;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: -0.03em;
`

const ItemChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.75rem;
`

const ItemChip = styled.span`
  padding: 0.28rem 0.6rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: #d1d1d6;
  font-size: 0.72rem;
`

const EmptyCard = styled(Card)`
  display: grid;
  place-items: center;
  min-height: 11rem;
  padding: 1.5rem 1.1rem;
  color: var(--dash-muted);
  font-size: 0.88rem;
  text-align: center;
`
