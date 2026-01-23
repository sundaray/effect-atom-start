import { Cause, Match, Option } from "effect";

import type { ConfigError, GetUserError, GetUsersError } from "@/app/errors";

import { Icons } from "@/components/icons";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface UserFailureCardProps {
  cause: Cause.Cause<GetUserError | GetUsersError | ConfigError>;
}

function getErrorTitle(
  error: GetUserError | GetUsersError | ConfigError,
): string {
  return Match.value(error).pipe(
    Match.tag("ConfigError", () => "Config Error"),
    Match.tag("GetUserRequestError", () => "Request Error"),
    Match.tag("GetUserResponseError", () => "Response Error"),
    Match.tag("GetUserParseError", () => "Parse Error"),
    Match.tag("GetUsersRequestError", () => "Request Error"),
    Match.tag("GetUsersResponseError", () => "Response Error"),
    Match.tag("GetUsersParseError", () => "Parse Error"),
    Match.exhaustive,
  );
}

export function UserFailureCard({ cause }: UserFailureCardProps) {
  const failure = Cause.failureOption(cause);

  const errorTitle = failure.pipe(
    Option.map(getErrorTitle),
    Option.getOrElse(() => "Unexpected Error"),
  );

  const errorMessage = failure.pipe(
    Option.map((error) => error.message),
    Option.getOrElse(() => "An unexpected error occurred"),
  );

  return (
    <Empty className="border py-10">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icons.alert className="text-red-600 size-10" />
        </EmptyMedia>
        <EmptyTitle className="text-red-600 text-lg font-bold">
          {errorTitle}
        </EmptyTitle>
        <EmptyDescription className="text-sm">{errorMessage}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
