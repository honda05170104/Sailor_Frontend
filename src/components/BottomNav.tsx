import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 4.2 4 11.2V20h5.5v-5.5h5V20H20v-8.8z"
        fill="currentColor"
      />
    </svg>
  )
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 12a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 12 12zm0 1.8c-3.1 0-7 1.6-7 4.2V20h14v-2c0-2.6-3.9-4.2-7-4.2z"
        fill="currentColor"
      />
    </svg>
  )
}

function ReceiptIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 4.5h10v15l-1.6-1-1.6 1-1.8-1-1.8 1-1.6-1-1.6 1zM9 8h6M9 11h6M9 14h3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <Nav aria-label="主要導覽">
      <NavBtn
        type="button"
        $active={pathname === '/profile'}
        aria-label="個人中心"
        onClick={() => navigate('/profile')}
      >
        <ProfileIcon />
      </NavBtn>
      <CenterBtn
        type="button"
        $active={pathname === '/'}
        aria-label="首頁"
        onClick={() => navigate('/')}
      >
        <HomeIcon />
      </CenterBtn>
      <NavBtn
        type="button"
        $active={pathname === '/transactions'}
        aria-label="交易紀錄"
        onClick={() => navigate('/transactions')}
      >
        <ReceiptIcon />
      </NavBtn>
    </Nav>
  )
}

const Nav = styled.nav`
  position: fixed;
  inset: auto 50% 1.1rem;
  z-index: 13;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  width: min(calc(100% - 2rem), 18rem);
  padding: 0.4rem;
  border-radius: 999px;
  background: rgba(18, 18, 22, 0.45);
  border: 1px solid var(--color-glass-border);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
  transform: translateX(-50%);
`

const NavBtn = styled.button<{ $active?: boolean }>`
  display: grid;
  place-items: center;
  flex: 1;
  min-height: 2.65rem;
  border: 0;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? 'rgba(255, 255, 255, 0.14)' : 'transparent')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#d1d1d6')};
  cursor: pointer;
  transition:
    background 160ms ease,
    color 160ms ease;

  svg {
    width: 1.2rem;
    height: 1.2rem;
  }
`

const CenterBtn = styled.button<{ $active?: boolean }>`
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 3.55rem;
  height: 3.55rem;
  margin: -0.55rem 0.1rem;
  border: 0;
  border-radius: 50%;
  background: ${({ $active }) =>
    $active ? 'var(--color-primary-strong)' : 'var(--color-primary)'};
  color: var(--color-white);
  cursor: pointer;
  box-shadow:
    0 8px 24px var(--color-primary-soft),
    0 0 0 4px rgba(5, 5, 5, 0.35);
  transition:
    background 160ms ease,
    transform 160ms ease;

  &:hover {
    transform: translateY(-1px);
  }

  svg {
    width: 1.55rem;
    height: 1.55rem;
  }
`
