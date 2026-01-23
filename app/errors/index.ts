import { Data } from "effect";

// ============ Config Error ============

export class ConfigError extends Data.TaggedError("ConfigError")<{
  message: string;
  cause: unknown;
}> {}

// ============ GetUser Errors ============

export class GetUserRequestError extends Data.TaggedError(
  "GetUserRequestError",
)<{
  message: string;
  cause: unknown;
}> {}

export class GetUserResponseError extends Data.TaggedError(
  "GetUserResponseError",
)<{
  message: string;
  cause: unknown;
}> {}

export class GetUserParseError extends Data.TaggedError("GetUserParseError")<{
  message: string;
  cause: unknown;
}> {}

export type GetUserError =
  | GetUserRequestError
  | GetUserResponseError
  | GetUserParseError;
// ============ GetUsers Errors ============

export class GetUsersRequestError extends Data.TaggedError(
  "GetUsersRequestError",
)<{
  message: string;
  cause: unknown;
}> {}

export class GetUsersResponseError extends Data.TaggedError(
  "GetUsersResponseError",
)<{
  message: string;
  cause: unknown;
}> {}

export class GetUsersParseError extends Data.TaggedError("GetUsersParseError")<{
  message: string;
  cause: unknown;
}> {}

export type GetUsersError =
  | GetUsersRequestError
  | GetUsersResponseError
  | GetUsersParseError;
// ============ DeleteUser Errors ============

export class DeleteUserRequestError extends Data.TaggedError(
  "DeleteUserRequestError",
)<{
  message: string;
  cause: unknown;
}> {}

export class DeleteUserResponseError extends Data.TaggedError(
  "DeleteUserResponseError",
)<{
  message: string;
  cause: unknown;
}> {}

export type DeleteUserError = DeleteUserRequestError | DeleteUserResponseError;

// ============ AddUser Errors ============

export class AddUserBodySerializationError extends Data.TaggedError(
  "AddUserBodySerializationError",
)<{
  message: string;
  cause: unknown;
}> {}

export class AddUserRequestError extends Data.TaggedError(
  "AddUserRequestError",
)<{
  message: string;
  cause: unknown;
}> {}

export class AddUserResponseError extends Data.TaggedError(
  "AddUserResponseError",
)<{
  message: string;
  cause: unknown;
}> {}

export class AddUserParseError extends Data.TaggedError("AddUserParseError")<{
  message: string;
  cause: unknown;
}> {}

export type AddUserError =
  | AddUserBodySerializationError
  | AddUserRequestError
  | AddUserResponseError
  | AddUserParseError;

// ============ Combined Users Service Error ============

export type UserServiceError =
  | ConfigError
  | GetUserError
  | GetUsersError
  | DeleteUserError
  | AddUserError;
