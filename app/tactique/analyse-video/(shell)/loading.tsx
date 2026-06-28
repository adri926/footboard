import Skeleton from "@/components/Skeleton"

export default function Loading() {
  return (
    <main style={{ background: "var(--bg)", minHeight: "calc(100vh - 56px)" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px 64px" }}>
        <Skeleton width={90} height={9} radius={4} style={{ marginBottom: 32 }} />
        <Skeleton width={260} height={44} radius={6} style={{ marginBottom: 32 }} />
        <Skeleton height={180} radius={14} style={{ marginBottom: 32 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height={52} radius={10} />
          ))}
        </div>
      </div>
    </main>
  )
}
