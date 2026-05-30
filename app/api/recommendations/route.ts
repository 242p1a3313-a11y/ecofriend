import {
  generateText,
  Output,
} from 'ai'
import { z } from 'zod'

export const maxDuration = 60

const PlantRecommendationSchema = z.object({
  recommendations: z.array(z.object({
    name: z.string().describe('Common name of the plant'),
    scientificName: z.string().nullable().describe('Scientific/botanical name'),
    localName: z.string().nullable().describe('Local/regional name in Indian languages'),
    description: z.string().describe('Brief description of the plant'),
    careLevel: z.enum(['easy', 'moderate', 'expert']).describe('Difficulty level of care'),
    wateringFrequency: z.string().describe('How often to water'),
    sunlight: z.string().describe('Sunlight requirements'),
    soilType: z.string().describe('Ideal soil type'),
    growthTime: z.string().describe('Time to mature/harvest'),
    benefits: z.array(z.string()).describe('Key benefits of growing this plant'),
    tips: z.array(z.string()).describe('Quick care tips'),
    bestSeason: z.string().describe('Best season to plant'),
  })),
  generalAdvice: z.string().describe('General advice based on user preferences'),
})

export async function POST(req: Request) {
  const { climate, soilType, purpose, experience, space, region } = await req.json()

  const prompt = `You are an expert Indian horticulturist and agricultural advisor. Based on the following user preferences, recommend 5 plants that would be ideal for them to grow.

User Preferences:
- Climate/Location: ${climate || 'Not specified'}
- Soil Type: ${soilType || 'Not specified'}
- Purpose: ${purpose || 'General gardening'}
- Experience Level: ${experience || 'Beginner'}
- Available Space: ${space || 'Not specified'}
- Region in India: ${region || 'Not specified'}

Please provide plant recommendations that:
1. Are suitable for the Indian climate and conditions
2. Match the user's experience level
3. Serve their stated purpose (food, decoration, medicinal, etc.)
4. Include a mix of traditional Indian plants and popular varieties
5. Consider the available growing space

For each plant, provide practical, actionable advice that would help an Indian gardener succeed.`

  const { output } = await generateText({
    model: 'anthropic/claude-sonnet-4-20250514',
    prompt,
    output: Output.object({
      schema: PlantRecommendationSchema,
    }),
    abortSignal: req.signal,
  })

  return Response.json(output)
}
