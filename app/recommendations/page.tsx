import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { RecommendationsInterface } from '@/components/recommendations/recommendations-interface'

export default async function RecommendationsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  return <RecommendationsInterface user={session.user} />
}
