'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Leaf, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface AuthFormProps {
  mode: 'sign-in' | 'sign-up'
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (mode === 'sign-up') {
        const result = await authClient.signUp.email({
          email,
          password,
          name,
        })
        if (result.error) {
          setError(result.error.message || 'Sign up failed')
          setIsLoading(false)
          return
        }
      } else {
        const result = await authClient.signIn.email({
          email,
          password,
        })
        if (result.error) {
          setError(result.error.message || 'Sign in failed')
          setIsLoading(false)
          return
        }
      }
      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('An unexpected error occurred')
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-emerald-200 shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
          <Leaf className="h-6 w-6 text-emerald-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-emerald-900">
          {mode === 'sign-in' ? 'Welcome Back' : 'Join EcoFriend'}
        </CardTitle>
        <CardDescription className="text-emerald-700">
          {mode === 'sign-in'
            ? 'Sign in to continue your green journey'
            : 'Create an account to start your sustainable gardening journey'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'sign-up' && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-emerald-800">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-emerald-800">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-emerald-800">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md">{error}</p>
          )}
          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === 'sign-in' ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              mode === 'sign-in' ? 'Sign In' : 'Create Account'
            )}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-emerald-700">
          {mode === 'sign-in' ? (
            <>
              {"Don't have an account? "}
              <Link href="/sign-up" className="font-medium text-emerald-600 hover:text-emerald-800 underline underline-offset-4">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link href="/sign-in" className="font-medium text-emerald-600 hover:text-emerald-800 underline underline-offset-4">
                Sign in
              </Link>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
