import { Entity } from 'electrodb';

export const NoteEntity = new Entity({
  model: {
    entity: 'note',
    version: '1',
    service: 'notetaker',
  },
  attributes: {
    noteId: {
      type: 'string',
    },
    title: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      required: true,
    },
    createdAt: {
      type: 'number',
      readOnly: true,
      required: true,
      default: () => Date.now(),
      set: () => Date.now(),
    },
    updatedAt: {
      type: 'number',
      watch: '*',
      required: true,
      default: () => Date.now(),
      set: () => Date.now(),
    },
  },
  indexes: {
    byNoteId: {
      pk: {
        field: 'pk',
        composite: ['noteId'],
      },
      sk: {
        field: 'sk',
        composite: [],
      },
    },
    byEntity: {
      index: 'gsi1',
      pk: {
        field: 'gsi1pk',
        composite: [],
      },
      sk: {
        field: 'gsi1sk',
        composite: ['noteId'],
      },
    },
  },
});
