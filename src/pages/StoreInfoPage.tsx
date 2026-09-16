import styled from 'styled-components'

import BottomNav from '../components/BottomNav'
import { Card, Dashboard, Scroll } from '../components/Dashboard'

type Store = {
  name: string
  address: string
  phone?: string
}

function googleMapsUrl(store: Store) {
  const query = `${store.name} ${store.address}`
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

const STORES: Store[] = [
  {
    name: '水手兩棲爬蟲•異寵-台北店',
    address: '臺北市大同區鄰江里',
    phone: '02 2585 5883',
  },
  {
    name: '水手兩棲爬蟲•異寵-新北永和店',
    address: '新北市永和區保安里',
    phone: '02 2922 5585',
  },
  {
    name: '水手兩棲爬蟲•異寵-南港店',
    address: '南港路二段20巷5號B1',
    phone: '02 2651 2131',
  },
  {
    name: '水手兩棲爬蟲•異寵-桃園店',
    address: '桃園市桃園區中寧里',
    phone: '03 215 1745',
  },
  {
    name: '水手兩棲爬蟲•異寵-台中',
    address: '台中市南屯區田心里五權西路二段380號',
    phone: '04 2475 0068',
  },
  {
    name: '水手兩棲爬蟲•異寵-彰化田尾店',
    address: '彰化縣田尾鄉中山路一段217號',
    phone: '04 883 6682',
  },
  {
    name: '水手兩棲爬蟲•異寵-台南',
    address: '臺南市安南區鳳凰里北安路三段179號',
  },
  {
    name: '水手兩棲爬蟲•異寵-高雄',
    address: '高雄市鼓山區龍水里明誠四路112號1F',
    phone: '07 586 6090',
  },
]

export default function StoreInfoPage() {
  return (
    <Dashboard>
      <Scroll>
        <PageHeader>
          <PageTitle>門市資訊</PageTitle>
        </PageHeader>

        <StoreList>
          {STORES.map((store) => (
            <InfoCard key={store.name}>
              <StoreName>{store.name}</StoreName>
              <InfoRow>
                <InfoLabel>地址</InfoLabel>
                <InfoValue>{store.address}</InfoValue>
              </InfoRow>
              {store.phone ? (
                <InfoRow>
                  <InfoLabel>電話</InfoLabel>
                  <PhoneLink href={`tel:${store.phone.replace(/\s/g, '')}`}>
                    {store.phone}
                  </PhoneLink>
                </InfoRow>
              ) : null}
              <MapBtn
                href={googleMapsUrl(store)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapIcon aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M12 3.5a6.2 6.2 0 0 0-6.2 6.2c0 4.35 5.1 9.85 5.75 10.55a.6.6 0 0 0 .9 0c.65-.7 5.75-6.2 5.75-10.55A6.2 6.2 0 0 0 12 3.5zm0 8.5a2.3 2.3 0 1 1 0-4.6 2.3 2.3 0 0 1 0 4.6z"
                      fill="currentColor"
                    />
                  </svg>
                </MapIcon>
                Google 地圖
              </MapBtn>
            </InfoCard>
          ))}
        </StoreList>
      </Scroll>
      <BottomNav />
    </Dashboard>
  )
}

const PageHeader = styled.header`
  margin: 0.15rem 0 1rem;
`

const PageTitle = styled.h1`
  margin: 0;
  font-size: clamp(1.6rem, 6vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.15;
`

const StoreList = styled.div`
  display: grid;
  gap: 0.75rem;
`

const InfoCard = styled(Card)`
  display: grid;
  gap: 0.85rem;
  padding: 1.15rem 1.1rem;
`

const StoreName = styled.h2`
  margin: 0;
  color: var(--color-white);
  font-size: 1.02rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.35;
`

const InfoRow = styled.div`
  display: grid;
  gap: 0.2rem;
`

const InfoLabel = styled.span`
  color: var(--dash-muted);
  font-size: 0.78rem;
  font-weight: 650;
`

const InfoValue = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.45;
`

const PhoneLink = styled.a`
  color: var(--color-white);
  font-size: 0.95rem;
  line-height: 1.45;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const MapBtn = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  min-height: 2.6rem;
  margin-top: 0.15rem;
  padding: 0.55rem 0.9rem;
  border-radius: 999px;
  background: var(--color-primary);
  color: var(--color-white);
  font-size: 0.88rem;
  font-weight: 700;
  text-decoration: none;
`

const MapIcon = styled.span`
  display: grid;
  place-items: center;

  svg {
    width: 1.05rem;
    height: 1.05rem;
  }
`
