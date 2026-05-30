'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Leaf,
  MessageCircle,
  ScanLine,
  Sprout,
  Calendar,
  LogOut,
  Menu,
  X,
  Home,
  Bot,
  TreePine,
  Droplets,
  Sun,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'

interface User {
  id: string
  name: string
  email: string
  image?: string | null
}

interface DashboardStats {
  totalPlants: number
  totalScans: number
  totalChats: number
  pendingReminders: number
}

interface DiseaseScan {
  id: number
  imageUrl: string
  diseaseName: string | null
  severity: string | null
  createdAt: Date
}

interface Reminder {
  id: number
  reminderType: string
  dueDate: Date
  plantId: number | null
}

interface Plant {
  id: number
  name: string
  species: string | null
  location: string | null
}

interface DashboardContentProps {
  user: User
  stats: DashboardStats
  recentScans: DiseaseScan[]
  reminders: Reminder[]
  plants: Plant[]
}

export function DashboardContent({ user, stats, recentScans, reminders, plants }: DashboardContentProps) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleSignOut = async () => {
    setIsLoggingOut(true)
    await authClient.signOut()
    router.push('/')
    router.refresh()
  }

  const features = [
    {
      title: 'PrakritiMitra Chatbot',
      description: 'Get AI-powered gardening advice in multiple languages',
      icon: Bot,
      href: '/chat',
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      title: 'Plant Recommendations',
      description: 'Discover plants perfect for your climate and soil',
      icon: Sprout,
      href: '/recommendations',
      color: 'bg-lime-100 text-lime-600',
    },
    {
      title: 'Leaf Disease Scanner',
      description: 'Upload leaf images to detect diseases and get treatments',
      icon: ScanLine,
      href: '/scan',
      color: 'bg-amber-100 text-amber-600',
    },
    {
      title: 'My Plants',
      description: 'Track and manage your plant collection',
      icon: TreePine,
      href: '/plants',
      color: 'bg-teal-100 text-teal-600',
    },
    {
      title: 'Care Reminders',
      description: 'Never miss a watering or fertilizing schedule',
      icon: Calendar,
      href: '/reminders',
      color: 'bg-sky-100 text-sky-600',
    },
    {
      title: 'Community Tips',
      description: 'Learn from fellow gardening enthusiasts',
      icon: MessageCircle,
      href: '/community',
      color: 'bg-purple-100 text-purple-600',
    },
  ]

  const getReminderIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'water':
        return <Droplets className="h-4 w-4 text-blue-500" />
      case 'fertilize':
        return <Sprout className="h-4 w-4 text-green-500" />
      case 'sunlight':
        return <Sun className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-emerald-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-emerald-600" />
            <span className="text-xl font-bold text-emerald-900">EcoFriend</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-900"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/chat"
              className="flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-900"
            >
              <Bot className="h-4 w-4" />
              Chat
            </Link>
            <Link
              href="/scan"
              className="flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-900"
            >
              <ScanLine className="h-4 w-4" />
              Scan
            </Link>
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <span className="text-sm text-emerald-700">
              Welcome, <span className="font-medium">{user.name}</span>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              disabled={isLoggingOut}
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isLoggingOut ? 'Signing out...' : 'Sign Out'}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-emerald-700" />
            ) : (
              <Menu className="h-6 w-6 text-emerald-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t border-emerald-200 bg-white p-4 md:hidden">
            <div className="space-y-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm font-medium text-emerald-700"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/chat"
                className="flex items-center gap-2 text-sm font-medium text-emerald-700"
                onClick={() => setIsMenuOpen(false)}
              >
                <Bot className="h-4 w-4" />
                Chat
              </Link>
              <Link
                href="/scan"
                className="flex items-center gap-2 text-sm font-medium text-emerald-700"
                onClick={() => setIsMenuOpen(false)}
              >
                <ScanLine className="h-4 w-4" />
                Scan
              </Link>
              <div className="border-t border-emerald-200 pt-4">
                <p className="mb-2 text-sm text-emerald-700">
                  Signed in as <span className="font-medium">{user.name}</span>
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                  className="w-full border-emerald-200 text-emerald-700"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-emerald-900">
            Welcome back, {user.name.split(' ')[0]}!
          </h1>
          <p className="mt-2 text-emerald-700">
            {"What would you like to do today? Let's grow something amazing together."}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-emerald-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-600 flex items-center gap-2">
                <TreePine className="h-4 w-4" />
                My Plants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-900">{stats.totalPlants}</p>
              <p className="text-xs text-emerald-600">Plants tracked</p>
            </CardContent>
          </Card>
          <Card className="border-emerald-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-600 flex items-center gap-2">
                <ScanLine className="h-4 w-4" />
                Disease Scans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-900">{stats.totalScans}</p>
              <p className="text-xs text-emerald-600">Scans completed</p>
            </CardContent>
          </Card>
          <Card className="border-emerald-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-600 flex items-center gap-2">
                <Bot className="h-4 w-4" />
                Chat Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-900">{stats.totalChats}</p>
              <p className="text-xs text-emerald-600">Conversations</p>
            </CardContent>
          </Card>
          <Card className="border-emerald-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-600 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Pending Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-900">{stats.pendingReminders}</p>
              <p className="text-xs text-emerald-600">Care reminders</p>
            </CardContent>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Feature Cards Grid - 2 columns on large screens */}
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-lg font-semibold text-emerald-900">Quick Actions</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <Link key={feature.title} href={feature.href}>
                  <Card className="group h-full cursor-pointer border-emerald-200 transition-all hover:border-emerald-400 hover:shadow-lg">
                    <CardHeader className="pb-2">
                      <div
                        className={`mb-2 flex h-10 w-10 items-center justify-center rounded-lg ${feature.color}`}
                      >
                        <feature.icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-base text-emerald-900 group-hover:text-emerald-700">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-sm text-emerald-600">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Plants */}
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-base text-emerald-900 flex items-center justify-between">
                  My Plants
                  <Link href="/plants" className="text-sm font-normal text-emerald-600 hover:text-emerald-800">
                    View all
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {plants.length === 0 ? (
                  <p className="text-sm text-emerald-600">No plants added yet. Start by adding your first plant!</p>
                ) : (
                  <ul className="space-y-3">
                    {plants.slice(0, 5).map((plant) => (
                      <li key={plant.id} className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                          <Leaf className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-emerald-900">{plant.name}</p>
                          <p className="text-xs text-emerald-600">{plant.species || 'Unknown species'}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Reminders */}
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-base text-emerald-900 flex items-center justify-between">
                  Upcoming Tasks
                  <Link href="/reminders" className="text-sm font-normal text-emerald-600 hover:text-emerald-800">
                    View all
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reminders.length === 0 ? (
                  <p className="text-sm text-emerald-600">No pending reminders. Your plants are all taken care of!</p>
                ) : (
                  <ul className="space-y-3">
                    {reminders.slice(0, 5).map((reminder) => (
                      <li key={reminder.id} className="flex items-center gap-3">
                        {getReminderIcon(reminder.reminderType)}
                        <div>
                          <p className="text-sm font-medium text-emerald-900 capitalize">{reminder.reminderType}</p>
                          <p className="text-xs text-emerald-600">
                            Due: {new Date(reminder.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Recent Scans */}
            {recentScans.length > 0 && (
              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-base text-emerald-900 flex items-center justify-between">
                    Recent Scans
                    <Link href="/scan" className="text-sm font-normal text-emerald-600 hover:text-emerald-800">
                      View all
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {recentScans.map((scan) => (
                      <li key={scan.id} className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                          <ScanLine className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-emerald-900">
                            {scan.diseaseName || 'Healthy'}
                          </p>
                          <p className="text-xs text-emerald-600">
                            {new Date(scan.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
