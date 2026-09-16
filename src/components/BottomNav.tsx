import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { useAppDispatch, useAppSelector } from '../customHooks/useApp'
import { logout } from '../redux/features/user'

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

function HamburgerIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 7h14M5 12h14M5 17h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function BottomNav() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const loggingOut = useAppSelector((state) => state.userReducer.logout.loading)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <>
      {menuOpen ? (
        <MenuOverlay type="button" aria-label="關閉選單" onClick={() => setMenuOpen(false)} />
      ) : null}
      {menuOpen ? (
        <Menu role="menu" aria-label="更多">
          <MenuItem
            type="button"
            role="menuitem"
            onClick={() => {
              setMenuOpen(false)
              navigate('/profile')
            }}
          >
            個人頁
          </MenuItem>
          <MenuItem
            type="button"
            role="menuitem"
            onClick={() => {
              setMenuOpen(false)
              navigate('/vip')
            }}
          >
            會員權益
          </MenuItem>
          <MenuItem
            type="button"
            role="menuitem"
            onClick={() => {
              setMenuOpen(false)
              navigate('/coupons')
            }}
          >
            優惠券
          </MenuItem>
          <MenuItem
            type="button"
            role="menuitem"
            onClick={() => {
              setMenuOpen(false)
              navigate('/store')
            }}
          >
            門市資訊
          </MenuItem>
          <MenuItem
            type="button"
            role="menuitem"
            $danger
            disabled={loggingOut}
            onClick={() => void dispatch(logout())}
          >
            {loggingOut ? '登出中…' : '登出'}
          </MenuItem>
        </Menu>
      ) : null}
      <Nav aria-label="主要導覽">
        <NavBtn
          type="button"
          $active={!menuOpen && pathname === '/'}
          aria-label="首頁"
          onClick={() => navigate('/')}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M6 17V11M12 17V7M18 17v-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </NavBtn>
        <NavBtn
          type="button"
          $active={!menuOpen && pathname === '/transactions'}
          aria-label="交易紀錄"
          onClick={() => navigate('/transactions')}
        >
          <ReceiptIcon />
        </NavBtn>
        <NavBtn
          type="button"
          $active={menuOpen}
          aria-label="選單"
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <HamburgerIcon />
        </NavBtn>
      </Nav>
    </>
  )
}

const MenuOverlay = styled.button`
  position: fixed;
  inset: 0;
  z-index: 11;
  border: 0;
  background: rgba(0, 0, 0, 0.45);
`

const Menu = styled.div`
  position: fixed;
  left: 50%;
  bottom: 5.15rem;
  z-index: 12;
  width: min(calc(100% - 2rem), 16rem);
  padding: 0.45rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.25rem;
  background: rgba(28, 28, 30, 0.96);
  backdrop-filter: blur(16px);
  transform: translateX(-50%);
`

const MenuItem = styled.button<{ $danger?: boolean }>`
  width: 100%;
  min-height: 2.65rem;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: ${({ $danger }) => ($danger ? '#ff453a' : '#d1d1d6')};
  font-size: 0.95rem;
  font-weight: 650;
  cursor: pointer;

  &:disabled {
    cursor: wait;
    opacity: 0.78;
  }
`

const Nav = styled.nav`
  position: fixed;
  inset: auto 50% 1.1rem;
  z-index: 13;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  width: min(calc(100% - 2rem), 16rem);
  padding: 0.45rem;
  border-radius: 999px;
  background: rgba(28, 28, 30, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
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

  svg {
    width: 1.15rem;
    height: 1.15rem;
  }
`
