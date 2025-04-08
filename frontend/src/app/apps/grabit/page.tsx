import GrabitClient from '@/app/apps/grabit/GrabitClient'
import AppLayout from '@/app/apps/layout'

export const dynamic = 'force-dynamic'

export const maxDuration = 60

export default function Page() {
  return (
    <AppLayout>
      <GrabitClient />
    </AppLayout>
  )
}
