"use client";

import { ReactNode } from "react";
import {
  ProgressBarProvider as NextProgressBarProvider,
  ProgressBar,
} from "react-transition-progress";

export function ProgressBarProvider({ children }: { children: ReactNode }) {
  return (
    <NextProgressBarProvider>
      <ProgressBar className="fixed top-0 left-0 z-50 h-1 w-full bg-blue-600 shadow-md shadow-blue-600/20" />
      {children}
    </NextProgressBarProvider>
  );
}
