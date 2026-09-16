import { useEffect, useRef, useState } from 'react'
import JsBarcode from 'jsbarcode'
import { useNavigate } from 'react-router-dom'
import styled, { css } from 'styled-components'

import { Card, Eyebrow, PlaceholderText } from './Dashboard'
import type { UserProfile } from '../utils/user'
import {
  resolveVipTheme,
  VIP_TAG_BG,
  VIP_TAG_COLOR,
  type VipThemeKey,
} from '../utils/vipTheme'

function BarcodeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 6h1.2v12H4zm2.4 0h.9v12H6.4zm2.1 0H10v12H8.5zm2.6 0h.8v12h-.8zm2 0h1.5v12h-1.5zm2.6 0H17v12h-1.3zm2.5 0H20v12h-1.2z"
        fill="currentColor"
      />
    </svg>
  )
}

function memberCode(user?: UserProfile | null) {
  const mobile = user?.mobile?.trim()
  if (mobile) return mobile
  return user?.id?.trim() || ''
}

type UserHeaderProps = {
  user?: UserProfile | null
  eyebrow: string
  onProfileClick?: () => void
}

export default function UserHeader({
  user,
  eyebrow,
  onProfileClick,
}: UserHeaderProps) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)
  const displayName = user?.displayName?.trim()
  const code = memberCode(user)
  const vipName = user?.vip?.name?.trim() || '銅卡'
  const vipTheme = resolveVipTheme(user?.vip)

  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  useEffect(() => {
    if (!open || !code || !svgRef.current) return
    JsBarcode(svgRef.current, code, {
      format: 'CODE128',
      displayValue: true,
      fontSize: 14,
      margin: 8,
      background: '#ffffff',
      lineColor: '#111111',
      width: 2,
      height: 84,
    })
  }, [code, open])

  function avatar() {
    return user?.avatarUrl ? (
      <Avatar src={user.avatarUrl} alt="" />
    ) : (
      <AvatarFallback>{displayName?.charAt(0) || '?'}</AvatarFallback>
    )
  }

  return (
    <>
      <UserCard>
        <BarcodeBtn
          type="button"
          aria-label="會員條碼"
          onClick={() => setOpen(true)}
        >
          <BarcodeIcon />
          會員條碼
        </BarcodeBtn>
        {onProfileClick ? (
          <AvatarButton type="button" aria-label="個人頁" onClick={onProfileClick}>
            {avatar()}
          </AvatarButton>
        ) : (
          avatar()
        )}
        <UserCopy>
          <Eyebrow>{eyebrow}</Eyebrow>
          <NameRow>
            {onProfileClick ? (
              <UserName as="button" type="button" onClick={onProfileClick}>
                {displayName || <PlaceholderText>顯示名稱</PlaceholderText>}
              </UserName>
            ) : (
              <UserName>
                {displayName || <PlaceholderText>顯示名稱</PlaceholderText>}
              </UserName>
            )}
            <VipTag
              type="button"
              $theme={vipTheme}
              aria-label={`VIP 等級 ${vipName}`}
              onClick={() => navigate('/vip')}
            >
              {vipName}
            </VipTag>
          </NameRow>
        </UserCopy>
      </UserCard>

      {open ? (
        <>
          <BarcodeOverlay
            type="button"
            aria-label="關閉會員條碼"
            onClick={() => setOpen(false)}
          />
          <BarcodeSheet role="dialog" aria-modal="true" aria-labelledby="member-barcode-title">
            <BarcodeTitle id="member-barcode-title">會員條碼</BarcodeTitle>
            <BarcodeFrame>
              {code ? <svg ref={svgRef} /> : <BarcodeHint>尚無會員條碼</BarcodeHint>}
            </BarcodeFrame>
            <BarcodeHint>結帳時請出示此條碼</BarcodeHint>
          </BarcodeSheet>
        </>
      ) : null}
    </>
  )
}

export const UserCard = styled(Card)`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.95rem;
  padding: 1.15rem 6.75rem 1.15rem 1.2rem;
`

const avatarStyles = css`
  width: 4.25rem;
  height: 4.25rem;
  flex: 0 0 auto;
  border-radius: 50%;
  object-fit: cover;
  background: #2c2c2e;
`

const Avatar = styled.img`
  ${avatarStyles}
`

const AvatarFallback = styled.span`
  ${avatarStyles}
  display: grid;
  place-items: center;
  color: #ffffff;
  font-size: 1.4rem;
  font-weight: 700;
`

export const UserCopy = styled.div`
  min-width: 0;
`

const NameRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.45rem 0.55rem;
  min-width: 0;
`

const UserName = styled.h1`
  margin: 0;
  min-width: 0;
  font-size: clamp(1.6rem, 6vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.15;

  &[type='button'] {
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
  }
`

const VipTag = styled.button<{ $theme: VipThemeKey }>`
  flex: 0 0 auto;
  padding: 0.18rem 0.52rem;
  border: 0;
  border-radius: 999px;
  background: ${({ $theme }) => VIP_TAG_BG[$theme]};
  color: ${({ $theme }) => VIP_TAG_COLOR[$theme]};
  font: inherit;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.2;
  cursor: pointer;
`

const AvatarButton = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  flex: 0 0 auto;
  border-radius: 50%;
`

const BarcodeBtn = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  flex: 0 0 auto;
  padding: 0.32rem 0.62rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #ffffff;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 650;
  cursor: pointer;

  svg {
    width: 0.9rem;
    height: 0.9rem;
  }
`

const BarcodeOverlay = styled.button`
  position: fixed;
  inset: 0;
  z-index: 20;
  border: 0;
  background: rgba(0, 0, 0, 0.55);
`

const BarcodeSheet = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 21;
  width: min(calc(100% - 2rem), 22rem);
  padding: 1.2rem 1.1rem 1.15rem;
  border-radius: 1.35rem;
  background: #ffffff;
  color: #111111;
  transform: translate(-50%, -50%);
`

const BarcodeTitle = styled.p`
  margin: 0 0 0.85rem;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  text-align: center;
`

const BarcodeFrame = styled.div`
  overflow: hidden;
  padding: 0.75rem 0.5rem 0.4rem;
  border-radius: 0.9rem;
  background: #ffffff;

  svg {
    display: block;
    width: 100%;
    height: auto;
  }
`

const BarcodeHint = styled.p`
  margin: 0.7rem 0 0;
  color: #6e6e73;
  font-size: 0.78rem;
  text-align: center;
`
