import { Label } from "@/components/ui/label";

// A labelled form field with an optional hint and error, shared by the sign-up and log-in forms.
export function Field({
  label,
  name,
  error,
  hint,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      {children}
      {hint && !error && (
        <p id={`${name}-hint`} className="text-body-small text-muted-foreground">
          {hint}
        </p>
      )}
      <FieldError id={`${name}-error`} message={error} />
    </div>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-body-small text-destructive">
      {message}
    </p>
  );
}

// A problem with the whole form, not one field (e.g. "Something went wrong on our side").
export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-sm bg-destructive/10 px-4 py-3 text-body-small text-destructive">
      {message}
    </p>
  );
}

// Links an input to its hint and error, so screen readers read them with the field.
export function fieldAria(name: string, error: string | undefined, hasHint = false) {
  const describedBy = [hasHint && `${name}-hint`, error && `${name}-error`].filter(Boolean).join(" ");
  return { "aria-invalid": error ? true : undefined, "aria-describedby": describedBy || undefined };
}
