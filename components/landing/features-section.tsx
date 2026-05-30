import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bot, ScanLine, Sprout, Globe, Bell, TrendingUp } from 'lucide-react'

const features = [
  {
    icon: Bot,
    title: 'PrakritiMitra Chatbot',
    description: 'Your 24/7 AI gardening companion. Ask questions about plant care, get instant solutions, and learn sustainable practices in Hindi, English, Telugu, and more.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: ScanLine,
    title: 'Leaf Disease Detection',
    description: 'Upload a photo of your plant leaf and get instant AI-powered diagnosis. Identify diseases early and receive treatment recommendations.',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    icon: Sprout,
    title: 'Smart Plant Recommendations',
    description: 'Get personalized plant suggestions based on your location, climate, soil type, and gardening goals. Perfect for beginners and experts alike.',
    color: 'bg-lime-100 text-lime-700',
  },
  {
    icon: Globe,
    title: 'Multilingual Support',
    description: 'Access all features in your preferred language. We support Hindi, English, Telugu, Tamil, and more regional languages.',
    color: 'bg-sky-100 text-sky-700',
  },
  {
    icon: Bell,
    title: 'Care Reminders',
    description: 'Never forget to water or fertilize again. Set up custom reminders for each plant based on their specific needs.',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    icon: TrendingUp,
    title: 'Growth Analytics',
    description: 'Track your plants progress over time with detailed growth predictions and health monitoring dashboards.',
    color: 'bg-rose-100 text-rose-700',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold uppercase tracking-wide text-primary">
            Features
          </h2>
          <p className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need for sustainable gardening
          </p>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Powered by AI, designed for gardeners. EcoFriend brings together cutting-edge 
            technology and agricultural wisdom to help your garden thrive.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card 
              key={feature.title} 
              className="group relative overflow-hidden border-border transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <CardHeader>
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
              {/* Hover effect */}
              <div className="absolute inset-x-0 bottom-0 h-1 scale-x-0 bg-primary transition-transform group-hover:scale-x-100" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
