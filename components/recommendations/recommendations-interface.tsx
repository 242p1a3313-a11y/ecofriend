'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Leaf,
  ArrowLeft,
  Loader2,
  Sprout,
  Droplets,
  Sun,
  Calendar,
  Sparkles,
  CheckCircle,
} from 'lucide-react'

interface User {
  id: string
  name: string
}

interface RecommendationsInterfaceProps {
  user: User
}

interface PlantRecommendation {
  name: string
  scientificName: string | null
  localName: string | null
  description: string
  careLevel: 'easy' | 'moderate' | 'expert'
  wateringFrequency: string
  sunlight: string
  soilType: string
  growthTime: string
  benefits: string[]
  tips: string[]
  bestSeason: string
}

interface RecommendationResult {
  recommendations: PlantRecommendation[]
  generalAdvice: string
}

const climateOptions = [
  { value: 'tropical', label: 'Tropical (Hot & Humid)' },
  { value: 'subtropical', label: 'Subtropical' },
  { value: 'arid', label: 'Arid/Semi-arid (Hot & Dry)' },
  { value: 'temperate', label: 'Temperate/Hill' },
  { value: 'coastal', label: 'Coastal' },
]

const soilOptions = [
  { value: 'loamy', label: 'Loamy (Rich & Well-draining)' },
  { value: 'clay', label: 'Clay (Heavy & Dense)' },
  { value: 'sandy', label: 'Sandy (Light & Fast-draining)' },
  { value: 'red', label: 'Red Soil' },
  { value: 'black', label: 'Black Cotton Soil' },
  { value: 'unknown', label: "I don't know" },
]

const purposeOptions = [
  { value: 'vegetables', label: 'Vegetables & Food' },
  { value: 'fruits', label: 'Fruits' },
  { value: 'herbs', label: 'Herbs & Medicinal' },
  { value: 'flowers', label: 'Flowers & Decoration' },
  { value: 'indoor', label: 'Indoor Plants' },
  { value: 'mixed', label: 'Mixed/Kitchen Garden' },
]

const experienceOptions = [
  { value: 'beginner', label: 'Beginner - Just starting out' },
  { value: 'intermediate', label: 'Intermediate - Some experience' },
  { value: 'advanced', label: 'Advanced - Experienced gardener' },
]

const spaceOptions = [
  { value: 'balcony', label: 'Balcony/Terrace' },
  { value: 'small', label: 'Small Garden (< 100 sq ft)' },
  { value: 'medium', label: 'Medium Garden (100-500 sq ft)' },
  { value: 'large', label: 'Large Garden (> 500 sq ft)' },
  { value: 'containers', label: 'Containers/Pots Only' },
]

const regionOptions = [
  { value: 'north', label: 'North India (Delhi, Punjab, UP)' },
  { value: 'south', label: 'South India (Karnataka, TN, Kerala)' },
  { value: 'east', label: 'East India (WB, Odisha, Bihar)' },
  { value: 'west', label: 'West India (Maharashtra, Gujarat)' },
  { value: 'central', label: 'Central India (MP, Rajasthan)' },
  { value: 'northeast', label: 'North East India' },
]

export function RecommendationsInterface({ user }: RecommendationsInterfaceProps) {
  const [climate, setClimate] = useState('')
  const [soilType, setSoilType] = useState('')
  const [purpose, setPurpose] = useState('')
  const [experience, setExperience] = useState('')
  const [space, setSpace] = useState('')
  const [region, setRegion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<RecommendationResult | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ climate, soilType, purpose, experience, space, region }),
      })

      if (!response.ok) throw new Error('Failed to get recommendations')

      const data = await response.json()
      setResult(data)
    } catch {
      setError('Failed to get recommendations. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getCareLevelBadge = (level: string) => {
    switch (level) {
      case 'easy':
        return <Badge className="bg-emerald-100 text-emerald-700">Easy</Badge>
      case 'moderate':
        return <Badge className="bg-amber-100 text-amber-700">Moderate</Badge>
      case 'expert':
        return <Badge className="bg-red-100 text-red-700">Expert</Badge>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="border-b border-emerald-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-emerald-600 hover:text-emerald-800">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-100">
                <Sprout className="h-5 w-5 text-lime-600" />
              </div>
              <div>
                <h1 className="font-semibold text-emerald-900">Plant Recommendations</h1>
                <p className="text-xs text-emerald-600">AI-powered plant suggestions</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {!result ? (
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-emerald-900">
                {"Let's find the perfect plants for you!"}
              </h2>
              <p className="mt-2 text-emerald-700">
                Answer a few questions and our AI will recommend plants tailored to your conditions.
              </p>
            </div>

            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-900">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                  Your Gardening Profile
                </CardTitle>
                <CardDescription>
                  Tell us about your growing conditions for personalized recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="region">Region in India</Label>
                      <Select value={region} onValueChange={setRegion}>
                        <SelectTrigger id="region" className="border-emerald-200">
                          <SelectValue placeholder="Select your region" />
                        </SelectTrigger>
                        <SelectContent>
                          {regionOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="climate">Climate Type</Label>
                      <Select value={climate} onValueChange={setClimate}>
                        <SelectTrigger id="climate" className="border-emerald-200">
                          <SelectValue placeholder="Select climate type" />
                        </SelectTrigger>
                        <SelectContent>
                          {climateOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="soil">Soil Type</Label>
                      <Select value={soilType} onValueChange={setSoilType}>
                        <SelectTrigger id="soil" className="border-emerald-200">
                          <SelectValue placeholder="Select soil type" />
                        </SelectTrigger>
                        <SelectContent>
                          {soilOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="purpose">Growing Purpose</Label>
                      <Select value={purpose} onValueChange={setPurpose}>
                        <SelectTrigger id="purpose" className="border-emerald-200">
                          <SelectValue placeholder="What do you want to grow?" />
                        </SelectTrigger>
                        <SelectContent>
                          {purposeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience Level</Label>
                      <Select value={experience} onValueChange={setExperience}>
                        <SelectTrigger id="experience" className="border-emerald-200">
                          <SelectValue placeholder="Your gardening experience" />
                        </SelectTrigger>
                        <SelectContent>
                          {experienceOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="space">Available Space</Label>
                      <Select value={space} onValueChange={setSpace}>
                        <SelectTrigger id="space" className="border-emerald-200">
                          <SelectValue placeholder="Your growing space" />
                        </SelectTrigger>
                        <SelectContent>
                          {spaceOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Finding perfect plants...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Get Recommendations
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-emerald-900">
                  Your Personalized Recommendations
                </h2>
                <p className="mt-1 text-emerald-700">
                  Based on your preferences, here are the best plants for you.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setResult(null)}
                className="border-emerald-200 text-emerald-700"
              >
                Start Over
              </Button>
            </div>

            {/* General Advice */}
            <Card className="mb-8 border-emerald-200 bg-emerald-50">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                      <Leaf className="h-5 w-5 text-emerald-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-900">Expert Advice</h3>
                    <p className="mt-1 text-emerald-700">{result.generalAdvice}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plant Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {result.recommendations.map((plant, index) => (
                <Card key={index} className="border-emerald-200 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-emerald-50 to-lime-50 pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg text-emerald-900">{plant.name}</CardTitle>
                        {plant.scientificName && (
                          <p className="text-xs italic text-emerald-600">{plant.scientificName}</p>
                        )}
                        {plant.localName && (
                          <p className="text-xs text-emerald-600">{plant.localName}</p>
                        )}
                      </div>
                      {getCareLevelBadge(plant.careLevel)}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="mb-4 text-sm text-emerald-700">{plant.description}</p>
                    
                    <div className="mb-4 grid grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <span className="text-emerald-700">{plant.wateringFrequency}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-yellow-500" />
                        <span className="text-emerald-700">{plant.sunlight}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sprout className="h-4 w-4 text-emerald-500" />
                        <span className="text-emerald-700">{plant.soilType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        <span className="text-emerald-700">{plant.bestSeason}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="mb-2 text-xs font-medium text-emerald-800">Benefits:</p>
                      <div className="flex flex-wrap gap-1">
                        {plant.benefits.slice(0, 3).map((benefit, i) => (
                          <Badge key={i} variant="secondary" className="text-xs bg-emerald-100 text-emerald-700">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-medium text-emerald-800">Quick Tips:</p>
                      <ul className="space-y-1">
                        {plant.tips.slice(0, 2).map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-emerald-700">
                            <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0 text-emerald-500" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
