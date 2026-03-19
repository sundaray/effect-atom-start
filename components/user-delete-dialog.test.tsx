import { RegistryProvider } from "@effect/atom-react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Effect, Layer, Stream } from "effect";
import { Atom } from "effect/unstable/reactivity";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { UserDeleteDialog } from "@/components/user-delete-dialog";

import { atomRuntime } from "@/atom-runtime";
import { ServerError, type HttpError } from "@/errors";
import type { User } from "@/schema/user-schema";
import { UserService } from "@/services/user-service";

const { toast } = vi.hoisted(() => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("sonner", () => ({ toast }));

function fakeUser(id: string, firstName: string, lastName: string): User {
  return {
    id,
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}@example.com`,
    company: { name: "Acme Corp", title: "Engineer" },
    address: { address: "123 Main St", city: "Springfield", state: "IL" },
  };
}

describe("UserDeleteDialog", () => {
  const jane = fakeUser("1", "Jane", "Doe");

  beforeEach(() => {
    toast.success.mockClear();
    toast.error.mockClear();
    window.history.replaceState({}, "", "/");
  });

  function renderDialog(deleteResult: Effect.Effect<void, HttpError>) {
    const testLayer = Layer.succeed(UserService, {
      getUsers: () => Effect.die("not implemented"),
      getUser: () => Effect.die("not implemented"),
      deleteUser: () => deleteResult,
      addUser: () => Effect.die("not implemented"),
      getUsersStream: () => Stream.die("not implemented"),
      getUserBasic: () => Effect.die("not implemented"),
      getUserAddress: () => Effect.die("not implemented"),
    });

    return render(
      <RegistryProvider
        initialValues={[Atom.initialValue(atomRuntime.layer, testLayer)]}
      >
        <UserDeleteDialog
          user={jane}
          trigger={<button type="button">Open delete dialog</button>}
        />
      </RegistryProvider>,
    );
  }

  it("opens the confirmation dialog from the provided trigger", async () => {
    const user = userEvent.setup();

    renderDialog(Effect.void);

    await user.click(
      screen.getByRole("button", { name: /open delete dialog/i }),
    );

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("Delete Jane Doe?")).toBeInTheDocument();
    expect(
      within(dialog).getByText("Are you sure? This action cannot be undone."),
    ).toBeInTheDocument();
  });

  it("shows a success toast when delete succeeds", async () => {
    const user = userEvent.setup();

    renderDialog(Effect.void.pipe(Effect.delay("50 millis")));

    await user.click(
      screen.getByRole("button", { name: /open delete dialog/i }),
    );
    const dialog = await screen.findByRole("dialog");

    await user.click(within(dialog).getByRole("button", { name: /^delete$/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("User deleted successfully", {
        description: "Jane Doe has been deleted.",
      });
    });
  });

  it("shows an error toast when delete fails", async () => {
    const user = userEvent.setup();

    renderDialog(
      Effect.fail(
        new ServerError({ message: "Delete failed", cause: null }),
      ).pipe(Effect.delay("50 millis")),
    );

    await user.click(
      screen.getByRole("button", { name: /open delete dialog/i }),
    );
    const dialog = await screen.findByRole("dialog");

    await user.click(within(dialog).getByRole("button", { name: /^delete$/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to delete Jane Doe", {
        description: "Delete failed",
      });
    });
  });
});
