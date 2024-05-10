import { expect, test, describe, expectTypeOf } from 'vitest';

type Note = { noteId: string; title: string; description: string; createdAt: number; updatedAt: number };

describe('test notes api routes', async () => {
  const notes: Note[] = [];
  const apiEndpoint = process.env.TEST_API_ENDPOINT;
  const apiKey = process.env.TEST_API_KEY;

  if (!apiEndpoint || !apiKey) throw new Error('missing required environment variables');

  test('create a note', async () => {
    const createNotePayload = {
      title: 'test note',
      description: 'test note description',
    };
    const response = await fetch(`${apiEndpoint}/notes`, {
      method: 'POST',
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json',
        'User-Agent': 'vitest',
      },
      body: JSON.stringify(createNotePayload),
    });
    const { data: body } = await response.json();
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json');
    expect(body.noteId).toBeDefined();
    expect(body).toMatchObject(createNotePayload);
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
    notes.push(body);
  });

  test('get a note', async () => {
    const note = notes[0];
    if (!note) throw new Error('note not found');
    const response = await fetch(`${apiEndpoint}/notes/${note.noteId}`, {
      method: 'GET',
      headers: {
        Authorization: apiKey,
        'User-Agent': 'vitest',
      },
    });
    const { data: body } = await response.json();
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json');
    expect(body).toEqual(note);
  });

  test('list notes', async () => {
    const response = await fetch(`${apiEndpoint}/notes`, {
      method: 'GET',
      headers: {
        Authorization: apiKey,
        'User-Agent': 'vitest',
      },
    });
    const { data: body }: { data: Note[]; cursor?: string } = await response.json();
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json');
    expectTypeOf(body).toBeArray();
    expect(body).toEqual(notes);
  });

  test('update a note', async () => {
    const note = notes[0];
    if (!note) throw new Error('note not found');
    const updateNotePayload = {
      title: 'updated test note',
      description: 'updated test note description',
    };
    const response = await fetch(`${apiEndpoint}/notes/${note.noteId}`, {
      method: 'PUT',
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json',
        'User-Agent': 'vitest',
      },
      body: JSON.stringify(updateNotePayload),
    });
    const { data: body }: { data: Note } = await response.json();
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json');
    expect(body).toMatchObject(updateNotePayload);
    expect(body.noteId).toBe(note.noteId);
    expect(body.updatedAt).toBeGreaterThan(note.updatedAt);
    expect(body.createdAt).toBe(note.createdAt);
    notes[0].title = body.title;
    notes[0].description = body.description;
    notes[0].updatedAt = body.updatedAt;
  });

  test('delete a note', async () => {
    const note = notes[0];
    if (!note) throw new Error('note not found');
    const response = await fetch(`${apiEndpoint}/notes/${note.noteId}`, {
      method: 'DELETE',
      headers: {
        Authorization: apiKey,
        'User-Agent': 'vitest',
      },
    });
    const { data: body }: { data: Note } = await response.json();
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json');
    expect(body).toEqual(note);
    notes.shift();
  });
});
