import {
  boolean,
  decimal,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  date,
} from 'drizzle-orm/pg-core'

// Better Auth tables
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// EcoFriend App Tables
export const plants = pgTable('plants', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
  species: text('species'),
  location: text('location'),
  plantedDate: date('planted_date'),
  imageUrl: text('image_url'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const diseaseScans = pgTable('disease_scans', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  plantId: integer('plant_id'),
  imageUrl: text('image_url').notNull(),
  diseaseName: text('disease_name'),
  confidence: decimal('confidence', { precision: 5, scale: 2 }),
  treatment: text('treatment'),
  severity: text('severity'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const recommendations = pgTable('recommendations', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  plantName: text('plant_name').notNull(),
  climate: text('climate'),
  soilType: text('soil_type'),
  purpose: text('purpose'),
  careLevel: text('care_level'),
  reasoning: text('reasoning'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const chatSessions = pgTable('chat_sessions', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  title: text('title'),
  messages: jsonb('messages').notNull().default([]),
  language: text('language').default('en'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const careReminders = pgTable('care_reminders', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  plantId: integer('plant_id'),
  reminderType: text('reminder_type').notNull(),
  dueDate: timestamp('due_date').notNull(),
  completed: boolean('completed').default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
