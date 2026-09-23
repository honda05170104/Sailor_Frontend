import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import BottomNav from '../../components/BottomNav'
import { Card, Dashboard, Scroll } from '../../components/Dashboard'
import HomeSkeleton from '../../components/HomeSkeleton'
import StoreEventsCarousel from '../../components/StoreEventsCarousel'
import UserHeader from '../../components/UserHeader'
import { useAppDispatch, useAppSelector } from '../../customHooks/useApp'
import { getUser } from '../../redux/features/user'
import { resolveVipTheme } from '../../utils/vipTheme'

export default function HomePage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { data, loading, error } = useAppSelector(
    (state) => state.userReducer.getUser,
  )
  const user = data?.user
  const [infoOpen, setInfoOpen] = useState<'feed' | 'points' | null>(null)

  useEffect(() => {
    if (!user && !loading && !error) {
      void dispatch(getUser())
    }
  }, [dispatch, error, loading, user])

  useEffect(() => {
    if (!infoOpen) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setInfoOpen(null)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [infoOpen])

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
        <UserHeader user={user} />

        <Stats aria-label="會員資料">
          <StatCard
            as="button"
            type="button"
            onClick={() => setInfoOpen('feed')}
            aria-label="餌料寄杯說明"
          >
            <StatValue>{prepaidFeed}</StatValue>
            <StatLabel>餌料寄杯</StatLabel>
          </StatCard>
          <StatCard
            as="button"
            type="button"
            onClick={() => setInfoOpen('points')}
            aria-label="點數說明"
          >
            <StatValue>{storedCredit}</StatValue>
            <StatLabel>點數</StatLabel>
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

        <SocialRow aria-label="社群媒體">
          <SocialLink
            href="https://www.facebook.com/sailoreptile"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M14 8.2h2.2V5H14c-2.5 0-4.2 1.8-4.2 4.6V12H7.5v3.2h2.3V22h3.4v-6.8h2.5l.5-3.2h-3V10c0-.9.3-1.8 1.8-1.8z"
                fill="currentColor"
              />
            </svg>
          </SocialLink>
          <SocialLink
            href="https://www.instagram.com/sailor_reptile2002/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 7.2A4.8 4.8 0 1 0 16.8 12 4.8 4.8 0 0 0 12 7.2zm0 7.9A3.1 3.1 0 1 1 15.1 12 3.1 3.1 0 0 1 12 15.1zM17.4 6.9a1.12 1.12 0 1 0 1.12 1.12A1.12 1.12 0 0 0 17.4 6.9zM12 3.5c-2.3 0-2.6 0-3.5.05a5.4 5.4 0 0 0-3.8 1.55A5.4 5.4 0 0 0 3.15 8.9C3.1 9.8 3.1 10.1 3.1 12.4s0 2.6.05 3.5a5.4 5.4 0 0 0 1.55 3.8 5.4 5.4 0 0 0 3.8 1.55c.9.05 1.2.05 3.5.05s2.6 0 3.5-.05a5.4 5.4 0 0 0 3.8-1.55 5.4 5.4 0 0 0 1.55-3.8c.05-.9.05-1.2.05-3.5s0-2.6-.05-3.5a5.4 5.4 0 0 0-1.55-3.8A5.4 5.4 0 0 0 15.5 3.55C14.6 3.5 14.3 3.5 12 3.5zm0 1.7c2.26 0 2.53 0 3.42.05a3.7 3.7 0 0 1 2.5 1.02 3.7 3.7 0 0 1 1.02 2.5c.04.89.05 1.16.05 3.42s0 2.53-.05 3.42a3.7 3.7 0 0 1-1.02 2.5 3.7 3.7 0 0 1-2.5 1.02c-.89.04-1.16.05-3.42.05s-2.53 0-3.42-.05a3.7 3.7 0 0 1-2.5-1.02 3.7 3.7 0 0 1-1.02-2.5C5.55 14.73 5.5 14.46 5.5 12.2s0-2.53.05-3.42a3.7 3.7 0 0 1 1.02-2.5 3.7 3.7 0 0 1 2.5-1.02C9.47 5.22 9.74 5.2 12 5.2z"
                fill="currentColor"
              />
            </svg>
          </SocialLink>
          <SocialLink
            href="https://www.threads.com/@sailor_reptile2002?hl=zh-tw"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Threads"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M16.3 10.1c-.14-.07-.28-.13-.43-.18a4.8 4.8 0 0 0-.2-2.5 4.4 4.4 0 0 0-2.9-2.5c-.78-.24-1.7-.28-2.6-.1a5 5 0 0 0-3.5 2.6c-.38.7-.56 1.55-.56 2.45v.04h2.05v-.03c0-.52.1-1.02.34-1.45.36-.66 1-1.1 1.8-1.25.62-.12 1.28-.06 1.82.22.55.28.95.75 1.1 1.35.12.46.1.95-.01 1.55-1.16-.2-2.4-.2-3.58.1-1.35.34-2.45 1.15-2.95 2.35-.28.67-.33 1.4-.15 2.15.3 1.25 1.25 2.2 2.5 2.55.9.25 1.9.22 2.8-.05.72-.22 1.35-.6 1.85-1.12.05.45.05.9-.05 1.35-.18.8-.7 1.45-1.45 1.8-.7.32-1.55.4-2.35.2-.75-.18-1.35-.65-1.65-1.3l-1.9.7c.5 1.2 1.55 2.05 2.85 2.4 1.15.3 2.4.25 3.5-.2 1.15-.48 2-1.4 2.35-2.6.22-.8.25-1.65.15-2.5.85-.7 1.4-1.65 1.55-2.75.1-.7 0-1.4-.28-2.05a3.7 3.7 0 0 0-1.15-1.4zm-3.15 4.85c-.45.45-1.1.7-1.75.65-.7-.05-1.3-.4-1.55-1-.12-.32-.12-.68 0-1 .2-.55.75-1 1.65-1.2.7-.16 1.45-.16 2.2 0-.15.7-.55 1.35-1.25 1.55z"
                fill="currentColor"
              />
            </svg>
          </SocialLink>
        </SocialRow>
      </Scroll>

      <BottomNav />

      {infoOpen ? (
        <>
          <ModalOverlay
            type="button"
            aria-label="關閉說明"
            onClick={() => setInfoOpen(null)}
          />
          <ModalSheet
            role="dialog"
            aria-modal="true"
            aria-labelledby="info-title"
          >
            <ModalTitle id="info-title">
              {infoOpen === 'feed' ? '餌料寄杯' : '點數'}
            </ModalTitle>
            {infoOpen === 'feed' ? (
              <>
                <ModalBody>
                  餌料寄杯是預先存放在門市的飼料／餌料份數。到店時可直接取用，結帳會依寄杯數量扣除。
                </ModalBody>
                <ModalBody>
                  實際可用數量以門市系統為準；若有疑問，歡迎向店員確認。
                </ModalBody>
              </>
            ) : (
              <ModalBody>一元可以折抵一點。</ModalBody>
            )}
            <ModalClose type="button" onClick={() => setInfoOpen(null)}>
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
  color: var(--color-white);

  svg {
    width: 2.1rem;
    height: 2.1rem;
  }
`

const SocialRow = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  margin: 1.15rem 0 0.35rem;
`

const SocialLink = styled.a`
  display: grid;
  place-items: center;
  width: 2.6rem;
  height: 2.6rem;
  border: 1px solid var(--color-glass-border);
  border-radius: 50%;
  background: var(--color-glass);
  color: var(--color-white);
  text-decoration: none;
  transition: background 160ms ease, color 160ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }

  svg {
    width: 1.2rem;
    height: 1.2rem;
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
