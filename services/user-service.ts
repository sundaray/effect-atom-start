import { Effect, Layer, ServiceMap } from "effect";
import {
  FetchHttpClient,
  HttpClient,
  HttpClientRequest,
  HttpClientResponse,
} from "effect/unstable/http";

import { apiBaseUrlConfig } from "@/lib/config";
import { USERS_PER_PAGE } from "@/lib/constants";
import { mapHttpError } from "@/lib/http-error";
import { ParseError, type HttpError } from "@/errors";
import { UsersSchema, type UsersResponse } from "@/schema/user-schema";

export class UserService extends ServiceMap.Service<UserService>()(
  "app/UserService",
  {
    make: Effect.gen(function* () {
      const client = (yield* HttpClient.HttpClient).pipe(
        HttpClient.filterStatusOk,
      );

      const apiBaseUrl = yield* apiBaseUrlConfig;

      // ============ Get Users ============
      function getUsers(): Effect.Effect<UsersResponse, HttpError> {
        const request = HttpClientRequest.get(`${apiBaseUrl}/users`).pipe(
          HttpClientRequest.setUrlParams({
            _limit: USERS_PER_PAGE.toString(),
          }),
        );

        return client.execute(request).pipe(
          Effect.delay("1 second"),
          Effect.flatMap((response) =>
            Effect.all({
              users: HttpClientResponse.schemaBodyJson(UsersSchema)(response),
              usersCount: Effect.succeed(
                Number(response.headers["x-total-count"]),
              ),
            }),
          ),
          Effect.catchTag("HttpClientError", (error) =>
            Effect.fail(mapHttpError(error)),
          ),
          Effect.catchTag("SchemaError", (error) =>
            Effect.fail(
              new ParseError({
                message: "Received an unexpected response from the server.",
                cause: error,
              }),
            ),
          ),
        );
      }

      return { getUsers };
    }),
  },
) {
  static layer = Layer.effect(this, this.make).pipe(
    Layer.provide(FetchHttpClient.layer),
  );
}
