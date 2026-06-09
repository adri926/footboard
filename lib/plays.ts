/* Séquences animées par situation tactique
 *
 * Chaque play = N frames décrivant l'évolution du mouvement.
 * Le moteur anime en CSS transitions entre chaque frame.
 *
 * hold : ms à tenir sur cette frame avant de passer à la suivante
 * Coordonnées identiques à scenarios.ts (x/y 0-100)
 */

import type { Phase, Style, PlayerPos } from "./scenarios"

export interface PlayFrame {
  hold:  number                    // ms de pause sur ce frame
  label: string                    // ce qui se passe tactiquement
  home:  PlayerPos[]
  away:  PlayerPos[]
  ball:  { x: number; y: number }
}

export interface TacticalPlay {
  scenarioId: string               // correspond à TacticalScenario.id
  phase:      Phase
  style:      Style
  frames:     PlayFrame[]
}

/* ── Helpers pour ne pas répéter les positions inchangées ── */
function p(id: number, role: string, x: number, y: number): PlayerPos {
  return { id, role, x, y }
}

/* ═══════════════════════════════════════════════════════════
   ATTACK — Conservation de balle
   Scénario : home fait tourner, brise le bloc médian adverse
   ═══════════════════════════════════════════════════════════ */
const POSSESSION_PLAY: TacticalPlay = {
  scenarioId: "attack-possession",
  phase: "attack",
  style: "possession",
  frames: [
    {
      hold: 1800,
      label: "Mise en place — home en possession, away en bloc médian",
      ball: { x: 50, y: 42 },
      home: [
        p(1,  "GB",  50,  8), p(2,  "DD",  72, 28), p(3,  "DC",  40, 22),
        p(4,  "DC",  60, 22), p(5,  "DG",  28, 28), p(6,  "MDC", 50, 40),
        p(7,  "MC",  32, 52), p(8,  "MC",  68, 52), p(9,  "AD",  80, 38),
        p(10, "BU",  50, 60), p(11, "AG",  20, 38),
      ],
      away: [
        p(1,  "GB",  50, 92), p(2,  "DG",  72, 76), p(3,  "DC",  40, 80),
        p(4,  "DC",  60, 80), p(5,  "DD",  28, 76), p(6,  "MG",  72, 65),
        p(7,  "MC",  40, 62), p(8,  "MC",  60, 62), p(9,  "MD",  28, 65),
        p(10, "BU",  40, 55), p(11, "BU",  60, 55),
      ],
    },
    {
      hold: 2000,
      label: "Circulation à droite — le latéral droit monte, l'ailier droit s'écarte, away se décale",
      ball: { x: 74, y: 34 },
      home: [
        p(1,  "GB",  50,  8), p(2,  "DD",  78, 38), p(3,  "DC",  40, 22),
        p(4,  "DC",  62, 22), p(5,  "DG",  22, 32), p(6,  "MDC", 54, 44),
        p(7,  "MC",  36, 52), p(8,  "MC",  72, 48), p(9,  "AD",  88, 44),
        p(10, "BU",  58, 60), p(11, "AG",  18, 42),
      ],
      away: [
        p(1,  "GB",  50, 92), p(2,  "DG",  78, 72), p(3,  "DC",  44, 80),
        p(4,  "DC",  62, 78), p(5,  "DD",  30, 76), p(6,  "MG",  80, 60),
        p(7,  "MC",  50, 60), p(8,  "MC",  66, 60), p(9,  "MD",  34, 65),
        p(10, "BU",  50, 52), p(11, "BU",  66, 52),
      ],
    },
    {
      hold: 2000,
      label: "Changement de côté — ballon switché vers le latéral gauche, away déséquilibré",
      ball: { x: 22, y: 36 },
      home: [
        p(1,  "GB",  50,  8), p(2,  "DD",  76, 42), p(3,  "DC",  40, 22),
        p(4,  "DC",  60, 22), p(5,  "DG",  18, 36), p(6,  "MDC", 46, 44),
        p(7,  "MC",  28, 50), p(8,  "MC",  66, 52), p(9,  "AD",  84, 50),
        p(10, "BU",  44, 62), p(11, "AG",  12, 46),
      ],
      away: [
        p(1,  "GB",  50, 92), p(2,  "DG",  76, 74), p(3,  "DC",  44, 80),
        p(4,  "DC",  60, 80), p(5,  "DD",  30, 72), p(6,  "MG",  76, 64),
        p(7,  "MC",  50, 62), p(8,  "MC",  62, 62), p(9,  "MD",  32, 62),
        p(10, "BU",  44, 54), p(11, "BU",  58, 54),
      ],
    },
    {
      hold: 2200,
      label: "Pénétration — l'ailier gauche dans l'espace, le buteur fait appel en profondeur",
      ball: { x: 14, y: 52 },
      home: [
        p(1,  "GB",  50,  8), p(2,  "DD",  72, 44), p(3,  "DC",  40, 22),
        p(4,  "DC",  60, 22), p(5,  "DG",  16, 42), p(6,  "MDC", 44, 48),
        p(7,  "MC",  26, 55), p(8,  "MC",  64, 54), p(9,  "AD",  80, 54),
        p(10, "BU",  40, 70), p(11, "AG",  10, 56),
      ],
      away: [
        p(1,  "GB",  50, 92), p(2,  "DG",  74, 72), p(3,  "DC",  42, 78),
        p(4,  "DC",  60, 78), p(5,  "DD",  24, 68), p(6,  "MG",  72, 65),
        p(7,  "MC",  48, 64), p(8,  "MC",  60, 64), p(9,  "MD",  26, 60),
        p(10, "BU",  42, 55), p(11, "BU",  56, 55),
      ],
    },
  ],
}

/* ═══════════════════════════════════════════════════════════
   ATTACK — Attaque rapide (contre-attaque)
   ═══════════════════════════════════════════════════════════ */
const COUNTER_PLAY: TacticalPlay = {
  scenarioId: "attack-counter",
  phase: "attack",
  style: "counter",
  frames: [
    {
      hold: 1500,
      label: "Récupération du ballon au milieu — away encore haut",
      ball: { x: 50, y: 50 },
      home: [
        p(1,  "GB",  50,  8), p(2,  "DD",  72, 32), p(3,  "DC",  40, 20),
        p(4,  "DC",  60, 20), p(5,  "DG",  28, 32), p(6,  "MDC", 50, 44),
        p(7,  "MC",  34, 52), p(8,  "MC",  66, 52), p(9,  "AD",  76, 44),
        p(10, "BU",  50, 62), p(11, "AG",  24, 44),
      ],
      away: [
        p(1,  "GB",  50, 92), p(2,  "DG",  74, 56), p(3,  "DC",  40, 64),
        p(4,  "DC",  60, 64), p(5,  "DD",  26, 56), p(6,  "MG",  76, 44),
        p(7,  "MC",  40, 46), p(8,  "MC",  60, 46), p(9,  "MD",  24, 44),
        p(10, "BU",  42, 36), p(11, "BU",  58, 36),
      ],
    },
    {
      hold: 1800,
      label: "Passe verticale directe — le buteur fixe, l'ailier droit lance sa course",
      ball: { x: 58, y: 62 },
      home: [
        p(1,  "GB",  50,  8), p(2,  "DD",  80, 42), p(3,  "DC",  40, 18),
        p(4,  "DC",  60, 18), p(5,  "DG",  20, 42), p(6,  "MDC", 50, 38),
        p(7,  "MC",  30, 50), p(8,  "MC",  70, 50), p(9,  "AD",  84, 52),
        p(10, "BU",  52, 64), p(11, "AG",  16, 54),
      ],
      away: [
        p(1,  "GB",  50, 92), p(2,  "DG",  74, 60), p(3,  "DC",  42, 66),
        p(4,  "DC",  60, 66), p(5,  "DD",  26, 58), p(6,  "MG",  76, 50),
        p(7,  "MC",  44, 52), p(8,  "MC",  60, 52), p(9,  "MD",  26, 50),
        p(10, "BU",  46, 44), p(11, "BU",  58, 44),
      ],
    },
    {
      hold: 1800,
      label: "L'ailier droit dans le dos de la défense — le défenseur central adverse pris de vitesse",
      ball: { x: 82, y: 68 },
      home: [
        p(1,  "GB",  50,  8), p(2,  "DD",  82, 52), p(3,  "DC",  38, 16),
        p(4,  "DC",  60, 16), p(5,  "DG",  18, 52), p(6,  "MDC", 50, 36),
        p(7,  "MC",  28, 50), p(8,  "MC",  70, 52), p(9,  "AD",  88, 66),
        p(10, "BU",  54, 68), p(11, "AG",  14, 62),
      ],
      away: [
        p(1,  "GB",  50, 92), p(2,  "DG",  76, 66), p(3,  "DC",  44, 70),
        p(4,  "DC",  62, 70), p(5,  "DD",  28, 62), p(6,  "MG",  78, 58),
        p(7,  "MC",  46, 56), p(8,  "MC",  62, 56), p(9,  "MD",  28, 56),
        p(10, "BU",  50, 52), p(11, "BU",  62, 52),
      ],
    },
    {
      hold: 2000,
      label: "Face au but — 3 contre 2, défense dépassée",
      ball: { x: 84, y: 76 },
      home: [
        p(1,  "GB",  50,  8), p(2,  "DD",  82, 60), p(3,  "DC",  38, 16),
        p(4,  "DC",  58, 16), p(5,  "DG",  16, 60), p(6,  "MDC", 50, 36),
        p(7,  "MC",  28, 52), p(8,  "MC",  68, 56), p(9,  "AD",  90, 76),
        p(10, "BU",  56, 76), p(11, "AG",  14, 70),
      ],
      away: [
        p(1,  "GB",  50, 92), p(2,  "DG",  78, 76), p(3,  "DC",  46, 78),
        p(4,  "DC",  64, 74), p(5,  "DD",  30, 72), p(6,  "MG",  80, 64),
        p(7,  "MC",  50, 62), p(8,  "MC",  64, 62), p(9,  "MD",  30, 62),
        p(10, "BU",  52, 58), p(11, "BU",  64, 58),
      ],
    },
  ],
}

/* ═══════════════════════════════════════════════════════════
   ATTACK — Jeu en profondeur
   ═══════════════════════════════════════════════════════════ */
const DEPTH_PLAY: TacticalPlay = {
  scenarioId: "attack-depth",
  phase: "attack",
  style: "depth",
  frames: [
    {
      hold: 1800,
      label: "Le défenseur central en possession — ailiers écartés au max, le buteur positionné",
      ball: { x: 60, y: 22 },
      home: [
        p(1,  "GB",  50,  8), p(2,  "DD",  78, 28), p(3,  "DC",  40, 20),
        p(4,  "DC",  60, 20), p(5,  "DG",  22, 28), p(6,  "MDC", 50, 40),
        p(7,  "MC",  34, 50), p(8,  "MC",  66, 50), p(9,  "AD",  92, 44),
        p(10, "BU",  50, 66), p(11, "AG",   8, 44),
      ],
      away: [
        p(1,  "GB",  50, 92), p(2,  "DG",  72, 68), p(3,  "DC",  40, 65),
        p(4,  "DC",  60, 65), p(5,  "DD",  28, 68), p(6,  "MG",  72, 56),
        p(7,  "MC",  40, 54), p(8,  "MC",  60, 54), p(9,  "MD",  28, 56),
        p(10, "BU",  42, 44), p(11, "BU",  58, 44),
      ],
    },
    {
      hold: 1600,
      label: "Long ball joué — le buteur fait sa course dans le dos",
      ball: { x: 52, y: 52 },
      home: [
        p(1,  "GB",  50,  8), p(2,  "DD",  80, 34), p(3,  "DC",  40, 20),
        p(4,  "DC",  60, 20), p(5,  "DG",  20, 34), p(6,  "MDC", 50, 42),
        p(7,  "MC",  34, 52), p(8,  "MC",  66, 52), p(9,  "AD",  90, 50),
        p(10, "BU",  52, 72), p(11, "AG",  10, 50),
      ],
      away: [
        p(1,  "GB",  50, 92), p(2,  "DG",  72, 70), p(3,  "DC",  42, 68),
        p(4,  "DC",  60, 68), p(5,  "DD",  28, 70), p(6,  "MG",  72, 58),
        p(7,  "MC",  40, 56), p(8,  "MC",  60, 56), p(9,  "MD",  28, 58),
        p(10, "BU",  44, 46), p(11, "BU",  58, 46),
      ],
    },
    {
      hold: 2000,
      label: "Le buteur contre le défenseur central — un contre un dans la surface",
      ball: { x: 52, y: 76 },
      home: [
        p(1,  "GB",  50,  8), p(2,  "DD",  82, 44), p(3,  "DC",  40, 20),
        p(4,  "DC",  60, 20), p(5,  "DG",  18, 44), p(6,  "MDC", 50, 44),
        p(7,  "MC",  34, 56), p(8,  "MC",  66, 56), p(9,  "AD",  88, 62),
        p(10, "BU",  52, 78), p(11, "AG",  12, 62),
      ],
      away: [
        p(1,  "GB",  50, 92), p(2,  "DG",  74, 76), p(3,  "DC",  44, 74),
        p(4,  "DC",  58, 72), p(5,  "DD",  26, 76), p(6,  "MG",  74, 64),
        p(7,  "MC",  42, 60), p(8,  "MC",  60, 60), p(9,  "MD",  28, 64),
        p(10, "BU",  46, 52), p(11, "BU",  60, 52),
      ],
    },
  ],
}

/* ═══════════════════════════════════════════════════════════
   DEFENSE — Bloc bas
   ═══════════════════════════════════════════════════════════ */
const LOW_BLOCK_PLAY: TacticalPlay = {
  scenarioId: "defense-low-block",
  phase: "defense",
  style: "low-block",
  frames: [
    {
      hold: 1800,
      label: "Home en bloc bas — away fait tourner sans trouver",
      ball: { x: 72, y: 52 },
      home: [
        p(1,  "GB",  50, 10), p(2,  "DD",  74, 26), p(3,  "DC",  40, 20),
        p(4,  "DC",  60, 20), p(5,  "DG",  26, 26), p(6,  "MD",  74, 36),
        p(7,  "MC",  40, 38), p(8,  "MC",  60, 38), p(9,  "MG",  26, 36),
        p(10, "MOC",  50, 46), p(11, "BU",  50, 54),
      ],
      away: [
        p(1,  "GB",  50, 92), p(2,  "DG",  78, 68), p(3,  "DC",  40, 74),
        p(4,  "DC",  60, 74), p(5,  "DD",  22, 68), p(6,  "MDC", 50, 62),
        p(7,  "MC",  32, 54), p(8,  "MC",  68, 54), p(9,  "AG",  82, 44),
        p(10, "BU",  50, 40), p(11, "AD",  18, 44),
      ],
    },
    {
      hold: 2000,
      label: "Away probe le couloir droit — home se décale et protège l'axe",
      ball: { x: 82, y: 44 },
      home: [
        p(1,  "GB",  52, 10), p(2,  "DD",  78, 24), p(3,  "DC",  44, 20),
        p(4,  "DC",  62, 20), p(5,  "DG",  28, 26), p(6,  "MD",  80, 34),
        p(7,  "MC",  46, 36), p(8,  "MC",  62, 36), p(9,  "MG",  30, 36),
        p(10, "MOC",  54, 44), p(11, "BU",  52, 52),
      ],
      away: [
        p(1,  "GB",  50, 92), p(2,  "DG",  84, 64), p(3,  "DC",  42, 74),
        p(4,  "DC",  62, 74), p(5,  "DD",  24, 68), p(6,  "MDC", 54, 60),
        p(7,  "MC",  36, 54), p(8,  "MC",  70, 52), p(9,  "AG",  88, 42),
        p(10, "BU",  56, 40), p(11, "AD",  20, 48),
      ],
    },
    {
      hold: 2000,
      label: "Switch gauche — home se réorganise, bloc reste compact",
      ball: { x: 18, y: 46 },
      home: [
        p(1,  "GB",  48, 10), p(2,  "DD",  72, 26), p(3,  "DC",  38, 20),
        p(4,  "DC",  58, 20), p(5,  "DG",  24, 24), p(6,  "MD",  70, 36),
        p(7,  "MC",  38, 36), p(8,  "MC",  58, 36), p(9,  "MG",  22, 34),
        p(10, "MOC",  46, 44), p(11, "BU",  48, 52),
      ],
      away: [
        p(1,  "GB",  50, 92), p(2,  "DG",  78, 68), p(3,  "DC",  40, 74),
        p(4,  "DC",  60, 74), p(5,  "DD",  20, 64), p(6,  "MDC", 46, 60),
        p(7,  "MC",  30, 54), p(8,  "MC",  64, 54), p(9,  "AG",  78, 48),
        p(10, "BU",  46, 40), p(11, "AD",  14, 44),
      ],
    },
    {
      hold: 2200,
      label: "Away entre les lignes — home ferme et récupère",
      ball: { x: 48, y: 50 },
      home: [
        p(1,  "GB",  50, 10), p(2,  "DD",  72, 24), p(3,  "DC",  38, 18),
        p(4,  "DC",  60, 18), p(5,  "DG",  26, 24), p(6,  "MD",  72, 34),
        p(7,  "MC",  38, 36), p(8,  "MC",  60, 36), p(9,  "MG",  26, 34),
        p(10, "MOC",  48, 46), p(11, "BU",  50, 53),
      ],
      away: [
        p(1,  "GB",  50, 92), p(2,  "DG",  76, 68), p(3,  "DC",  40, 74),
        p(4,  "DC",  60, 74), p(5,  "DD",  24, 68), p(6,  "MDC", 50, 62),
        p(7,  "MC",  34, 56), p(8,  "MC",  66, 56), p(9,  "AG",  80, 46),
        p(10, "BU",  48, 48), p(11, "AD",  20, 46),
      ],
    },
  ],
}

/* ═══════════════════════════════════════════════════════════
   DEFENSE — Bloc médian
   ═══════════════════════════════════════════════════════════ */
const MID_BLOCK_PLAY: TacticalPlay = {
  scenarioId: "defense-mid-block",
  phase: "defense",
  style: "mid-block",
  frames: [
    {
      hold: 1800,
      label: "Home organisé — away cherche la faille",
      ball: { x: 50, y: 60 },
      home: [
        p(1,  "GB",  50, 10), p(2,  "DD",  74, 28), p(3,  "DC",  40, 22),
        p(4,  "DC",  60, 22), p(5,  "DG",  26, 28), p(6,  "MD",  74, 44),
        p(7,  "MC",  40, 46), p(8,  "MC",  60, 46), p(9,  "MG",  26, 44),
        p(10, "BU",  40, 58), p(11, "BU",  60, 58),
      ],
      away: [
        p(1,  "GB",  50, 92), p(2,  "DG",  78, 70), p(3,  "DC",  40, 76),
        p(4,  "DC",  60, 76), p(5,  "DD",  22, 70), p(6,  "MDC", 50, 62),
        p(7,  "MC",  32, 54), p(8,  "MC",  68, 54), p(9,  "AG",  80, 46),
        p(10, "BU",  50, 40), p(11, "AD",  20, 46),
      ],
    },
    {
      hold: 2000,
      label: "Le milieu central adverse porte le ballon — home monte pour presser",
      ball: { x: 50, y: 52 },
      home: [
        p(1,  "GB",  50, 10), p(2,  "DD",  74, 32), p(3,  "DC",  40, 24),
        p(4,  "DC",  60, 24), p(5,  "DG",  26, 32), p(6,  "MD",  72, 48),
        p(7,  "MC",  38, 50), p(8,  "MC",  60, 50), p(9,  "MG",  26, 48),
        p(10, "BU",  40, 60), p(11, "BU",  60, 60),
      ],
      away: [
        p(1,  "GB",  50, 92), p(2,  "DG",  76, 70), p(3,  "DC",  40, 76),
        p(4,  "DC",  60, 76), p(5,  "DD",  24, 70), p(6,  "MDC", 50, 64),
        p(7,  "MC",  36, 56), p(8,  "MC",  64, 56), p(9,  "AG",  78, 48),
        p(10, "BU",  48, 42), p(11, "AD",  22, 48),
      ],
    },
    {
      hold: 1800,
      label: "Interception — home récupère entre les lignes",
      ball: { x: 54, y: 48 },
      home: [
        p(1,  "GB",  50, 10), p(2,  "DD",  74, 32), p(3,  "DC",  40, 22),
        p(4,  "DC",  60, 22), p(5,  "DG",  26, 32), p(6,  "MD",  72, 46),
        p(7,  "MC",  40, 48), p(8,  "MC",  62, 48), p(9,  "MG",  26, 46),
        p(10, "BU",  42, 58), p(11, "BU",  62, 58),
      ],
      away: [
        p(1,  "GB",  50, 92), p(2,  "DG",  74, 68), p(3,  "DC",  40, 74),
        p(4,  "DC",  60, 74), p(5,  "DD",  26, 68), p(6,  "MDC", 52, 64),
        p(7,  "MC",  38, 58), p(8,  "MC",  66, 58), p(9,  "AG",  76, 50),
        p(10, "BU",  50, 46), p(11, "AD",  24, 50),
      ],
    },
    {
      hold: 2200,
      label: "Contre éclair — away déséquilibré, home se projette",
      ball: { x: 62, y: 56 },
      home: [
        p(1,  "GB",  50, 10), p(2,  "DD",  78, 40), p(3,  "DC",  40, 22),
        p(4,  "DC",  58, 22), p(5,  "DG",  22, 40), p(6,  "MD",  80, 52),
        p(7,  "MC",  38, 52), p(8,  "MC",  66, 52), p(9,  "MG",  22, 52),
        p(10, "BU",  46, 66), p(11, "BU",  66, 64),
      ],
      away: [
        p(1,  "GB",  50, 92), p(2,  "DG",  74, 66), p(3,  "DC",  42, 72),
        p(4,  "DC",  60, 72), p(5,  "DD",  28, 66), p(6,  "MDC", 54, 64),
        p(7,  "MC",  40, 60), p(8,  "MC",  68, 58), p(9,  "AG",  74, 52),
        p(10, "BU",  52, 50), p(11, "AD",  26, 52),
      ],
    },
  ],
}

/* ═══════════════════════════════════════════════════════════
   DEFENSE — Pressing haut
   ═══════════════════════════════════════════════════════════ */
const HIGH_PRESS_PLAY: TacticalPlay = {
  scenarioId: "defense-high-press",
  phase: "defense",
  style: "high-press",
  frames: [
    {
      hold: 1500,
      label: "Le gardien adverse en possession — home monte le bloc très haut",
      ball: { x: 50, y: 88 },
      home: [
        p(1,  "GB",  50, 22), p(2,  "DD",  74, 42), p(3,  "DC",  40, 36),
        p(4,  "DC",  60, 36), p(5,  "DG",  26, 42), p(6,  "MD",  74, 54),
        p(7,  "MC",  40, 56), p(8,  "MC",  60, 56), p(9,  "MG",  26, 54),
        p(10, "BU",  40, 68), p(11, "BU",  60, 68),
      ],
      away: [
        p(1,  "GB",  50, 92), p(2,  "DG",  72, 80), p(3,  "DC",  40, 84),
        p(4,  "DC",  60, 84), p(5,  "DD",  28, 80), p(6,  "MDC", 50, 72),
        p(7,  "MC",  36, 64), p(8,  "MC",  64, 64), p(9,  "AG",  72, 56),
        p(10, "BU",  50, 52), p(11, "AD",  28, 56),
      ],
    },
    {
      hold: 1800,
      label: "Le buteur presse le gardien — les lignes de passe courtes coupées",
      ball: { x: 50, y: 90 },
      home: [
        p(1,  "GB",  50, 22), p(2,  "DD",  72, 44), p(3,  "DC",  40, 38),
        p(4,  "DC",  60, 38), p(5,  "DG",  28, 44), p(6,  "MD",  72, 56),
        p(7,  "MC",  38, 58), p(8,  "MC",  62, 58), p(9,  "MG",  28, 56),
        p(10, "BU",  44, 76), p(11, "BU",  56, 76),
      ],
      away: [
        p(1,  "GB",  50, 92), p(2,  "DG",  70, 82), p(3,  "DC",  40, 86),
        p(4,  "DC",  60, 86), p(5,  "DD",  30, 82), p(6,  "MDC", 50, 74),
        p(7,  "MC",  36, 66), p(8,  "MC",  64, 66), p(9,  "AG",  70, 58),
        p(10, "BU",  48, 54), p(11, "AD",  30, 58),
      ],
    },
    {
      hold: 1800,
      label: "Le défenseur central forcé au long — home saute pour le second ballon",
      ball: { x: 50, y: 68 },
      home: [
        p(1,  "GB",  50, 24), p(2,  "DD",  72, 46), p(3,  "DC",  40, 40),
        p(4,  "DC",  60, 40), p(5,  "DG",  28, 46), p(6,  "MD",  72, 58),
        p(7,  "MC",  38, 60), p(8,  "MC",  62, 60), p(9,  "MG",  28, 58),
        p(10, "BU",  42, 72), p(11, "BU",  58, 72),
      ],
      away: [
        p(1,  "GB",  50, 94), p(2,  "DG",  70, 82), p(3,  "DC",  40, 86),
        p(4,  "DC",  60, 86), p(5,  "DD",  30, 82), p(6,  "MDC", 50, 74),
        p(7,  "MC",  36, 66), p(8,  "MC",  64, 66), p(9,  "AG",  70, 60),
        p(10, "BU",  46, 56), p(11, "AD",  30, 60),
      ],
    },
    {
      hold: 2200,
      label: "Second ballon gagné — home récupère haut, away désorganisé",
      ball: { x: 46, y: 64 },
      home: [
        p(1,  "GB",  50, 24), p(2,  "DD",  74, 46), p(3,  "DC",  40, 40),
        p(4,  "DC",  60, 40), p(5,  "DG",  26, 46), p(6,  "MD",  74, 56),
        p(7,  "MC",  40, 60), p(8,  "MC",  62, 58), p(9,  "MG",  26, 56),
        p(10, "BU",  42, 68), p(11, "BU",  58, 70),
      ],
      away: [
        p(1,  "GB",  50, 94), p(2,  "DG",  70, 80), p(3,  "DC",  40, 84),
        p(4,  "DC",  60, 84), p(5,  "DD",  30, 80), p(6,  "MDC", 50, 72),
        p(7,  "MC",  38, 66), p(8,  "MC",  62, 66), p(9,  "AG",  70, 60),
        p(10, "BU",  46, 58), p(11, "AD",  30, 60),
      ],
    },
  ],
}

/* ── Export ─────────────────────────────────────────────── */
export const PLAYS: TacticalPlay[] = [
  POSSESSION_PLAY,
  COUNTER_PLAY,
  DEPTH_PLAY,
  LOW_BLOCK_PLAY,
  MID_BLOCK_PLAY,
  HIGH_PRESS_PLAY,
]

export function getPlay(scenarioId: string): TacticalPlay | undefined {
  return PLAYS.find(p => p.scenarioId === scenarioId)
}
