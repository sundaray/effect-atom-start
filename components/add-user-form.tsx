"use client";

import { startTransition, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { useAtomSet } from "@effect-atom/atom-react";
import { effectTsResolver } from "@hookform/resolvers/effect-ts";
import { Cause, Exit, Option } from "effect";
import { useForm } from "react-hook-form";
import { useProgress } from "react-transition-progress";
import { toast } from "sonner";

import {
  FormErrorMessage,
  FormFieldErrorMessage,
} from "@/components/form-messages";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useSpinDelay } from "@/hooks/use-spin-delay";
import { addUserAtom, invalidateUsersAtom } from "@/atoms/users";
import {
  AddUserFormSchema,
  type AddUserFormValues,
} from "@/schema/user-schema";

export function AddUserForm() {
  const id = useId();
  const router = useRouter();
  const startProgress = useProgress();

  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddUserFormValues>({
    resolver: effectTsResolver(AddUserFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      company: { name: "", title: "" },
      address: { address: "", city: "", state: "" },
    },
  });

  const showSpinner = useSpinDelay(isSubmitting, {
    delay: 0,
    minDuration: 500,
  });

  const addUser = useAtomSet(addUserAtom, { mode: "promiseExit" });
  const invalidateUsers = useAtomSet(invalidateUsersAtom, { mode: "promise" });

  const onSubmit = async (data: AddUserFormValues) => {
    setGlobalError(null);
    const exit = await addUser(data);

    if (Exit.isSuccess(exit)) {
      await invalidateUsers(undefined);
      const user = exit.value;

      toast.success("User Added Successfully", {
        description: `${user.firstName} ${user.lastName} was added successfully.`,
      });

      startTransition(() => {
        startProgress();
        router.push("/");
      });
    } else {
      const failureOption = Cause.failureOption(exit.cause);
      const errorMessage = Option.isSome(failureOption)
        ? failureOption.value.message
        : "An unexpected error occurred";
      setGlobalError(errorMessage);
    }
  };
  return (
    <Card>
      <CardContent className="mt-4">
        <FormErrorMessage message={globalError} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor={`${id}-firstName`}>First Name</Label>
            <Input
              id={`${id}-firstName`}
              {...register("firstName")}
              aria-invalid={!!errors.firstName}
              aria-describedby={
                errors.firstName ? `${id}-firstName-error` : undefined
              }
            />
            <FormFieldErrorMessage
              id={`${id}-firstName-error`}
              message={errors.firstName?.message}
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor={`${id}-lastName`}>Last Name</Label>
            <Input
              id={`${id}-lastName`}
              {...register("lastName")}
              aria-invalid={!!errors.lastName}
              aria-describedby={
                errors.lastName ? `${id}-lastName-error` : undefined
              }
            />
            <FormFieldErrorMessage
              id={`${id}-lastName-error`}
              message={errors.lastName?.message}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor={`${id}-email`}>Email</Label>
            <Input
              id={`${id}-email`}
              type="email"
              {...register("email")}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? `${id}-email-error` : undefined}
            />
            <FormFieldErrorMessage
              id={`${id}-email-error`}
              message={errors.email?.message}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor={`${id}-companyName`}>Company Name</Label>
              <Input
                id={`${id}-companyName`}
                {...register("company.name")}
                aria-invalid={!!errors.company?.name}
                aria-describedby={
                  errors.company?.name ? `${id}-companyName-error` : undefined
                }
              />
              <FormFieldErrorMessage
                id={`${id}-companyName-error`}
                message={errors.company?.name?.message}
              />
            </div>

            {/* Job Title */}
            <div className="space-y-2">
              <Label htmlFor={`${id}-jobTitle`}>Job Title</Label>
              <Input
                id={`${id}-jobTitle`}
                {...register("company.title")}
                aria-invalid={!!errors.company?.title}
                aria-describedby={
                  errors.company?.title ? `${id}-jobTitle-error` : undefined
                }
              />
              <FormFieldErrorMessage
                id={`${id}-jobTitle-error`}
                message={errors.company?.title?.message}
              />
            </div>
          </div>

          {/* Address Info */}
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor={`${id}-address`}>Street Address</Label>
              <Input
                id={`${id}-address`}
                {...register("address.address")}
                aria-invalid={!!errors.address?.address}
              />
              <FormFieldErrorMessage
                id={`${id}-address-error`}
                message={errors.address?.address?.message}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-city`}>City</Label>
                <Input
                  id={`${id}-city`}
                  {...register("address.city")}
                  aria-invalid={!!errors.address?.city}
                />
                <FormFieldErrorMessage
                  id={`${id}-city-error`}
                  message={errors.address?.city?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${id}-state`}>State</Label>
                <Input
                  id={`${id}-state`}
                  {...register("address.state")}
                  aria-invalid={!!errors.address?.state}
                />
                <FormFieldErrorMessage
                  id={`${id}-state-error`}
                  message={errors.address?.state?.message}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {showSpinner && <Icons.spinner className="size-4 animate-spin" />}
              Add User
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
