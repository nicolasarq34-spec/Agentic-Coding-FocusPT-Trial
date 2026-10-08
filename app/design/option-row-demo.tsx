"use client";

import { useState } from "react";
import { OptionRow } from "@/components/option-row";

const roles = [
  { id: "trainer", label: "I'm a trainer", description: "Build programmes and follow your clients" },
  { id: "client", label: "I'm a client", description: "See today's workout and log your sets" },
];

// Interactive example for /design: one choice at a time, like the role picker at sign-up.
export function OptionRowDemo() {
  const [role, setRole] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {roles.map((option) => (
        <OptionRow
          key={option.id}
          selected={role === option.id}
          description={option.description}
          onClick={() => setRole(option.id)}
        >
          {option.label}
        </OptionRow>
      ))}
    </div>
  );
}
