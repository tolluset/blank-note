import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import notes from './notes'
import dotenv from 'dotenv';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

dotenv.config({ path: '../.env' });

const db = drizzle(process.env.DATABASE_URL!);

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/notes', notes)

serve({
  fetch: app.fetch,
  port: 8787
})
