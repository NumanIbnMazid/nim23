import GrabitClient from '@/app/apps/grabit/GrabitClient'

export const dynamic = 'force-dynamic'

export const maxDuration = 60

export default function Page() {
  return (
    <div>
      <GrabitClient />
    </div>
  )
}
