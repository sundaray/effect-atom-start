import { Icons } from "@/components/icons";

interface FormErrorMessageProps {
  message?: string | null;
}

export function FormErrorMessage({ message }: FormErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="bg-red-50 text-red-900 border border-red-200 p-4 flex items-center gap-3 mb-6"
    >
      <Icons.alert className="size-5 shrink-0 text-red-600" />
      <p className="text-xs">{message}</p>
    </div>
  );
}

interface FormSuccessMessageProps {
  message?: string | null;
}

export function FormSuccessMessage({ message }: FormSuccessMessageProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="bg-green-50 text-green-900 border border-green-200 p-4 flex items-center gap-3 mb-6"
    >
      <Icons.checkCircle className="size-5 shrink-0 text-green-600" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

interface FormFieldErrorMessageProps {
  id: string;
  message?: string;
}

export function FormFieldErrorMessage({
  id,
  message,
}: FormFieldErrorMessageProps) {
  if (!message) return null;

  return (
    <p
      id={id}
      className="text-xs text-destructive flex items-center gap-2"
      role="alert"
    >
      {message}
    </p>
  );
}
