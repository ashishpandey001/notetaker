import { ulid } from 'ulid';
import { noteTakerService } from '../db';
import createError from 'http-errors';

export async function listNotes({ limit, cursor: existingCursor }: { limit?: number; cursor?: string }) {
  const { cursor, data } = await noteTakerService.entities.note.query.byEntity({}).go({
    ...(limit && { limit }),
    ...(existingCursor && { cursor: existingCursor }),
  });
  console.log({ cursor });
  return { data, ...(cursor && { cursor }) };
}

export async function createNote({ title, description }: { title: string; description: string }) {
  const newNoteId = ulid();
  const { data: newNote } = await noteTakerService.entities.note.create({ noteId: newNoteId, title, description }).go();
  return { data: newNote };
}

export async function getNote({ noteId }: { noteId: string }) {
  const {
    data: [note],
  } = await noteTakerService.entities.note.query.byNoteId({ noteId }).go();
  if (!note) {
    throw new createError.NotFound(JSON.stringify({ message: 'Note not found' }));
  }
  return { data: note };
}

export async function updateNote({ noteId, title, description }: { noteId: string; title?: string; description?: string }) {
  const {
    data: [existingNote],
  } = await noteTakerService.entities.note.query.byNoteId({ noteId }).go();
  if (!existingNote) {
    throw new createError.NotFound(JSON.stringify({ message: 'Note not found' }));
  }
  const { data: updatedNote } = await noteTakerService.entities.note
    .update({ noteId: existingNote.noteId })
    .set({ ...(title && { title }), ...(description && { description }) })
    .go({ response: 'all_new' });
  return { data: updatedNote };
}

export async function deleteNote({ noteId }: { noteId: string }) {
  const {
    data: [existingNote],
  } = await noteTakerService.entities.note.query.byNoteId({ noteId }).go();
  if (!existingNote) {
    throw new createError.NotFound(JSON.stringify({ message: 'Note not found' }));
  }
  const { data: deletedNote } = await noteTakerService.entities.note.delete({ noteId: existingNote.noteId }).go({ response: 'all_old' });
  return { data: deletedNote };
}
