"use client";

import { useParams } from "next/navigation";
import { Result, useAtomValue } from "@effect-atom/atom-react";

import { FailureCard } from "@/components/failure-card";
import { UserDetailsCard } from "@/components/user-details-card";
import { UserGridSpinner } from "@/components/user-grid-spinner";

import { getErrorInfo } from "@/lib/utils";

export function UserDetail() {
  return <h1>User Detail</h1>;
}
