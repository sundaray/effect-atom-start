import { RegistryContext, useAtomValue } from "@effect/atom-react";
import { render, screen, waitFor } from "@testing-library/react";
import { Schema } from "effect";
import { Atom, AtomRegistry, Hydration } from "effect/unstable/reactivity";
import { describe, expect, it } from "vitest";

import { HydrationBoundary } from "@/components/hydration-boundary";

const countAtom = Atom.make(0).pipe(
  Atom.serializable({
    key: "test-count",
    schema: Schema.Number,
  }),
);

function CountValue() {
  const count = useAtomValue(countAtom);

  return <div>{count}</div>;
}

function makeHydratedState(value: number) {
  const registry = AtomRegistry.make();
  registry.set(countAtom, value);
  return Hydration.dehydrate(registry);
}

describe("HydrationBoundary", () => {
  it("hydrates serializable atoms that are not yet in the registry", () => {
    const registry = AtomRegistry.make();

    render(
      <RegistryContext.Provider value={registry}>
        <HydrationBoundary state={makeHydratedState(5)}>
          <CountValue />
        </HydrationBoundary>
      </RegistryContext.Provider>,
    );

    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("hydrates values for atoms that already have a node in the registry", async () => {
    const registry = AtomRegistry.make();
    registry.set(countAtom, 1);

    render(
      <RegistryContext.Provider value={registry}>
        <HydrationBoundary state={makeHydratedState(9)}>
          <CountValue />
        </HydrationBoundary>
      </RegistryContext.Provider>,
    );

    await waitFor(() => {
      expect(screen.getByText("9")).toBeInTheDocument();
    });
  });
});
