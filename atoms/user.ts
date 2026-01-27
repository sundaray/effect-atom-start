import { Atom } from "@effect-atom/atom-react";
import { Duration, Effect } from "effect";

import { atomRuntime } from "@/atom-runtime";
import { UsersService } from "@/services/user-service";

export const userAtom = Atom.family((id: string) =>
  atomRuntime
    .atom(
      Effect.gen(function* () {
        return yield* UsersService.getUser(id);
      }),
    )
    .pipe(Atom.setIdleTTL(Duration.hours(1))),
);
