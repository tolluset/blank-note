import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import notes from './notes'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/notes', notes)

serve({
  fetch: app.fetch,
  port: 8787
})
