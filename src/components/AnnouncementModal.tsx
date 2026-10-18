import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'

import { isOfficialPath } from '../utils/official'

const ANNOUNCEMENT_KEY = 'sailor_announcement_2026_10_15'
const ANNOUNCEMENT_INTERVAL = 24 * 60 * 60 * 1000
const LOGIN_PATH = '/login'
const openListeners = new Set<() => void>()

export function openAnnouncement() {
  openListeners.forEach((listener) => listener())
}

type AnnouncementModalProps = {
  onClose?: () => void
}

function shouldShowAnnouncement(): boolean {
  const lastShown = localStorage.getItem(ANNOUNCEMENT_KEY)
  if (!lastShown) return true
  
  const lastShownTime = parseInt(lastShown, 10)
  const now = Date.now()
  return now - lastShownTime >= ANNOUNCEMENT_INTERVAL
}

function markAnnouncementShown(): void {
  localStorage.setItem(ANNOUNCEMENT_KEY, Date.now().toString())
}

export default function AnnouncementModal({ onClose }: AnnouncementModalProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isVisible, setIsVisible] = useState(false)
  const isHidden =
    location.pathname === LOGIN_PATH || isOfficialPath(location.pathname)
  const isHiddenRef = useRef(isHidden)
  isHiddenRef.current = isHidden

  useEffect(() => {
    if (isHidden) {
      setIsVisible(false)
      return
    }

    if (shouldShowAnnouncement()) {
      setIsVisible(true)
    }
  }, [isHidden])

  useEffect(() => {
    function show() {
      if (isHiddenRef.current) return
      setIsVisible(true)
    }

    openListeners.add(show)
    return () => {
      openListeners.delete(show)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    markAnnouncementShown()
    onClose?.()
  }

  const openVip = () => {
    handleClose()
    navigate('/vip')
  }

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      handleClose()
    }
  }

  if (!isVisible) return null

  return (
    <Overlay onClick={handleOverlayClick}>
      <Modal role="dialog" aria-modal="true" aria-labelledby="announcement-title">
        <CloseButton 
          type="button" 
          aria-label="關閉公告"
          onClick={handleClose}
        >
          ✕
        </CloseButton>
        
        <Content>
          <Title id="announcement-title">
            水手會員系統將於 10/15 正式上線！
          </Title>

          <Section>
            <SectionTitle>1. 新會員可獲得 20 元折價券</SectionTitle>
            <Method>來店向門市人員索取，即可獲得一張 20 元折價券。</Method>
          </Section>

          <Section>
            <SectionTitle>2. 舊會員註冊即享 100 元折價券</SectionTitle>
            <StepList>
              <Step>
                於本 LINE 帳號回覆您的「手機號碼」＋已完成註冊
                <Example>範例：0912345678 已完成註冊</Example>
              </Step>
              <Step>等候客服核對資料，即可獲得 100 元折價券！</Step>
            </StepList>
          </Section>

          <Section>
            <SectionTitle>⚠️ 注意事項：</SectionTitle>
            <NoteList>
              <Note>
                各等級詳細內容請見
                <BenefitsLink type="button" onClick={openVip}>
                  會員權益
                </BenefitsLink>
              </Note>
            </NoteList>
          </Section>
        </Content>

        <ActionButton type="button" onClick={handleClose}>
          我知道了
        </ActionButton>
      </Modal>
    </Overlay>
  )
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
`

const Modal = styled.div`
  position: relative;
  max-width: 24rem;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  background: linear-gradient(135deg, #1a1a1c 0%, #0f0f10 100%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  animation: ${fadeIn} 0.3s ease-out;
`

const CloseButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 1;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-white);
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`

const Content = styled.div`
  padding: 1.5rem 1.25rem 1rem;
  color: var(--color-white);
`

const Title = styled.h2`
  margin: 0 0 1rem;
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.3;
  text-align: center;
`

const Section = styled.div`
  margin: 0 0 1.25rem;
`

const SectionTitle = styled.h3`
  margin: 0 0 0.6rem;
  font-size: 0.9rem;
  font-weight: 700;
`

const Method = styled.p`
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.4;
`

const StepList = styled.ol`
  margin: 0;
  padding: 0 0 0 1.2rem;
  list-style: decimal;
`

const Step = styled.li`
  margin: 0 0 0.4rem;
  font-size: 0.85rem;
  line-height: 1.4;
`

const Example = styled.span`
  display: block;
  margin-top: 0.35rem;
  color: var(--color-muted);
  font-size: 0.8rem;
`

const NoteList = styled.ul`
  margin: 0;
  padding: 0 0 0 1.2rem;
  list-style: disc;
`

const Note = styled.li`
  margin: 0 0 0.4rem;
  font-size: 0.85rem;
  line-height: 1.4;
  color: var(--color-muted);
`

const BenefitsLink = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-white);
  font: inherit;
  font-size: inherit;
  font-weight: 650;
  text-decoration: underline;
  text-underline-offset: 0.15em;
  cursor: pointer;
`

const ActionButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(47, 107, 255, 0.1);
  color: var(--color-primary);
  font: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(47, 107, 255, 0.2);
  }
`