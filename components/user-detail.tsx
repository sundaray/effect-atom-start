"use client";

import { useParams } from "next/navigation";
import { useAtomValue } from "@effect/atom-react";
import { AsyncResult } from "effect/unstable/reactivity";

import { FailureCard } from "@/components/failure-card";
import { UserDetailsCard } from "@/components/user-details-card";
import { UserGridSpinner } from "@/components/user-grid-spinner";

import { getErrorInfo } from "@/lib/utils";
import { userAtom } from "@/atoms/user";

export function UserDetail() {
  const params = useParams<{ id: string }>();
  const result = useAtomValue(userAtom(params.id));

  return AsyncResult.builder(result)
    .onInitial(() => <UserGridSpinner />)
    .onError((error) => {
      const { title, message } = getErrorInfo(error);
      return <FailureCard title={title} message={message} />;
    })
    .onDefect((defect) => {
      const { title, message } = getErrorInfo(defect);
      return <FailureCard title={title} message={message} />;
    })
    .onSuccess((user, { waiting }) => (
      <UserDetailsCard user={user} waiting={waiting} />
    ))
    .render();
}
