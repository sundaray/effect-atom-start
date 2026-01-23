import { Config } from "effect";

export const apiBaseUrlConfig = Config.string("NEXT_PUBLIC_API_BASE_URL").pipe(
  Config.withDefault("http://localhost:3001"),
);
