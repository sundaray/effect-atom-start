"use client";

import { Atom, useAtom } from "@effect-atom/atom-react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { pageAtom } from "@/atoms/page";
import { searchQueryAtom } from "@/atoms/search";

export function UsersSearchBar() {
  const [query, setQuery] = useAtom(searchQueryAtom);
  const [page, setPage] = useAtom(pageAtom);

  function handleSearch(value: string) {
    Atom.batch(() => {
      setQuery(value);
      if (page !== 1) {
        setPage(1);
      }
    });
  }

  function handleClear() {
    handleSearch("");
  }

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-muted-foreground">
        <Icons.search className="size-4" />
      </div>

      <Input
        placeholder="Search by user name..."
        className="pl-9 pr-8"
        onChange={(event) => handleSearch(event.target.value)}
      />
    </div>
  );
}
