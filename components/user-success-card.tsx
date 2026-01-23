import Link from "next/link";

import type { User } from "@/app/schema/user-schema";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { UserDeleteDialog } from "@/components/user-delete-dialog";

interface UserSuccessCardProps {
  user: User;
}

export function UserSuccessCard({ user }: UserSuccessCardProps) {
  return (
    <div className="bg-white border p-4 flex flex-col justify-between gap-4 relative">
      <div className="space-y-1">
        <h3 className="font-semibold text-lg">
          {user.firstName} {user.lastName}
        </h3>
        <p className="text-sm text-neutral-600 font-medium">
          {user.company.title}
        </p>
        <p className="text-sm text-neutral-500">{user.company.name}</p>
      </div>

      <UserDeleteDialog
        user={user}
        trigger={
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-neutral-400 hover:text-red-600 hover:bg-red-50 absolute top-1 right-1"
          >
            <Icons.trash className="size-4" />
            <span className="sr-only">Delete user</span>
          </Button>
        }
      />

      <p className="text-xs text-neutral-500 break-all">{user.email}</p>

      <Link
        href={`/users/${user.id}`}
        className="w-full bg-blue-50 text-blue-900 font-medium hover:bg-blue-50 text-sm text-center py-1"
      >
        View Details
      </Link>
    </div>
  );
}
