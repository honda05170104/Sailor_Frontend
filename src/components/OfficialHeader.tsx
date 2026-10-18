import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { SectionTitle } from './Dashboard'

export default function OfficialHeader({ title }: { title: string }) {
  const navigate = useNavigate()
  const location = useLocation()
  // 'default' means this page was the entry point, so there is nothing to go back to.
  const canGoBack = location.key !== 'default'

  return (
    <Header>
      {canGoBack ? (
        <BackBtn type="button" aria-label="返回" onClick={() => navigate(-1)}>
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
      ) : null}
      <Title>{title}</Title>
    </Header>
  )
}

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
