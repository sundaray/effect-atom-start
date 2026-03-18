"use client";

import type { FallbackProps } from "react-error-boundary";

import { FailureCard } from "@/components/failure-card";

import { getErrorInfo } from "@/lib/utils";

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const { title, message } = getErrorInfo(error);

  return (
    <FailureCard title={title} message={message} onRetry={resetErrorBoundary} />
  );
}
