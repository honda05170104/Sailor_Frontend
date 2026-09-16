import styled, { css, keyframes } from 'styled-components'

import { VIP_PAGE_BG, type VipThemeKey } from '../utils/vipTheme'

const shimmer = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(100%);
  }
`

export const Dashboard = styled.main<{ $vip?: VipThemeKey }>`
  --dash-bg: #000000;
  --dash-card: #1c1c1e;
  --dash-text: #ffffff;
  --dash-muted: #8e8e93;
  min-height: 100svh;
  background: ${({ $vip }) => ($vip ? VIP_PAGE_BG[$vip] : 'var(--dash-bg)')};
  color: var(--dash-text);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif;
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
  border-radius: 1.35rem;
`

export const Eyebrow = styled.p`
  margin: 0 0 0.25rem;
  color: var(--dash-muted);
  font-size: 0.95rem;
`

export const PlaceholderText = styled.span`
  color: var(--dash-muted);
  font-weight: 500;
`

export const Skeleton = styled.span<{
  $variant?: 'avatar' | 'eyebrow' | 'title' | 'tag' | 'stat' | 'line' | 'wide'
}>`
  display: block;
  overflow: hidden;
  border-radius: 0.75rem;
  background: #2c2c2e;
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
          border-radius: 1.35rem;
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
          border-radius: 1.35rem;
        `
      default:
        return css`
          height: 1rem;
        `
    }
  }}
`
