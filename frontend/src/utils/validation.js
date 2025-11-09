import { z } from 'zod'

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const gameSchema = z.object({
  name: z.string().min(1, 'Game name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  icon: z.string().url('Icon must be a valid URL'),
  gameType: z.enum(['balloon-pop', 'puzzle']),
})

export const scoreSchema = z.object({
  score: z.number().int().nonnegative('Score must be a non-negative integer'),
  gameData: z.object({}).passthrough().optional(),
})

export const idSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format')