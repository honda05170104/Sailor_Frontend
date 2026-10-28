import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { Card, Dashboard, Scroll } from '../../components/Dashboard'

const FACTS = [
  { label: '原產地', value: '葉門、沙烏地阿拉伯西南部' },
  { label: '成體體長', value: '公龍約 45–60 公分，母龍約 25–35 公分（含尾）' },
  { label: '壽命', value: '飼養下常見約 5–8 年' },
  { label: '食性', value: '以蟋蟀、蟑螂等昆蟲為主，也會吃葉菜' },
  { label: '喝水', value: '不喝靜止的水，從葉片上的水珠舔食' },
  { label: '飼養', value: '一籠一隻。垂直枝葉、白天 UVB 與曬點' },
] as const

export default function VeiledChameleonPage() {
  useEffect(() => {
    const previous = document.title
    document.title = '高冠變色龍｜水手兩棲爬蟲'
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <Dashboard>
      <PageScroll>
        <SpeciesCard>
          <Photo
            src="/species/veiled-chameleon.jpg"
            alt="高冠變色龍，綠色身體，頭頂有高起的冠盔，背脊帶一列橘色鱗"
          />
          <Body>
            <Eyebrow>物種卡</Eyebrow>
            <Name>高冠變色龍</Name>
            <Latin>
              <i>Chamaeleo calyptratus</i>
              <English>Veiled Chameleon</English>
            </Latin>

            <Chips>
              <Chip>樹棲</Chip>
              <Chip>日行性</Chip>
              <Chip>一籠一隻</Chip>
            </Chips>

            <Lead>
              頭頂那片高高隆起的冠盔，是高冠變色龍最醒目的特徵。公龍的冠又高又寬，體色常在青綠、黃與橘之間轉換；母龍較小，冠盔也比較低。
            </Lead>
            <Lead>
              牠們白天待在樹上。變色主要用來調節體溫、表達情緒與溝通，不只是為了躲起來。
            </Lead>

            <Facts>
              {FACTS.map((fact) => (
                <Fact key={fact.label}>
                  <FactLabel>{fact.label}</FactLabel>
                  <FactValue>{fact.value}</FactValue>
                </Fact>
              ))}
            </Facts>
          </Body>
        </SpeciesCard>

        <StoreLink to="/store">門市資訊</StoreLink>
      </PageScroll>
    </Dashboard>
  )
}

const PageScroll = styled(Scroll)`
  padding-bottom: 2.5rem;
`

const SpeciesCard = styled(Card)`
  overflow: hidden;
`

const Photo = styled.img`
  display: block;
  width: 100%;
  height: auto;
  background: #000;
`

const Body = styled.div`
  padding: 1.15rem 1.15rem 1.25rem;
`

const Eyebrow = styled.p`
  margin: 0;
  color: var(--dash-muted);
  font-size: 0.78rem;
  letter-spacing: 0.14em;
`

const Name = styled.h1`
  margin: 0.35rem 0 0;
  font-size: clamp(1.7rem, 6vw, 2.05rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.15;
`

const Latin = styled.p`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.45rem 0.7rem;
  margin: 0.35rem 0 0;
  color: var(--dash-muted);
  font-size: 0.92rem;
`

const English = styled.span`
  font-size: 0.78rem;
  letter-spacing: 0.02em;
`

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.9rem;
`

const Chip = styled.span`
  padding: 0.28rem 0.65rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: #d1d1d6;
  font-size: 0.72rem;
`

const Lead = styled.p`
  margin: 0.85rem 0 0;
  color: rgba(255, 255, 255, 0.82);
  font-size: 0.95rem;
  line-height: 1.65;
`

const Facts = styled.dl`
  display: grid;
  gap: 0.75rem;
  margin: 1.15rem 0 0;
  padding-top: 1rem;
  border-top: 1px solid var(--color-glass-border);
`

const Fact = styled.div`
  display: grid;
  grid-template-columns: 4.5rem 1fr;
  gap: 0.75rem;
  align-items: baseline;
`

const FactLabel = styled.dt`
  margin: 0;
  color: var(--dash-muted);
  font-size: 0.78rem;
`

const FactValue = styled.dd`
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.5;
`

const StoreLink = styled(Link)`
  display: block;
  margin-top: 1rem;
  color: var(--dash-muted);
  font-size: 0.82rem;
  text-align: center;
  text-decoration: none;
`
