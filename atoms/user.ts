import { Duration, Effect } from "effect";
import { Atom, Reactivity } from "effect/unstable/reactivity";

import { atomRuntime } from "@/atom-runtime";
import { pageAtom } from "@/atoms/page";
import { debouncedSearchQueryAtom } from "@/atoms/search";
import { type AddUserFormValues } from "@/schema/user-schema";
import { UserService } from "@/services/user-service";

const baseUsersAtom = atomRuntime
  .atom((get) =>
    Effect.gen(function* () {
      const page = get(pageAtom);
      const query = get(debouncedSearchQueryAtom);
      const userService = yield* UserService;
      return yield* userService.getUsers(query, page);
    }),
  )
  .pipe(Atom.setIdleTTL(Duration.hours(1)), Atom.withReactivity(["users"]));

// ============ Users Atom ============
export const usersAtom = (
  typeof window !== "undefined"
    ? Atom.refreshOnWindowFocus(baseUsersAtom)
    : baseUsersAtom
).pipe(Atom.setIdleTTL(Duration.hours(1)), Atom.withReactivity(["users"]));

// ============ User Atom ============
export const userAtom = Atom.family((id: string) => {
  const base = atomRuntime
    .atom(
      Effect.gen(function* () {
        const userService = yield* UserService;
        return yield* userService.getUser(id);
      }),
    )
    .pipe(Atom.setIdleTTL(Duration.hours(1)));

  return typeof window !== "undefined" ? Atom.refreshOnWindowFocus(base) : base;
});

// ============ Delete User Atom ============
export const deleteUserAtom = atomRuntime.fn(
  Effect.fnUntraced(function* (userId: string, get) {
    const userService = yield* UserService;
    yield* userService.deleteUser(userId);
  }),
  { reactivityKeys: ["users"] },
);

// ============ Add User Atom ============
export const addUserAtom = atomRuntime.fn<AddUserFormValues>()(
  Effect.fnUntraced(function* (user) {
    const userService = yield* UserService;
    return yield* userService.addUser(user);
  }),
);

// ============ Invalidate Users ============
export const invalidateUsersAtom = atomRuntime.fn()(
  Effect.fnUntraced(function* () {
    yield* Reactivity.invalidate(["users"]);
  }),
);
