import { Data } from "effect";

export class ClientError extends Data.TaggedError("ClientError")<{
  message: string;
  cause: unknown;
}> {}

export class ServerError extends Data.TaggedError("ServerError")<{
  message: string;
  cause: unknown;
}> {}

export class ParseError extends Data.TaggedError("ParseError")<{
  message: string;
  cause: unknown;
}> {}

export type HttpError = ClientError | ServerError | ParseError;

export type UserServiceError = HttpError;
