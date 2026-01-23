"use client";

import { ReactNode } from "react";
import { RegistryProvider } from "@effect-atom/atom-react";

export function AtomRegistryProvider({ children }: { children: ReactNode }) {
  return <RegistryProvider>{children}</RegistryProvider>;
}
