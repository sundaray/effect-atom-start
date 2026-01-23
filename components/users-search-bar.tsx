"use client";



import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function UsersSearchBar() {

  function handleSearch(value: string) {
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
