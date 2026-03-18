import { Schema } from "effect";

export class ClientError extends Schema.TaggedErrorClass<ClientError>()(
  "ClientError",
  {
    message: Schema.String,
    cause: Schema.Defect,
  },
) {}

export class ServerError extends Schema.TaggedErrorClass<ServerError>()(
  "ServerError",
  {
    message: Schema.String,
    cause: Schema.Defect,
  },
) {}

export class ParseError extends Schema.TaggedErrorClass<ParseError>()(
  "ParseError",
  {
    message: Schema.String,
    cause: Schema.Defect,
  },
) {}

export const HttpErrorSchema = Schema.Union([
  ClientError,
  ServerError,
  ParseError,
]);

export type HttpError = ClientError | ServerError | ParseError;
