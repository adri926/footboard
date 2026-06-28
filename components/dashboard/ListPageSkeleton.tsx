import Skeleton from "@/components/Skeleton"

export default function ListPageSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="page-pad" style={{ maxWidth: 900 }}>
      <Skeleton width={110} height={9} radius={4} style={{ marginBottom: 20 }} />
      <Skeleton width={220} height={30} radius={6} style={{ marginBottom: 28 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} height={72} radius={12} />
        ))}
      </div>
    </div>
  )
}
