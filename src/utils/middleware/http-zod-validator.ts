import middy from "@middy/core";
import { APIGatewayProxyEvent } from "aws-lambda";
import { createError } from "@middy/util";
import { ZodSchema } from "zod";

const defaults: {
  eventSchema?: ZodSchema;
  contextSchema?: ZodSchema;
  responseSchema?: ZodSchema;
} = {
  eventSchema: undefined,
  contextSchema: undefined,
  responseSchema: undefined,
};

const zodValidatorMiddleware = (
  opts: {
    eventSchema?: ZodSchema;
    contextSchema?: ZodSchema;
    responseSchema?: ZodSchema;
  } = {},
): middy.MiddlewareObj<APIGatewayProxyEvent> => {
  const { eventSchema, contextSchema, responseSchema } = {
    ...defaults,
    ...opts,
  };

  const validatorMiddlewareBefore: middy.MiddlewareFn<
    APIGatewayProxyEvent,
    void
  > = async (request): Promise<void> => {
    if (eventSchema) {
      const { success, error, data } = await eventSchema.safeParseAsync(
        request.event,
      );
      request.event = { ...request.event, ...data };
      if (!success) {
        throw createError(400, "Event object failed validation", {
          cause: {
            package: "request-validator",
            data: error,
          },
        });
      }
    }
    if (contextSchema) {
      const { success, error } = await contextSchema.safeParseAsync(
        request.context,
      );
      if (!success) {
        throw createError(500, "Context object failed validation", {
          cause: {
            package: "request-validator",
            data: error,
          },
        });
      }
    }
  };

  const validatorMiddlewareAfter: middy.MiddlewareFn<
    APIGatewayProxyEvent,
    void
  > = async (request): Promise<void> => {
    if (responseSchema) {
      const { success, error } = await responseSchema.safeParseAsync(
        request.response,
      );
      if (!success) {
        throw createError(500, "Response object failed validation", {
          cause: {
            package: "request-validator",
            data: error,
          },
        });
      }
    }
  };

  return {
    before:
      eventSchema ?? contextSchema ? validatorMiddlewareBefore : undefined,
    after: responseSchema ? validatorMiddlewareAfter : undefined,
  };
};

export default zodValidatorMiddleware;
