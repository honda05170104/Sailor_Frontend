import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import BottomNav from './BottomNav'
import { Dashboard, Scroll, SectionTitle } from './Dashboard'

type PageLayoutProps = {
  title: string
  /** Member pages show the bottom nav; official pages stay free of member UI. */
  nav?: boolean
  busy?: boolean
  children: ReactNode
}

export default function PageLayout({ title, nav = false, busy = false, children }: PageLayoutProps) {
  const navigate = useNavigate()

  return (
    <Dashboard>
      <PageScroll $nav={nav} aria-busy={busy || undefined}>
        <Header>
          {/* The member center is behind RequireAuth, which sends logged-out users to login. */}
          <BackBtn type="button" aria-label="回到會員中心" onClick={() => navigate('/')}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M15 5l-7 7 7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </BackBtn>
          <Title>{title}</Title>
        </Header>
        {children}
      </PageScroll>
      {nav ? <BottomNav /> : null}
    </Dashboard>
  )
}

const PageScroll = styled(Scroll)<{ $nav: boolean }>`
  padding-bottom: ${({ $nav }) => ($nav ? '6.5rem' : '2rem')};
`

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin: 0.15rem 0 1rem;
`

const Title = styled(SectionTitle)`
  margin: 0;
`

const BackBtn = styled.button`
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid var(--color-glass-border);
  border-radius: 50%;
  background: var(--color-glass);
  color: var(--color-white);
  cursor: pointer;

  svg {
    width: 1.1rem;
    height: 1.1rem;
  }
`
