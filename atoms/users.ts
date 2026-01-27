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
  .pipe(Atom.setIdleTTL(Duration.hours(1)));

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
