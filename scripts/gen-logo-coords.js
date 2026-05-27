/**
 * Génère les coordonnées de 11 points par lettre ("F" et "B") à partir du
 * contour du glyphe Impact, dans le repère du terrain (0-100% × 0-100%).
 *
 * Usage : node scripts/gen-logo-coords.js
 */

const opentype = require('opentype.js')
const fs       = require('fs')

const FONT_PATH = '/System/Library/Fonts/Supplemental/Impact.ttf'
const PITCH_W   = 600  // SVG viewBox width
const PITCH_H   = 900  // SVG viewBox height
const N         = 11   // points par lettre

// ── Utilitaires ──────────────────────────────────────────────────────────────

function bounds(cmds) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const c of cmds) {
    for (const [x, y] of [[c.x,c.y],[c.x1,c.y1],[c.x2,c.y2]]) {
      if (x != null) { x0 = Math.min(x0, x); x1 = Math.max(x1, x) }
      if (y != null) { y0 = Math.min(y0, y); y1 = Math.max(y1, y) }
    }
  }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 }
}

/** Transforme un path opentype pour qu'il remplisse la zone cible (centre+scale). */
function computeTransform(cmds, tx, ty, tw, th) {
  const b = bounds(cmds)
  const scale = Math.min(tw / b.w, th / b.h)
  const ox = tx + (tw - b.w * scale) / 2 - b.x0 * scale
  const oy = ty + (th - b.h * scale) / 2 - b.y0 * scale
  return { scale, ox, oy }
}

/** Évalue une bezier quadratique à t. */
function quad(ax, ay, bx, by, cx, cy, t) {
  const u = 1 - t
  return { x: u*u*ax + 2*u*t*bx + t*t*cx,
           y: u*u*ay + 2*u*t*by + t*t*cy }
}

/** Évalue une bezier cubique à t. */
function cubic(ax, ay, bx, by, cx, cy, dx, dy, t) {
  const u = 1 - t
  return { x: u*u*u*ax + 3*u*u*t*bx + 3*u*t*t*cx + t*t*t*dx,
           y: u*u*u*ay + 3*u*u*t*by + 3*u*t*t*cy + t*t*t*dy }
}

/**
 * Convertit les commandes d'un path en polyligne (segments [a,b]),
 * applique la transformation, et retourne les segments en coords pitch.
 */
function toSegments(cmds, tf) {
  const { scale: s, ox, oy } = tf
  const T = (x, y) => ({ x: x * s + ox, y: y * s + oy })
  const segs = []
  let cx = 0, cy = 0, sx = 0, sy = 0

  for (const c of cmds) {
    if (c.type === 'M') {
      cx = c.x; cy = c.y; sx = c.x; sy = c.y
    } else if (c.type === 'L') {
      segs.push([T(cx, cy), T(c.x, c.y)])
      cx = c.x; cy = c.y
    } else if (c.type === 'Q') {
      const STEPS = 24
      let prev = T(cx, cy)
      for (let i = 1; i <= STEPS; i++) {
        const p = quad(cx, cy, c.x1, c.y1, c.x, c.y, i / STEPS)
        const next = T(p.x, p.y)
        segs.push([prev, next])
        prev = next
      }
      cx = c.x; cy = c.y
    } else if (c.type === 'C') {
      const STEPS = 32
      let prev = T(cx, cy)
      for (let i = 1; i <= STEPS; i++) {
        const p = cubic(cx, cy, c.x1, c.y1, c.x2, c.y2, c.x, c.y, i / STEPS)
        const next = T(p.x, p.y)
        segs.push([prev, next])
        prev = next
      }
      cx = c.x; cy = c.y
    } else if (c.type === 'Z') {
      segs.push([T(cx, cy), T(sx, sy)])
      cx = sx; cy = sy
    }
  }
  return segs
}

/**
 * Échantillonne n points à espacement arc-longueur constant sur une polyligne,
 * puis convertit en pourcentages du terrain (0-100%).
 */
function sample(segs, n) {
  const lens = segs.map(([a, b]) => Math.hypot(b.x - a.x, b.y - a.y))
  const total = lens.reduce((a, b) => a + b, 0)
  const pts = []
  let acc = 0, si = 0

  for (let i = 0; i < n; i++) {
    const target = total * (i + 0.5) / n
    while (si < segs.length - 1 && acc + lens[si] < target) {
      acc += lens[si++]
    }
    const [a, b] = segs[si]
    const t = lens[si] > 0 ? Math.min(1, (target - acc) / lens[si]) : 0
    pts.push({
      x: Math.round((a.x + t * (b.x - a.x)) / PITCH_W * 1000) / 10,
      y: Math.round((a.y + t * (b.y - a.y)) / PITCH_H * 1000) / 10,
    })
  }
  return pts
}

// ── Main ──────────────────────────────────────────────────────────────────────

const font = opentype.parse(fs.readFileSync(FONT_PATH))

// Obtenir les commandes brutes pour 'F' et 'B' à une taille de référence
const REF = 1000
const fPath = font.getPath('F', 0, 0, REF)
const bPath = font.getPath('B', 0, 0, REF)

// Zone cible pour chaque lettre dans le pitch (coordonnées SVG 600×900)
// F à gauche, B à droite, marges confortables
const MARGIN_X = 40
const MARGIN_Y = 50
const HALF_W   = PITCH_W / 2 - MARGIN_X * 1.5   // ~230px

const fTarget = { x: MARGIN_X, y: MARGIN_Y, w: HALF_W, h: PITCH_H - MARGIN_Y * 2 }
const bTarget = { x: PITCH_W / 2 + MARGIN_X * 0.5, y: MARGIN_Y, w: HALF_W, h: PITCH_H - MARGIN_Y * 2 }

const fTf = computeTransform(fPath.commands, fTarget.x, fTarget.y, fTarget.w, fTarget.h)
const bTf = computeTransform(bPath.commands, bTarget.x, bTarget.y, bTarget.w, bTarget.h)

const fPts = sample(toSegments(fPath.commands, fTf), N)
const bPts = sample(toSegments(bPath.commands, bTf), N)

// ── Affichage ─────────────────────────────────────────────────────────────────
console.log('\n// RED — "F" (Impact)')
fPts.forEach((p, i) => {
  console.log(`  { n: "${i + 1}", x: ${p.x}, y: ${p.y} },`)
})

console.log('\n// BLUE — "B" (Impact)')
bPts.forEach((p, i) => {
  console.log(`  { n: "${i + 1}", x: ${p.x}, y: ${p.y} },`)
})

// Debug : affiche la taille réelle des lettres pour ajustement
const fBounds = bounds(fPath.commands)
const bBounds = bounds(bPath.commands)
const fScale  = fTf.scale
const bScale  = bTf.scale
console.log(`\n// Lettre F : ${Math.round(fBounds.w * fScale)}×${Math.round(fBounds.h * fScale)}px dans le pitch`)
console.log(`// Lettre B : ${Math.round(bBounds.w * bScale)}×${Math.round(bBounds.h * bScale)}px dans le pitch`)
