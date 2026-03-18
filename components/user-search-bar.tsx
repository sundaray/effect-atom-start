"use client";

import { useAtom, useAtomSet } from "@effect/atom-react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { pageAtom } from "@/atoms/page";
import { searchQueryAtom } from "@/atoms/search";

export function UserSearchBar() {
  const [query, setQuery] = useAtom(searchQueryAtom);
  const setPage = useAtomSet(pageAtom);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setPage(1);
  }

  function handleClear() {
    setQuery("");
    setPage(1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      handleClear();
    }
  }

  return (
    <div className="relative">
      <Icons.search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input
        type="search"
        placeholder="Search users..."
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="search-input pr-20 pl-9"
      />
      {query && (
        <Button
          variant="outline"
          onClick={handleClear}
          className="absolute top-1/2 right-2 h-6 -translate-y-1/2 rounded-sm px-2 text-xs"
        >
          ESC
        </Button>
      )}
    </div>
  );
}
