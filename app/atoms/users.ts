import { Atom } from "@effect-atom/atom-react";
import { Effect } from "effect";

import { atomRuntime } from "@/runtime";
import { pageAtom } from "@/app/atoms/page";
import { debouncedSearchQueryAtom } from "@/app/atoms/search";
import { UsersService } from "@/app/services/users-service";

import { AddUserFormValues } from "../schema/user-schema";

const usersResponseAtom = atomRuntime
  .atom((get) =>
    Effect.gen(function* () {
      const query = get(debouncedSearchQueryAtom);
      const page = get(pageAtom);

      return yield* UsersService.getUsers(query, page);
    }),
  )
  .pipe(Atom.keepAlive, Atom.withReactivity(["users"]));

// ============ Get Users ============
export const usersAtom = Atom.mapResult(
  usersResponseAtom,
  (result) => result.users,
).pipe(Atom.keepAlive, Atom.withReactivity(["users"]));

// ============ Get Users Count ============
export const usersCountAtom = Atom.mapResult(
  usersResponseAtom,
  (result) => result.usersCount,
).pipe(Atom.keepAlive, Atom.withReactivity(["users"]));

// ============ Delete User ============
export const deleteUserAtom = atomRuntime.fn(
  Effect.fnUntraced(function* (userId: string) {
    yield* UsersService.deleteUser(userId);
  }),
  { reactivityKeys: ["users"] },
);

// ============ Add User ============
export const addUserAtom = atomRuntime.fn(
  Effect.fnUntraced(function* (user: AddUserFormValues) {
    return yield* UsersService.addUser(user);
  }),
  { reactivityKeys: ["users"] },
);
