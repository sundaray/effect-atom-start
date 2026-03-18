"use client";

import { useAtom, useAtomValue } from "@effect/atom-react";
import { AsyncResult, Atom } from "effect/unstable/reactivity";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

import { USERS_PER_PAGE } from "@/lib/constants";
import { pageAtom } from "@/atoms/page";
import { usersAtom } from "@/atoms/user";

const selectUsersCount = (result: Atom.Type<typeof usersAtom>) =>
  AsyncResult.map(result, (data) => data.usersCount);

export function UserPagination() {
  const [page, setPage] = useAtom(pageAtom);
  const usersCountResult = useAtomValue(usersAtom, selectUsersCount);

  return AsyncResult.match(usersCountResult, {
    onInitial: () => null,
    onFailure: () => null,
    onSuccess: (result) => {
      const totalPages = Math.ceil(result.value / USERS_PER_PAGE);

      if (totalPages <= 1) return null;

      return (
        <div className="mt-4 flex items-center justify-between border-t py-4">
          <p className="text-muted-foreground text-sm">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((page) => page - 1)}
              disabled={page <= 1}
              className="hover:bg-neutral-200"
            >
              <Icons.chevronLeft className="size-4" />
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((page) => page + 1)}
              disabled={page >= totalPages}
              className="hover:bg-neutral-200"
            >
              Next
              <Icons.chevronRight className="size-4" />
            </Button>
          </div>
        </div>
      );
    },
  });
}
