import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Leaf } from 'lucide-react'

interface CTASectionProps {
  isLoggedIn: boolean
}

export function CTASection({ isLoggedIn }: CTASectionProps) {
  return (
    <section className="relative overflow-hidden bg-primary py-20 sm:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-white/5" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex items-center justify-center">
            <Leaf className="h-12 w-12 text-primary-foreground/80" />
          </div>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Ready to start your sustainable gardening journey?
          </h2>
          <p className="mt-4 text-pretty text-lg text-primary-foreground/80">
            Join thousands of gardeners who are growing smarter with AI-powered insights. 
            {"It's free to get started!"}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {isLoggedIn ? (
              <Button 
                asChild 
                size="lg" 
                className="w-full bg-white text-primary hover:bg-white/90 sm:w-auto"
              >
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button 
                  asChild 
                  size="lg" 
                  className="w-full bg-white text-primary hover:bg-white/90 sm:w-auto"
                >
                  <Link href="/sign-up">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  asChild 
                  className="w-full border-white/30 text-primary-foreground hover:bg-white/10 sm:w-auto"
                >
                  <Link href="/sign-in">
                    Already have an account? Sign In
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
