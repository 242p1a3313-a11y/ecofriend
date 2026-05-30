import Link from 'next/link'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { TestimonialsSection } from '@/components/landing/testimonials-section'
import { CTASection } from '@/components/landing/cta-section'
import { Footer } from '@/components/landing/footer'
import { Leaf, Menu, X } from 'lucide-react'

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const isLoggedIn = !!session?.user

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={isLoggedIn} />
      <main>
        <HeroSection isLoggedIn={isLoggedIn} />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection isLoggedIn={isLoggedIn} />
      </main>
      <Footer />
    </div>
  )
}

function Header({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">EcoFriend</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </Link>
          <Link href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Testimonials
          </Link>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {isLoggedIn ? (
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu would go here */}
        <MobileNav isLoggedIn={isLoggedIn} />
      </nav>
    </header>
  )
}

function MobileNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div className="md:hidden">
      <details className="group relative">
        <summary className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg hover:bg-muted list-none">
          <Menu className="h-5 w-5 text-foreground group-open:hidden" />
          <X className="hidden h-5 w-5 text-foreground group-open:block" />
        </summary>
        <div className="absolute right-0 top-12 w-64 rounded-lg border border-border bg-card p-4 shadow-lg">
          <div className="flex flex-col gap-4">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Testimonials
            </Link>
            <div className="border-t border-border pt-4">
              {isLoggedIn ? (
                <Button asChild className="w-full bg-primary">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                  <Button asChild className="w-full bg-primary">
                    <Link href="/sign-up">Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </details>
    </div>
  )
}
