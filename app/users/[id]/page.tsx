import { AtomRegistry, Hydration } from "effect/unstable/reactivity";
import { Link } from "react-transition-progress/next";

import { HydrationBoundary } from "@/components/hydration-boundary";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { UserDetailClient } from "@/components/user-detail-client";

import { prefetch } from "@/lib/utils";
import { userAddressAtom, userBasicAtom } from "@/atoms/user";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const registry = AtomRegistry.make();

  registry.mount(userBasicAtom(id));
  await prefetch(registry, userBasicAtom(id));

  registry.mount(userAddressAtom(id));

  const state = Hydration.dehydrate(registry, {
    encodeInitialAs: "promise",
  });

  return (
    <HydrationBoundary state={state}>
      <div className="container max-w-5xl space-y-10">
        <Button variant="ghost" asChild>
          <Link href="/">
            <Icons.arrowLeft className="size-4" />
            Back to users
          </Link>
        </Button>
        <UserDetailClient id={id} />
      </div>
    </HydrationBoundary>
  );
}
