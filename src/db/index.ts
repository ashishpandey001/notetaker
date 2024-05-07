import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { NoteEntity } from './entities/notes';
import { Service } from 'electrodb';

const client = new DynamoDBClient({});

const tableName = process.env.TABLE_NAME;
if (!tableName) {
  throw new Error('Table name not found in environment variables');
}

export const noteTakerService = new Service(
  { note: NoteEntity },
  {
    client,
    table: tableName,
  },
);
