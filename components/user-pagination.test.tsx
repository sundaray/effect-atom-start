import { RegistryProvider, useAtomValue } from "@effect/atom-react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AsyncResult, Atom } from "effect/unstable/reactivity";
import { describe, expect, it } from "vitest";

import { UserPagination } from "@/components/user-pagination";

import { currentUsersAtom } from "@/atoms/user";
import { pageAtom } from "@/atoms/page";
import type { HttpError } from "@/errors";
import type { UsersResponse } from "@/schema/user-schema";

function PageValue({ pageStateAtom }: { pageStateAtom: typeof pageAtom }) {
  const page = useAtomValue(pageStateAtom);

  return <div>Page value: {page}</div>;
}

function makeUsersStateAtom(usersResponse: UsersResponse): typeof currentUsersAtom {
  const result: Atom.Type<typeof currentUsersAtom> =
    AsyncResult.success<UsersResponse, HttpError>(usersResponse);

  return Atom.make(result);
}

describe("UserPagination", () => {
  it("uses the page and users atoms injected by HomePageClient", async () => {
    const user = userEvent.setup();
    const pageStateAtom: typeof pageAtom = Atom.make(2);
    const usersStateAtom = makeUsersStateAtom({
      users: [],
      usersCount: 9,
    });

    render(
      <RegistryProvider>
        <UserPagination
          pageStateAtom={pageStateAtom}
          usersStateAtom={usersStateAtom}
        />
        <PageValue pageStateAtom={pageStateAtom} />
      </RegistryProvider>,
    );

    expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByText("Page 3 of 3")).toBeInTheDocument();
      expect(screen.getByText("Page value: 3")).toBeInTheDocument();
    });
  });
});
