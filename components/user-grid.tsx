"use client";

import { Result, useAtomValue } from "@effect-atom/atom-react";

import { FailureCard } from "@/components/failure-card";
import {
  getNoUsersFoundReason,
  UserEmptyCard,
} from "@/components/user-empty-card";
import { UserGridSpinner } from "@/components/user-grid-spinner";
import { UserSuccessCard } from "@/components/user-success-card";

export function UserGrid() {
  return <h1>User Grid</h1>;
}
