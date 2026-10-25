import { EmptyCard } from '../../components/Dashboard'
import PageLayout from '../../components/PageLayout'

export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <PageLayout title={title} nav>
      <EmptyCard>即將開放</EmptyCard>
    </PageLayout>
  )
}
