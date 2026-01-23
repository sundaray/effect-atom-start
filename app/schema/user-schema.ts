import { Schema } from "effect";

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

const requiredString = (message: string) =>
  Schema.NonEmptyString.annotations({ message: () => message });

export const AddUserFormSchema = Schema.Struct({
  firstName: requiredString("First name is required"),
  lastName: requiredString("Last name is required"),

  email: Schema.String.pipe(
    Schema.nonEmptyString({ message: () => "Email is required" }),
    Schema.includes("@", { message: () => "Invalid email address" }),
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

export const UsersSchema = Schema.Array(UserSchema);

export const UsersResponseSchema = Schema.Struct({
  users: UsersSchema,
  usersCount: Schema.Number,
});

// Derive TypeScript types from schemas
export type User = typeof UserSchema.Type;
export type UsersResponse = typeof UsersResponseSchema.Type;
export type AddUserFormValues = typeof AddUserFormSchema.Type;
