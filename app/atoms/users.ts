import { Atom } from "@effect-atom/atom-react";
import { Effect } from "effect";

import { UsersService } from "@/app/services/user-service";

import { atomRuntime } from "@/atom-runtime";

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
