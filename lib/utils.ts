import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const errorTitles: Record<string, string> = {
  GetUsersRequestError: "Connection Failed",
  GetUsersResponseError: "Server Error",
  GetUsersParseError: "Data Error",
  ConfigError: "Configuration Error",
};

interface ErrorInfo {
  title: string;
  message: string;
}

export function getErrorInfo(error: unknown): ErrorInfo {
  const errorName = error instanceof Error ? error.name : "Error";
  const title = errorTitles[errorName] ?? "Something went wrong";
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred";

  return { title, message };
}
