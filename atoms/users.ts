import { Atom } from "@effect-atom/atom-react";
import { Duration, Effect } from "effect";

import { atomRuntime } from "@/atom-runtime";
import { UsersService } from "@/services/user-service";

const usersResponseAtom = atomRuntime
  .atom(
    Effect.gen(function* () {
      return yield* UsersService.getUsers();
    }),
  )
  .pipe(
    Atom.setIdleTTL(Duration.hours(1)),
    (atom) =>
      typeof window !== "undefined" ? Atom.refreshOnWindowFocus(atom) : atom,
    Atom.withServerValueInitial,
  );

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
);
