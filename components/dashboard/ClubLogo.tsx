interface Props {
  src?:  string | null
  name:  string
  size?: number
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase())
    .join("")
}

export default function ClubLogo({ src, name, size = 28 }: Props) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        style={{
          width: size, height: size, borderRadius: 6,
          objectFit: "contain", flexShrink: 0,
          backgroundColor: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(122,154,130,0.1)",
        }}
      />
    )
  }

  return (
    <span style={{
      width: size, height: size, borderRadius: 6, flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      backgroundColor: "rgba(122,154,130,0.08)",
      border: "1px solid rgba(122,154,130,0.15)",
      fontFamily: "var(--font-mono), monospace", fontWeight: 700,
      fontSize: Math.max(8, Math.round(size * 0.36)),
      letterSpacing: "0.04em",
      color: "rgba(122,154,130,0.5)",
    }}>
      {initials(name) || "—"}
    </span>
  )
}
