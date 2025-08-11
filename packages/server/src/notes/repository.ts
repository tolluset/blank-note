import { eq, and, asc } from "drizzle-orm";
import { db } from "../db";
import { notes } from "../db/schema";

export interface CreateNoteInput {
  id: string;
  userId: string;
  content?: string;
}

export interface UpdateNoteInput {
  content?: string;
  isTorn?: boolean;
  isTrashed?: boolean;
}

export class NotesRepository {
  async findByUserId(userId: string) {
    return await db
      .select()
      .from(notes)
      .where(and(
        eq(notes.userId, userId),
        eq(notes.isTrashed, false)
      ))
      .orderBy(asc(notes.id));
  }

  async findTornByUserId(userId: string) {
    return await db
      .select()
      .from(notes)
      .where(and(
        eq(notes.userId, userId),
        eq(notes.isTorn, true),
        eq(notes.isTrashed, false)
      ))
      .orderBy(asc(notes.id));
  }

  async findTrashedByUserId(userId: string) {
    return await db
      .select()
      .from(notes)
      .where(and(
        eq(notes.userId, userId),
        eq(notes.isTrashed, true)
      ))
      .orderBy(asc(notes.id));
  }

  async findById(id: string) {
    const [note] = await db
      .select()
      .from(notes)
      .where(eq(notes.id, id));
    return note;
  }

  async update(id: string, input: UpdateNoteInput) {
    const [note] = await db
      .update(notes)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(notes.id, id))
      .returning();
    return note;
  }

  async delete(id: string) {
    await db
      .delete(notes)
      .where(eq(notes.id, id));
  }

  async create(input: CreateNoteInput) {
    const [note] = await db
      .insert(notes)
      .values({
        id: input.id,
        userId: input.userId,
        content: input.content || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return note;
  }

  async createBatch(inputs: CreateNoteInput[]) {
    return await db
      .insert(notes)
      .values(
        inputs.map(input => ({
          id: input.id,
          userId: input.userId,
          content: input.content || '',
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      )
      .returning();
  }
}
