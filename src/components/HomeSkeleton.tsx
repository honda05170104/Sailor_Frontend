import styled from 'styled-components'

import BottomNav from './BottomNav'
import { Dashboard, Scroll, Skeleton } from './Dashboard'
import { UserHeaderSkeleton } from './UserHeader'

export default function HomeSkeleton() {
  return (
    <Dashboard>
      <Scroll aria-busy="true" aria-label="載入中">
        <UserHeaderSkeleton />
        <Stats>
          <Skeleton $variant="stat" />
          <Skeleton $variant="stat" />
          <Skeleton $variant="stat" />
        </Stats>
        <Skeleton $variant="wide" />
        <Skeleton $variant="wide" />
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
