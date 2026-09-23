import styled, { css, keyframes } from 'styled-components'

import { type VipThemeKey } from '../utils/vipTheme'

const shimmer = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(100%);
  }
`

const VIP_GLOW: Record<VipThemeKey, string> = {
  bronze: 'rgba(180, 110, 50, 0.28)',
  silver: 'rgba(140, 160, 190, 0.28)',
  gold: 'rgba(210, 170, 60, 0.28)',
  black: 'rgba(120, 120, 140, 0.22)',
}

export const Dashboard = styled.main<{ $vip?: VipThemeKey }>`
  --dash-bg: var(--color-black);
  --dash-card: var(--color-glass);
  --dash-card-border: var(--color-glass-border);
  --dash-glass: var(--color-glass-strong);
  --dash-text: var(--color-white);
  --dash-muted: var(--color-muted);
  --dash-blur: blur(22px);
  --dash-primary: var(--color-primary);
  --dash-accent: var(--color-accent);
  --dash-secondary: var(--color-secondary);
  position: relative;
  isolation: isolate;
  min-height: 100svh;
  overflow: hidden;
  background: var(--color-black);
  color: var(--dash-text);
  font-family: var(--font-body), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background:
      radial-gradient(
        ellipse 90% 55% at 50% -5%,
        ${({ $vip }) => ($vip ? VIP_GLOW[$vip] : 'rgba(120, 120, 140, 0.22)')} 0%,
        transparent 58%
      ),
      radial-gradient(ellipse 70% 45% at 50% 62%, rgba(55, 55, 70, 0.45), transparent 70%),
      radial-gradient(ellipse 50% 35% at 80% 20%, rgba(80, 80, 110, 0.18), transparent 55%),
      linear-gradient(180deg, #0a0a0c 0%, #050505 45%, #000000 100%);
  }
`

export const DashboardLoading = styled(Dashboard)`
  display: grid;
  place-items: center;
`

export const Status = styled.p`
  margin: 0;
  color: var(--dash-muted);
`

export const Scroll = styled.div`
  max-width: 28rem;
  margin: 0 auto;
  padding: 1rem 1rem 6.5rem;
`

export const Card = styled.section`
  background: var(--dash-card);
  border: 1px solid var(--dash-card-border);
  border-radius: 1.5rem;
  backdrop-filter: var(--dash-blur);
  -webkit-backdrop-filter: var(--dash-blur);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.28);
`

export const Eyebrow = styled.p`
  margin: 0 0 0.25rem;
  color: var(--dash-muted);
  font-size: 0.95rem;
`

export const SectionTitle = styled.h1`
  margin: 0.15rem 0 1rem;
  font-size: clamp(1.6rem, 6vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.15;
`

export const PlaceholderText = styled.span`
  color: var(--dash-muted);
  font-weight: 500;
`

export const Skeleton = styled.span<{
  $variant?: 'avatar' | 'eyebrow' | 'title' | 'tag' | 'stat' | 'line' | 'wide' | 'hero'
}>`
  display: block;
  overflow: hidden;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.06);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.08),
      transparent
    );
    animation: ${shimmer} 1.6s ease infinite;
  }

  ${({ $variant }) => {
    switch ($variant) {
      case 'avatar':
        return css`
          width: 4.25rem;
          height: 4.25rem;
          flex: 0 0 auto;
          border-radius: 50%;
        `
      case 'eyebrow':
        return css`
          width: 5rem;
          height: 0.75rem;
          margin-bottom: 0.45rem;
        `
      case 'title':
        return css`
          width: 8.5rem;
          height: 1.6rem;
        `
      case 'tag':
        return css`
          width: 6.5rem;
          height: 1.6rem;
          margin-top: 0.85rem;
          border-radius: 999px;
        `
      case 'stat':
        return css`
          min-height: 6.5rem;
          border-radius: 1.5rem;
        `
      case 'hero':
        return css`
          width: 11rem;
          height: 2.8rem;
          margin: 0.4rem auto 0;
          border-radius: 1rem;
        `
      case 'line':
        return css`
          height: 1.1rem;
          margin-top: 0.75rem;
        `
      case 'wide':
        return css`
          min-height: 5.5rem;
          margin-top: 0.85rem;
          border-radius: 1.5rem;
        `
      default:
        return css`
          height: 1rem;
        `
    }
  }}
`
