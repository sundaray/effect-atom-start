import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const errorTitles: Record<string, string> = {
  ClientError: "Client Error",
  ServerError: "Server Error",
  ParseError: "Parse Error",
  ConfigError: "Configuration Error",
};

interface ErrorInfo {
  title: string;
  message: string;
}

export function getErrorInfo(error: unknown): ErrorInfo {
  const tag =
    error !== null &&
    typeof error === "object" &&
    "_tag" in error &&
    typeof error._tag === "string"
      ? error._tag
      : "Error";

  const title = errorTitles[tag] ?? "Something went wrong";
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred";

  return { title, message };
}
