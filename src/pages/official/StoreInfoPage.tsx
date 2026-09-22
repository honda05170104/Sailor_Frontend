import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import BottomNav from '../../components/BottomNav'
import { Card, Dashboard, Scroll } from '../../components/Dashboard'
import { getAuthToken } from '../../utils/auth'
import { saveReturnTo } from '../../utils/returnTo'

type Store = {
  name: string
  address: string
  phone?: string
  hoursLabel?: string
  hours?: string
  lineUrl?: string
}

const STORE_HOURS = '13:00 – 22:00'

function storeQuery(store: Store) {
  return `${store.name} ${store.address}`
}

function googleMapsUrl(store: Store) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(storeQuery(store))}`
}

function googleMapsEmbedUrl(store: Store) {
  const params = new URLSearchParams({
    q: storeQuery(store),
    hl: 'zh-TW',
    z: '16',
    output: 'embed',
  })
  return `https://maps.google.com/maps?${params.toString()}`
}

const STORES: Store[] = [
  {
    name: '水手兩棲爬蟲•異寵-台北店',
    address: '臺北市大同區鄰江里',
    phone: '02 2585 5883',
    lineUrl: 'https://lin.ee/nKeJvy2',
  },
  {
    name: '水手兩棲爬蟲•異寵-新北永和店',
    address: '新北市永和區保安里',
    phone: '02 2922 5585',
    lineUrl: 'https://lin.ee/y9T5YYa',
  },
  {
    name: '水手兩棲爬蟲•異寵-南港店',
    address: '南港路二段20巷5號B1',
    phone: '02 2651 2131',
    lineUrl: 'https://lin.ee/PBdBnkf',
  },
  {
    name: '水手兩棲爬蟲•異寵-桃園店',
    address: '桃園市桃園區中寧里',
    phone: '03 215 1745',
    lineUrl: 'https://lin.ee/KY5mOAN',
  },
  {
    name: '水手兩棲爬蟲•異寵-台中',
    address: '台中市南屯區田心里五權西路二段380號',
    phone: '04 2475 0068',
    lineUrl: 'https://lin.ee/55Zo3S2',
  },
  {
    name: '水手兩棲爬蟲•異寵-彰化田尾店',
    address: '彰化縣田尾鄉中山路一段217號',
    phone: '04 883 6682',
    hoursLabel: '營業日期',
    hours: '本店採不定期公休，建議到訪前確認',
    lineUrl: 'https://lin.ee/tvY9Teu',
  },
  {
    name: '水手兩棲爬蟲•異寵-台南',
    address: '臺南市安南區鳳凰里北安路三段179號',
    phone: '06 245 0255',
    lineUrl: 'https://lin.ee/UBL2twj',
  },
  {
    name: '水手兩棲爬蟲•異寵-高雄',
    address: '高雄市鼓山區龍水里明誠四路112號1F',
    phone: '07 586 6090',
    lineUrl: 'https://lin.ee/haZB1yM',
  },
]

export default function StoreInfoPage() {
  const navigate = useNavigate()
  const loggedIn = Boolean(getAuthToken())

  function onLogin() {
    saveReturnTo('/store')
    navigate('/login')
  }

  return (
    <Dashboard>
      <PageScroll $withNav={loggedIn}>
        <PageHeader>
          <PageTitle>門市資訊</PageTitle>
          {loggedIn ? null : (
            <LoginBtn type="button" onClick={onLogin}>
              登入會員
            </LoginBtn>
          )}
        </PageHeader>

        <StoreList>
          {STORES.map((store) => (
            <InfoCard key={store.name}>
              <MapPreview
                href={googleMapsUrl(store)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${store.name} Google 地圖`}
              >
                <iframe
                  title={`${store.name} 地圖`}
                  src={googleMapsEmbedUrl(store)}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  tabIndex={-1}
                />
              </MapPreview>
              <CardBody>
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
                <InfoRow>
                  <InfoLabel>{store.hoursLabel ?? '營業時間'}</InfoLabel>
                  <InfoValue>{store.hours ?? STORE_HOURS}</InfoValue>
                </InfoRow>
                {store.lineUrl ? (
                  <LineBtn
                    href={store.lineUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LineIcon aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path
                          d="M19.8 10.3c0-3.6-3.6-6.5-8-6.5s-8 2.9-8 6.5c0 3.2 2.85 5.9 6.7 6.4.26.05.61.17.7.38.08.2.05.51.03.71l-.12.74c-.04.22-.17.86.76.47s5.03-2.96 6.86-5.07c1.27-1.4 1.07-2.87 1.07-3.63z"
                          fill="currentColor"
                        />
                      </svg>
                    </LineIcon>
                    LINE 官方帳號
                  </LineBtn>
                ) : null}
              </CardBody>
            </InfoCard>
          ))}
        </StoreList>
      </PageScroll>
      {loggedIn ? <BottomNav /> : null}
    </Dashboard>
  )
}

const PageScroll = styled(Scroll)<{ $withNav?: boolean }>`
  padding-bottom: ${({ $withNav }) => ($withNav ? '6.5rem' : '2rem')};
`

const PageHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin: 0.15rem 0 1rem;
`

const PageTitle = styled.h1`
  margin: 0;
  font-size: clamp(1.6rem, 6vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.15;
`

const LoginBtn = styled.button`
  flex: 0 0 auto;
  min-height: 2.15rem;
  padding: 0 0.9rem;
  border: 1px solid var(--color-glass-border);
  border-radius: 999px;
  background: var(--color-glass);
  color: var(--color-white);
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
`

const StoreList = styled.div`
  display: grid;
  gap: 0.75rem;
`

const InfoCard = styled(Card)`
  display: grid;
  overflow: hidden;
  padding: 0;
`

const MapPreview = styled.a`
  position: relative;
  display: block;
  aspect-ratio: 2 / 1;
  overflow: hidden;
  background: #1a1a1c;

  iframe {
    position: absolute;
    inset: -18% 0 -8%;
    width: 100%;
    height: 126%;
    border: 0;
    pointer-events: none;
  }
`

const CardBody = styled.div`
  display: grid;
  gap: 0.85rem;
  padding: 1.05rem 1.1rem 1.15rem;
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

const LineBtn = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  min-height: 2.6rem;
  margin-top: 0.15rem;
  padding: 0.55rem 0.9rem;
  border-radius: 999px;
  background: var(--color-success);
  color: var(--color-white);
  font-size: 0.88rem;
  font-weight: 700;
  text-decoration: none;
`

const LineIcon = styled.span`
  display: grid;
  place-items: center;

  svg {
    width: 1.05rem;
    height: 1.05rem;
  }
`
