import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { Card } from './Dashboard'

const SLIDES = [
  { src: '/S__36470804_0.jpg', alt: '新到物種 1' },
  { src: '/S__36470805_0.jpg', alt: '新到物種 2' },
  { src: '/S__36470806_0.jpg', alt: '新到物種 3' },
]

const LOOP_SLIDES = [SLIDES[SLIDES.length - 1], ...SLIDES, SLIDES[0]]
const FIRST_REAL = 1
const LAST_REAL = SLIDES.length
const LAST_CLONE = LOOP_SLIDES.length - 1
const AUTO_MS = 4000

export default function StoreEventsCarousel() {
  const [index, setIndex] = useState(FIRST_REAL)
  const [animate, setAnimate] = useState(true)
  const dragging = useRef(false)
  const startX = useRef(0)
  const paused = useRef(false)

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (paused.current || dragging.current) return
      setAnimate(true)
      setIndex((current) => current + 1)
    }, AUTO_MS)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (animate) return
    const frame = window.requestAnimationFrame(() => {
      setAnimate(true)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [animate, index])

  function realIndex() {
    if (index === 0) return SLIDES.length - 1
    if (index === LAST_CLONE) return 0
    return index - 1
  }

  function goTo(next: number) {
    setAnimate(true)
    setIndex(next)
  }

  function snapIfClone() {
    if (index === LAST_CLONE) {
      setAnimate(false)
      setIndex(FIRST_REAL)
    } else if (index === 0) {
      setAnimate(false)
      setIndex(LAST_REAL)
    }
  }

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
        onPointerUp={(event) => {
          if (!dragging.current) return
          const delta = event.clientX - startX.current
          dragging.current = false
          if (Math.abs(delta) < 40) return
          goTo(delta < 0 ? index + 1 : index - 1)
        }}
      >
        <CarouselTrack $index={index} $animate={animate} onTransitionEnd={snapIfClone}>
          {LOOP_SLIDES.map((slide, slideIndex) => (
            <CarouselSlide key={`${slide.src}-${slideIndex}`}>
              <img src={slide.src} alt={slide.alt} draggable={false} />
            </CarouselSlide>
          ))}
        </CarouselTrack>
        <CarouselDots>
          {SLIDES.map((slide, slideIndex) => (
            <CarouselDot
              key={slide.src}
              type="button"
              $active={slideIndex === realIndex()}
              aria-label={`第 ${slideIndex + 1} 張`}
              onClick={() => goTo(slideIndex + FIRST_REAL)}
            />
          ))}
        </CarouselDots>
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
  touch-action: pan-y;
  user-select: none;
`

const CarouselTrack = styled.div<{ $index: number; $animate: boolean }>`
  display: flex;
  transition: ${({ $animate }) => ($animate ? 'transform 0.45s ease' : 'none')};
  transform: translateX(${({ $index }) => `-${$index * 100}%`});
`

const CarouselSlide = styled.div`
  flex: 0 0 100%;
  aspect-ratio: 16 / 9;
  background: #2c2c2e;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
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
