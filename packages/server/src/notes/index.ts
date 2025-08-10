import { Hono } from 'hono'

const notes = new Hono()

notes.get('/', (c) => {
  return c.json([])
})

notes.get('/torn', (c) => {
  return c.json([])
})

notes.get('/trashed', (c) => {
  return c.json([])
})

notes.patch('/:pageId', (c) => {
  const pageId = c.req.param('pageId')
  return c.json({ id: pageId, updated: true })
})

export default notes