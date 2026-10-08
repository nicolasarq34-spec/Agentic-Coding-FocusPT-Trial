import { OptionRow } from "@/components/option-row";

const roles = [
  { id: "trainer", label: "I'm a trainer", description: "Build programmes and follow your clients" },
  { id: "client", label: "I'm a client", description: "See today's workout and log your sets" },
];

// Example for /design: one choice at a time, like the role picker at sign-up.
// No useState needed: the shared `name` makes the browser keep one row selected.
export function OptionRowDemo() {
  return (
    <fieldset className="space-y-2">
      <legend className="sr-only">Who are you?</legend>
      {roles.map((option) => (
        <OptionRow key={option.id} name="demo-role" value={option.id} description={option.description}>
          {option.label}
        </OptionRow>
      ))}
    </fieldset>
  );
}
