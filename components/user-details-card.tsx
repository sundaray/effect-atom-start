import { Icons } from "@/components/icons";

import { cn } from "@/lib/utils";
import type { User } from "@/schema/user-schema";

interface UserDetailsCardProps {
  user: User;
  waiting?: boolean;
}

export function UserDetailsCard({ user, waiting }: UserDetailsCardProps) {
  return (
    <div
      className={cn(
        "bg-white border p-6 flex flex-col justify-between gap-6 relative container max-w-md",
        waiting && "opacity-50 pointer-events-none",
      )}
    >
      <div className="space-y-2">
        <h3 className="font-semibold text-2xl">
          {user.firstName} {user.lastName}
        </h3>
        <p className="text-base text-neutral-600 font-medium">
          {user.company.title}
        </p>
        <p className="text-sm text-neutral-500">{user.company.name}</p>
      </div>

      <p className="text-sm text-neutral-500 break-all">{user.email}</p>

      <div className="flex items-start gap-3 bg-neutral-50 p-3 border">
        <Icons.mapPin className="size-5 text-neutral-400 mt-0.5 shrink-0" />
        <div className="text-sm text-neutral-600">
          <p>{user.address.address}</p>
          <p>
            {user.address.city}, {user.address.state}
          </p>
        </div>
      </div>
    </div>
  );
}
