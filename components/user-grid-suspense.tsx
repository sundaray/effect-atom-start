"use client";

import {
  useAtomRefresh,
  useAtomSuspense,
  useAtomValue,
} from "@effect/atom-react";
import { Cause } from "effect";

import { FailureCard } from "@/components/failure-card";
import {
  getNoUsersFoundReason,
  UserEmptyCard,
} from "@/components/user-empty-card";
import { UserSuccessCard } from "@/components/user-success-card";

import { getErrorInfo } from "@/lib/utils";
import { pageAtom } from "@/atoms/page";
import { debouncedSearchQueryAtom } from "@/atoms/search";
import { usersAtom } from "@/atoms/user";

export function UserGridSuspense() {
  const result = useAtomSuspense(usersAtom, { includeFailure: true });
  const refresh = useAtomRefresh(usersAtom);
  const searchQuery = useAtomValue(debouncedSearchQueryAtom);
  const page = useAtomValue(pageAtom);

  if (result._tag === "Failure") {
    const error = Cause.squash(result.cause);
    const { title, message } = getErrorInfo(error);

    return <FailureCard title={title} message={message} onRetry={refresh} />;
  }

  const users = result.value.users;

  if (users.length === 0) {
    return (
      <UserEmptyCard reason={getNoUsersFoundReason(users, searchQuery, page)} />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {users.map((user) => (
        <UserSuccessCard key={user.id} user={user} waiting={result.waiting} />
      ))}
    </div>
  );
}
