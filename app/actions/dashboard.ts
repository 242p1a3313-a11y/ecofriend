'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { plants, diseaseScans, chatSessions, careReminders } from '@/lib/db/schema'
import { eq, desc, and, gte } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

// Get dashboard stats
export async function getDashboardStats() {
  const userId = await getUserId()
  
  const [userPlants, scans, sessions, reminders] = await Promise.all([
    db.select().from(plants).where(eq(plants.userId, userId)),
    db.select().from(diseaseScans).where(eq(diseaseScans.userId, userId)),
    db.select().from(chatSessions).where(eq(chatSessions.userId, userId)),
    db.select().from(careReminders).where(
      and(
        eq(careReminders.userId, userId),
        eq(careReminders.completed, false)
      )
    ),
  ])

  return {
    totalPlants: userPlants.length,
    totalScans: scans.length,
    totalChats: sessions.length,
    pendingReminders: reminders.length,
  }
}

// Get user's plants
export async function getUserPlants() {
  const userId = await getUserId()
  return db
    .select()
    .from(plants)
    .where(eq(plants.userId, userId))
    .orderBy(desc(plants.createdAt))
}

// Add a new plant
export async function addPlant(data: {
  name: string
  species?: string
  location?: string
  plantedDate?: string
  notes?: string
}) {
  const userId = await getUserId()
  
  await db.insert(plants).values({
    userId,
    name: data.name,
    species: data.species || null,
    location: data.location || null,
    plantedDate: data.plantedDate || null,
    notes: data.notes || null,
  })
  
  revalidatePath('/dashboard')
  revalidatePath('/plants')
}

// Delete a plant
export async function deletePlant(plantId: number) {
  const userId = await getUserId()
  
  await db.delete(plants).where(
    and(eq(plants.id, plantId), eq(plants.userId, userId))
  )
  
  revalidatePath('/dashboard')
  revalidatePath('/plants')
}

// Get recent disease scans
export async function getRecentScans(limit: number = 5) {
  const userId = await getUserId()
  return db
    .select()
    .from(diseaseScans)
    .where(eq(diseaseScans.userId, userId))
    .orderBy(desc(diseaseScans.createdAt))
    .limit(limit)
}

// Save a disease scan result
export async function saveScanResult(data: {
  imageUrl: string
  diseaseName?: string
  confidence?: number
  treatment?: string
  severity?: string
  plantId?: number
}) {
  const userId = await getUserId()
  
  await db.insert(diseaseScans).values({
    userId,
    imageUrl: data.imageUrl,
    diseaseName: data.diseaseName || null,
    confidence: data.confidence ? String(data.confidence) : null,
    treatment: data.treatment || null,
    severity: data.severity || null,
    plantId: data.plantId || null,
  })
  
  revalidatePath('/dashboard')
  revalidatePath('/scan')
}

// Get pending care reminders
export async function getPendingReminders() {
  const userId = await getUserId()
  const now = new Date()
  
  return db
    .select()
    .from(careReminders)
    .where(
      and(
        eq(careReminders.userId, userId),
        eq(careReminders.completed, false),
        gte(careReminders.dueDate, now)
      )
    )
    .orderBy(careReminders.dueDate)
    .limit(10)
}

// Mark reminder as complete
export async function completeReminder(reminderId: number) {
  const userId = await getUserId()
  
  await db
    .update(careReminders)
    .set({ completed: true })
    .where(
      and(eq(careReminders.id, reminderId), eq(careReminders.userId, userId))
    )
  
  revalidatePath('/dashboard')
  revalidatePath('/reminders')
}

// Add a care reminder
export async function addReminder(data: {
  plantId?: number
  reminderType: string
  dueDate: Date
}) {
  const userId = await getUserId()
  
  await db.insert(careReminders).values({
    userId,
    plantId: data.plantId || null,
    reminderType: data.reminderType,
    dueDate: data.dueDate,
  })
  
  revalidatePath('/dashboard')
  revalidatePath('/reminders')
}
