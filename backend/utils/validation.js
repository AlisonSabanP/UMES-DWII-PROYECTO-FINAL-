import { z } from 'zod';

const objectIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/, 'ID inválido');

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Nombre completo debe tener al menos 2 caracteres').max(100),
  email: z.string().email('Formato de correo electrónico inválido').max(100),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(100),
  role: z.enum(['user', 'admin']).optional().default('user')
});

export const loginSchema = z.object({
  email: z.string().email('Formato de correo electrónico inválido'),
  password: z.string().min(1, 'La contraseña es requerida')
});

export const gameSchema = z.object({
  name: z.string().min(1, 'Nombre del juego es requerido').max(100),
  description: z.string().min(1, 'Descripción del juego es requerida').max(1000),
  price: z.number().min(0, 'Precio no puede ser negativo'),
  category: z.enum(['action', 'puzzle', 'strategy', 'adventure', 'arcade', 'other']),
  icon: z.string().optional().default(''),
  gameType: z.enum(['balloon-pop', 'puzzle', 'other']),
  isActive: z.boolean().optional().default(true)
});

export const updateGameSchema = gameSchema.partial();

export const purchaseSchema = z.object({
  gameId: objectIdSchema
});

export const scoreSchema = z.object({
  gameId: objectIdSchema,
  score: z.number().int().min(0, 'Puntuación debe ser no negativa'),
  gameData: z.record(z.unknown()).optional() 
});

export const idSchema = z.object({
  id: objectIdSchema
});