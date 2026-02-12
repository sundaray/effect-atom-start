"use client";

import { useAtomRefresh, useAtomSuspense } from "@effect-atom/atom-react";
import { Cause } from "effect";

import { FailureCard } from "@/components/failure-card";
import { UserSuccessCard } from "@/components/user-success-card";

import { getErrorInfo } from "@/lib/utils";

export function UserGridSuspense() {
  return <h1>User Grid Suspense</h1>;
}
