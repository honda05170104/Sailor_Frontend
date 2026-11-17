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
    src: '/announcement/announcement-member-launch.jpg',
    alt: '水手會員系統 10/15 正式上線，註冊即享 50 元折價券，舊會員直升金卡',
    modal: true,
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
