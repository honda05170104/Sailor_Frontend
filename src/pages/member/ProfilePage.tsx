import { useEffect } from 'react'
import styled from 'styled-components'

import BottomNav from '../../components/BottomNav'
import {
  Card,
  Dashboard,
  PlaceholderText,
  Scroll,
  Skeleton,
} from '../../components/Dashboard'
import FavoriteSpeciesCard from '../../components/FavoriteSpeciesCard'
import UserHeader, { UserHeaderSkeleton } from '../../components/UserHeader'
import { useAppDispatch, useAppSelector } from '../../customHooks/useApp'
import { getUser } from '../../redux/features/user'
import { resolveVipTheme } from '../../utils/vipTheme'

function formatBirthday(value?: string) {
  if (!value?.trim()) return null
  const date = value.slice(0, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return date
  const [year, month, day] = date.split('-')
  return `${year}/${month}/${day}`
}

function formatMobile(value?: string) {
  const mobile = value?.trim()
  if (!mobile) return null
  if (/^09\d{8}$/.test(mobile)) {
    return `${mobile.slice(0, 4)} ${mobile.slice(4, 7)} ${mobile.slice(7)}`
  }
  return mobile
}

function formatMoney(amount?: number) {
  return `$${(amount ?? 0).toLocaleString()}`
}

function ProfileSkeleton() {
  return (
    <Dashboard>
      <Scroll aria-busy="true" aria-label="載入中">
        <UserHeaderSkeleton />
        <Skeleton $variant="wide" />
        <Skeleton $variant="wide" />
      </Scroll>
      <BottomNav />
    </Dashboard>
  )
}

export default function ProfilePage() {
  const dispatch = useAppDispatch()
  const { data, loading, error } = useAppSelector(
    (state) => state.userReducer.getUser,
  )
  const user = data?.user

  useEffect(() => {
    if (!user && !loading && !error) {
      void dispatch(getUser())
    }
  }, [dispatch, error, loading, user])

  if (loading || (!user && !error)) {
    return <ProfileSkeleton />
  }

  const vipTheme = resolveVipTheme(user?.vip)
  const prepaidFeed = (user?.prepaidFeed ?? 0).toLocaleString()
  const storedCredit = (user?.storedCredit ?? 0).toLocaleString()
  const spend = formatMoney(user?.totalSpend)
  const coupons = (user?.couponCount ?? 0).toLocaleString()
  const birthday = formatBirthday(user?.birthday)
  const mobile = formatMobile(user?.mobile)

  return (
    <Dashboard $vip={vipTheme}>
      <Scroll>
        <UserHeader user={user} />

        <ProfileCard>
          <CardTitle>個人資料</CardTitle>
          <ProfileList>
            <div>
              <dt>電話</dt>
              <dd>{mobile ?? <PlaceholderText>0912 345 678</PlaceholderText>}</dd>
            </div>
            <div>
              <dt>生日</dt>
              <dd>{birthday ?? <PlaceholderText>1990/01/01</PlaceholderText>}</dd>
            </div>
            <div>
              <dt>餌料寄杯</dt>
              <dd>{prepaidFeed}</dd>
            </div>
            <div>
              <dt>儲值金</dt>
              <dd>{storedCredit}</dd>
            </div>
            <div>
              <dt>累積消費</dt>
              <dd>{spend}</dd>
            </div>
            <div>
              <dt>優惠券</dt>
              <dd>{coupons}</dd>
            </div>
          </ProfileList>
        </ProfileCard>

        <FavoriteSpeciesCard />
      </Scroll>

      <BottomNav />
    </Dashboard>
  )
}

const ProfileCard = styled(Card)`
  margin-top: 0.85rem;
  padding: 1rem 1.1rem 1.05rem;
`

const CardTitle = styled.p`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
`

const ProfileList = styled.dl`
  display: grid;
  gap: 0.85rem;
  margin: 0.9rem 0 0;

  div {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
  }

  dt {
    color: var(--dash-muted);
    font-size: 0.82rem;
  }

  dd {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
  }
`
