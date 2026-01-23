import {
  FetchHttpClient,
  HttpClient,
  HttpClientRequest,
  HttpClientResponse,
} from "@effect/platform";
import { Effect } from "effect";

import {
  AddUserBodySerializationError,
  AddUserError,
  AddUserParseError,
  AddUserRequestError,
  AddUserResponseError,
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
} from "@/app/errors";
import {
  AddUserFormValues,
  UserSchema,
  UsersSchema,
  type User,
  type UsersResponse,
} from "@/app/schema/user-schema";

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
              message: "Failed to load API configuration",
              cause: error,
            }),
          ),
        ),
      );

      // ============ Get Users ============

      function getUsers(
        query: string,
        page: number,
      ): Effect.Effect<UsersResponse, GetUsersError> {
        const request = HttpClientRequest.get(`${apiBaseUrl}/users`).pipe(
          HttpClientRequest.setUrlParams({
            q: query,
            _page: page.toString(),
            _limit: USERS_PER_PAGE.toString(),
          }),
        );

        return client.execute(request).pipe(
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

      // ============ Add User ============

      function addUser(
        user: AddUserFormValues,
      ): Effect.Effect<User, AddUserError> {
        return HttpClientRequest.post(`${apiBaseUrl}/users`).pipe(
          HttpClientRequest.bodyJson(user),
          Effect.flatMap(client.execute),
          Effect.flatMap(HttpClientResponse.schemaBodyJson(UserSchema)),
          Effect.catchTags({
            HttpBodyError: (err) =>
              Effect.fail(
                new AddUserBodySerializationError({
                  message: "Failed to serialize addUser request body",
                  cause: err,
                }),
              ),
            RequestError: (err) =>
              Effect.fail(
                new AddUserRequestError({
                  message: "Failed to create user request",
                  cause: err,
                }),
              ),
            ResponseError: (err) =>
              Effect.fail(
                new AddUserResponseError({
                  message: `Failed to create user: status ${err.response.status}`,
                  cause: err,
                }),
              ),
            ParseError: (err) =>
              Effect.fail(
                new AddUserParseError({
                  message: "Failed to parse created user response",
                  cause: err,
                }),
              ),
          }),
        );
      }

      return { getUser, getUsers, deleteUser, addUser };
    }),
    dependencies: [FetchHttpClient.layer],
    accessors: true,
  },
) {}
