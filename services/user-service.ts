import { Effect, Layer, Option, ServiceMap, Stream } from "effect";
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
import {
  UserSchema,
  UsersSchema,
  type AddUserFormValues,
  type PageChunk,
  type User,
  type UsersResponse,
} from "@/schema/user-schema";

export class UserService extends ServiceMap.Service<UserService>()(
  "app/UserService",
  {
    make: Effect.gen(function* () {
      const client = (yield* HttpClient.HttpClient).pipe(
        HttpClient.filterStatusOk,
      );

      const apiBaseUrl = yield* apiBaseUrlConfig;

      // ============ Get Users ============
      function getUsers(
        query: string,
        page: number,
      ): Effect.Effect<UsersResponse, HttpError> {
        const request = HttpClientRequest.get(`${apiBaseUrl}/users`).pipe(
          HttpClientRequest.setUrlParams({
            q: query,
            _page: page.toString(),
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

      // ============ Get Users Stream ============
      function getUsersStream(
        query: string,
      ): Stream.Stream<PageChunk, HttpError> {
        return Stream.paginate(1, (page) =>
          getUsers(query, page).pipe(
            Effect.map(({ users, usersCount }) => {
              const totalPages = Math.ceil(usersCount / USERS_PER_PAGE);
              const hasMore = page < totalPages;
              return [
                [{ users, hasMore }],
                hasMore ? Option.some(page + 1) : Option.none(),
              ];
            }),
          ),
        );
      }

      // ============ Get User ============
      function getUser(id: string): Effect.Effect<User, HttpError> {
        return client.get(`${apiBaseUrl}/users/${id}`).pipe(
          Effect.delay("1 second"),
          Effect.flatMap(HttpClientResponse.schemaBodyJson(UserSchema)),
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

      // ============ Delete User ============
      function deleteUser(userId: string): Effect.Effect<void, HttpError> {
        return client.del(`${apiBaseUrl}/usersx/${userId}`).pipe(
          Effect.delay("1 second"),
          Effect.asVoid,
          Effect.catchTag("HttpClientError", (error) =>
            Effect.fail(mapHttpError(error)),
          ),
        );
      }

      // ============ Add User ============
      function addUser(
        user: AddUserFormValues,
      ): Effect.Effect<User, HttpError> {
        return HttpClientRequest.post(`${apiBaseUrl}/users`).pipe(
          HttpClientRequest.bodyJson(user),
          Effect.delay("1 second"),
          Effect.flatMap(client.execute),
          Effect.flatMap(HttpClientResponse.schemaBodyJson(UserSchema)),
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

      return { getUsers, getUsersStream, getUser, deleteUser, addUser };
    }),
  },
) {
  static layer = Layer.effect(this, this.make).pipe(
    Layer.provide(FetchHttpClient.layer),
  );
}
