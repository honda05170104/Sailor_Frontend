import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import BottomNav from '../components/BottomNav'
import { Dashboard, Scroll } from '../components/Dashboard'
import HomeSkeleton from '../components/HomeSkeleton'
import StoreEventsCarousel from '../components/StoreEventsCarousel'
import UserHeader from '../components/UserHeader'
import { useAppDispatch, useAppSelector } from '../customHooks/useApp'
import { getUser } from '../redux/features/user'
import { resolveVipTheme } from '../utils/vipTheme'

export default function HomePage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
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
    return <HomeSkeleton />
  }

  const vipTheme = resolveVipTheme(user?.vip)
  const prepaidFeed = (user?.prepaidFeed ?? 0).toLocaleString()
  const storedCredit = (user?.storedCredit ?? 0).toLocaleString()
  const coupons = (user?.couponCount ?? 0).toLocaleString()

  return (
    <Dashboard $vip={vipTheme}>
      <Scroll>
        <UserHeader
          user={user}
          eyebrow="歡迎回來"
          onProfileClick={() => navigate('/profile')}
        />

        <Stats aria-label="會員資料">
          <StatCard>
            <StatValue>{prepaidFeed}</StatValue>
            <StatLabel>餌料寄杯</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{storedCredit}</StatValue>
            <StatLabel>儲值金</StatLabel>
          </StatCard>
          <StatCard
            as="button"
            type="button"
            onClick={() => navigate('/coupons')}
            aria-label="優惠券"
          >
            <StatValue>{coupons}</StatValue>
            <StatLabel>優惠券</StatLabel>
          </StatCard>
        </Stats>

        <StoreEventsCarousel />

        <FeatureCard aria-label="功能">
          <FeatureTitle>功能</FeatureTitle>
          <FeatureGrid>
            <FeatureLink type="button" onClick={() => navigate('/order-mice')}>
              <FeatureIcon aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M7.2 13.2a4.8 4.8 0 1 1 9.3-1.5A3.7 3.7 0 1 1 14 20H9.2a3.8 3.8 0 0 1-2-6.8zM16.6 8.1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                    fill="currentColor"
                  />
                </svg>
              </FeatureIcon>
              訂購老鼠
            </FeatureLink>
            <FeatureLink type="button" onClick={() => navigate('/boarding')}>
              <FeatureIcon aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M4.5 11.5 12 5.2l7.5 6.3V20h-15zM9.2 20v-6h5.6v6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </svg>
              </FeatureIcon>
              寄宿申請
            </FeatureLink>
            <FeatureLink type="button" onClick={() => navigate('/profile')}>
              <FeatureIcon aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M12 12a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 12 12zm0 1.8c-3.1 0-7 1.6-7 4.2V20h14v-2c0-2.6-3.9-4.2-7-4.2z"
                    fill="currentColor"
                  />
                </svg>
              </FeatureIcon>
              個人頁
            </FeatureLink>
            <FeatureLink type="button" onClick={() => navigate('/vip')}>
              <FeatureIcon aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M8 5h8v3.2c0 2.1-1.4 3.9-3.4 4.4.7.4 1.2 1.1 1.4 1.9H9.9c.2-.8.7-1.5 1.4-1.9C9.4 12.1 8 10.3 8 8.2V5zm-2 1.5H5a2 2 0 0 0 2 2.1V7.5zm12 0V8.6A2 2 0 0 0 19 6.5h-1zm-6 11.5h2.4v1.8H10v-1.8z"
                    fill="currentColor"
                  />
                </svg>
              </FeatureIcon>
              會員權益
            </FeatureLink>
            <FeatureLink type="button" onClick={() => navigate('/coupons')}>
              <FeatureIcon aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M4.5 8.5h15v2.2a2.2 2.2 0 0 0 0 4.4v2.4h-15v-2.4a2.2 2.2 0 0 0 0-4.4zm5 2v5m5-5v5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </FeatureIcon>
              優惠券
            </FeatureLink>
            <FeatureLink type="button" onClick={() => navigate('/transactions')}>
              <FeatureIcon aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M7 4.5h10v15l-1.6-1-1.6 1-1.8-1-1.8 1-1.6-1-1.6 1zM9 8h6M9 11h6M9 14h3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </FeatureIcon>
              交易紀錄
            </FeatureLink>
          </FeatureGrid>
        </FeatureCard>
      </Scroll>

      <BottomNav />
    </Dashboard>
  )
}

const Stats = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.65rem;
  margin-top: 0.85rem;
`

const StatCard = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  min-height: 6.5rem;
  padding: 0.85rem 0.5rem;
  text-align: center;
  background: var(--dash-card);
  border-radius: 1.35rem;

  &[type='button'] {
    border: 0;
    color: inherit;
    font: inherit;
    cursor: pointer;
  }
`

const StatValue = styled.p<{ $small?: boolean }>`
  margin: 0;
  font-size: ${({ $small }) => ($small ? '1.15rem' : '1.55rem')};
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.2;
`

const StatLabel = styled.p`
  margin: 0;
  color: var(--dash-muted);
  font-size: 0.82rem;
`

const FeatureCard = styled.section`
  margin-top: 0.85rem;
  padding: 1rem 1.1rem 1.05rem;
  background: var(--dash-card);
  border-radius: 1.35rem;
`

const FeatureTitle = styled.p`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
`

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.45rem;
  margin-top: 0.85rem;
`

const FeatureLink = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.45rem;
  padding: 0.2rem 0.15rem 0.1rem;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
`

const FeatureIcon = styled.span`
  display: grid;
  place-items: center;
  width: 2.65rem;
  height: 2.65rem;
  border-radius: 0.95rem;
  background: rgba(255, 255, 255, 0.08);
  color: #d1d1d6;

  svg {
    width: 1.2rem;
    height: 1.2rem;
  }
`
