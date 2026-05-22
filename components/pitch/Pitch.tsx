const S = "rgba(255,255,255,0.75)"
const SW = 2

export default function Pitch() {
  return (
    <svg viewBox="0 0 600 900" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* fond noir mat */}
      <rect width="600" height="900" fill="#0a0a0a" />

      {/* surface */}
      <rect x="30" y="30" width="540" height="840" fill="#0d1f0e" />

      {/* bandes herbe alternées */}
      {Array.from({ length: 14 }).map((_, i) => (
        i % 2 === 0 ? null :
        <rect key={i} x="30" y={30 + i * 60} width="540" height="60" fill="#0f2310" />
      ))}

      {/* délimitations */}
      <rect x="30" y="30" width="540" height="840" fill="none" stroke={S} strokeWidth={SW} />

      {/* ligne médiane */}
      <line x1="30" y1="450" x2="570" y2="450" stroke={S} strokeWidth={SW} />

      {/* cercle central */}
      <circle cx="300" cy="450" r="70" fill="none" stroke={S} strokeWidth={SW} />
      <circle cx="300" cy="450" r="4" fill={S} />

      {/* surface de réparation haut */}
      <rect x="140" y="30" width="320" height="132" fill="none" stroke={S} strokeWidth={SW} />
      {/* surface de but haut */}
      <rect x="228" y="30" width="144" height="44" fill="none" stroke={S} strokeWidth={SW} />

      {/* surface de réparation bas */}
      <rect x="140" y="738" width="320" height="132" fill="none" stroke={S} strokeWidth={SW} />
      {/* surface de but bas */}
      <rect x="228" y="826" width="144" height="44" fill="none" stroke={S} strokeWidth={SW} />

      {/* points de penalty */}
      <circle cx="300" cy="118" r="4" fill={S} />
      <circle cx="300" cy="782" r="4" fill={S} />

      {/* arcs de penalty */}
      <path d="M 246 162 A 70 70 0 0 0 354 162" fill="none" stroke={S} strokeWidth={SW} />
      <path d="M 246 738 A 70 70 0 0 1 354 738" fill="none" stroke={S} strokeWidth={SW} />

      {/* buts */}
      <rect x="271" y="18" width="58" height="12" fill="none" stroke={S} strokeWidth={SW} />
      <rect x="271" y="870" width="58" height="12" fill="none" stroke={S} strokeWidth={SW} />

      {/* arcs de coin */}
      <path d="M 30 42 A 12 12 0 0 1 42 30" fill="none" stroke={S} strokeWidth={SW} />
      <path d="M 558 30 A 12 12 0 0 1 570 42" fill="none" stroke={S} strokeWidth={SW} />
      <path d="M 570 858 A 12 12 0 0 1 558 870" fill="none" stroke={S} strokeWidth={SW} />
      <path d="M 42 870 A 12 12 0 0 1 30 858" fill="none" stroke={S} strokeWidth={SW} />
    </svg>
  )
}
