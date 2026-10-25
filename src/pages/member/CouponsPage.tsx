import { useEffect, useMemo } from 'react'

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
import { getCoupons } from '../../redux/features/user'
import type { Coupon } from '../../utils/user'

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

export default function CouponsPage() {
  const dispatch = useAppDispatch()
  const { data, loading } = useAppSelector((state) => state.userReducer.getCoupons)
  const coupons = useMemo(() => sortCoupons(data?.coupons ?? []), [data?.coupons])

  useEffect(() => {
    void dispatch(getCoupons())
  }, [dispatch])

  const pending = loading && !data

  return (
    <PageLayout title="優惠券" nav busy={pending}>
      {pending ? (
        <ItemList>
          <Skeleton $variant="wide" />
          <Skeleton $variant="wide" />
        </ItemList>
      ) : coupons.length ? (
        <ItemList>
          {coupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </ItemList>
      ) : (
        <EmptyCard>尚無優惠券</EmptyCard>
      )}
    </PageLayout>
  )
}
