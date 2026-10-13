import { useEffect, useState } from 'react'

import ImageCarousel, { type CarouselSlide } from './ImageCarousel'

type SpeciesItem = {
  image?: string
  name?: string
}

function toSlides(items: SpeciesItem[]): CarouselSlide[] {
  return items.flatMap((item) => {
    const image = item.image?.trim()
    if (!image) return []
    const name = item.name?.trim()
    return [
      {
        id: image,
        src: `/species/${image}`,
        alt: name || '新到物種',
        caption: name || undefined,
      },
    ]
  })
}

export default function StoreEventsCarousel() {
  const [slides, setSlides] = useState<CarouselSlide[] | null>(null)

  useEffect(() => {
    let cancelled = false

    void fetch('/species/species.json')
      .then((response) => {
        if (!response.ok) throw new Error('species json')
        return response.json() as Promise<SpeciesItem[]>
      })
      .then((items) => {
        if (cancelled) return
        setSlides(toSlides(Array.isArray(items) ? items : []))
      })
      .catch(() => {
        if (cancelled) return
        setSlides([])
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (!slides?.length) return null

  return <ImageCarousel title="新到物種" slides={slides} aspectRatio="896 / 1200" />
}
