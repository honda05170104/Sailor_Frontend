import styled from 'styled-components'

import BottomNav from '../../components/BottomNav'
import { Card, Dashboard, Scroll } from '../../components/Dashboard'

export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <Dashboard>
      <Scroll>
        <PageHeader>
          <PageTitle>{title}</PageTitle>
        </PageHeader>
        <EmptyCard>即將開放</EmptyCard>
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

const EmptyCard = styled(Card)`
  display: grid;
  place-items: center;
  min-height: 11rem;
  padding: 1.5rem 1.1rem;
  color: var(--dash-muted);
  font-size: 0.88rem;
  text-align: center;
`
