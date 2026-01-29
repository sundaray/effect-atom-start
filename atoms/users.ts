import { Atom } from "@effect-atom/atom-react";
import { Reactivity } from "@effect/experimental";
import { Duration, Effect } from "effect";

import { atomRuntime } from "@/atom-runtime";
import { debouncedSearchQueryAtom } from "@/atoms/search";
import type { AddUserFormValues } from "@/schema/user-schema";
import { UsersService } from "@/services/user-service";
import { pageAtom } from "./page";

const usersResponseAtom = atomRuntime
  .atom((get) =>
    Effect.gen(function* () {
      const page = get(pageAtom);
      const query = get(debouncedSearchQueryAtom);
      return yield* UsersService.getUsers(query, page);
    }),
  )
  .pipe(Atom.setIdleTTL(Duration.hours(1)), Atom.withReactivity(["users"]));

// ============ Get Users ============
export const usersAtom = Atom.mapResult(
  usersResponseAtom,
  (result) => result.users,
);
// ============ Get Users Count ============
export const usersCountAtom = Atom.mapResult(
  usersResponseAtom,
  (result) => result.usersCount,
);

// ============ Get User ============
export const userAtom = Atom.family((id: string) =>
  atomRuntime
    .atom(
      Effect.gen(function* () {
        return yield* UsersService.getUser(id);
      }),
    )
    .pipe(Atom.setIdleTTL(Duration.hours(1))),
);

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
