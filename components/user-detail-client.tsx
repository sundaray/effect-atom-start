"use client";

import { UserDetail } from "@/components/user-detail";

export function UserDetailClient({ id }: { id: string }) {
  return <UserDetail id={id} />;
}
