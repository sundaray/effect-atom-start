import { Suspense } from "react";


import { UserEmptyCard } from "@/components/user-empty-card";
import { UserGridSpinner } from "@/components/user-grid-spinner";
import { UserSuccessCard } from "@/components/user-success-card";

function UsergridContent() {


  return <h1>User Grid</h1>
}

export function UserGridSuspense() {
  return (
    <Suspense fallback={<UserGridSpinner />}>
      <UsergridContent />
    </Suspense>
  );
}
