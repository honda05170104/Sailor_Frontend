import { openAnnouncement } from './AnnouncementModal'
import ImageCarousel, { type CarouselSlide } from './ImageCarousel'

type Announcement = {
  src: string
  alt: string
  href?: string
  modal?: boolean
}

const ANNOUNCEMENTS: Announcement[] = [
  {
    src: '/announcement/announcement-launch-1015.jpg',
    alt: '水手會員系統 10/15 正式上線，舊會員註冊即享 200 元折價券',
    modal: true,
  },
  {
    src: '/announcement/HzEsBdxwGtj7.jpg',
    alt: '2026 桃園寵物用品展秋季，10/23–26 桃園會展中心',
  },
  {
    src: '/announcement/89HbwEQEWxZQ.jpg',
    alt: '2026 寵物用品博覽會台北貓展，11/27–30 南港展覽館2館',
  },
]

const slides: CarouselSlide[] = ANNOUNCEMENTS.map((item) => ({
  id: item.src,
  src: item.src,
  alt: item.alt,
  href: item.href,
  onClick: item.modal ? openAnnouncement : undefined,
}))

export default function AnnouncementCarousel() {
  return <ImageCarousel title="公告" slides={slides} emptyText="尚無公告" />
}
