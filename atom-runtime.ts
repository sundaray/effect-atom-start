import { Atom } from "effect/unstable/reactivity";

import { UserService } from "@/services/user-service";

export const atomRuntime = Atom.runtime(UserService.layer);
