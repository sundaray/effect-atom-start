import { Atom } from "@effect-atom/atom-react";
import { Effect } from "effect";

import { atomRuntime } from "@/runtime";
import { UsersService } from "@/app/services/users-service";

export const userAtom = Atom.family((id: string) =>
  atomRuntime
    .atom(
      Effect.gen(function* () {
        return yield* UsersService.getUser(id);
      }),
    )
    .pipe(Atom.keepAlive),
);
