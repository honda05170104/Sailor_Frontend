import styled from 'styled-components'

import { Card } from './Dashboard'

export const ItemList = styled.div`
  display: grid;
  gap: 0.85rem;
`

export const ItemCard = styled(Card)<{ $muted?: boolean }>`
  padding: 1rem 1.1rem 1.05rem;
  opacity: ${({ $muted }) => ($muted ? 0.55 : 1)};
`

export const ItemTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
`

export const ItemName = styled.p`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.03em;
`

export const ItemMeta = styled.p`
  margin: 0.3rem 0 0;
  color: var(--dash-muted);
  font-size: 0.78rem;
`

export const ItemAmount = styled.p`
  margin: 0;
  flex: 0 0 auto;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: -0.03em;
`

export const ItemChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.75rem;
`

export const ItemChip = styled.span`
  padding: 0.28rem 0.6rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: #d1d1d6;
  font-size: 0.72rem;
`
