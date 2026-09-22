import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import BottomNav from '../components/BottomNav'
import { Card, Dashboard, Scroll, Skeleton } from '../components/Dashboard'
import UserHeader, { UserCard, UserCopy } from '../components/UserHeader'
import { useAppDispatch, useAppSelector } from '../customHooks/useApp'
import { getUser, getVips } from '../redux/features/user'
import type { VipTier } from '../utils/user'
import { resolveVipTheme } from '../utils/vipTheme'

function formatSpend(amount?: number) {
  if (!amount) return '加入即是'
  return `累積消費 $${amount.toLocaleString()}`
}

function formatDiscount(percent?: number) {
  if (!percent) return '無額外折扣'
  return `折扣 ${percent}%`
}

function sortVips(vips: VipTier[]) {
  return [...vips].sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
}

function VipSkeleton() {
  return (
    <Dashboard>
      <Scroll aria-busy="true" aria-label="載入中">
        <UserCard>
          <Skeleton $variant="avatar" />
          <UserCopy>
            <Skeleton $variant="eyebrow" />
            <Skeleton $variant="title" />
          </UserCopy>
        </UserCard>
        <Skeleton $variant="wide" />
        <Skeleton $variant="wide" />
      </Scroll>
      <BottomNav />
    </Dashboard>
  )
}

export default function VipPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { data, loading, error } = useAppSelector(
    (state) => state.userReducer.getUser,
  )
  const vipsState = useAppSelector((state) => state.userReducer.getVips)
  const user = data?.user
  const vips = useMemo(() => sortVips(vipsState.data?.vips ?? []), [vipsState.data?.vips])

  useEffect(() => {
    if (!user && !loading && !error) {
      void dispatch(getUser())
    }
  }, [dispatch, error, loading, user])

  useEffect(() => {
    void dispatch(getVips())
  }, [dispatch])

  if (loading || (!user && !error)) {
    return <VipSkeleton />
  }

  const vipTheme = resolveVipTheme(user?.vip)

  return (
    <Dashboard $vip={vipTheme}>
      <Scroll>
        <UserHeader
          user={user}
          eyebrow="歡迎回來"
          onProfileClick={() => navigate('/profile')}
        />

        {vips.length ? (
          <InfoCard>
            <CardTitle>會員權益</CardTitle>
            <VipList>
              {vips.map((vip) => (
                <VipItem key={vip.id}>
                  <VipItemName>{vip.name}</VipItemName>
                  <VipItemMeta>{formatSpend(vip.minSpend)}</VipItemMeta>
                  <VipItemMeta>{formatDiscount(vip.discountPercent)}</VipItemMeta>
                  {vip.description?.trim() ? (
                    <VipItemDesc>{vip.description}</VipItemDesc>
                  ) : null}
                </VipItem>
              ))}
            </VipList>
            <Disclaimer>
              *水手保有修改誠品會員各項權益之權利，最新內容請以水手官方網站或門市相關公告為準。
            </Disclaimer>
          </InfoCard>
        ) : null}
      </Scroll>

      <BottomNav />
    </Dashboard>
  )
}

const InfoCard = styled(Card)`
  margin-top: 0.85rem;
  padding: 1rem 1.1rem 1.05rem;
`

const CardTitle = styled.p`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
`

const VipList = styled.div`
  display: grid;
  gap: 0.75rem;
  margin-top: 0.9rem;
`

const VipItem = styled.article`
  padding: 0.85rem 0.9rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.04);
`

const VipItemName = styled.p`
  margin: 0;
  font-size: 1.02rem;
  font-weight: 700;
  letter-spacing: -0.03em;
`

const VipItemMeta = styled.p`
  margin: 0.28rem 0 0;
  color: var(--dash-muted);
  font-size: 0.82rem;
`

const VipItemDesc = styled.p`
  margin: 0.4rem 0 0;
  font-size: 0.88rem;
  line-height: 1.45;
`

const Disclaimer = styled.p`
  margin: 1rem 0 0;
  color: var(--dash-muted);
  font-size: 0.78rem;
  line-height: 1.5;
`
