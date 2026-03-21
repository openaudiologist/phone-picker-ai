interface SpecBadgeProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export default function SpecBadge({ label, value, icon }: SpecBadgeProps) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "0.5px solid rgba(255,255,255,0.07)",
        borderRadius: 10,
        padding: "8px 10px",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          textTransform: "uppercase",
          letterSpacing: 1,
          color: "rgba(255,255,255,0.3)",
          marginBottom: 4,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        {icon && <span style={{ opacity: 0.6, display: "flex" }}>{icon}</span>}
        {label}
      </div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: "#f1f0ff",
        }}
      >
        {value}
      </div>
    </div>
  );
}
