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

notes.post('/:pageId/tear', async (c) => {
  const pageId = c.req.param('pageId')
  const userId = getUserId(c)
  const service = new NotesService(new NotesRepository(), userId)
  
  try {
    const result = await service.toggleTorn(pageId)
    return c.json(result)
  } catch (error) {
    return c.json({ error: 'Note not found' }, 404)
  }
})

notes.post('/:pageId/trash', async (c) => {
  const pageId = c.req.param('pageId')
  const userId = getUserId(c)
  const service = new NotesService(new NotesRepository(), userId)
  
  try {
    const result = await service.moveToTrash(pageId)
    return c.json(result)
  } catch (error) {
    return c.json({ error: 'Note not found' }, 404)
  }
})

notes.post('/:pageId/restore', async (c) => {
  const pageId = c.req.param('pageId')
  const userId = getUserId(c)
  const service = new NotesService(new NotesRepository(), userId)
  
  try {
    const result = await service.restoreFromTrash(pageId)
    return c.json(result)
  } catch (error) {
    return c.json({ error: 'Note not found' }, 404)
  }
})

notes.delete('/:pageId', async (c) => {
  const pageId = c.req.param('pageId')
  const userId = getUserId(c)
  const service = new NotesService(new NotesRepository(), userId)
  
  try {
    await service.deleteNote(pageId)
    return c.json({ message: 'Note deleted successfully' })
  } catch (error) {
    return c.json({ error: 'Note not found' }, 404)
  }
})

notes.patch('/:pageId/position', async (c) => {
  const pageId = c.req.param('pageId')
  const userId = getUserId(c)
  const service = new NotesService(new NotesRepository(), userId)
  
  try {
    const body = await c.req.json()
    const { x, y } = body
    
    if (typeof x !== 'number' || typeof y !== 'number') {
      return c.json({ error: 'x and y must be numbers' }, 400)
    }
    
    const result = await service.updateNotePosition(pageId, x, y)
    return c.json(result)
  } catch (error) {
    if (error instanceof Error && error.message === 'Note not found') {
      return c.json({ error: 'Note not found' }, 404)
    }
    return c.json({ error: 'Invalid request' }, 400)
  }
})

export default notes
