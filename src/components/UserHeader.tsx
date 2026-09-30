import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled, { css } from 'styled-components'

import { Card, Eyebrow, PlaceholderText, Skeleton } from './Dashboard'
import type { UserProfile } from '../utils/user'
import {
  resolveVipTheme,
  VIP_TAG_BG,
  VIP_TAG_COLOR,
  type VipThemeKey,
} from '../utils/vipTheme'


const DEFAULT_EYEBROW = '歡迎回來'

const MEMBER_CARD_ART: Partial<Record<VipThemeKey, string>> = {
  silver: '/test/card-silver-h.png',
  gold: '/test/card-gold-h.png',
  black: '/test/card-black-h.png',
}

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

function formatVipExpiry(value?: string | null) {
  if (!value?.trim()) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}

function resolveVipExpiry(user?: UserProfile | null) {
  const vip = user?.vip
  const baseTier =
    vip?.slug === 'normal' || vip?.rank === 1 || vip?.name === '一般會員'
  const forever =
    baseTier ||
    (user?.vipExpiresForever ?? user?.vipProgress?.vipExpiresForever)
  if (forever) return '永遠'
  return formatVipExpiry(user?.vipExpiresAt ?? user?.vipProgress?.vipExpiresAt)
}

function formatBirthday(value?: string) {
  if (!value?.trim()) return null
  const date = value.slice(0, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return date
  const [year, month, day] = date.split('-')
  return `${year}/${month}/${day}`
}

function formatMobile(value?: string) {
  const mobile = value?.trim()
  if (!mobile) return null
  if (/^09\d{8}$/.test(mobile)) {
    return `${mobile.slice(0, 4)} ${mobile.slice(4, 7)} ${mobile.slice(7)}`
  }
  return mobile
}

function formatMoney(amount?: number) {
  return `$${(amount ?? 0).toLocaleString()}`
}

type UserHeaderProps = {
  user?: UserProfile | null
  /** @default 歡迎回來 */
  eyebrow?: string
  onProfileClick?: () => void
}

export function UserHeaderSkeleton() {
  return (
    <UserCard>
      <Skeleton $variant="avatar" />
      <UserCopy>
        <Skeleton $variant="eyebrow" />
        <Skeleton $variant="title" />
      </UserCopy>
    </UserCard>
  )
}

export default function UserHeader({
  user,
  eyebrow = DEFAULT_EYEBROW,
  onProfileClick,
}: UserHeaderProps) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const displayName = user?.displayName?.trim()
  const vipName = user?.vip?.name?.trim() || '銅卡'
  const nextVipName = user?.nextVip?.name?.trim()
  const spendToNext = (user?.spendToNext ?? 0).toLocaleString()
  const vipExpiry = resolveVipExpiry(user)
  const vipTheme = resolveVipTheme(user?.vip)
  // 一般會員沿用銀卡卡面
  const cardTheme: VipThemeKey = vipTheme === 'bronze' ? 'silver' : vipTheme

  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

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
          aria-label="會員詳情"
          onClick={() => setOpen(true)}
        >
          <BarcodeIcon />
          會員詳情
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
            aria-label="關閉會員詳情"
            onClick={() => setOpen(false)}
          />
          <BarcodeSheet role="dialog" aria-modal="true" aria-labelledby="member-detail-title">
            <BarcodeClose type="button" aria-label="關閉" onClick={() => setOpen(false)}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6 6 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </BarcodeClose>
            <BarcodeTitle id="member-detail-title">會員詳情</BarcodeTitle>
            
            {/* 新的V1會員卡片樣式 */}
            <V1MemberCard $theme={cardTheme} $art={MEMBER_CARD_ART[cardTheme]}>
              <V1CardHead>
                <V1Identity>
                  {user?.avatarUrl ? (
                    <V1Avatar src={user.avatarUrl} alt="" />
                  ) : (
                    <V1AvatarFallback>{displayName?.charAt(0) || '?'}</V1AvatarFallback>
                  )}
                  <V1CardCopy>
                    <V1Membership>MEMBERSHIP</V1Membership>
                    <V1CardTitle>{vipName}</V1CardTitle>
                  </V1CardCopy>
                </V1Identity>
                <V1VipBadge>VIP</V1VipBadge>
              </V1CardHead>
              
              <V1CardContent>
                {vipExpiry ? (
                  <V1ExpiryRow>
                    <span>期限</span>
                    <V1ExpiryValue>{vipExpiry}</V1ExpiryValue>
                  </V1ExpiryRow>
                ) : null}
                {nextVipName && (
                  <V1ProgressSection>
                    <V1ProgressLabel>
                      <span>升級進度</span>
                      <V1ProgressValue>
                        ${(user?.totalSpend || 0).toLocaleString()}
                        <V1ProgressTotal>
                          {' '}/ ${((user?.totalSpend || 0) + (user?.spendToNext || 0)).toLocaleString()}
                        </V1ProgressTotal>
                      </V1ProgressValue>
                    </V1ProgressLabel>
                    <V1ProgressContainer>
                      <V1ProgressBar 
                        $progress={
                          user?.totalSpend && user?.spendToNext 
                            ? (user.totalSpend / (user.totalSpend + user.spendToNext)) * 100
                            : 0
                        } 
                      />
                    </V1ProgressContainer>
                  </V1ProgressSection>
                )}
              </V1CardContent>
            </V1MemberCard>
            <DetailList>
              <div>
                <dt>電話</dt>
                <dd>{formatMobile(user?.mobile) ?? <DetailPlaceholder>0912 345 678</DetailPlaceholder>}</dd>
              </div>
              <div>
                <dt>生日</dt>
                <dd>{formatBirthday(user?.birthday) ?? <DetailPlaceholder>1990/01/01</DetailPlaceholder>}</dd>
              </div>
              <div>
                <dt>累積消費</dt>
                <dd>{formatMoney(user?.totalSpend)}</dd>
              </div>
              {nextVipName ? (
                <div>
                  <dt>升級</dt>
                  <dd>再消費 ${spendToNext} 升級{nextVipName}</dd>
                </div>
              ) : null}
            </DetailList>
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
  gap: 1rem;
  padding: 1.25rem 7rem 1.25rem 1.3rem;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.08) 0%, 
    rgba(255, 255, 255, 0.03) 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.12),
    0 4px 16px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.03) 0%, 
      transparent 50%);
    border-radius: inherit;
    pointer-events: none;
  }
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
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.2;

  &[type='button'] {
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    text-align: left;
    cursor: pointer;
  }
`

const VipTag = styled.button<{ $theme: VipThemeKey }>`
  flex: 0 0 auto;
  padding: 0.22rem 0.65rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  background: linear-gradient(135deg, 
    ${({ $theme }) => VIP_TAG_BG[$theme]}dd, 
    ${({ $theme }) => VIP_TAG_BG[$theme]}aa);
  color: ${({ $theme }) => VIP_TAG_COLOR[$theme]};
  font: inherit;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  line-height: 1.2;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 
      0 4px 12px rgba(0, 0, 0, 0.2),
      0 0 16px ${({ $theme }) => VIP_TAG_BG[$theme]}40,
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
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
  top: 0.8rem;
  right: 0.8rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  flex: 0 0 auto;
  padding: 0.4rem 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.12) 0%, 
    rgba(255, 255, 255, 0.06) 100%);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  color: rgba(255, 255, 255, 0.9);
  font: inherit;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);

  &:hover {
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.18) 0%, 
      rgba(255, 255, 255, 0.12) 100%);
    border-color: rgba(255, 255, 255, 0.2);
    color: #ffffff;
    transform: translateY(-1px);
    box-shadow: 
      0 4px 12px rgba(0, 0, 0, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }

  svg {
    width: 0.95rem;
    height: 0.95rem;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
  }
`

const BarcodeOverlay = styled.button`
  position: fixed;
  inset: 0;
  z-index: 20;
  border: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  cursor: pointer;
`

const BarcodeSheet = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 21;
  width: min(calc(100% - 2rem), 24rem);
  max-height: min(85svh, 42rem);
  overflow: auto;
  padding: 1.5rem 1.25rem 1.25rem;
  border-radius: 1.5rem;
  background: rgba(0, 0, 0, 0.95);
  color: #ffffff;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 
    0 32px 80px rgba(0, 0, 0, 0.6),
    0 16px 40px rgba(0, 0, 0, 0.4),
    0 4px 12px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
`

const BarcodeTitle = styled.p`
  margin: 0 0 0.85rem;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  text-align: center;
  color: #ffffff;
`


const DetailList = styled.dl`
  display: grid;
  gap: 0.5rem;
  margin: 0.95rem 0 0;

  div {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.5rem 0;
  }

  dt {
    flex: 0 0 auto;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.82rem;
    font-weight: 500;
  }

  dd {
    margin: 0;
    color: #ffffff;
    font-size: 0.95rem;
    font-weight: 600;
    text-align: right;
  }
`

const DetailPlaceholder = styled.span`
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
  font-style: italic;
`

const BarcodeClose = styled.button`
  position: absolute;
  top: 0.7rem;
  right: 0.7rem;
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #ff453a;
  }

  svg {
    width: 1.15rem;
    height: 1.15rem;
  }
`

// V1 Member Card Styles - Premium Gold Card
const V1MemberCard = styled.div<{ $theme?: VipThemeKey; $art?: string }>`
  position: relative;
  width: 100%;
  min-height: 180px;
  padding: 0;
  margin-bottom: 20px;
  border-radius: 16px;
  overflow: hidden;
  box-sizing: border-box;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  aspect-ratio: 85/54; /* 標準信用卡比例 */
  /* 文字色：銀卡用深色；金卡、黑卡用白字，各自搭配陰影與底部暈影確保可讀 */
  --card-ink: ${({ $theme }) => ($theme === 'silver' ? '#12161b' : '#ffffff')};
  --card-ink-soft: ${({ $theme }) =>
    $theme === 'silver' ? '#2b323a' : 'rgba(255, 255, 255, 0.92)'};
  --card-ink-shadow: ${({ $theme }) =>
    $theme === 'silver'
      ? '0 1px 0 rgba(255, 255, 255, 0.85), 0 0 8px rgba(255, 255, 255, 0.6)'
      : $theme === 'gold'
        ? '0 1px 2px rgba(60, 35, 0, 0.85), 0 0 10px rgba(60, 35, 0, 0.55)'
        : '0 1px 3px rgba(0, 0, 0, 0.9), 0 0 10px rgba(0, 0, 0, 0.6)'};
  --card-track: ${({ $theme }) =>
    $theme === 'silver' ? 'rgba(0, 0, 0, 0.22)' : 'rgba(0, 0, 0, 0.35)'};
  --card-bar: ${({ $theme }) =>
    $theme === 'black'
      ? 'linear-gradient(90deg, #b9a3ff, #ffffff)'
      : $theme === 'gold'
        ? 'linear-gradient(90deg, #ffe9a8, #ffffff)'
        : 'linear-gradient(90deg, #3a424c, #12161b)'};
  --card-bar-glow: ${({ $theme }) =>
    $theme === 'black' ? 'rgba(167, 139, 250, 0.8)' : 'rgba(0, 0, 0, 0.15)'};
  --card-pill-bg: ${({ $theme }) =>
    $theme === 'silver' ? 'rgba(255, 255, 255, 0.55)' : 'rgba(0, 0, 0, 0.32)'};
  --card-pill-border: ${({ $theme }) =>
    $theme === 'silver' ? 'rgba(0, 0, 0, 0.55)' : 'rgba(255, 255, 255, 0.7)'};
  --card-scrim: ${({ $theme }) =>
    $theme === 'silver'
      ? 'rgba(255, 255, 255, 0.55)'
      : $theme === 'gold'
        ? 'rgba(70, 40, 0, 0.55)'
        : 'rgba(0, 0, 0, 0.4)'};

  /* 金屬背景；銀／金／黑改用卡面圖 */
  background: ${({ $art, $theme = 'gold' }) => {
    if ($art) return `center / 100% 100% no-repeat url("${$art}")`
    switch ($theme) {
      case 'bronze':
        return `linear-gradient(135deg, 
          #cd7f32 0%, 
          #e6a85c 25%, 
          #ffd700 50%, 
          #e6a85c 75%, 
          #cd7f32 100%)`;
      case 'silver':
        return `linear-gradient(135deg, 
          #c0c0c0 0%, 
          #e8e8e8 25%, 
          #ffffff 50%, 
          #e8e8e8 75%, 
          #c0c0c0 100%)`;
      case 'gold':
        return `linear-gradient(135deg, 
          #b8860b 0%, 
          #daa520 25%, 
          #ffd700 50%, 
          #daa520 75%, 
          #b8860b 100%)`;
      case 'black':
        return `linear-gradient(135deg, 
          #1a1a1a 0%, 
          #2d2d2d 25%, 
          #404040 50%, 
          #2d2d2d 75%, 
          #1a1a1a 100%)`;
      default:
        return `linear-gradient(135deg, 
          #b8860b 0%, 
          #daa520 25%, 
          #ffd700 50%, 
          #daa520 75%, 
          #b8860b 100%)`;
    }
  }};
  
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2);
  
  /* 金屬質感覆蓋層 */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      linear-gradient(45deg, 
        transparent 0%, 
        rgba(255, 255, 255, 0.1) 25%, 
        transparent 50%, 
        rgba(255, 255, 255, 0.1) 75%, 
        transparent 100%),
      radial-gradient(circle at 30% 30%, 
        rgba(255, 255, 255, 0.2) 0%, 
        transparent 50%);
    pointer-events: none;
  }
  
  /* 垂直條紋 */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 30%;
    width: 8px;
    height: 100%;
    background: linear-gradient(to bottom, 
      rgba(0, 0, 0, 0.8) 0%, 
      rgba(0, 0, 0, 0.6) 50%, 
      rgba(0, 0, 0, 0.8) 100%);
    box-shadow: 
      inset 1px 0 0 rgba(255, 255, 255, 0.2),
      inset -1px 0 0 rgba(0, 0, 0, 0.3);
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 12px 48px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.4),
      inset 0 -1px 0 rgba(0, 0, 0, 0.3);
  }

  ${({ $art }) =>
    $art &&
    css`
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);

      /* 上下暈影：墊在文字後方，避免被卡面波紋干擾 */
      &::before,
      &::after {
        content: '';
        position: absolute;
        z-index: 1;
        pointer-events: none;
        transform: none;
        width: auto;
        right: auto;
      }

      &::before {
        inset: 0 0 auto 0;
        height: 48%;
        background: radial-gradient(
          ellipse 90% 100% at 30% 0%,
          var(--card-scrim) 0%,
          transparent 100%
        );
      }

      &::after {
        inset: auto 0 0 0;
        height: 60%;
        background: radial-gradient(
          ellipse 80% 100% at 82% 100%,
          var(--card-scrim) 0%,
          transparent 100%
        );
        box-shadow: none;
      }

      &:hover {
        box-shadow: 0 14px 36px rgba(0, 0, 0, 0.45);
      }
    `}
`

/* 內容包裝器 */
const V1CardContent = styled.div`
  position: absolute;
  z-index: 2;
  right: 22px;
  bottom: 16px;
  width: 62%;
  display: flex;
  flex-direction: column;
  gap: 9px;
`



/* 卡片頂部：左側等級名稱、右側 VIP 標籤 */
const V1CardHead = styled.div`
  position: absolute;
  top: 18px;
  left: 22px;
  right: 22px;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`

const V1CardCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
`

const V1Membership = styled.div`
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.3em;
  color: var(--card-ink-soft);
  text-shadow: var(--card-ink-shadow);
`

const V1CardTitle = styled.h3`
  margin: 0;
  font-size: 26px;
  line-height: 1.15;
  font-weight: 900;
  letter-spacing: 0.04em;
  color: var(--card-ink);
  text-shadow: var(--card-ink-shadow);
`

const V1VipBadge = styled.div`
  flex: 0 0 auto;
  padding: 3px 10px 3px 12px;
  border: 1px solid var(--card-pill-border);
  border-radius: 999px;
  background: var(--card-pill-bg);
  color: var(--card-ink);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.22em;
  text-shadow: var(--card-ink-shadow);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
`

/* 底部資訊靠右對齊，左下角留給卡面 Logo */
const V1ProgressSection = styled.div``

const V1ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--card-ink-soft);
  text-shadow: var(--card-ink-shadow);
`

const V1ProgressValue = styled.span`
  font-size: 15px;
  font-weight: 900;
  letter-spacing: 0.02em;
  font-variant-numeric: tabular-nums;
  color: var(--card-ink);
  text-shadow: var(--card-ink-shadow);
`

const V1ProgressTotal = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: var(--card-ink-soft);
`

const V1ProgressContainer = styled.div`
  position: relative;
  height: 5px;
  border-radius: 999px;
  overflow: hidden;
  background: var(--card-track);
`

const V1ProgressBar = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${({ $progress }) => Math.min($progress, 100)}%;
  border-radius: inherit;
  background: var(--card-bar);
  box-shadow: 0 0 8px var(--card-bar-glow);
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
`

const V1ExpiryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--card-ink-soft);
  text-shadow: var(--card-ink-shadow);
`

const V1ExpiryValue = styled.span`
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 0.04em;
  font-variant-numeric: tabular-nums;
  color: var(--card-ink);
`

const V1Identity = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`

const v1AvatarStyles = css`
  flex: 0 0 auto;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  background: #2c2c2e;
`

const V1Avatar = styled.img`
  ${v1AvatarStyles}
  object-fit: cover;
`

const V1AvatarFallback = styled.span`
  ${v1AvatarStyles}
  display: grid;
  place-items: center;
  color: #ffffff;
  font-size: 20px;
  font-weight: 800;
`