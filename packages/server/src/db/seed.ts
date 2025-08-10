import { eq } from 'drizzle-orm';
import { users, notes } from './schema';
import { db } from './index';

async function main() {
  const user: typeof users.$inferInsert = {
    id: 'user-1',
    email: 'user@example.com',
    name: 'Test User',
  };

  await db.insert(users).values(user);
  console.log('User created!');

  const notesData: (typeof notes.$inferInsert)[] = [];
  for (let i = 1; i <= 100; i++) {
    notesData.push({
      id: `note-${i}`,
      userId: 'user-1',
      content: `This is note number ${i}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      isTorn: i % 10 === 0, // Every 10th note is torn
      isTrashed: i % 20 === 0, // Every 20th note is trashed
    });
  }

  await db.insert(notes).values(notesData);
  console.log('100 notes created!');

  const allNotes = await db.select().from(notes).where(eq(notes.userId, 'user-1'));
  console.log(`Total notes for user 1: ${allNotes.length}`);

  const tornNotes = await db.select().from(notes).where(eq(notes.isTorn, true));
  console.log(`Torn notes: ${tornNotes.length}`);

  const trashedNotes = await db.select().from(notes).where(eq(notes.isTrashed, true));
  console.log(`Trashed notes: ${trashedNotes.length}`);
}

main();
