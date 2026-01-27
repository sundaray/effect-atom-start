"use client";

import { Result, useAtomValue } from "@effect-atom/atom-react";

import { usersAtom } from "@/app/atoms/users";

import { FailureCard } from "@/components/failure-card";
import { UserEmptyCard } from "@/components/user-empty-card";
import { UserGridSpinner } from "@/components/user-grid-spinner";
import { UserSuccessCard } from "@/components/user-success-card";

export function UserGrid() {
  const usersResult = useAtomValue(usersAtom);

  return Result.builder(usersResult)
    .onInitial(() => <UserGridSpinner />)

    .onErrorTag("ConfigError", (error) => (
      <FailureCard title="Configuration Error" message={error.message} />
    ))

    .onErrorTag("GetUsersRequestError", (error) => (
      <FailureCard title="Connection Failed" message={error.message} />
    ))

    .onErrorTag("GetUsersResponseError", (error) => (
      <FailureCard title="Server Error" message={error.message} />
    ))

    .onErrorTag("GetUsersParseError", (error) => (
      <FailureCard title="Data Error" message={error.message} />
    ))

    .onDefect(() => (
      <FailureCard
        title="Unexpected Error"
        message="Something went wrong. Please try refreshing the page."
      />
    ))

    .onSuccess((users) =>
      users.length === 0 ? (
        <UserEmptyCard />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {users.map((user) => (
            <UserSuccessCard key={user.id} user={user} />
          ))}
        </div>
      ),
    )
    .render();
}
