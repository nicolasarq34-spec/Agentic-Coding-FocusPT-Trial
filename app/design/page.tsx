import type { Metadata } from "next";
import { ArrowLeft, List, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptionRowDemo } from "./option-row-demo";

export const metadata: Metadata = {
  title: "Design system · Coach Lab",
};

// Each swatch shows a token by name. Colours come from app/globals.css, so this page updates when the tokens do.
const colourGroups = [
  {
    title: "Surfaces and text",
    tokens: ["background", "card", "foreground", "muted-foreground", "border", "muted"],
  },
  {
    title: "Brand",
    tokens: ["primary", "primary-hover", "accent"],
  },
  {
    title: "State",
    tokens: ["success", "warning", "destructive"],
  },
  {
    title: "Charts",
    tokens: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
  },
];

const typeStyles = [
  { name: "display", className: "font-display text-display", sample: "Coach Lab" },
  { name: "heading-1", className: "font-display text-heading-1", sample: "Today’s workout" },
  { name: "heading-2", className: "font-display text-heading-2", sample: "Week 3, day 2" },
  { name: "body", className: "text-body", sample: "4 sets of 6 reps at 80 kg. Rest two minutes between sets." },
  { name: "body-small", className: "text-body-small", sample: "Last logged on Monday" },
  { name: "label", className: "text-label", sample: "Weight (kg)" },
  { name: "caption", className: "text-caption text-muted-foreground", sample: "Updated 2 hours ago" },
];

const spacing = [
  { name: "1", px: 4, className: "w-1" },
  { name: "2", px: 8, className: "w-2" },
  { name: "4", px: 16, className: "w-4" },
  { name: "6", px: 24, className: "w-6" },
  { name: "10", px: 40, className: "w-10" },
];

const radii = [
  { name: "sm · 12px", use: "Tiles, badges", className: "rounded-sm" },
  { name: "md · 20px", use: "Cards, rows", className: "rounded-md" },
  { name: "lg · 28px", use: "Sheets", className: "rounded-lg" },
  { name: "full", use: "Buttons, inputs", className: "rounded-full" },
];

const buttonVariants = ["default", "outline", "secondary", "ghost", "destructive", "link"] as const;
const buttonSizes = ["sm", "default", "lg"] as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 border-t border-border pt-10">
      <h2 className="font-display text-heading-2">{title}</h2>
      {children}
    </section>
  );
}

function Subheading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-label text-muted-foreground">{children}</h3>;
}

export default function DesignPage() {
  return (
    <main className="mx-auto w-full max-w-reading space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <p className="text-label text-primary">Coach Lab</p>
        <h1 className="font-display text-heading-1">Design system</h1>
        <p className="text-muted-foreground">
          The colours, type and components every screen is built from. Based on the FocusPT design system,
          reshaped dark-first after the Pillowtalk and Future Pro references.
        </p>
      </header>

      <Section title="Colour">
        {colourGroups.map((group) => (
          <div key={group.title} className="space-y-3">
            <Subheading>{group.title}</Subheading>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {group.tokens.map((token) => (
                <li key={token} className="overflow-hidden rounded-md border border-border bg-card">
                  <div className="h-16 border-b border-border" style={{ background: `var(--${token})` }} />
                  <p className="px-3 py-2 font-mono text-caption">{token}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Section>

      <Section title="Type">
        <p className="text-body-small text-muted-foreground">
          Space Grotesk for headings only. Inter for everything people read.
        </p>
        <ul className="divide-y divide-border rounded-md border border-border bg-card">
          {typeStyles.map((style) => (
            <li key={style.name} className="space-y-1 px-4 py-4">
              <p className="font-mono text-caption text-muted-foreground">{style.name}</p>
              <p className={style.className}>{style.sample}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Spacing">
        <p className="text-body-small text-muted-foreground">
          Use only these Tailwind steps (e.g. <code className="font-mono">p-4</code>,{" "}
          <code className="font-mono">gap-6</code>), so every screen has the same rhythm.
        </p>
        <ul className="space-y-2">
          {spacing.map((step) => (
            <li key={step.name} className="flex items-center gap-4">
              <span className="w-16 font-mono text-caption">{step.name}</span>
              <span className={`h-4 rounded-sm bg-primary ${step.className}`} />
              <span className="text-body-small text-muted-foreground">{step.px}px</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Corner radius">
        <div className="flex flex-wrap gap-6">
          {radii.map((radius) => (
            <div key={radius.name} className="space-y-2">
              <div className={`size-20 border border-border bg-accent ${radius.className}`} />
              <p className="font-mono text-caption">{radius.name}</p>
              <p className="text-caption text-muted-foreground">{radius.use}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Page widths">
        <p className="text-body-small text-muted-foreground">
          Clients mostly use phones, trainers mostly use laptops. Every page picks one of two widths, shown here to
          scale. Side padding grows with the screen: 16px, then 24px, then 32px.
        </p>
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="h-10 w-[53%] rounded-sm border border-dashed border-primary/60 bg-accent" />
            <p className="font-mono text-caption">max-w-reading · 640px</p>
            <p className="text-caption text-muted-foreground">Client screens, sign-up, log-in, forms</p>
          </div>
          <div className="space-y-1">
            <div className="h-10 w-full rounded-sm border border-dashed border-primary/60 bg-accent" />
            <p className="font-mono text-caption">max-w-app · 1200px</p>
            <p className="text-caption text-muted-foreground">Trainer screens: programme builder, dashboard, tables</p>
          </div>
        </div>
        <p className="text-body-small text-muted-foreground">
          Later, with the trainer pages: a bottom tab bar on phones, a left sidebar from tablet width up.
        </p>
      </Section>

      <Section title="Button">
        <div className="space-y-3">
          <Subheading>Variants</Subheading>
          <div className="flex flex-wrap items-center gap-3">
            {buttonVariants.map((variant) => (
              <Button key={variant} variant={variant}>
                {variant === "default" ? "Log in" : variant}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <Subheading>Sizes</Subheading>
          <div className="flex flex-wrap items-center gap-3">
            {buttonSizes.map((size) => (
              <Button key={size} size={size}>
                {size}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <Subheading>Icon buttons</Subheading>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="icon" variant="secondary" aria-label="Back">
              <ArrowLeft />
            </Button>
            <Button size="icon" variant="secondary" aria-label="Close">
              <X />
            </Button>
            <Button size="icon" variant="secondary" aria-label="Exercise list">
              <List />
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          <Subheading>Primary action</Subheading>
          <p className="text-body-small text-muted-foreground">
            Full width on phones, where it sits under the thumb. Sized to its label on wider screens.
          </p>
          <Button size="lg" className="w-full sm:w-auto">
            Start workout
          </Button>
        </div>
        <div className="space-y-3">
          <Subheading>Disabled</Subheading>
          <div className="flex flex-wrap items-center gap-3">
            <Button disabled>Log in</Button>
            <Button variant="outline" disabled>
              Sign up
            </Button>
          </div>
        </div>
      </Section>

      <Section title="Option row">
        <p className="text-body-small text-muted-foreground">
          A choice the person taps to select. Used for the trainer or client choice at sign-up. Try it.
        </p>
        <OptionRowDemo />
      </Section>

      <Section title="Empty state">
        <div className="rounded-md border border-dashed border-border bg-card px-6 py-10 text-center">
          <p className="font-medium">No programme assigned yet</p>
          <p className="mt-1 text-body-small text-muted-foreground">
            When your trainer assigns one, today’s workout appears here.
          </p>
        </div>
      </Section>
    </main>
  );
}
