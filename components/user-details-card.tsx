import type { User } from "@/app/schema/user-schema";

import { Icons } from "@/components/icons";

interface UserDetailsCardProps {
  user: User;
}

export function UserDetailsCard({ user }: UserDetailsCardProps) {
  return (
    <div className="bg-white border p-6 flex flex-col gap-6 relative max-w-md container">
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
