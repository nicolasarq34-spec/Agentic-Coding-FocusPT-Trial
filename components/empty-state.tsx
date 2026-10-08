// What a section shows before there's anything in it, e.g. "No clients yet".
export function EmptyState({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-border bg-card px-6 py-10 text-center">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-body-small text-muted-foreground">{children}</p>
    </div>
  );
}
