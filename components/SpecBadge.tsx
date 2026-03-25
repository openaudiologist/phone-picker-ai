interface SpecBadgeProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export default function SpecBadge({ label, value, icon }: SpecBadgeProps) {
  return (
    <div className="rounded-2xl border border-border/70 bg-secondary/40 p-3">
      <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {icon ? <span className="flex opacity-70">{icon}</span> : null}
        {label}
      </div>
      <div className="text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}
