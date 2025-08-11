import { Hono } from 'hono'
import { NotesService } from './service'
import { NotesRepository } from './repository'
import { authMiddleware, getUserId } from '../middleware/auth'

const notes = new Hono()

notes.use('*', authMiddleware)

notes.get('/', async (c) => {
  const userId = getUserId(c)
  const service = new NotesService(new NotesRepository(), userId)
  const result = await service.getNotes()
  return c.json(result)
})

notes.get('/torn', async (c) => {
  const userId = getUserId(c)
  const service = new NotesService(new NotesRepository(), userId)
  const result = await service.getTornNotes()
  return c.json(result)
})

notes.get('/trashed', async (c) => {
  const userId = getUserId(c)
  const service = new NotesService(new NotesRepository(), userId)
  const result = await service.getTrashedNotes()
  return c.json(result)
})

notes.patch('/:pageId', async (c) => {
  const pageId = c.req.param('pageId')
  if (!pageId) {
    return c.json({ error: 'Page ID is required' }, 400)
  }
  
  const userId = getUserId(c)
  const service = new NotesService(new NotesRepository(), userId)
  
  try {
    const body = await c.req.json()
    const result = await service.updateNote(pageId, body)
    return c.json(result)
  } catch (error) {
    return c.json({ error: 'Invalid JSON body' }, 400)
  }
})

notes.post('/create-100', async (c) => {
  const userId = getUserId(c)
  const service = new NotesService(new NotesRepository(), userId)
  
  try {
    const result = await service.create100Notes()
    return c.json(result)
  } catch (error) {
    console.error('Error creating 100 notes:', error)
    return c.json({ error: 'Failed to create notes' }, 500)
  }
})

export default notes
