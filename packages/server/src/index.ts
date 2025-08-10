import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import notes from './notes'

const app = new Hono()

app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}))

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/notes', notes)

serve({
  fetch: app.fetch,
  port: 8787
})
