import { Atom } from "@effect-atom/atom-react";

import { UsersService } from "@/app/services/user-service";

// Build a runtime that knows how to provide UserService
export const atomRuntime = Atom.runtime(UsersService.Default);
