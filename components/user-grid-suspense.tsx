"use client";

import { useAtomRefresh, useAtomSuspense } from "@effect-atom/atom-react";
import { Cause } from "effect";

import { FailureCard } from "@/components/failure-card";
import { UserSuccessCard } from "@/components/user-success-card";

import { getErrorInfo } from "@/lib/utils";
import { usersAtom } from "@/atoms/users";

export function UserGridSuspense() {
  const result = useAtomSuspense(usersAtom, { includeFailure: true });
  const refresh = useAtomRefresh(usersAtom);

  if (result._tag === "Failure") {
    const error = Cause.squash(result.cause);
    const { title, message } = getErrorInfo(error);

    return <FailureCard title={title} message={message} onRetry={refresh} />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {result.value.map((user) => (
        <UserSuccessCard key={user.id} user={user} />
      ))}
    </div>
  );
}
