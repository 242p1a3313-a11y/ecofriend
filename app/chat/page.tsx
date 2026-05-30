import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { ChatInterface } from '@/components/chat/chat-interface'

export default async function ChatPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  return <ChatInterface user={session.user} />
}
