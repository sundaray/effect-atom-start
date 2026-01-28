import { Atom } from "@effect-atom/atom-react";
import { Duration, Effect } from "effect";

import { atomRuntime } from "@/atom-runtime";
import type { AddUserFormValues } from "@/schema/user-schema";
import { UsersService } from "@/services/user-service";

const usersResponseAtom = atomRuntime
  .atom(
    Effect.gen(function* () {
      return yield* UsersService.getUsers();
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
