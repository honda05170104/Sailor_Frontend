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

import { Card } from './Dashboard'

const AUTO_MS = 4000

export type CarouselSlide = {
  id: string
  src: string
  alt: string
  caption?: string
  href?: string
  onClick?: () => void
}

type ImageCarouselProps = {
  title: string
  slides: CarouselSlide[]
  emptyText?: string
  aspectRatio?: string
}

export default function ImageCarousel({
  title,
  slides,
  emptyText,
  aspectRatio = '16 / 9',
}: ImageCarouselProps) {
  const navigate = useNavigate()
  const [index, setIndex] = useState(1)
  const [animate, setAnimate] = useState(true)
  const dragging = useRef(false)
  const startX = useRef(0)
  const paused = useRef(false)
  const suppressClick = useRef(false)

  const looping = slides.length > 1
  const loopSlides = useMemo(
    () => (looping ? [slides[slides.length - 1], ...slides, slides[0]] : slides),
    [looping, slides],
  )
  const lastClone = Math.max(loopSlides.length - 1, 0)
  const lastReal = slides.length
  const displayIndex = looping ? Math.min(Math.max(index, 0), lastClone) : 0

  useEffect(() => {
    setAnimate(false)
    setIndex(looping ? 1 : 0)
  }, [looping])

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

  function armSuppressClick() {
    suppressClick.current = true
    window.setTimeout(() => {
      suppressClick.current = false
    }, 0)
  }

  function activateCurrentSlide() {
    const slide = slides[realIndex()]
    if (!slide) return
    if (slide.onClick) {
      slide.onClick()
      return
    }
    if (!slide.href) return
    if (slide.href.startsWith('/')) {
      navigate(slide.href)
      return
    }
    window.open(slide.href, '_blank', 'noopener,noreferrer')
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    const target = event.target
    if (target instanceof Element && target.closest('[data-carousel-dot]')) return
    dragging.current = true
    startX.current = event.clientX
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return
    const delta = event.clientX - startX.current
    dragging.current = false
    armSuppressClick()
    if (Math.abs(delta) >= 40) {
      if (!looping) return
      setAnimate(true)
      setIndex((current) => {
        const next = delta < 0 ? current + 1 : current - 1
        return Math.min(lastClone, Math.max(0, next))
      })
      return
    }
    activateCurrentSlide()
  }

  function consumeSuppressedClick(event: MouseEvent) {
    if (!suppressClick.current) return false
    suppressClick.current = false
    event.preventDefault()
    return true
  }

  if (!slides.length) {
    if (!emptyText) return null
    return (
      <CarouselCard aria-label={title}>
        <CardTitle>{title}</CardTitle>
        <Empty>{emptyText}</Empty>
      </CarouselCard>
    )
  }

  return (
    <CarouselCard aria-label={title}>
      <CardTitle>{title}</CardTitle>
      <CarouselFrame $ratio={aspectRatio}
        onPointerEnter={() => {
          paused.current = true
        }}
        onPointerLeave={() => {
          paused.current = false
        }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          dragging.current = false
        }}
      >
        <CarouselTrack $index={displayIndex} $animate={animate} onTransitionEnd={snapIfClone}>
          {loopSlides.map((slide, slideIndex) => (
            <CarouselSlide key={`${slide.id}-${slideIndex}`}>
              <SlideMedia slide={slide} onActivate={consumeSuppressedClick} />
            </CarouselSlide>
          ))}
        </CarouselTrack>
        {looping ? (
          <CarouselDots>
            {slides.map((slide, slideIndex) => (
              <CarouselDot
                key={slide.id}
                type="button"
                data-carousel-dot=""
                $active={slideIndex === realIndex()}
                aria-label={`第 ${slideIndex + 1} 張`}
                aria-current={slideIndex === realIndex() ? 'true' : undefined}
                onClick={() => goTo(slideIndex + 1)}
              />
            ))}
          </CarouselDots>
        ) : null}
      </CarouselFrame>
    </CarouselCard>
  )
}

function SlideMedia({
  slide,
  onActivate,
}: {
  slide: CarouselSlide
  onActivate: (event: MouseEvent) => boolean
}) {
  const navigate = useNavigate()
  const image = (
    <>
      <img src={slide.src} alt={slide.alt} draggable={false} />
      {slide.caption ? <SlideCaption>{slide.caption}</SlideCaption> : null}
    </>
  )

  if (slide.onClick) {
    return (
      <SlideButton
        type="button"
        onClick={(event) => {
          if (onActivate(event)) return
          slide.onClick?.()
        }}
      >
        {image}
      </SlideButton>
    )
  }

  if (slide.href) {
    const internal = slide.href.startsWith('/')
    return (
      <SlideLink
        href={slide.href}
        target={internal ? undefined : '_blank'}
        rel={internal ? undefined : 'noopener noreferrer'}
        draggable={false}
        onClick={(event) => {
          if (onActivate(event)) return
          if (!internal) return
          event.preventDefault()
          navigate(slide.href!)
        }}
      >
        {image}
      </SlideLink>
    )
  }

  return image
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

const Empty = styled.p`
  margin: 0.75rem 0 0.15rem;
  color: var(--dash-muted);
  font-size: 0.82rem;
`

const CarouselFrame = styled.div<{ $ratio: string }>`
  position: relative;
  margin-top: 0.75rem;
  overflow: hidden;
  border-radius: 1rem;
  aspect-ratio: ${({ $ratio }) => $ratio};
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
  position: relative;
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

const SlideButton = styled.button`
  display: block;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
`

const SlideCaption = styled.span`
  position: absolute;
  left: 0.75rem;
  bottom: 0.7rem;
  max-width: calc(100% - 7rem);
  padding: 0.28rem 0.7rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.55);
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 650;
  line-height: 1.3;
  pointer-events: none;
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
