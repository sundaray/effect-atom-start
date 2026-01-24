import { Atom } from "@effect-atom/atom-react";
import { Effect } from "effect";

import { atomRuntime } from "@/runtime";
import { UsersService } from "@/app/services/users-service";

const usersResponseAtom = atomRuntime.atom(
  Effect.gen(function* () {
    return yield* UsersService.getUsers();
  }),
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
