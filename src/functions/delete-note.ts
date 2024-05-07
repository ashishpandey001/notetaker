import middy from '@middy/core';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { z } from 'zod';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpResponseSerializer from '@middy/http-response-serializer';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpSecurityHeaders from '@middy/http-security-headers';
import httpCors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';

import zodValidatorMiddleware from '../utils/middleware/http-zod-validator';
import { deleteNote } from '../core/notes';

export const handler = middy<APIGatewayProxyEventV2, Omit<APIGatewayProxyResultV2, 'body'> & { body: Record<string, unknown> }>()
  .use(httpHeaderNormalizer())
  .use(httpEventNormalizer())
  .use(
    zodValidatorMiddleware({
      eventSchema: z.object({
        pathParameters: z.object({
          noteId: z.string(),
        }),
      }),
    }),
  )
  .use(
    httpResponseSerializer({
      serializers: [
        {
          regex: /^application\/json/,
          serializer: ({ body }) => JSON.stringify(body),
        },
      ],
      defaultContentType: 'application/json',
    }),
  )
  .use(httpSecurityHeaders())
  .use(httpCors())
  .use(httpErrorHandler({ fallbackMessage: JSON.stringify({ message: 'An error occurred, please contact support.' }) }))
  .handler(async (event) => {
    const { noteId } = event.pathParameters as unknown as Record<string, string>;
    const { data: deletedNote } = await deleteNote({
      noteId,
    });
    return {
      statusCode: 200,
      body: {
        data: deletedNote,
      },
    };
  });
