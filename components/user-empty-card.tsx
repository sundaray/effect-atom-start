"use client";

import { UsersIcon } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import type { User } from "@/schema/user-schema";

export type NoUsersFoundReason =
  | "no-matching-search-results"
  | "page-out-of-range"
  | "empty-users-list";

interface UserEmptyCardProps {
  reason: NoUsersFoundReason;
  page?: number;
}

export function UserEmptyCard({ reason, page }: UserEmptyCardProps) {
  const descriptions: Record<NoUsersFoundReason, string> = {
    "no-matching-search-results": "No users match your search query.",
    "page-out-of-range": `Page ${page} doesn't exist. Try going back to page 1.`,
    "empty-users-list": "The users list is currently empty.",
  };

  return (
    <Empty className="border py-10">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UsersIcon className="text-neutral-400 size-10" />
        </EmptyMedia>
        <EmptyTitle className="font-bold text-lg">No Users Found</EmptyTitle>
        <EmptyDescription className="text-sm">
          {descriptions[reason]}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export function getNoUsersFoundReason(
  users: readonly User[],
  searchQuery: string,
  page: number,
): NoUsersFoundReason {
  if (users.length > 0) {
    throw new Error(
      "getNoUsersFoundReason should only be called when the users list is empty",
    );
  }

  if (searchQuery && searchQuery !== "") {
    return "no-matching-search-results";
  }

  // No search query but page > 1 means user navigated beyond available pages
  if (page > 1) {
    return "page-out-of-range";
  }

  return "empty-users-list";
}
