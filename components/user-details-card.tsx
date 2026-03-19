import { Icons } from "@/components/icons";

import { cn } from "@/lib/utils";
import type { UserBasic } from "@/schema/user-schema";

interface UserDetailsCardProps {
  user: UserBasic;
  addressContent: React.ReactNode;
  waiting?: boolean;
}

export function UserDetailsCard({
  user,
  addressContent,
  waiting,
}: UserDetailsCardProps) {
  return (
    <div className="relative container flex max-w-md flex-col justify-between gap-6 border bg-white p-6">
      <div
        className={cn("space-y-2", waiting && "pointer-events-none opacity-50")}
      >
        <h3 className="text-2xl font-semibold">
          {user.firstName} {user.lastName}
        </h3>
        <p className="text-base font-medium text-neutral-600">
          {user.company.title}
        </p>
        <p className="text-sm text-neutral-500">{user.company.name}</p>
      </div>

      <p className="text-sm break-all text-neutral-500">{user.email}</p>

      <div className="flex items-start gap-3 border bg-neutral-50 p-3">
        <Icons.mapPin className="mt-0.5 size-5 shrink-0 text-neutral-400" />
        <div className="text-sm text-neutral-600">{addressContent}</div>
      </div>
    </div>
  );
}
