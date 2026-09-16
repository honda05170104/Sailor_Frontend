import styled from 'styled-components'

import BottomNav from '../components/BottomNav'
import { Card, Dashboard, Eyebrow, Scroll } from '../components/Dashboard'

const STORE = {
  name: '水手門市',
  address: '台北市範例區範例路 1 號',
  phone: '02-0000-0000',
  hours: '每日 12:00 – 21:00',
}

export default function StoreInfoPage() {
  return (
    <Dashboard>
      <Scroll>
        <PageHeader>
          <Eyebrow>門市服務</Eyebrow>
          <PageTitle>門市資訊</PageTitle>
        </PageHeader>

        <InfoCard>
          <StoreName>{STORE.name}</StoreName>
          <InfoRow>
            <InfoLabel>地址</InfoLabel>
            <InfoValue>{STORE.address}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>電話</InfoLabel>
            <InfoValue>{STORE.phone}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>營業時間</InfoLabel>
            <InfoValue>{STORE.hours}</InfoValue>
          </InfoRow>
        </InfoCard>
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

const InfoCard = styled(Card)`
  display: grid;
  gap: 1rem;
  padding: 1.25rem 1.1rem;
`

const StoreName = styled.h2`
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
`

const InfoRow = styled.div`
  display: grid;
  gap: 0.2rem;
`

const InfoLabel = styled.span`
  color: var(--dash-muted);
  font-size: 0.78rem;
  font-weight: 650;
`

const InfoValue = styled.p`
  margin: 0;
  font-size: 0.98rem;
  line-height: 1.45;
`
