import { Atom } from "@effect-atom/atom-react";
import { Reactivity } from "@effect/experimental";
import { Duration, Effect } from "effect";

import { atomRuntime } from "@/atom-runtime";
import { debouncedSearchQueryAtom } from "@/atoms/search";
import type { AddUserFormValues } from "@/schema/user-schema";
import { UsersService } from "@/services/user-service";
import { pageAtom } from "./page";

const baseUsersResponseAtom = atomRuntime
  .atom((get) =>
    Effect.gen(function* () {
      const page = get(pageAtom);
      const query = get(debouncedSearchQueryAtom);
      return yield* UsersService.getUsers(query, page);
    }),
  )
  .pipe(Atom.setIdleTTL(Duration.hours(1)), Atom.withReactivity(["users"]));

// Only apply refreshOnWindowFocus on the client
export const usersResponseAtom =
  typeof window !== "undefined"
    ? Atom.refreshOnWindowFocus(baseUsersResponseAtom)
    : baseUsersResponseAtom;

// ============ Get Users ============
export const usersAtom = Atom.mapResult(
  usersResponseAtom,
  (result) => result.users,
).pipe(Atom.setIdleTTL(Duration.hours(1)), Atom.withReactivity(["users"]));

// ============ Get Users Count ============
export const usersCountAtom = Atom.mapResult(
  usersResponseAtom,
  (result) => result.usersCount,
).pipe(Atom.setIdleTTL(Duration.hours(1)), Atom.withReactivity(["users"]));

// ============ Get User ============
export const userAtom = Atom.family((id: string) => {
  const base = atomRuntime
    .atom(
      Effect.gen(function* () {
        return yield* UsersService.getUser(id);
      }),
    )
    .pipe(Atom.setIdleTTL(Duration.hours(1)));

  return typeof window !== "undefined" ? Atom.refreshOnWindowFocus(base) : base;
});

// ============ Delete User ============
export const deleteUserAtom = atomRuntime.fn<string>()(
  Effect.fnUntraced(function* (userId) {
    yield* UsersService.deleteUser(userId);
  }),
  { reactivityKeys: ["users"] },
);

// ============ Add User ============
export const addUserAtom = atomRuntime.fn<AddUserFormValues>()(
  Effect.fnUntraced(function* (user) {
    return yield* UsersService.addUser(user);
  }),
  { reactivityKeys: ["users"] },
);

// ============ Invalidate Users ============
export const invalidateUsersAtom = atomRuntime.fn()(
  Effect.fnUntraced(function* () {
    yield* Reactivity.invalidate(["users"]);
  }),
);
