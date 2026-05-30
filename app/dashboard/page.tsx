import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getDashboardStats, getRecentScans, getPendingReminders, getUserPlants } from '@/app/actions/dashboard'
import { DashboardContent } from '@/components/dashboard/dashboard-content'

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const [stats, recentScans, reminders, plants] = await Promise.all([
    getDashboardStats(),
    getRecentScans(5),
    getPendingReminders(),
    getUserPlants(),
  ])

  return (
    <DashboardContent 
      user={session.user} 
      stats={stats}
      recentScans={recentScans}
      reminders={reminders}
      plants={plants}
    />
  )
}
