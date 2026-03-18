"use client";

import { useState } from "react";
import { useAtom, useAtomRefresh } from "@effect/atom-react";
import { Cause } from "effect";
import { AsyncResult } from "effect/unstable/reactivity";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { getErrorInfo } from "@/lib/utils";
import { usersLoadMoreAtom } from "@/atoms/user";

export function UserLoadMore() {
  const [result, loadMore] = useAtom(usersLoadMoreAtom);
  const refresh = useAtomRefresh(usersLoadMoreAtom);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const isWaiting = result._tag === "Success" && result.waiting === true;

  if (!isWaiting && isLoadingMore) {
    setIsLoadingMore(false);
  }

  function handleLoadMore() {
    setIsLoadingMore(true);
    loadMore();
  }

  const showSpinner = isWaiting && isLoadingMore;

  return AsyncResult.match(result, {
    onInitial: () => null,
    onFailure: ({ cause }) => {
      const error = Cause.squash(cause);
      const { message } = getErrorInfo(error);

      return <UserLoadMoreError message={message} onRetry={() => refresh()} />;
    },
    onSuccess: ({ value: { items } }) => {
      const lastPage = items[items.length - 1];
      if (!lastPage.hasMore) return null;

      return (
        <div className="mt-4 flex justify-center border-t py-4">
          <Button
            variant="secondary"
            className="w-fit rounded-full border hover:bg-neutral-200"
            onClick={handleLoadMore}
            disabled={showSpinner}
          >
            {showSpinner && <Spinner className="mr-2 size-4" />}
            SHOW MORE
          </Button>
        </div>
      );
    },
  });
}

interface UserLoadMoreErrorProps {
  message: string;
  onRetry: () => void;
}

export function UserLoadMoreError({
  message,
  onRetry,
}: UserLoadMoreErrorProps) {
  return (
    <div className="mt-4 flex flex-col items-center gap-3 border-t py-4">
      <div className="flex items-center gap-2 text-sm text-red-600">
        <Icons.alert className="size-4 shrink-0" />
        <span>{message}</span>
      </div>
      <Button variant="outline" className="w-fit" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
