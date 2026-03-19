import { RegistryProvider } from "@effect/atom-react";
import { render, screen } from "@testing-library/react";
import { Cause } from "effect";
import { AsyncResult, Atom } from "effect/unstable/reactivity";
import { describe, expect, it } from "vitest";

import { UserDetail } from "@/components/user-detail";

import { ServerError, type HttpError } from "@/errors";
import type { UserAddress, UserBasic } from "@/schema/user-schema";
import { userAddressAtom, userBasicAtom } from "@/atoms/user";

type UserBasicResult = Atom.Type<ReturnType<typeof userBasicAtom>>;
type UserAddressResult = Atom.Type<ReturnType<typeof userAddressAtom>>;

function fakeUserBasic(): UserBasic {
  return {
    id: "1",
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
    company: { name: "Acme Corp", title: "Engineer" },
  };
}

function fakeUserAddress(): UserAddress {
  return {
    address: "123 Main St",
    city: "Springfield",
    state: "IL",
  };
}

function basicSuccess(): UserBasicResult {
  return AsyncResult.success<UserBasic, HttpError>(fakeUserBasic());
}

function basicFailure(message: string): UserBasicResult {
  return AsyncResult.failure<UserBasic, HttpError>(
    Cause.fail(new ServerError({ message, cause: null })),
  );
}

function addressPending(): UserAddressResult {
  return AsyncResult.initial<UserAddress, HttpError>(true);
}

function addressSuccess(): UserAddressResult {
  return AsyncResult.success<UserAddress, HttpError>(fakeUserAddress());
}

function addressFailure(message: string): UserAddressResult {
  return AsyncResult.failure<UserAddress, HttpError>(
    Cause.fail(new ServerError({ message, cause: null })),
  );
}

function renderUserDetail(options: {
  basicResult: UserBasicResult;
  addressResult: UserAddressResult;
}) {
  const basicAtom = userBasicAtom("1");
  const addressAtom = userAddressAtom("1");

  return render(
    <RegistryProvider
      initialValues={[
        Atom.initialValue(basicAtom, options.basicResult),
        Atom.initialValue(addressAtom, options.addressResult),
      ]}
    >
      <UserDetail id="1" />
    </RegistryProvider>,
  );
}

describe("UserDetail", () => {
  it("renders the user card immediately while the address is still pending", () => {
    const { container } = renderUserDetail({
      basicResult: basicSuccess(),
      addressResult: addressPending(),
    });

    expect(
      screen.getByRole("heading", { name: "Jane Doe" }),
    ).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(container.querySelector('[data-slot="skeleton"]')).not.toBeNull();
    expect(screen.queryByText("123 Main St")).not.toBeInTheDocument();
  });

  it("renders the full user detail when both atoms have succeeded", () => {
    renderUserDetail({
      basicResult: basicSuccess(),
      addressResult: addressSuccess(),
    });

    expect(
      screen.getByRole("heading", { name: "Jane Doe" }),
    ).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("123 Main St")).toBeInTheDocument();
    expect(screen.getByText("Springfield, IL")).toBeInTheDocument();
  });

  it("renders an inline error when the address request failed", () => {
    renderUserDetail({
      basicResult: basicSuccess(),
      addressResult: addressFailure("Address unavailable"),
    });

    expect(
      screen.getByRole("heading", { name: "Jane Doe" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Address unavailable")).toBeInTheDocument();
  });

  it("renders a failure card when the basic user data failed", () => {
    renderUserDetail({
      basicResult: basicFailure("User not found"),
      addressResult: addressPending(),
    });

    expect(screen.getByText("Server Error")).toBeInTheDocument();
    expect(screen.getByText("User not found")).toBeInTheDocument();
  });
});
