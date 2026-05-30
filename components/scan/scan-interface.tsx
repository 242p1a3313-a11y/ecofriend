'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft,
  Upload,
  Camera,
  ScanLine,
  Loader2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Leaf,
  RefreshCw,
  Info,
} from 'lucide-react'

interface User {
  id: string
  name: string
}

interface ScanInterfaceProps {
  user: User
}

interface TreatmentPlan {
  immediate: string[]
  organic: string[]
  chemical: string[]
  prevention: string[]
}

interface ScanResult {
  isPlantImage: boolean
  isHealthy: boolean
  diseaseName: string | null
  confidence: number
  severity: 'none' | 'mild' | 'moderate' | 'severe'
  symptoms: string[]
  possibleCauses: string[]
  treatment: TreatmentPlan
  additionalNotes: string | null
}

export function ScanInterface({ user }: ScanInterfaceProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image size should be less than 10MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string)
      setResult(null)
      setError('')
    }
    reader.readAsDataURL(file)
  }, [])

  const handleAnalyze = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    setError('')

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: selectedImage }),
      })

      if (!response.ok) throw new Error('Analysis failed')

      const data = await response.json()
      setResult(data)
    } catch {
      setError('Failed to analyze image. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setSelectedImage(null)
    setResult(null)
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'none':
        return 'bg-emerald-100 text-emerald-700'
      case 'mild':
        return 'bg-yellow-100 text-yellow-700'
      case 'moderate':
        return 'bg-orange-100 text-orange-700'
      case 'severe':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'none':
        return <CheckCircle className="h-5 w-5 text-emerald-600" />
      case 'mild':
        return <Info className="h-5 w-5 text-yellow-600" />
      case 'moderate':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case 'severe':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="border-b border-emerald-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-emerald-600 hover:text-emerald-800">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <ScanLine className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h1 className="font-semibold text-emerald-900">Leaf Disease Scanner</h1>
                <p className="text-xs text-emerald-600">AI-powered plant health analysis</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {!result ? (
          <div className="mx-auto max-w-xl">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-emerald-900">
                Scan Your Plant Leaves
              </h2>
              <p className="mt-2 text-emerald-700">
                Upload a clear photo of a plant leaf to detect diseases and get treatment recommendations.
              </p>
            </div>

            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-900">
                  <Camera className="h-5 w-5 text-emerald-600" />
                  Upload Image
                </CardTitle>
                <CardDescription>
                  Take a close-up photo of the affected leaf for best results.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />

                {!selectedImage ? (
                  <label
                    htmlFor="image-upload"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-emerald-300 bg-emerald-50 p-12 transition-colors hover:border-emerald-500 hover:bg-emerald-100"
                  >
                    <Upload className="mb-4 h-12 w-12 text-emerald-400" />
                    <p className="mb-2 text-sm font-medium text-emerald-700">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-emerald-600">
                      PNG, JPG up to 10MB
                    </p>
                  </label>
                ) : (
                  <div className="space-y-4">
                    <div className="relative overflow-hidden rounded-lg">
                      <img
                        src={selectedImage}
                        alt="Selected leaf"
                        className="w-full object-contain max-h-80"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={handleReset}
                        className="flex-1 border-emerald-200 text-emerald-700"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Choose Different Image
                      </Button>
                      <Button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <ScanLine className="mr-2 h-4 w-4" />
                            Analyze Leaf
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {error && (
                  <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
                )}
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="mt-6 border-emerald-200 bg-emerald-50">
              <CardContent className="pt-6">
                <h3 className="mb-3 font-semibold text-emerald-900">Tips for Best Results</h3>
                <ul className="space-y-2 text-sm text-emerald-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-emerald-500" />
                    Use natural lighting for clearer images
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-emerald-500" />
                    Focus on the affected area of the leaf
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-emerald-500" />
                    Include both healthy and affected parts if possible
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-emerald-500" />
                    Avoid blurry or dark images
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-emerald-900">Analysis Results</h2>
              <Button
                variant="outline"
                onClick={handleReset}
                className="border-emerald-200 text-emerald-700"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Scan Another
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Image Preview */}
              <Card className="border-emerald-200 lg:col-span-1">
                <CardContent className="pt-6">
                  <img
                    src={selectedImage || ''}
                    alt="Analyzed leaf"
                    className="w-full rounded-lg object-contain"
                  />
                </CardContent>
              </Card>

              {/* Results */}
              <div className="space-y-6 lg:col-span-2">
                {!result.isPlantImage ? (
                  <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <AlertTriangle className="h-8 w-8 text-amber-600" />
                        <div>
                          <h3 className="font-semibold text-amber-900">Not a Plant Image</h3>
                          <p className="text-amber-700">
                            {"The uploaded image doesn't appear to be a plant or leaf. Please upload a clear image of a plant leaf."}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {/* Status Card */}
                    <Card className={`border-2 ${result.isHealthy ? 'border-emerald-300 bg-emerald-50' : 'border-amber-300 bg-amber-50'}`}>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                          {result.isHealthy ? (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                              <Leaf className="h-6 w-6 text-emerald-600" />
                            </div>
                          ) : (
                            getSeverityIcon(result.severity)
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="text-xl font-semibold text-gray-900">
                                {result.isHealthy ? 'Healthy Plant!' : result.diseaseName || 'Issue Detected'}
                              </h3>
                              <Badge className={getSeverityColor(result.severity)}>
                                {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)}
                              </Badge>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-sm text-gray-600">Confidence:</span>
                              <Progress value={result.confidence} className="w-32" />
                              <span className="text-sm font-medium text-gray-700">{result.confidence}%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Symptoms */}
                    {result.symptoms.length > 0 && (
                      <Card className="border-emerald-200">
                        <CardHeader>
                          <CardTitle className="text-emerald-900">Observed Symptoms</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {result.symptoms.map((symptom, i) => (
                              <li key={i} className="flex items-start gap-2 text-emerald-700">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                                {symptom}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {/* Possible Causes */}
                    {result.possibleCauses.length > 0 && (
                      <Card className="border-emerald-200">
                        <CardHeader>
                          <CardTitle className="text-emerald-900">Possible Causes</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {result.possibleCauses.map((cause, i) => (
                              <li key={i} className="flex items-start gap-2 text-emerald-700">
                                <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                                {cause}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {/* Treatment Plan */}
                    {!result.isHealthy && (
                      <Card className="border-emerald-200">
                        <CardHeader>
                          <CardTitle className="text-emerald-900">Treatment Plan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {result.treatment.immediate.length > 0 && (
                            <div>
                              <h4 className="mb-2 flex items-center gap-2 font-semibold text-red-700">
                                <AlertTriangle className="h-4 w-4" />
                                Immediate Actions
                              </h4>
                              <ul className="space-y-1 text-sm text-gray-700">
                                {result.treatment.immediate.map((action, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500" />
                                    {action}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {result.treatment.organic.length > 0 && (
                            <div>
                              <h4 className="mb-2 flex items-center gap-2 font-semibold text-emerald-700">
                                <Leaf className="h-4 w-4" />
                                Organic Treatments
                              </h4>
                              <ul className="space-y-1 text-sm text-gray-700">
                                {result.treatment.organic.map((treatment, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                                    {treatment}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {result.treatment.chemical.length > 0 && (
                            <div>
                              <h4 className="mb-2 font-semibold text-amber-700">Chemical Options (if needed)</h4>
                              <ul className="space-y-1 text-sm text-gray-700">
                                {result.treatment.chemical.map((treatment, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                                    {treatment}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {result.treatment.prevention.length > 0 && (
                            <div>
                              <h4 className="mb-2 flex items-center gap-2 font-semibold text-blue-700">
                                <CheckCircle className="h-4 w-4" />
                                Prevention Tips
                              </h4>
                              <ul className="space-y-1 text-sm text-gray-700">
                                {result.treatment.prevention.map((tip, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Additional Notes */}
                    {result.additionalNotes && (
                      <Card className="border-emerald-200 bg-emerald-50">
                        <CardContent className="pt-6">
                          <div className="flex gap-4">
                            <Info className="h-5 w-5 flex-shrink-0 text-emerald-600" />
                            <p className="text-emerald-700">{result.additionalNotes}</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
