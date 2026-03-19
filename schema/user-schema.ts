import { Schema } from "effect";
import { AsyncResult } from "effect/unstable/reactivity";

import { HttpErrorSchema } from "@/errors";

export const UserSchema = Schema.Struct({
  id: Schema.String,
  firstName: Schema.String,
  lastName: Schema.String,
  email: Schema.String,
  company: Schema.Struct({
    name: Schema.String,
    title: Schema.String,
  }),
  address: Schema.Struct({
    address: Schema.String,
    city: Schema.String,
    state: Schema.String,
  }),
});

export const UserBasicSchema = Schema.Struct({
  id: Schema.String,
  firstName: Schema.String,
  lastName: Schema.String,
  email: Schema.String,
  company: Schema.Struct({
    name: Schema.String,
    title: Schema.String,
  }),
});

export const UserAddressSchema = Schema.Struct({
  address: Schema.String,
  city: Schema.String,
  state: Schema.String,
});

export const UserBasicAsyncResultSchema = AsyncResult.Schema({
  success: UserBasicSchema,
  error: HttpErrorSchema,
});

export const UserAddressAsyncResultSchema = AsyncResult.Schema({
  success: UserAddressSchema,
  error: HttpErrorSchema,
});

function requiredString(message: string) {
  return Schema.String.check(Schema.isNonEmpty({ message }));
}

export const AddUserFormSchema = Schema.Struct({
  firstName: requiredString("First name is required"),
  lastName: requiredString("Last name is required"),

  email: Schema.String.check(
    Schema.isNonEmpty({ message: "Email is required" }),
    Schema.isIncludes("@", { message: "Invalid email address" }),
  ),

  company: Schema.Struct({
    name: requiredString("Company name is required"),
    title: requiredString("Job title is required"),
  }),

  address: Schema.Struct({
    address: requiredString("Street address is required"),
    city: requiredString("City is required"),
    state: requiredString("State is required"),
  }),
});

// Export the Standard Schema version for use with hook form
export const AddUserFormStandardSchema =
  Schema.toStandardSchemaV1(AddUserFormSchema);

export const UsersSchema = Schema.Array(UserSchema);

export const UsersResponseSchema = Schema.Struct({
  users: UsersSchema,
  usersCount: Schema.Number,
});

export const UsersResponseAsyncResultSchema = AsyncResult.Schema({
  success: UsersResponseSchema,
  error: HttpErrorSchema,
});

export const PageChunkSchema = Schema.Struct({
  users: UsersSchema,
  hasMore: Schema.Boolean,
});

// Derive TypeScript types from schemas
export type User = typeof UserSchema.Type;
export type UserBasic = typeof UserBasicSchema.Type;
export type UserAddress = typeof UserAddressSchema.Type;
export type UsersResponse = typeof UsersResponseSchema.Type;
export type AddUserFormValues = typeof AddUserFormSchema.Type;
export type PageChunk = typeof PageChunkSchema.Type;
