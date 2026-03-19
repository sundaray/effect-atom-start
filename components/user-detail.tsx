"use client";

import { useAtomValue } from "@effect/atom-react";
import { Cause } from "effect";
import { AsyncResult, Atom } from "effect/unstable/reactivity";

import { FailureCard } from "@/components/failure-card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserDetailsCard } from "@/components/user-details-card";
import { UserGridSpinner } from "@/components/user-grid-spinner";

import { getErrorInfo } from "@/lib/utils";
import { userAddressAtom, userBasicAtom } from "@/atoms/user";

function UserDetailAddress({
  addressResult,
}: {
  addressResult: Atom.Type<ReturnType<typeof userAddressAtom>>;
}) {
  return AsyncResult.match(addressResult, {
    onInitial: () => (
      <div className="space-y-1">
        <Skeleton className="h-4.5 w-24" />
        <Skeleton className="h-4.5 w-36" />
      </div>
    ),
    onFailure: (failure) => {
      const error = Cause.squash(failure.cause);
      const { message } = getErrorInfo(error);
      return <p className="text-sm text-red-600">{message}</p>;
    },
    onSuccess: (success) => (
      <>
        <p>{success.value.address}</p>
        <p>
          {success.value.city}, {success.value.state}
        </p>
      </>
    ),
  });
}

export function UserDetail({ id }: { id: string }) {
  const basicResult = useAtomValue(userBasicAtom(id));
  const addressResult = useAtomValue(userAddressAtom(id));
  const addressContent = <UserDetailAddress addressResult={addressResult} />;

  return AsyncResult.builder(basicResult)
    .onInitial(() => <UserGridSpinner />)
    .onFailure((cause) => {
      const error = Cause.squash(cause);
      const { title, message } = getErrorInfo(error);
      return <FailureCard title={title} message={message} />;
    })
    .onSuccess((user) => (
      <UserDetailsCard user={user} addressContent={addressContent} />
    ))
    .render();
}
