"use client";

import { useParams } from "next/navigation";
import { Result, useAtomValue } from "@effect-atom/atom-react";

import { FailureCard } from "@/components/failure-card";
import { UserDetailsCard } from "@/components/user-details-card";
import { UserGridSpinner } from "@/components/user-grid-spinner";

import { getErrorInfo } from "@/lib/utils";
import { userAtom } from "@/atoms/users";

export function UserDetail() {
  const params = useParams<{ id: string }>();
  const result = useAtomValue(userAtom(params.id));

  return Result.builder(result)
    .onInitial(() => <UserGridSpinner />)
    .onFailure((cause) => {
      const { title, message } = getErrorInfo(cause);
      return <FailureCard title={title} message={message} />;
    })
    .onSuccess((user, { waiting }) => (
      <div className={waiting ? "opacity-50 transition-opacity" : ""}>
        <UserDetailsCard user={user} waiting={waiting} />
      </div>
    ))
    .render();
}
