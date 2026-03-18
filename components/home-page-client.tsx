"use client";

import { useMemo } from "react";
import { Atom } from "effect/unstable/reactivity";
import { Link } from "react-transition-progress/next";

import { UserGrid } from "@/components/user-grid";
import { UserPagination } from "@/components/user-pagination";
import { UserSearchBar } from "@/components/user-search-bar";

import { pageAtom } from "@/atoms/page";
import { searchQueryAtom } from "@/atoms/search";
import { currentUsersAtom, usersAtom } from "@/atoms/user";

interface HomePageClientProps {
  query: string;
  page: number;
}

export function HomePageClient({ query, page }: HomePageClientProps) {
  const pageStateAtom = useMemo(
    () => Atom.withServerValue(pageAtom, () => page),
    [page],
  );
  const searchStateAtom = useMemo(
    () => Atom.withServerValue(searchQueryAtom, () => query),
    [query],
  );
  const usersStateAtom = useMemo(() => {
    let cached: Atom.Type<typeof currentUsersAtom> | undefined;
    return Atom.withServerValue(currentUsersAtom, (get) => {
      if (cached === undefined) {
        cached = get(usersAtom(query, page));
      }
      return cached;
    });
  }, [page, query]);

  return (
    <div className="container max-w-5xl space-y-10">
      <div className="flex items-center justify-between">
        <h1>Users</h1>
        <Link
          href="/add-user"
          className="bg-accent text-foreground px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-200"
        >
          + Add User
        </Link>
      </div>
      <UserSearchBar
        pageStateAtom={pageStateAtom}
        searchStateAtom={searchStateAtom}
      />
      <UserGrid usersStateAtom={usersStateAtom} />
      <UserPagination
        pageStateAtom={pageStateAtom}
        usersStateAtom={usersStateAtom}
      />
    </div>
  );
}
