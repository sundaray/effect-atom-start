import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface FailureCardProps {
  title: string;
  message: string;
  onRetry?: () => void;
}

export function FailureCard({ title, message, onRetry }: FailureCardProps) {
  return (
    <Empty className="border py-10">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icons.alert className="size-8 text-red-600" />
        </EmptyMedia>
        <EmptyTitle className="text-lg font-bold text-red-600">
          {title}
        </EmptyTitle>
        <EmptyDescription className="text-sm">{message}</EmptyDescription>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="mt-4">
            Try again
          </Button>
        )}
      </EmptyHeader>
    </Empty>
  );
}
