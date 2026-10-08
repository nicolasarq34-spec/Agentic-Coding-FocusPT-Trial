import { Check } from "lucide-react";
import { cn } from "cn";

type OptionRowProps = React.ComponentProps<"button"> & {
  selected: boolean;
  description?: string;
};

// A full-width choice the person taps to select, e.g. "I'm a trainer" / "I'm a client".
// It holds no state: the page decides what is selected and passes `selected` in.
export function OptionRow({ selected, description, className, children, ...props }: OptionRowProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center justify-between gap-4 rounded-md border px-5 py-3 text-left transition-colors outline-none",
        "min-h-12 pointer-coarse:min-h-14",
        "focus-visible:ring-3 focus-visible:ring-ring/50",
        selected
          ? "border-primary/60 bg-accent"
          : "border-transparent bg-card hover:bg-muted",
        className,
      )}
      {...props}
    >
      <span className="space-y-0.5">
        <span className="block font-medium">{children}</span>
        {description && <span className="block text-body-small text-muted-foreground">{description}</span>}
      </span>
      <Check
        aria-hidden
        className={cn("size-5 shrink-0 text-primary transition-opacity", selected ? "opacity-100" : "opacity-0")}
      />
    </button>
  );
}
