const steps = [
  {
    number: '01',
    title: 'Create Your Account',
    description: 'Sign up for free and tell us about your gardening goals, location, and experience level.',
  },
  {
    number: '02',
    title: 'Get Personalized Recommendations',
    description: 'Our AI analyzes your inputs and suggests the perfect plants for your environment and skill level.',
  },
  {
    number: '03',
    title: 'Chat with PrakritiMitra',
    description: 'Ask questions anytime in your preferred language. Get instant answers about planting, care, and troubleshooting.',
  },
  {
    number: '04',
    title: 'Scan and Protect',
    description: 'Upload photos of your plants to detect diseases early and receive AI-powered treatment recommendations.',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-secondary/30 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold uppercase tracking-wide text-primary">
            How It Works
          </h2>
          <p className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Start your green journey in 4 simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16">
          <div className="relative">
            {/* Connection line - hidden on mobile */}
            <div className="absolute left-8 top-0 hidden h-full w-0.5 bg-border lg:left-1/2 lg:block lg:-translate-x-1/2" />

            <div className="space-y-12 lg:space-y-0">
              {steps.map((step, index) => (
                <div key={step.number} className="relative">
                  <div className={`lg:flex lg:items-center lg:gap-8 ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
                    {/* Content */}
                    <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right lg:pr-16' : 'lg:text-left lg:pl-16'}`}>
                      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <span className="text-4xl font-bold text-primary/20">{step.number}</span>
                        <h3 className="mt-2 text-xl font-semibold text-foreground">{step.title}</h3>
                        <p className="mt-2 text-muted-foreground">{step.description}</p>
                      </div>
                    </div>

                    {/* Circle indicator - hidden on mobile, centered on desktop */}
                    <div className="absolute left-8 top-6 hidden h-4 w-4 -translate-x-1/2 rounded-full border-4 border-primary bg-background lg:left-1/2 lg:block" />

                    {/* Spacer for alternating layout */}
                    <div className="hidden flex-1 lg:block" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
