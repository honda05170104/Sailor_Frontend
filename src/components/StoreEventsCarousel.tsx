import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type TransitionEvent,
} from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { getBannersApi, type Banner } from '../utils/banner'
import { Card } from './Dashboard'

const AUTO_MS = 4000

function toSlides(banners: Banner[]) {
  return banners
    .filter((banner) => banner.enabled !== false && banner.imageUrl?.trim())
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((banner) => ({
      id: banner.id,
      src: banner.imageUrl.trim(),
      href: banner.linkUrl?.trim() || undefined,
    }))
}

export default function StoreEventsCarousel() {
  const navigate = useNavigate()
  const [banners, setBanners] = useState<Banner[] | null>(null)
  const [index, setIndex] = useState(1)
  const [animate, setAnimate] = useState(true)
  const dragging = useRef(false)
  const startX = useRef(0)
  const paused = useRef(false)
  const suppressClick = useRef(false)

  const slides = useMemo(() => toSlides(banners ?? []), [banners])
  const looping = slides.length > 1
  const loopSlides = useMemo(
    () => (looping ? [slides[slides.length - 1], ...slides, slides[0]] : slides),
    [looping, slides],
  )
  const lastClone = Math.max(loopSlides.length - 1, 0)
  const lastReal = slides.length
  const displayIndex = looping ? Math.min(Math.max(index, 0), lastClone) : 0

  useEffect(() => {
    let cancelled = false

    void getBannersApi()
      .then((result) => {
        if (cancelled) return
        setBanners(result?.banners ?? [])
      })
      .catch(() => {
        if (cancelled) return
        setBanners([])
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    setAnimate(false)
    setIndex(looping ? 1 : 0)
  }, [looping, slides])

  useEffect(() => {
    if (!looping) return

    const timer = window.setInterval(() => {
      if (paused.current || dragging.current) return
      setAnimate(true)
      setIndex((current) => {
        if (current <= 0 || current >= lastClone) return current
        return current + 1
      })
    }, AUTO_MS)

    return () => window.clearInterval(timer)
  }, [lastClone, looping])

  useEffect(() => {
    if (!looping) return
    if (index !== 0 && index !== lastClone) return

    const timer = window.setTimeout(() => {
      setAnimate(false)
      setIndex(index === 0 ? lastReal : 1)
    }, 500)

    return () => window.clearTimeout(timer)
  }, [index, lastClone, lastReal, looping])

  useEffect(() => {
    if (animate) return
    const frame = window.requestAnimationFrame(() => {
      setAnimate(true)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [animate])

  function realIndex() {
    if (!looping) return 0
    if (displayIndex === 0) return slides.length - 1
    if (displayIndex >= lastClone) return 0
    return displayIndex - 1
  }

  function goTo(next: number) {
    setAnimate(true)
    setIndex(Math.min(lastClone, Math.max(0, next)))
  }

  function snapIfClone(event: TransitionEvent<HTMLDivElement>) {
    if (!looping) return
    if (event.target !== event.currentTarget) return
    if (event.propertyName !== 'transform') return
    if (index === lastClone) {
      setAnimate(false)
      setIndex(1)
    } else if (index === 0) {
      setAnimate(false)
      setIndex(lastReal)
    }
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return
    const delta = event.clientX - startX.current
    dragging.current = false
    if (Math.abs(delta) < 40) return
    suppressClick.current = true
    if (!looping) return
    setAnimate(true)
    setIndex((current) => {
      const next = delta < 0 ? current + 1 : current - 1
      return Math.min(lastClone, Math.max(0, next))
    })
  }

  function onSlideClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (suppressClick.current) {
      suppressClick.current = false
      event.preventDefault()
      return
    }
    if (!href.startsWith('/')) return
    event.preventDefault()
    navigate(href)
  }

  if (banners === null) {
    return (
      <CarouselCard>
        <CardTitle>新到物種</CardTitle>
        <CarouselFrame aria-busy="true" />
      </CarouselCard>
    )
  }

  if (!slides.length) return null

  return (
    <CarouselCard>
      <CardTitle>新到物種</CardTitle>
      <CarouselFrame
        onPointerEnter={() => {
          paused.current = true
        }}
        onPointerLeave={() => {
          paused.current = false
        }}
        onPointerDown={(event) => {
          dragging.current = true
          startX.current = event.clientX
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          dragging.current = false
        }}
      >
        <CarouselTrack $index={displayIndex} $animate={animate} onTransitionEnd={snapIfClone}>
          {loopSlides.map((slide, slideIndex) => (
            <CarouselSlide key={`${slide.id}-${slideIndex}`}>
              {slide.href ? (
                <SlideLink
                  href={slide.href}
                  target={slide.href.startsWith('/') ? undefined : '_blank'}
                  rel={slide.href.startsWith('/') ? undefined : 'noopener noreferrer'}
                  draggable={false}
                  onClick={(event) => onSlideClick(event, slide.href!)}
                >
                  <img src={slide.src} alt="新到物種" draggable={false} />
                </SlideLink>
              ) : (
                <img src={slide.src} alt="新到物種" draggable={false} />
              )}
            </CarouselSlide>
          ))}
        </CarouselTrack>
        {looping ? (
          <CarouselDots>
            {slides.map((slide, slideIndex) => (
              <CarouselDot
                key={slide.id}
                type="button"
                $active={slideIndex === realIndex()}
                aria-label={`第 ${slideIndex + 1} 張`}
                onClick={() => goTo(slideIndex + 1)}
              />
            ))}
          </CarouselDots>
        ) : null}
      </CarouselFrame>
    </CarouselCard>
  )
}

const CarouselCard = styled(Card)`
  margin-top: 0.85rem;
  padding: 1rem 1.1rem 1.05rem;
`

const CardTitle = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
`

const CarouselFrame = styled.div`
  position: relative;
  margin-top: 0.75rem;
  overflow: hidden;
  border-radius: 1rem;
  aspect-ratio: 16 / 9;
  background: #2c2c2e;
  touch-action: pan-y;
  user-select: none;
`

const CarouselTrack = styled.div<{ $index: number; $animate: boolean }>`
  display: flex;
  height: 100%;
  transition: ${({ $animate }) => ($animate ? 'transform 0.45s ease' : 'none')};
  transform: translateX(${({ $index }) => `-${$index * 100}%`});
`

const CarouselSlide = styled.div`
  flex: 0 0 100%;
  width: 100%;
  min-width: 100%;
  height: 100%;
  background: #2c2c2e;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const SlideLink = styled.a`
  display: block;
  height: 100%;
  color: inherit;
`

const CarouselDots = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0.75rem;
  display: flex;
  justify-content: center;
  gap: 0.4rem;
`

const CarouselDot = styled.button<{ $active?: boolean }>`
  width: ${({ $active }) => ($active ? '1.15rem' : '0.45rem')};
  height: 0.45rem;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: ${({ $active }) =>
    $active ? '#ffffff' : 'rgba(255, 255, 255, 0.45)'};
  cursor: pointer;
`
