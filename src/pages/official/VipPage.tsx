import styled from 'styled-components'

import PageLayout from '../../components/PageLayout'

const TIERS = [
  {
    name: '一般會員',
    slug: 'normal',
    lines: [
      { tag: '升等', text: '單筆消費滿 2,888 元，或近一年累積消費滿 4,888 元，升為金卡' },
      { tag: '升等', text: '單筆消費滿 8,888 元，或近一年累積消費滿 10,000 元，升為黑卡' },
    ],
  },
  {
    name: '金卡',
    slug: 'gold',
    lines: [
      { tag: '續會', text: '會籍期間消費滿 4,888 元，保留金卡' },
      { tag: '降等', text: '會籍期間未滿 4,888 元，到期後退回一般會員' },
    ],
  },
  {
    name: '黑卡',
    slug: 'black',
    lines: [
      { tag: '續會', text: '會籍期間消費滿 10,000 元，保留黑卡' },
      { tag: '降等', text: '會籍期間滿 4,888 元、未滿 10,000 元，改為金卡' },
      { tag: '降等', text: '會籍期間未滿 4,888 元，到期後退回一般會員' },
    ],
  },
] as const

export default function VipPage() {
  return (
    <PageLayout title="會員權益">
      <Chart
        src="/vip-membership.jpg"
        alt="水手兩棲爬蟲．異寵會員制度。船員卡、金卡會員、黑卡會員的入會門檻、會籍、續等、購物優惠與各項福利對照。"
      />
      <RenewCard>
        <RenewTitle>
          <span>升等／降等</span>
          <span>續會方式</span>
        </RenewTitle>
        <RenewRows>
          {TIERS.map((tier) => (
            <RenewRow key={tier.slug}>
              <TierPill $slug={tier.slug}>{tier.name}</TierPill>
              <RenewCopy>
                {tier.lines.map((line) => (
                  <RenewLine key={`${tier.slug}-${line.tag}-${line.text}`}>
                    <RenewTag>{line.tag}</RenewTag>
                    <span>{line.text}</span>
                  </RenewLine>
                ))}
              </RenewCopy>
            </RenewRow>
          ))}
        </RenewRows>
      </RenewCard>
    </PageLayout>
  )
}

const Chart = styled.img`
  display: block;
  width: calc(100% + 2rem);
  max-width: none;
  height: auto;
  margin: 0 -1rem;
  border-radius: 0;
`

const RenewCard = styled.section`
  display: grid;
  grid-template-columns: 5.5rem 1fr;
  gap: 0.85rem;
  margin-top: 1.15rem;
  padding: 0.95rem 0.9rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--color-glass-border);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const RenewTitle = styled.h2`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.15rem;
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.35;
`

const RenewRows = styled.div`
  display: grid;
  gap: 0.75rem;
`

const RenewRow = styled.div`
  display: grid;
  grid-template-columns: 4.6rem 1fr;
  gap: 0.65rem;
  align-items: start;
`

const TierPill = styled.span<{ $slug: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 1.7rem;
  padding: 0.2rem 0.45rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  background: ${({ $slug }) =>
    $slug === 'black' ? '#2a2a2a' : $slug === 'gold' ? '#e7d7b1' : '#d7e7b8'};
  color: ${({ $slug }) => ($slug === 'black' ? '#f5f5f5' : '#2c311c')};
  border: ${({ $slug }) => ($slug === 'black' ? '1px solid rgba(255, 255, 255, 0.16)' : '0')};
`

const RenewCopy = styled.div`
  display: grid;
  gap: 0.35rem;
`

const RenewLine = styled.p`
  display: grid;
  grid-template-columns: 2.4rem 1fr;
  gap: 0.35rem;
  margin: 0;
  color: var(--dash-muted);
  font-size: 0.84rem;
  line-height: 1.45;
`

const RenewTag = styled.span`
  flex: 0 0 auto;
  color: var(--color-white);
  font-weight: 700;
`
