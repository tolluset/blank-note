import { NotesRepository, UpdateNoteInput } from "./repository";

export class NotesService {
  constructor(
    private repository: NotesRepository,
    private userId: string
  ) {}

  async getNotes() {
    return await this.repository.findByUserId(this.userId);
  }

  async getTornNotes() {
    return await this.repository.findTornByUserId(this.userId);
  }

  async getTrashedNotes() {
    return await this.repository.findTrashedByUserId(this.userId);
  }

  async updateNote(id: string, updates: UpdateNoteInput) {
    const existingNote = await this.repository.findById(id);
    if (!existingNote) {
      throw new Error("Note not found");
    }

    return await this.repository.update(id, updates);
  }

  async toggleTorn(id: string) {
    const note = await this.repository.findById(id);
    if (!note) {
      throw new Error("Note not found");
    }

    return await this.updateNote(id, { isTorn: !note.isTorn });
  }

  async deleteNote(id: string) {
    const existingNote = await this.repository.findById(id);
    if (!existingNote) {
      throw new Error("Note not found");
    }

    await this.repository.delete(id);
  }

  async moveToTrash(id: string) {
    return await this.updateNote(id, { isTrashed: true });
  }

  async restoreFromTrash(id: string) {
    return await this.updateNote(id, { isTrashed: false });
  }

  async create100Notes() {
    const currentNotes = await this.getNotes();
    const currentCount = currentNotes.length;
    const needed = Math.max(0, 100 - currentCount);

    if (needed === 0) {
      return { message: "이미 100개의 노트가 있습니다.", created: 0 };
    }

    const { ulid } = await import('ulid');
    const newNotes = Array.from({ length: needed }, () => ({
      id: ulid(),
      userId: this.userId,
      content: '',
    }));

    const createdNotes = await this.repository.createBatch(newNotes);
    return { 
      message: `${needed}개의 새 노트가 생성되었습니다.`,
      created: needed,
      notes: createdNotes
    };
  }
}
