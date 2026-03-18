"use client";

import { useState } from "react";
import { useAtomSet } from "@effect/atom-react";
import { Cause, Exit, Option } from "effect";
import { toast } from "sonner";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { optimisticDeleteUserAtom } from "@/atoms/user";
import type { User } from "@/schema/user-schema";

interface UserDeleteDialogProps {
  user: User;
  trigger: React.ReactNode;
}

export function UserDeleteDialog({ user, trigger }: UserDeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUser = useAtomSet(optimisticDeleteUserAtom, {
    mode: "promiseExit",
  });

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (!isOpen) {
      setError(null);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    setError(null);

    // Close dialog immediately — optimistic update happens at atom level
    setOpen(false);

    const exit = await deleteUser(user.id);

    setIsDeleting(false);

    if (Exit.isSuccess(exit)) {
      setOpen(false);
      toast.success("User deleted successfully", {
        description: `${user.firstName} ${user.lastName} has been deleted.`,
      });
    } else {
      const failureOption = Cause.findErrorOption(exit.cause);
      const errorMessage = Option.isSome(failureOption)
        ? failureOption.value.message
        : "An unexpected error occurred";
      setError(errorMessage);
      toast.error(`Failed to delete ${user.firstName} ${user.lastName}`, {
        description: errorMessage,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-110">
        <DialogHeader>
          <DialogTitle>
            Delete {user.firstName} {user.lastName}?
          </DialogTitle>
          <DialogDescription>
            Are you sure? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-2 border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            <Icons.alert className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isDeleting}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting && <Icons.spinner className="size-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
