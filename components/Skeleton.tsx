interface Props {
  width?:  number | string
  height?: number | string
  radius?: number
  style?:  React.CSSProperties
}

export default function Skeleton({ width = "100%", height = 16, radius, style }: Props) {
  return (
    <div
      className="skeleton-box"
      style={{ width, height, ...(radius !== undefined ? { borderRadius: radius } : {}), ...style }}
    />
  )
}
