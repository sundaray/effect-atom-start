import { Match } from "effect";
import { HttpClientError } from "effect/unstable/http";

import { ClientError, ParseError, ServerError } from "@/errors";

export function mapHttpError(
  error: HttpClientError.HttpClientError,
): ClientError | ServerError | ParseError {
  return Match.value(error.reason).pipe(
    Match.tags({
      TransportError: () =>
        new ClientError({
          message: "Unable to reach the server. Please check your connection.",
          cause: error,
        }),
      EncodeError: () =>
        new ClientError({
          message: "Unable to reach the server. Please check your connection.",
          cause: error,
        }),
      InvalidUrlError: () =>
        new ClientError({
          message: "Unable to reach the server. Please check your connection.",
          cause: error,
        }),
      StatusCodeError: () =>
        new ServerError({
          message: `Server returned status ${error.response?.status}`,
          cause: error,
        }),
      DecodeError: () =>
        new ParseError({
          message: "Received an unexpected response from the server.",
          cause: error,
        }),
      EmptyBodyError: () =>
        new ParseError({
          message: "Received an unexpected response from the server.",
          cause: error,
        }),
    }),
    Match.exhaustive,
  );
}
