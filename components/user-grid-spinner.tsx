import { Spinner } from "@/components/ui/spinner";

export function UserGridSpinner() {
  return (
    <div className="bg-white border grid place-items-center size-8 mx-auto">
      <Spinner className="size-6 text-muted-foreground" />
    </div>
  );
}
