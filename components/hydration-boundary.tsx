"use client";

import React from "react";
import { RegistryContext } from "@effect/atom-react";
import { Atom, Hydration } from "effect/unstable/reactivity";

interface HydrationBoundaryProps {
  state?: Iterable<Hydration.DehydratedAtom>;
  children?: React.ReactNode;
}

export function HydrationBoundary({ children, state }: HydrationBoundaryProps) {
  const registry = React.useContext(RegistryContext);

  const hydrationQueue = React.useMemo(() => {
    if (state) {
      const dehydratedAtoms = Hydration.toValues(Array.from(state));
      const nodes = registry.getNodes();

      const newDehydrateAtoms: Array<Hydration.DehydratedAtomValue> = [];
      const existingDehydrateAtoms: Array<Hydration.DehydratedAtomValue> = [];

      for (const dehydratedAtom of dehydratedAtoms) {
        const existingNode = nodes.get(dehydratedAtom.key);

        if (!existingNode) {
          newDehydrateAtoms.push(dehydratedAtom);
        } else {
          existingDehydrateAtoms.push(dehydratedAtom);
        }
      }

      if (newDehydrateAtoms.length > 0) {
        Hydration.hydrate(registry, newDehydrateAtoms);
      }

      if (existingDehydrateAtoms.length > 0) {
        return existingDehydrateAtoms;
      }

      return undefined;
    }
  }, [registry, state]);

  React.useEffect(() => {
    if (hydrationQueue) {
      Hydration.hydrate(registry, hydrationQueue);

      for (const dehydratedAtom of hydrationQueue) {
        // Skip streaming atoms as they handle their own Promise resolution
        if (dehydratedAtom.resultPromise) {
          continue;
        }

        // get the node from the registry
        const node = registry.getNodes().get(dehydratedAtom.key);

        if (!node) {
          continue;
        }

        const atom = node.atom as typeof node.atom & {
          [Atom.SerializableTypeId]?: {
            decode: (value: unknown) => unknown;
          };
        };

        const serializable = atom[Atom.SerializableTypeId];

        if (serializable) {
          (node as unknown as { setValue: (value: unknown) => void }).setValue(
            serializable.decode(dehydratedAtom.value),
          );
        }
      }
    }
  }, [registry, hydrationQueue]);

  return <>{children}</>;
}
