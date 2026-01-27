"use client";

import { useState } from "react";
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

import { useSpinDelay } from "@/hooks/use-spin-delay";
import type { User } from "@/schema/user-schema";

interface UserDeleteDialogProps {
  user: User;
  trigger: React.ReactNode;
}

export function UserDeleteDialog({ user, trigger }: UserDeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showSpinner = useSpinDelay(isDeleting, {
    delay: 0,
    minDuration: 500,
  });

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    // Clear error when dialog opens or closes
    if (!isOpen) {
      setError(null);
    }
  }

  async function handleDelete() {}

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
          <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200">
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
            {showSpinner && <Icons.spinner className="size-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
