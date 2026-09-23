import styled from 'styled-components'

import BottomNav from '../../components/BottomNav'
import { Card, Dashboard, Scroll, SectionTitle } from '../../components/Dashboard'

export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <Dashboard>
      <Scroll>
        <SectionTitle>{title}</SectionTitle>
        <EmptyCard>即將開放</EmptyCard>
      </Scroll>
      <BottomNav />
    </Dashboard>
  )
}

const EmptyCard = styled(Card)`
  display: grid;
  place-items: center;
  min-height: 11rem;
  padding: 1.5rem 1.1rem;
  color: var(--dash-muted);
  font-size: 0.88rem;
  text-align: center;
`
