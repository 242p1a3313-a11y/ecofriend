import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { AuthForm } from '@/components/auth-form'
import { Leaf } from 'lucide-react'
import Link from 'next/link'

export default async function SignInPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect('/dashboard')

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col">
      <header className="p-6">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900">
          <Leaf className="h-6 w-6" />
          <span className="font-semibold text-lg">EcoFriend</span>
        </Link>
      </header>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <AuthForm mode="sign-in" />
      </div>
    </main>
  )
}
