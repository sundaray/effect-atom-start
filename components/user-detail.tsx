"use client";

import { useParams } from "next/navigation";


import { UserDetailsCard } from "@/components/user-details-card";
import { UserFailureCard } from "@/components/user-failure-card";
import { UserGridSpinner } from "@/components/user-grid-spinner";

export function UserDetail() {
  const params = useParams<{ id: string }>();

  return <h1>User Detail</h1>
}
