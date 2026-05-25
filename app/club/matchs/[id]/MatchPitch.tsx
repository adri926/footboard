"use client"

import { useState, useRef, useTransition } from "react"
import { motion, useMotionValue } from "framer-motion"
import Pitch from "@/components/pitch/Pitch"
import { saveLineup } from "../actions"
import { SLOTS, FORMATIONS_LIST, type LineupData } from "@/lib/lineup-slots"

interface Player {
  id: string; first_name: string; last_name: string
  position: string; number?: number; status?: string
}

interface Props {
  matchId: string
  match:   any
  players: Player[]
}

const POS_COLORS = {
  GK:  { bg:"#7c3aed", border:"#a78bfa", glow:"rgba(124,58,237,0.65)" },
  DEF: { bg:"#16a34a", border:"#4ade80", glow:"rgba(22,163,74,0.65)"  },
  MIL: { bg:"#2563eb", border:"#60a5fa", glow:"rgba(37,99,235,0.65)"  },
  ATT: { bg:"#dc2626", border:"#f87171", glow:"rgba(220,38,38,0.65)"  },
}

export default function MatchPitch({ matchId, match, players }: Props) {
  // Parse l'ancien format (Record<slotId, playerId>) ou le nouveau (LineupData)
  const initial: LineupData = (() => {
    const raw = match.lineup
    if (!raw) return { slots: {} }
    if (raw.slots) return raw as LineupData
    return { slots: raw as Record<string, string> }
  })()

  const [formation, setFormation] = useState<string>(match.formation ?? "4-3-3")
  const [lineup,    setLineup]    = useState<LineupData>(initial)
  const [picker,    setPicker]    = useState<string | null>(null)  // slotId en cours de sélection
  const [pending,   start]        = useTransition()
  const [saved,     setSaved]     = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const slots         = SLOTS[formation]
  const assignedIds   = new Set(Object.values(lineup.slots))
  const available     = players.filter(p =>
    p.status !== "injured" && p.status !== "suspended" && !assignedIds.has(p.id)
  )
  const indisponibles = players.filter(p => p.status === "injured" || p.status === "suspended")
  const filled        = Object.keys(lineup.slots).filter(k => lineup.slots[k]).length

  function changeFormation(newF: string) {
    if (filled > 0 && !confirm("Changer de formation va réinitialiser la composition. Continuer ?")) return
    setFormation(newF)
    setLineup({ slots: {} })
  }

  function assignPlayer(slotId: string, playerId: string) {
    setLineup(prev => {
      const newSlots = { ...prev.slots }
      // Si le joueur est déjà dans un autre slot, on le retire
      Object.keys(newSlots).forEach(k => { if (newSlots[k] === playerId) delete newSlots[k] })
      newSlots[slotId] = playerId
      return { ...prev, slots: newSlots }
    })
    setPicker(null)
  }

  function removeFromSlot(slotId: string) {
    setLineup(prev => {
      const next = { ...prev.slots }
      delete next[slotId]
      return { ...prev, slots: next }
    })
  }

  function updatePosition(playerId: string, x: number, y: number) {
    setLineup(prev => ({
      ...prev,
      positions: { ...(prev.positions ?? {}), [playerId]: { x, y } },
    }))
  }

  function handleSave() {
    start(async () => {
      await saveLineup(matchId, lineup as any, formation)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    })
  }

  function resetPositions() {
    if (!confirm("Réinitialiser les positions par défaut de la formation ?")) return
    setLineup(prev => ({ ...prev, positions: {} }))
  }

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6">

      {/* TERRAIN */}
      <div className="flex flex-col items-center gap-3">
        {/* Header */}
        <div className="w-full flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <select value={formation} onChange={e => changeFormation(e.target.value)}
              className="px-3 py-2 rounded-xl text-white text-sm cursor-pointer focus:outline-none font-semibold"
              style={{ backgroundColor:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.15)" }}>
              {FORMATIONS_LIST.map(f => <option key={f} value={f} style={{ backgroundColor:"#111" }}>{f}</option>)}
            </select>
            <div>
              <p className="text-2xl font-black text-white leading-none">{filled}/11</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">postes</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={resetPositions}
              className="text-xs px-3 py-1.5 rounded-lg text-gray-400 hover:text-white transition"
              style={{ border:"1px solid rgba(255,255,255,0.1)" }}>
              ↺ Reset positions
            </button>
            <button onClick={handleSave} disabled={pending}
              className="px-4 py-1.5 rounded-lg text-sm font-bold transition disabled:opacity-50"
              style={{ backgroundColor: saved ? "#4ade80" : "white", color: saved ? "white" : "black" }}>
              {saved ? "✓ Enregistré" : pending ? "..." : "💾 Enregistrer"}
            </button>
          </div>
        </div>

        {/* Pitch */}
        <div ref={containerRef} className="relative w-full max-w-[420px] overflow-hidden rounded-2xl"
          style={{ aspectRatio: "600 / 900", boxShadow:"0 0 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)" }}>
          <Pitch />
          {slots.map(slot => {
            const playerId = lineup.slots[slot.id]
            const player = playerId ? players.find(p => p.id === playerId) : null
            const customPos = playerId ? lineup.positions?.[playerId] : null
            const x = customPos?.x ?? slot.x
            const y = customPos?.y ?? slot.y

            if (player) {
              return (
                <DraggableToken
                  key={slot.id}
                  player={player}
                  x={x} y={y}
                  containerRef={containerRef}
                  onMove={(nx, ny) => updatePosition(player.id, nx, ny)}
                  onRemove={() => removeFromSlot(slot.id)}
                />
              )
            }
            return (
              <EmptySlot key={slot.id} slot={slot}
                onClick={() => setPicker(picker === slot.id ? null : slot.id)}
                isPicking={picker === slot.id} />
            )
          })}
        </div>

        {/* Légende */}
        <div className="flex gap-3 text-[10px] text-gray-500">
          <span><span style={{ color:"#a78bfa" }}>●</span> GK</span>
          <span><span style={{ color:"#4ade80" }}>●</span> DEF</span>
          <span><span style={{ color:"#60a5fa" }}>●</span> MIL</span>
          <span><span style={{ color:"#f87171" }}>●</span> ATT</span>
        </div>
      </div>

      {/* PANEL DROIT — picker actif OU joueurs dispo */}
      <div className="flex flex-col gap-4">
        {picker ? (
          <PickerPanel
            slot={slots.find(s => s.id === picker)!}
            available={available}
            onPick={pid => assignPlayer(picker, pid)}
            onClose={() => setPicker(null)}
          />
        ) : (
          <AvailablePanel available={available} indisponibles={indisponibles} />
        )}
      </div>
    </div>
  )
}

// ─── EMPTY SLOT ───────────────────────────────────────────────

function EmptySlot({ slot, onClick, isPicking }: { slot: any; onClick: () => void; isPicking: boolean }) {
  const c = POS_COLORS[slot.pos as keyof typeof POS_COLORS]
  return (
    <button onClick={onClick}
      className="absolute flex items-center justify-center transition"
      style={{
        left: `${slot.x}%`, top: `${slot.y}%`,
        marginLeft: -22, marginTop: -22,
        width: 44, height: 44,
        borderRadius: "50%",
        backgroundColor: isPicking ? c.bg + "cc" : "transparent",
        border: `2px dashed ${isPicking ? c.border : c.border + "88"}`,
        color: isPicking ? "white" : c.border,
        fontSize: 9,
        fontWeight: 700,
        cursor: "pointer",
        zIndex: 5,
        boxShadow: isPicking ? `0 0 16px ${c.glow}` : "none",
      }}>
      {isPicking ? "?" : slot.label}
    </button>
  )
}

// ─── DRAGGABLE TOKEN ──────────────────────────────────────────

function DraggableToken({ player, x, y, containerRef, onMove, onRemove }: {
  player: Player; x: number; y: number
  containerRef: React.RefObject<HTMLDivElement | null>
  onMove: (x: number, y: number) => void
  onRemove: () => void
}) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const c  = POS_COLORS[player.position as keyof typeof POS_COLORS]
  const label = player.number?.toString() ?? player.last_name.slice(0,2).toUpperCase()

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      style={{
        x: mx, y: my,
        position: "absolute",
        left: `${x}%`, top: `${y}%`,
        marginLeft: -22, marginTop: -22,
        width: 44, height: 44,
        borderRadius: "50%",
        backgroundColor: c.bg,
        border: `2.5px solid ${c.border}`,
        boxShadow: `0 0 18px ${c.glow}, 0 0 6px ${c.glow}`,
        display:"flex", alignItems:"center", justifyContent:"center",
        color: "white",
        fontSize: 13,
        fontWeight: "900",
        cursor: "grab",
        userSelect: "none",
        zIndex: 10,
        textShadow: "0 1px 2px rgba(0,0,0,0.8)",
        transition: "left 0.3s ease, top 0.3s ease",
      }}
      whileHover={{ scale: 1.15 }}
      whileDrag={{ scale: 1.25, zIndex: 50 }}
      onDragEnd={(_, info) => {
        const container = containerRef.current
        if (!container) return
        const rect = container.getBoundingClientRect()
        const newX = Math.max(3, Math.min(97, ((info.point.x - rect.left) / rect.width) * 100))
        const newY = Math.max(3, Math.min(97, ((info.point.y - rect.top) / rect.height) * 100))
        mx.set(0); my.set(0)
        onMove(newX, newY)
      }}
      onContextMenu={e => { e.preventDefault(); if (confirm(`Retirer ${player.first_name} ${player.last_name} ?`)) onRemove() }}
      title={`${player.first_name} ${player.last_name} (clic droit pour retirer)`}>
      {label}
    </motion.div>
  )
}

// ─── PANEL DROIT — Picker ─────────────────────────────────────

function PickerPanel({ slot, available, onPick, onClose }: {
  slot: any; available: Player[]
  onPick: (id: string) => void; onClose: () => void
}) {
  const c = POS_COLORS[slot.pos as keyof typeof POS_COLORS]
  const matching = available.filter(p => p.position === slot.pos)
  const others   = available.filter(p => p.position !== slot.pos)

  return (
    <div className="p-4 rounded-2xl"
      style={{ backgroundColor:"rgba(255,255,255,0.05)", border:`2px solid ${c.border}40` }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-widest" style={{ color: c.border }}>Poste à pourvoir</p>
          <p className="text-lg font-black text-white">{slot.label}</p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white text-lg">✕</button>
      </div>

      {matching.length > 0 && (
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Joueurs au poste</p>
          <div className="flex flex-col gap-1">
            {matching.map(p => <PlayerPickRow key={p.id} player={p} onPick={() => onPick(p.id)} />)}
          </div>
        </div>
      )}

      {others.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Autres postes</p>
          <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
            {others.map(p => <PlayerPickRow key={p.id} player={p} onPick={() => onPick(p.id)} dimmed />)}
          </div>
        </div>
      )}

      {available.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">Aucun joueur disponible</p>
      )}
    </div>
  )
}

function PlayerPickRow({ player, onPick, dimmed }: { player: Player; onPick: () => void; dimmed?: boolean }) {
  const c = POS_COLORS[player.position as keyof typeof POS_COLORS]
  return (
    <button onClick={onPick}
      className="flex items-center gap-2 p-2 rounded-lg transition hover:bg-white/8 text-left"
      style={{ backgroundColor:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", opacity: dimmed ? 0.6 : 1 }}>
      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0"
        style={{ backgroundColor: c.bg + "30", color: c.border }}>
        {player.position}
      </span>
      <span className="flex-1 text-sm font-semibold text-white">
        {player.first_name} {player.last_name}
      </span>
      {player.number && <span className="text-xs text-gray-500">#{player.number}</span>}
    </button>
  )
}

// ─── PANEL DROIT — Joueurs dispo ──────────────────────────────

function AvailablePanel({ available, indisponibles }: { available: Player[]; indisponibles: Player[] }) {
  return (
    <>
      <div>
        <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
          Disponibles ({available.length})
        </p>
        {available.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6 rounded-xl"
            style={{ backgroundColor:"rgba(255,255,255,0.03)" }}>
            Tous les joueurs disponibles sont alignés
          </p>
        ) : (
          <div className="flex flex-col gap-1 max-h-96 overflow-y-auto">
            {available.map(p => {
              const c = POS_COLORS[p.position as keyof typeof POS_COLORS]
              return (
                <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg"
                  style={{ backgroundColor:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: c.bg + "30", color: c.border }}>
                    {p.position}
                  </span>
                  <span className="flex-1 text-sm text-white">{p.first_name} {p.last_name}</span>
                  {p.number && <span className="text-xs text-gray-500">#{p.number}</span>}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {indisponibles.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
            Indisponibles ({indisponibles.length})
          </p>
          <div className="flex flex-col gap-1">
            {indisponibles.map(p => (
              <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg opacity-50"
                style={{ backgroundColor:"rgba(255,255,255,0.02)" }}>
                <span className="flex-1 text-xs text-gray-400">{p.first_name} {p.last_name}</span>
                <span className="text-[10px]" style={{ color: p.status === "injured" ? "#f87171" : "#fbbf24" }}>
                  {p.status === "injured" ? "Blessé" : "Suspendu"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-[11px] text-gray-500 mt-2">
        💡 Clique sur un poste vide pour assigner un joueur. Glisse un jeton pour ajuster sa position. Clic-droit sur un jeton pour le retirer.
      </p>
    </>
  )
}
