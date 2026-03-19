import { RegistryProvider, useAtomValue } from "@effect/atom-react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Atom } from "effect/unstable/reactivity";
import { beforeEach, describe, expect, it } from "vitest";

import { UserSearchBar } from "@/components/user-search-bar";

import { pageAtom } from "@/atoms/page";
import { searchQueryAtom } from "@/atoms/search";

describe("UserSearchBar", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
  });

  function renderSearchBar() {
    return render(
      <RegistryProvider>
        <UserSearchBar
          pageStateAtom={pageAtom}
          searchStateAtom={searchQueryAtom}
        />
      </RegistryProvider>,
    );
  }

  function PageValue({ pageStateAtom }: { pageStateAtom: typeof pageAtom }) {
    const page = useAtomValue(pageStateAtom);

    return <div>Page value: {page}</div>;
  }

  it("renders with an empty search input", () => {
    renderSearchBar();

    expect(screen.getByRole("searchbox")).toHaveValue("");
    expect(
      screen.queryByRole("button", { name: /esc/i }),
    ).not.toBeInTheDocument();
  });

  it("updates the URL search params when the user types", async () => {
    const user = userEvent.setup();
    renderSearchBar();

    await user.type(screen.getByRole("searchbox"), "hello");

    expect(screen.getByRole("searchbox")).toHaveValue("hello");

    await waitFor(() => {
      const params = new URLSearchParams(window.location.search);
      expect(params.get("q")).toBe("hello");
      expect(params.get("page")).toBeNull();
    });
  });

  it("clears the query and removes URL params when the ESC button is clicked", async () => {
    const user = userEvent.setup();
    window.history.replaceState({}, "", "/?page=3");
    renderSearchBar();

    await user.type(screen.getByRole("searchbox"), "test");

    await waitFor(() => {
      const params = new URLSearchParams(window.location.search);
      expect(params.get("q")).toBe("test");
      expect(params.get("page")).toBeNull();
    });

    await user.click(screen.getByRole("button", { name: /esc/i }));

    expect(screen.getByRole("searchbox")).toHaveValue("");

    await waitFor(() => {
      const params = new URLSearchParams(window.location.search);
      expect(params.get("q")).toBeNull();
      expect(params.get("page")).toBeNull();
    });
  });

  it("clears the query when Escape key is pressed", async () => {
    const user = userEvent.setup();
    renderSearchBar();

    await user.type(screen.getByRole("searchbox"), "hello");
    await user.keyboard("{Escape}");

    expect(screen.getByRole("searchbox")).toHaveValue("");

    await waitFor(() => {
      const params = new URLSearchParams(window.location.search);
      expect(params.get("q")).toBeNull();
    });
  });

  it("uses the atoms injected by HomePageClient", async () => {
    const user = userEvent.setup();
    const pageStateAtom: typeof pageAtom = Atom.make(3);
    const searchStateAtom: typeof searchQueryAtom = Atom.make("server query");

    render(
      <RegistryProvider>
        <UserSearchBar
          pageStateAtom={pageStateAtom}
          searchStateAtom={searchStateAtom}
        />
        <PageValue pageStateAtom={pageStateAtom} />
      </RegistryProvider>,
    );

    expect(screen.getByRole("searchbox")).toHaveValue("server query");
    expect(screen.getByText("Page value: 3")).toBeInTheDocument();

    await user.type(screen.getByRole("searchbox"), " updated");

    await waitFor(() => {
      expect(screen.getByRole("searchbox")).toHaveValue("server query updated");
      expect(screen.getByText("Page value: 1")).toBeInTheDocument();
    });
  });
});
