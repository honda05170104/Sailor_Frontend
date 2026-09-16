import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import BottomNav from '../components/BottomNav'
import { Card, Dashboard, Scroll } from '../components/Dashboard'
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
  const [feedInfoOpen, setFeedInfoOpen] = useState(false)

  useEffect(() => {
    if (!user && !loading && !error) {
      void dispatch(getUser())
    }
  }, [dispatch, error, loading, user])

  useEffect(() => {
    if (!feedInfoOpen) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setFeedInfoOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [feedInfoOpen])

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
          <StatCard
            as="button"
            type="button"
            onClick={() => setFeedInfoOpen(true)}
            aria-label="餌料寄杯說明"
          >
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
            <FeatureLink type="button" onClick={() => navigate('/store')}>
              <FeatureIcon aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M4.5 10.2 6 5.5h12l1.5 4.7M5 10.5V20h14v-9.5M9 20v-5h6v5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </svg>
              </FeatureIcon>
              門市資訊
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

      {feedInfoOpen ? (
        <>
          <ModalOverlay
            type="button"
            aria-label="關閉說明"
            onClick={() => setFeedInfoOpen(false)}
          />
          <ModalSheet
            role="dialog"
            aria-modal="true"
            aria-labelledby="feed-info-title"
          >
            <ModalTitle id="feed-info-title">餌料寄杯</ModalTitle>
            <ModalBody>
              餌料寄杯是預先存放在門市的飼料／餌料份數。到店時可直接取用，結帳會依寄杯數量扣除。
            </ModalBody>
            <ModalBody>
              實際可用數量以門市系統為準；若有疑問，歡迎向店員確認。
            </ModalBody>
            <ModalClose type="button" onClick={() => setFeedInfoOpen(false)}>
              知道了
            </ModalClose>
          </ModalSheet>
        </>
      ) : null}
    </Dashboard>
  )
}

const Stats = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.65rem;
  margin-top: 0.85rem;
`

const StatValue = styled.p<{ $small?: boolean }>`
  margin: 0;
  color: var(--color-white);
  font-size: ${({ $small }) => ($small ? '1.15rem' : '1.55rem')};
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.2;
`

const StatCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  min-height: 6.5rem;
  padding: 0.85rem 0.5rem;
  text-align: center;

  &[type='button'] {
    color: inherit;
    font: inherit;
    cursor: pointer;
  }
`

const StatLabel = styled.p`
  margin: 0;
  color: var(--dash-muted);
  font-size: 0.82rem;
`

const FeatureCard = styled(Card)`
  margin-top: 0.85rem;
  padding: 1rem 1.1rem 1.05rem;
`

const FeatureTitle = styled.p`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
`

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.55rem;
  margin-top: 0.85rem;
`

const FeatureLink = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  min-height: 4.4rem;
  padding: 0.4rem 0.2rem;
  border: 0;
  border-radius: 1rem;
  background: #171a24;
  color: #aeb4c2;
  font: inherit;
  font-size: 0.72rem;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: background 160ms ease;

  &:hover {
    background: #1d2130;
  }
`

const FeatureIcon = styled.span`
  display: grid;
  place-items: center;
  color: var(--color-primary);

  svg {
    width: 2.1rem;
    height: 2.1rem;
  }
`

const ModalOverlay = styled.button`
  position: fixed;
  inset: 0;
  z-index: 20;
  border: 0;
  background: rgba(0, 0, 0, 0.55);
`

const ModalSheet = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 21;
  width: min(calc(100% - 2rem), 22rem);
  padding: 1.25rem 1.15rem 1.1rem;
  border: 1px solid var(--color-glass-border);
  border-radius: 1.35rem;
  background: rgba(22, 24, 32, 0.96);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
  transform: translate(-50%, -50%);
`

const ModalTitle = styled.h2`
  margin: 0 0 0.85rem;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.03em;
`

const ModalBody = styled.p`
  margin: 0 0 0.7rem;
  color: var(--dash-muted);
  font-size: 0.92rem;
  line-height: 1.55;

  &:last-of-type {
    margin-bottom: 1.1rem;
  }
`

const ModalClose = styled.button`
  width: 100%;
  min-height: 2.75rem;
  border: 0;
  border-radius: 999px;
  background: var(--color-primary);
  color: var(--color-white);
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
`
