"use client";

import { useAtomValue } from "@effect/atom-react";
import { AsyncResult, Atom } from "effect/unstable/reactivity";

import { FailureCard } from "@/components/failure-card";
import { UserEmptyCard } from "@/components/user-empty-card";
import { UserGridSpinner } from "@/components/user-grid-spinner";
import { UserSuccessCard } from "@/components/user-success-card";

import { usersAtom } from "@/atoms/user";

const selectUsers = (result: Atom.Type<typeof usersAtom>) =>
  AsyncResult.map(result, (data) => data.users);

export function UserGrid() {
  const usersResult = useAtomValue(usersAtom, selectUsers);

  return AsyncResult.builder(usersResult)
    .onInitial(() => <UserGridSpinner />)
    .onErrorTag("ConfigError", (error) => (
      <FailureCard title="Configuration Error" message={error.message} />
    ))
    .onErrorTag("ClientError", (error) => (
      <FailureCard title="Client Error" message={error.message} />
    ))
    .onErrorTag("ServerError", (error) => (
      <FailureCard title="Server Error" message={error.message} />
    ))
    .onErrorTag("ParseError", (error) => (
      <FailureCard title="Parse Error" message={error.message} />
    ))
    .onDefect(() => (
      <FailureCard
        title="Unexpected Error"
        message="Something went wrong. Please try refreshing the page."
      />
    ))
    .onSuccess((users) =>
      users.length === 0 ? (
        <UserEmptyCard reason="empty-users-list" />
      ) : (
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {users.map((user) => (
            <UserSuccessCard key={user.id} user={user} />
          ))}
        </div>
      ),
    )
    .render();
}
