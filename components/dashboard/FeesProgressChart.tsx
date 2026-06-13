const W = 100
const H = 10

interface Props {
  totalDue:  number
  totalPaid: number
}

export default function FeesProgressChart({ totalDue, totalPaid }: Props) {
  const ratio = totalDue > 0 ? Math.min(totalPaid / totalDue, 1) : 0
  const width = ratio * W

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width={W} height={H} rx="2" fill="rgba(255,255,255,0.04)" />
      {width > 0 && (
        <rect x="0" y="0" width={width} height={H} rx="2" fill="#7A9A82" />
      )}
    </svg>
  )
}
