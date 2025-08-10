import { Context, Next } from 'hono'
import jwt from 'jsonwebtoken'

interface JwtPayload {
  userId: string
  exp: number
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Missing or invalid authorization header' }, 401)
  }

  const token = authHeader.substring(7)

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload
    c.set('userId', payload.userId)
    await next()
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401)
  }
}

export const getUserId = (c: Context): string => {
  const userId = c.get('userId')
  if (!userId) {
    throw new Error('User ID not found in context')
  }
  return userId
}