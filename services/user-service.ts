import {
  FetchHttpClient,
  HttpClient,
  HttpClientRequest,
  HttpClientResponse,
} from "@effect/platform";
import { Effect } from "effect";

import { apiBaseUrlConfig } from "@/lib/config";
import { USERS_PER_PAGE } from "@/lib/constants";
import {
  ConfigError,
  DeleteUserError,
  DeleteUserRequestError,
  DeleteUserResponseError,
  GetUserError,
  GetUserParseError,
  GetUserRequestError,
  GetUserResponseError,
  GetUsersError,
  GetUsersParseError,
  GetUsersRequestError,
  GetUsersResponseError,
} from "@/errors";
import {
  UserSchema,
  UsersSchema,
  type User,
  type UsersResponse,
} from "@/schema/user-schema";

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

      // ============ Get User ============

      function getUser(id: string): Effect.Effect<User, GetUserError> {
        return client.get(`${apiBaseUrl}/users/${id}`).pipe(
          Effect.delay("1 second"),
          Effect.flatMap(HttpClientResponse.schemaBodyJson(UserSchema)),
          Effect.catchTags({
            RequestError: (err) =>
              Effect.fail(
                new GetUserRequestError({
                  message: `Failed to get user ${id}`,
                  cause: err,
                }),
              ),
            ResponseError: (err) =>
              Effect.fail(
                new GetUserResponseError({
                  message: `Failed to get user ${id}: status ${err.response.status}`,
                  cause: err,
                }),
              ),
            ParseError: (err) =>
              Effect.fail(
                new GetUserParseError({
                  message: "Failed to parse getUser response",
                  cause: err,
                }),
              ),
          }),
        );
      }

      // ============ Delete User ============

      function deleteUser(
        userId: string,
      ): Effect.Effect<void, DeleteUserError> {
        return client.del(`${apiBaseUrl}/users/${userId}`).pipe(
          Effect.asVoid,
          Effect.catchTags({
            RequestError: (requestError) =>
              Effect.fail(
                new DeleteUserRequestError({
                  message: `Failed to delete user ${userId}`,
                  cause: requestError,
                }),
              ),
            ResponseError: (responseError) =>
              Effect.fail(
                new DeleteUserResponseError({
                  message: `Failed to delete user ${userId}: status ${responseError.response.status}`,
                  cause: responseError,
                }),
              ),
          }),
        );
      }

      return { getUsers, getUser, deleteUser };
    }),
    dependencies: [FetchHttpClient.layer],
    accessors: true,
  },
) {}
