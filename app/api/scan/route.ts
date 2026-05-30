import {
  generateText,
  Output,
} from 'ai'
import { z } from 'zod'

export const maxDuration = 60

const DiseaseAnalysisSchema = z.object({
  isPlantImage: z.boolean().describe('Whether the image appears to be a plant/leaf'),
  isHealthy: z.boolean().describe('Whether the plant appears healthy'),
  diseaseName: z.string().nullable().describe('Name of the detected disease, if any'),
  confidence: z.number().min(0).max(100).describe('Confidence percentage of the diagnosis'),
  severity: z.enum(['none', 'mild', 'moderate', 'severe']).describe('Severity of the condition'),
  symptoms: z.array(z.string()).describe('Visible symptoms observed in the image'),
  possibleCauses: z.array(z.string()).describe('Possible causes of the condition'),
  treatment: z.object({
    immediate: z.array(z.string()).describe('Immediate actions to take'),
    organic: z.array(z.string()).describe('Organic/natural treatment options'),
    chemical: z.array(z.string()).describe('Chemical treatment options if needed'),
    prevention: z.array(z.string()).describe('Prevention tips for the future'),
  }),
  additionalNotes: z.string().nullable().describe('Any additional observations or recommendations'),
})

export async function POST(req: Request) {
  const { imageBase64 } = await req.json()

  if (!imageBase64) {
    return Response.json({ error: 'No image provided' }, { status: 400 })
  }

  const prompt = `You are an expert plant pathologist specializing in Indian agriculture and horticulture. Analyze this leaf/plant image and provide a detailed diagnosis.

Instructions:
1. First determine if this is a valid plant/leaf image
2. If it's a plant image, assess its health status
3. If disease symptoms are visible, identify the disease
4. Provide practical treatment recommendations suitable for Indian gardeners
5. Include both organic and chemical treatment options
6. Consider common diseases found in Indian growing conditions

Be thorough but practical in your analysis. If you're uncertain, indicate lower confidence.
If the image is not a plant/leaf image, set isPlantImage to false and provide appropriate feedback.`

  const { output } = await generateText({
    model: 'anthropic/claude-sonnet-4-20250514',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          {
            type: 'image',
            image: imageBase64,
          },
        ],
      },
    ],
    output: Output.object({
      schema: DiseaseAnalysisSchema,
    }),
    abortSignal: req.signal,
  })

  return Response.json(output)
}
