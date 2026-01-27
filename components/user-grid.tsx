"use client";

import { Result, useAtomValue } from "@effect-atom/atom-react";

import { usersAtom } from "@/app/atoms/users";

import { UserEmptyCard } from "@/components/user-empty-card";
import { UserFailureCard } from "@/components/user-failure-card";
import { UserGridSpinner } from "@/components/user-grid-spinner";
import { UserSuccessCard } from "@/components/user-success-card";

export function UserGrid() {
  const usersResult = useAtomValue(usersAtom);

  return Result.match(usersResult, {
    onInitial: () => <UserGridSpinner />,

    // 1. Unwrap the failure cause
    onFailure: (failure) => <UserFailureCard cause={failure.cause} />,

    // 2. Unwrap the success value
    onSuccess: (success) => {
      const users = success.value; // <--- Access the data here

      if (users.length === 0) {
        return <UserEmptyCard />;
      }

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {users.map((user) => (
            <UserSuccessCard key={user.id} user={user} />
          ))}
        </div>
      );
    },
  });
}
