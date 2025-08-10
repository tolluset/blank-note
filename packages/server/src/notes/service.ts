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
}
