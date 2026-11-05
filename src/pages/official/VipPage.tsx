import { useEffect } from 'react'
import styled from 'styled-components'

import { Card, Skeleton } from '../../components/Dashboard'
import PageLayout from '../../components/PageLayout'
import { useAppDispatch, useAppSelector } from '../../customHooks/useApp'
import { getVips } from '../../redux/features/user'

function normalizeVipText(value: string) {
  return value.replace(/[。．.]/g, '').replace(/\s+/g, '').trim()
}

function splitTrailingPunctuation(value: string) {
  const match = /^(.*?)([.,。、，；;：:！!？?）)】\]]+)$/u.exec(value)
  if (!match) return { href: value, trailing: '' }
  return { href: match[1], trailing: match[2] }
}

function linkParts(text: string) {
  const parts: Array<{ text: string; href?: string }> = []
  let cursor = 0

  for (const match of text.matchAll(/https?:\/\/[^\s<>"']+/gi)) {
    const raw = match[0]
    const index = match.index ?? 0
    if (index > cursor) parts.push({ text: text.slice(cursor, index) })

    const { href, trailing } = splitTrailingPunctuation(raw)
    try {
      const url = new URL(href)
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        parts.push({ text: href, href })
        if (trailing) parts.push({ text: trailing })
      } else {
        parts.push({ text: raw })
      }
    } catch {
      parts.push({ text: raw })
    }

    cursor = index + raw.length
  }

  if (cursor < text.length) parts.push({ text: text.slice(cursor) })
  return parts
}

function ruleKind(rule: string) {
  if (rule.includes('升等')) return '升等'
  if (rule.includes('保留')) return '續會'
  if (rule.includes('改為') || rule.includes('退回')) return '降等'
  return ''
}

function LinkifiedText({ text }: { text: string }) {
  return linkParts(text).map((part, index) =>
    part.href ? (
      <TextLink key={`${part.href}-${index}`} href={part.href} target="_blank" rel="noopener noreferrer">
        {part.text}
      </TextLink>
    ) : (
      <span key={`${part.text}-${index}`}>{part.text}</span>
    ),
  )
}

export default function VipPage() {
  const dispatch = useAppDispatch()
  const vipState = useAppSelector((state) => state.userReducer.getVips)
  const vips = vipState.data?.vips ?? []

  useEffect(() => {
    void dispatch(getVips())
  }, [dispatch])

  const pending = vipState.loading && !vipState.data

  return (
    <PageLayout title="會員權益" busy={pending}>
      {pending ? (
        <>
          <Skeleton $variant="wide" />
          <Skeleton $variant="wide" />
        </>
      ) : (
        <InfoCard>
          {vipState.error ? <VipItemMeta>{vipState.error}</VipItemMeta> : null}
          <VipList>
            {vips.map((vip) => {
              const description = vip.description?.trim()
              const descriptionKey = description ? normalizeVipText(description) : ''
              const rules = (vip.rules ?? []).map((rule) => rule.trim()).filter(Boolean)
              const ruleKeys = new Set(rules.map((rule) => normalizeVipText(rule)))
              const benefits = (vip.benefits ?? []).filter((benefit) => {
                const key = normalizeVipText(benefit)
                if (!key || key === descriptionKey || ruleKeys.has(key)) return false
                return true
              })

              return (
                <VipItem key={vip.id}>
                  <VipItemName>{vip.name}</VipItemName>
                  {benefits.length ? (
                    <BenefitList>
                      {benefits.map((benefit, index) => (
                        <li key={benefit}>
                          <BenefitIndex>{index + 1}.</BenefitIndex>
                          <span>
                            <LinkifiedText text={benefit} />
                          </span>
                        </li>
                      ))}
                    </BenefitList>
                  ) : null}
                </VipItem>
              )
            })}
          </VipList>
          <Disclaimer>
            水手會員等級或資格累計辦法，本公司保有解釋及隨時變更、增加條文相關之權利，且不另行通知。
          </Disclaimer>
          <RenewCard>
            <RenewTitle>
              <span>升等／降等</span>
              <span>續會方式</span>
            </RenewTitle>
            <RenewRows>
              {vips.map((vip) => {
                const rules = (vip.rules ?? []).map((rule) => rule.trim()).filter(Boolean)
                const nextPaid = vips.find((item) => (item.rank ?? 0) > (vip.rank ?? 0) && (item.minSpend ?? 0) > 0)
                const stayText =
                  nextPaid && (nextPaid.minSpend ?? 0) > 0
                    ? `近一年累積消費未滿 ${nextPaid.minSpend.toLocaleString('zh-TW')} 元，維持${vip.name}，沒有會籍到期日。`
                    : `${vip.name}沒有會籍到期日。`

                return (
                  <RenewRow key={vip.id}>
                    <TierPill $slug={vip.slug || ''}>{vip.name}</TierPill>
                    <RenewCopy>
                      {rules.length ? (
                        rules.map((rule) => (
                          <RenewLine key={rule}>
                            {ruleKind(rule) ? <RenewTag>{ruleKind(rule)}</RenewTag> : null}
                            <span>{rule}</span>
                          </RenewLine>
                        ))
                      ) : (
                        <RenewLine>
                          <span>{stayText}</span>
                        </RenewLine>
                      )}
                    </RenewCopy>
                  </RenewRow>
                )
              })}
            </RenewRows>
          </RenewCard>
        </InfoCard>
      )}
    </PageLayout>
  )
}

const InfoCard = styled(Card)`
  padding: 1rem 1.1rem 1.05rem;
`

const VipList = styled.div`
  display: grid;
  gap: 0.75rem;
`

const VipItem = styled.article`
  padding: 0.85rem 0.9rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.04);
  border-left: 3px solid var(--color-glass-border);
`

const VipItemName = styled.p`
  margin: 0;
  font-size: 1.02rem;
  font-weight: 700;
  letter-spacing: -0.03em;
`

const VipItemMeta = styled.p`
  margin: 0.35rem 0 0;
  color: var(--dash-muted);
  font-size: 0.86rem;
  line-height: 1.4;
`

const RenewCard = styled.section`
  display: grid;
  grid-template-columns: 5.5rem 1fr;
  gap: 0.85rem;
  margin-top: 0.85rem;
  padding: 0.95rem 0.9rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--color-glass-border);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const RenewTitle = styled.h3`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.15rem;
  margin: 0;
  font-size: 1rem;
  font-weight: 750;
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
  display: flex;
  flex-wrap: wrap;
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

const BenefitList = styled.ol`
  display: grid;
  gap: 0.35rem;
  margin: 0.65rem 0 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    gap: 0.35rem;
    font-size: 0.88rem;
    line-height: 1.45;
  }
`

const TextLink = styled.a`
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 0.15em;
  overflow-wrap: anywhere;
`

const BenefitIndex = styled.span`
  flex: 0 0 auto;
  color: var(--dash-muted);
  font-weight: 650;
`

const Disclaimer = styled.p`
  margin: 1rem 0 0;
  color: var(--dash-muted);
  font-size: 0.78rem;
  line-height: 1.5;
`
