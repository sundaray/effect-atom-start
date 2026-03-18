import { Array as Arr, Duration, Effect, Stream } from "effect";
import { AsyncResult, Atom, Reactivity } from "effect/unstable/reactivity";

import { atomRuntime } from "@/atom-runtime";
import { pageAtom } from "@/atoms/page";
import { debouncedSearchQueryAtom } from "@/atoms/search";
import {
  UsersResponseAsyncResultSchema,
  type AddUserFormValues,
} from "@/schema/user-schema";
import { UserService } from "@/services/user-service";

// ============ Users Family Atom ============
const usersFamily = Atom.family((key: [string, number]) => {
  const [query, page] = key;

  const base = atomRuntime.atom(() => {
    return Effect.gen(function* () {
      const userService = yield* UserService;
      return yield* userService.getUsers(query, page);
    });
  });

  return base.pipe(
    Atom.serializable({
      key: `users:${query}:${page}`,
      schema: UsersResponseAsyncResultSchema,
    }),
    Atom.withReactivity(["users"]),
    Atom.setIdleTTL(Duration.hours(1)),
  );
});

// ============ Users Atom ============
export const usersAtom = (query: string, page: number) =>
  usersFamily([query, page]);

// ============ Current Users Atom ============
export const currentUsersAtom = Atom.readable((get) => {
  const query = get(debouncedSearchQueryAtom);
  const page = get(pageAtom);
  return get(usersAtom(query, page));
});

// ============ Load More Users Atom (Pull Atom) ============
export const usersLoadMoreAtom = atomRuntime
  .pull((get) => {
    const query = get(debouncedSearchQueryAtom);
    return Stream.unwrap(
      Effect.gen(function* () {
        const userService = yield* UserService;
        return userService.getUsersStream(query);
      }),
    );
  })
  .pipe(Atom.setIdleTTL(Duration.hours(1)));

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
  Effect.fnUntraced(function* (userId: string) {
    const userService = yield* UserService;
    yield* userService.deleteUser(userId);
  }),
);

// ============ Add User Atom ============
export const addUserAtom = atomRuntime.fn<AddUserFormValues>()(
  Effect.fnUntraced(function* (user) {
    const userService = yield* UserService;
    return yield* userService.addUser(user);
  }),
);

// ============ Invalidate Users Atom ============
export const invalidateUsersAtom = atomRuntime.fn()(
  Effect.fnUntraced(function* () {
    yield* Reactivity.invalidate(["users"]);
  }),
);

// ============ Optimistic Users Atom ============
export const optimisticUsersAtom = Atom.optimistic(usersLoadMoreAtom);

// ============ Optimistic Delete Users Atom ============
export const optimisticDeleteUserAtom = Atom.optimisticFn(optimisticUsersAtom, {
  reducer: (current, userId: string) =>
    AsyncResult.map(current, (data) => ({
      ...data,
      items: Arr.map(data.items, (chunk) => ({
        ...chunk,
        users: Arr.filter(chunk.users, (user) => user.id !== userId),
      })),
    })),
  fn: deleteUserAtom,
});
