"use client";

import { Result, useAtom, useAtomValue } from "@effect-atom/atom-react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

import { USERS_PER_PAGE } from "@/lib/constants";
import { pageAtom } from "@/atoms/page";
import { usersCountAtom } from "@/atoms/users";

export function UsersPagination() {
  const [page, setPage] = useAtom(pageAtom);

  const usersCount = useAtomValue(usersCountAtom);

  return Result.match(usersCount, {
    onInitial: () => null,
    onFailure: () => null,
    onSuccess: (result) => {
      const usersCount = result.value;
      const totalPages = Math.ceil(usersCount / USERS_PER_PAGE);

      if (totalPages <= 1) return null;

      return (
        <div className="flex items-center justify-between py-4 border-t mt-4">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="hover:bg-neutral-200"
            >
              <Icons.chevronLeft className="size-4" />
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage(page + 1)}
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
