import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Leaf, Sparkles, ArrowRight } from 'lucide-react'

interface HeroSectionProps {
  isLoggedIn: boolean
}

export function HeroSection({ isLoggedIn }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 h-[400px] w-[400px] rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Plantation Assistant</span>
          </div>

          {/* Headline */}
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Grow Smarter with{' '}
            <span className="text-primary">EcoFriend</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Your intelligent gardening companion. Get personalized plant recommendations, 
            detect leaf diseases instantly, and chat with PrakritiMitra for expert advice 
            in multiple languages.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {isLoggedIn ? (
              <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90 sm:w-auto">
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90 sm:w-auto">
                  <Link href="/sign-up">
                    Start Growing Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
                  <Link href="#features">
                    Explore Features
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-primary" />
              <span>100+ Plant Species</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              <span>Multilingual Support</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              <span>AI-Powered Analysis</span>
            </div>
          </div>
        </div>

        {/* Hero Image/Illustration */}
        <div className="relative mx-auto mt-16 max-w-4xl">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <div className="flex h-full items-center justify-center">
              <div className="grid grid-cols-3 gap-4 p-8">
                {/* Card 1 - Chat */}
                <div className="flex flex-col items-center rounded-xl bg-background/80 p-4 shadow-lg backdrop-blur">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <span className="mt-2 text-xs font-medium text-foreground">PrakritiMitra</span>
                  <span className="text-xs text-muted-foreground">AI Chatbot</span>
                </div>

                {/* Card 2 - Scan */}
                <div className="flex flex-col items-center rounded-xl bg-background/80 p-4 shadow-lg backdrop-blur">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                    <svg className="h-6 w-6 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <span className="mt-2 text-xs font-medium text-foreground">Leaf Scanner</span>
                  <span className="text-xs text-muted-foreground">Disease Detection</span>
                </div>

                {/* Card 3 - Recommend */}
                <div className="flex flex-col items-center rounded-xl bg-background/80 p-4 shadow-lg backdrop-blur">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className="mt-2 text-xs font-medium text-foreground">Smart Picks</span>
                  <span className="text-xs text-muted-foreground">Plant Suggestions</span>
                </div>
              </div>
            </div>
          </div>
          {/* Floating decoration elements */}
          <div className="absolute -left-4 top-1/4 h-8 w-8 rotate-12 rounded-lg bg-primary/20" />
          <div className="absolute -right-2 bottom-1/3 h-6 w-6 rotate-45 rounded bg-accent/30" />
        </div>
      </div>
    </section>
  )
}
