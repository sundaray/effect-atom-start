"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Link } from "react-transition-progress/next";

import { UserGridSpinner } from "@/components/user-grid-spinner";
import { UserGridSuspense } from "@/components/user-grid-suspense";
import { UserPagination } from "@/components/user-pagination";
import { UserSearchBar } from "@/components/user-search-bar";

export default function HomePage() {
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
      <UserSearchBar />
      <Suspense fallback={<UserGridSpinner />}>
        <UserGridSuspense />
      </Suspense>
      <UserPagination />
    </div>
  );
}
