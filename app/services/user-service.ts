import {
  FetchHttpClient,
  HttpClient,
  HttpClientRequest,
  HttpClientResponse,
} from "@effect/platform";
import { Effect } from "effect";

import {
  ConfigError,
  GetUsersError,
  GetUsersParseError,
  GetUsersRequestError,
  GetUsersResponseError,
} from "@/app/errors";
import { UsersSchema, type UsersResponse } from "@/app/schema/user-schema";

import { apiBaseUrlConfig } from "@/lib/config";
import { USERS_PER_PAGE } from "@/lib/constants";

export class UsersService extends Effect.Service<UsersService>()(
  "app/UsersService",
  {
    effect: Effect.gen(function* () {
      const client = (yield* HttpClient.HttpClient).pipe(
        HttpClient.filterStatusOk,
      );

      const apiBaseUrl = yield* apiBaseUrlConfig.pipe(
        Effect.catchTag("ConfigError", (error) =>
          Effect.fail(
            new ConfigError({
              message: "API base URL is not configured.",
              cause: error,
            }),
          ),
        ),
      );

      // ============ Get Users ============

      function getUsers(): Effect.Effect<UsersResponse, GetUsersError> {
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
          Effect.catchTags({
            RequestError: (requestError) =>
              Effect.fail(
                new GetUsersRequestError({
                  message: "Failed to get users",
                  cause: requestError,
                }),
              ),
            ResponseError: (responseError) =>
              Effect.fail(
                new GetUsersResponseError({
                  message: `Failed to get users: status ${responseError.response.status}`,
                  cause: responseError,
                }),
              ),
            ParseError: (parseError) => {
              return Effect.fail(
                new GetUsersParseError({
                  message: "Failed to parse getUsers response",
                  cause: parseError,
                }),
              );
            },
          }),
        );
      }

      return { getUsers };
    }),
    dependencies: [FetchHttpClient.layer],
    accessors: true,
  },
) {}
