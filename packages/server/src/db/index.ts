import { drizzle } from 'drizzle-orm/node-postgres';

const DATABASE_URL = process.env.DATABASE_URL || `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@postgres:5432/${process.env.POSTGRES_DB}`;

export const db = drizzle(DATABASE_URL);
