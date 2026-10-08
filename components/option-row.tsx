import { Check } from "lucide-react";
import { cn } from "cn";

type OptionRowProps = Omit<React.ComponentProps<"input">, "type"> & {
  description?: string;
};

// A full-width choice the person taps to select, e.g. "I'm a trainer" / "I'm a client".
// Underneath it's a real radio button, hidden visually: rows that share a `name` form a group,
// so the browser handles picking one, arrow keys, screen readers and sending the choice with a form.
// The row's look follows the hidden radio (`has-checked:`), so there's no state to manage.
export function OptionRow({ description, className, children, ...props }: OptionRowProps) {
  return (
    <label
      className={cn(
        "group flex w-full cursor-pointer items-center justify-between gap-4 rounded-md border px-5 py-3 text-left transition-colors",
        "min-h-12 pointer-coarse:min-h-14",
        "border-transparent bg-card hover:bg-muted",
        "has-checked:border-primary/60 has-checked:bg-accent",
        "has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
        className,
      )}
    >
      <input type="radio" className="sr-only" {...props} />
      <span className="space-y-0.5">
        <span className="block font-medium">{children}</span>
        {description && <span className="block text-body-small text-muted-foreground">{description}</span>}
      </span>
      <Check
        aria-hidden
        className="size-5 shrink-0 text-primary opacity-0 transition-opacity group-has-checked:opacity-100"
      />
    </label>
  );
}
