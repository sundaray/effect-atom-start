import { RegistryProvider } from "@effect/atom-react";
import { render, screen } from "@testing-library/react";
import { AsyncResult, Atom } from "effect/unstable/reactivity";
import { describe, expect, it, vi } from "vitest";

import { UserGrid } from "@/components/user-grid";

import { currentUsersAtom } from "@/atoms/user";
import type { HttpError } from "@/errors";
import type { User, UsersResponse } from "@/schema/user-schema";

vi.mock("@/components/user-success-card", () => ({
  UserSuccessCard: ({
    user,
  }: {
    user: Pick<User, "firstName" | "lastName">;
  }) => <div>{user.firstName} {user.lastName}</div>,
}));

function makeUser(id: string, firstName: string, lastName: string): User {
  return {
    id,
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}@example.com`,
    company: { name: "Acme Corp", title: "Engineer" },
    address: { address: "123 Main St", city: "Springfield", state: "IL" },
  };
}

function makeUsersStateAtom(usersResponse: UsersResponse): typeof currentUsersAtom {
  const result: Atom.Type<typeof currentUsersAtom> =
    AsyncResult.success<UsersResponse, HttpError>(usersResponse);

  return Atom.make(result);
}

describe("UserGrid", () => {
  it("renders the users from the injected HomePageClient atom", () => {
    const usersStateAtom = makeUsersStateAtom({
      users: [makeUser("1", "Jane", "Doe")],
      usersCount: 1,
    });

    render(
      <RegistryProvider>
        <UserGrid usersStateAtom={usersStateAtom} />
      </RegistryProvider>,
    );

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });
});
