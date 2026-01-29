"use client";

import { UsersIcon } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function UserEmptyCard() {
  const isSearching = true;

  const description = isSearching
    ? `No users match your search query.`
    : "The users list is currently empty.";

  return (
    <Empty className="border py-10">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UsersIcon className="text-neutral-400 size-10" />
        </EmptyMedia>
        <EmptyTitle className="font-bold text-lg">No Users Found</EmptyTitle>
        <EmptyDescription className="text-sm">{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
