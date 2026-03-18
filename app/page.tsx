import { Effect, Option, Schema } from "effect";
import { AtomRegistry, Hydration } from "effect/unstable/reactivity";

import { HomePageClient } from "@/components/home-page-client";
import { HydrationBoundary } from "@/components/hydration-boundary";

import { prefetch } from "@/lib/utils";
import { usersAtom } from "@/atoms/user";

const SearchParamsSchema = Schema.Struct({
  q: Schema.String.pipe(Schema.withDecodingDefault(() => "")),
  page: Schema.NumberFromString.check(
    Schema.isInt(),
    Schema.isGreaterThanOrEqualTo(1),
  ).pipe(
    Schema.catchDecoding(() => Effect.succeed(Option.some(1))),
    Schema.withDecodingDefault(() => "1"),
  ),
});

const decodeSearchParams = Schema.decodeUnknownSync(SearchParamsSchema);

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { q: query, page: pageNum } = decodeSearchParams(await searchParams);

  const registry = AtomRegistry.make();
  const homeUsersAtom = usersAtom(query, pageNum);

  registry.mount(homeUsersAtom);
  await prefetch(registry, homeUsersAtom);

  const state = Hydration.dehydrate(registry);

  return (
    <HydrationBoundary state={state}>
      <HomePageClient query={query} page={pageNum} />
    </HydrationBoundary>
  );
}
