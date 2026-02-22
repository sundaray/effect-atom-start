import { Duration, Effect } from "effect";
import { Atom } from "effect/unstable/reactivity";

import { atomRuntime } from "@/atom-runtime";
import { UserService } from "@/services/user-service";

// ============ Users Atom ============
export const usersAtom = atomRuntime
  .atom(
    Effect.gen(function* () {
      const userService = yield* UserService;
      return yield* userService.getUsers();
    }),
  )
  .pipe(Atom.setIdleTTL(Duration.hours(1)));
