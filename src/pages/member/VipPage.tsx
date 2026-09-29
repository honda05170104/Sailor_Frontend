import { useEffect } from 'react'
import styled from 'styled-components'

import BottomNav from '../../components/BottomNav'
import { Card, Dashboard, Scroll, SectionTitle, Skeleton } from '../../components/Dashboard'
import { useAppDispatch, useAppSelector } from '../../customHooks/useApp'
import { getUser, getVips } from '../../redux/features/user'
import { resolveVipTheme } from '../../utils/vipTheme'

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

function VipSkeleton() {
  return (
    <Dashboard>
      <Scroll aria-busy="true" aria-label="載入中">
        <Skeleton $variant="title" />
        <Skeleton $variant="wide" />
        <Skeleton $variant="wide" />
      </Scroll>
      <BottomNav />
    </Dashboard>
  )
}

export default function VipPage() {
  const dispatch = useAppDispatch()
  const userState = useAppSelector((state) => state.userReducer.getUser)
  const vipState = useAppSelector((state) => state.userReducer.getVips)
  const user = userState.data?.user
  const vips = vipState.data?.vips ?? []

  useEffect(() => {
    if (!user && !userState.loading && !userState.error) {
      void dispatch(getUser())
    }
  }, [dispatch, user, userState.error, userState.loading])

  useEffect(() => {
    void dispatch(getVips())
  }, [dispatch])

  if ((userState.loading && !user) || (vipState.loading && !vipState.data)) {
    return <VipSkeleton />
  }

  const vipTheme = resolveVipTheme(user?.vip)

  return (
    <Dashboard $vip={vipTheme}>
      <Scroll>
        <SectionTitle>會員規則</SectionTitle>
        <InfoCard>
          <StoreNotice>目前僅適用台北大同店</StoreNotice>
          {vipState.error ? <VipItemMeta>{vipState.error}</VipItemMeta> : null}
          <VipList>
            {vips.map((vip) => {
              const description = vip.description?.trim()
              const descriptionKey = description ? normalizeVipText(description) : ''
              const benefits = (vip.benefits ?? []).filter(
                (benefit) => normalizeVipText(benefit) !== descriptionKey,
              )

              return (
                <VipItem key={vip.id}>
                  <VipItemName>{vip.name}</VipItemName>
                  {description ? (
                    <VipItemMeta>
                      <LinkifiedText text={description} />
                    </VipItemMeta>
                  ) : null}
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
            *水手保有修改會員各項權益之權利，最新內容請以水手官方公告或門市相關公告為準。
          </Disclaimer>
        </InfoCard>
      </Scroll>

      <BottomNav />
    </Dashboard>
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

const StoreNotice = styled.p`
  margin: 0 0 0.85rem;
  color: var(--dash-muted);
  font-size: 0.78rem;
  line-height: 1.5;
`

const Disclaimer = styled.p`
  margin: 1rem 0 0;
  color: var(--dash-muted);
  font-size: 0.78rem;
  line-height: 1.5;
`
