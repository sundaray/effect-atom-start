import { Icons } from "@/components/icons";
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
}

export function FailureCard({ title, message }: FailureCardProps) {
  return (
    <Empty className="border py-10">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icons.alert className="text-red-600 size-10" />
        </EmptyMedia>
        <EmptyTitle className="text-red-600 text-lg font-bold">
          {title}
        </EmptyTitle>
        <EmptyDescription className="text-sm">{message}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
