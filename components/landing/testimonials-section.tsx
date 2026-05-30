import { Card, CardContent } from '@/components/ui/card'
import { Quote } from 'lucide-react'

const testimonials = [
  {
    quote: 'EcoFriend helped me transform my barren balcony into a thriving garden. The plant recommendations were spot-on for my climate!',
    author: 'Priya Sharma',
    role: 'Home Gardener, Delhi',
    avatar: 'PS',
  },
  {
    quote: 'The leaf disease scanner saved my tomato plants! I caught the blight early and the treatment suggestions actually worked.',
    author: 'Rajesh Kumar',
    role: 'Urban Farmer, Bangalore',
    avatar: 'RK',
  },
  {
    quote: 'Finally an app that speaks my language! PrakritiMitra answers all my questions in Telugu, making gardening so much easier.',
    author: 'Lakshmi Devi',
    role: 'Kitchen Gardener, Hyderabad',
    avatar: 'LD',
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold uppercase tracking-wide text-primary">
            Testimonials
          </h2>
          <p className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Loved by gardeners across India
          </p>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            {"Join thousands of happy gardeners who've transformed their green spaces with EcoFriend."}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.author} 
              className="relative overflow-hidden border-border"
            >
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-primary/20" />
                <blockquote className="mt-4 text-foreground">
                  {`"${testimonial.quote}"`}
                </blockquote>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
