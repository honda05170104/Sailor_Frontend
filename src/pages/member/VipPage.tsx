import { useEffect } from 'react'
import styled from 'styled-components'

import BottomNav from '../../components/BottomNav'
import { Card, Dashboard, Scroll, SectionTitle, Skeleton } from '../../components/Dashboard'
import { useAppDispatch, useAppSelector } from '../../customHooks/useApp'
import { getUser } from '../../redux/features/user'
import { resolveVipTheme, type VipThemeKey } from '../../utils/vipTheme'

type VipRule = {
  id: string
  name: string
  theme: VipThemeKey
  requirement: string
  notes?: string[]
  benefits: string[]
}

const VIP_RULES: VipRule[] = [
  {
    id: 'general',
    name: '一般會員',
    theme: 'bronze',
    requirement: '註冊即加入',
    notes: ['累積消費'],
    benefits: [],
  },
  {
    id: 'gold',
    name: '金卡',
    theme: 'gold',
    requirement: '累積消費一年內 $3,500',
    notes: ['舊會員（已消費滿 $100）：三年內不會降級'],
    benefits: [
      '用品類 85 折（活體、餌料、缸除外）',
      '寄宿動物一天折 $50',
      '升等禮 $100 折價券',
    ],
  },
  {
    id: 'black',
    name: '黑卡',
    theme: 'black',
    requirement: '累積消費一年內 $12,000',
    benefits: [
      '用品類 75 折（活體、餌料、缸除外）',
      '生日現金折價券：$600',
      '寄宿動物免費',
      '黑卡專屬社群',
      '不定期提供品牌活動',
      '升等禮 $300 折價券',
    ],
  },
]

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
  const { data, loading, error } = useAppSelector(
    (state) => state.userReducer.getUser,
  )
  const user = data?.user

  useEffect(() => {
    if (!user && !loading && !error) {
      void dispatch(getUser())
    }
  }, [dispatch, error, loading, user])

  if (loading || (!user && !error)) {
    return <VipSkeleton />
  }

  const vipTheme = resolveVipTheme(user?.vip)

  return (
    <Dashboard $vip={vipTheme}>
      <Scroll>
        <SectionTitle>會員規則</SectionTitle>
        <InfoCard>
          <VipList>
            {VIP_RULES.map((vip) => (
              <VipItem key={vip.id} $theme={vip.theme}>
                <VipItemName>{vip.name}</VipItemName>
                <VipItemMeta>{vip.requirement}</VipItemMeta>
                {vip.notes?.map((note) => (
                  <VipItemNote key={note}>{note}</VipItemNote>
                ))}
                {vip.benefits.length ? (
                  <BenefitList>
                    {vip.benefits.map((benefit, index) => (
                      <li key={benefit}>
                        <BenefitIndex>{index + 1}.</BenefitIndex>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </BenefitList>
                ) : null}
              </VipItem>
            ))}
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

const VipItem = styled.article<{ $theme: VipThemeKey }>`
  padding: 0.85rem 0.9rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.04);
  border-left: 3px solid
    ${({ $theme }) =>
      $theme === 'gold'
        ? '#c9a227'
        : $theme === 'black'
          ? '#f0f0f0'
          : '#b87333'};
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

const VipItemNote = styled.p`
  margin: 0.3rem 0 0;
  color: var(--dash-muted);
  font-size: 0.82rem;
  line-height: 1.45;
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
