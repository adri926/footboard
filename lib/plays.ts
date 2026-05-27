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
        p(1,  "GK",  50,  8), p(2,  "RB",  72, 28), p(3,  "CB",  40, 22),
        p(4,  "CB",  60, 22), p(5,  "LB",  28, 28), p(6,  "CDM", 50, 40),
        p(7,  "CM",  32, 52), p(8,  "CM",  68, 52), p(9,  "RW",  80, 38),
        p(10, "ST",  50, 60), p(11, "LW",  20, 38),
      ],
      away: [
        p(1,  "GK",  50, 92), p(2,  "RB",  72, 76), p(3,  "CB",  40, 80),
        p(4,  "CB",  60, 80), p(5,  "LB",  28, 76), p(6,  "RM",  72, 65),
        p(7,  "CM",  40, 62), p(8,  "CM",  60, 62), p(9,  "LM",  28, 65),
        p(10, "ST",  40, 55), p(11, "ST",  60, 55),
      ],
    },
    {
      hold: 2000,
      label: "Circulation à droite — RB monte, RW s'écarte, away se décale",
      ball: { x: 74, y: 34 },
      home: [
        p(1,  "GK",  50,  8), p(2,  "RB",  78, 38), p(3,  "CB",  40, 22),
        p(4,  "CB",  62, 22), p(5,  "LB",  22, 32), p(6,  "CDM", 54, 44),
        p(7,  "CM",  36, 52), p(8,  "CM",  72, 48), p(9,  "RW",  88, 44),
        p(10, "ST",  58, 60), p(11, "LW",  18, 42),
      ],
      away: [
        p(1,  "GK",  50, 92), p(2,  "RB",  78, 72), p(3,  "CB",  44, 80),
        p(4,  "CB",  62, 78), p(5,  "LB",  30, 76), p(6,  "RM",  80, 60),
        p(7,  "CM",  50, 60), p(8,  "CM",  66, 60), p(9,  "LM",  34, 65),
        p(10, "ST",  50, 52), p(11, "ST",  66, 52),
      ],
    },
    {
      hold: 2000,
      label: "Changement de côté — ballon switché vers LB, away déséquilibré",
      ball: { x: 22, y: 36 },
      home: [
        p(1,  "GK",  50,  8), p(2,  "RB",  76, 42), p(3,  "CB",  40, 22),
        p(4,  "CB",  60, 22), p(5,  "LB",  18, 36), p(6,  "CDM", 46, 44),
        p(7,  "CM",  28, 50), p(8,  "CM",  66, 52), p(9,  "RW",  84, 50),
        p(10, "ST",  44, 62), p(11, "LW",  12, 46),
      ],
      away: [
        p(1,  "GK",  50, 92), p(2,  "RB",  76, 74), p(3,  "CB",  44, 80),
        p(4,  "CB",  60, 80), p(5,  "LB",  30, 72), p(6,  "RM",  76, 64),
        p(7,  "CM",  50, 62), p(8,  "CM",  62, 62), p(9,  "LM",  32, 62),
        p(10, "ST",  44, 54), p(11, "ST",  58, 54),
      ],
    },
    {
      hold: 2200,
      label: "Pénétration — LW dans l'espace, ST fait appel en profondeur",
      ball: { x: 14, y: 52 },
      home: [
        p(1,  "GK",  50,  8), p(2,  "RB",  72, 44), p(3,  "CB",  40, 22),
        p(4,  "CB",  60, 22), p(5,  "LB",  16, 42), p(6,  "CDM", 44, 48),
        p(7,  "CM",  26, 55), p(8,  "CM",  64, 54), p(9,  "RW",  80, 54),
        p(10, "ST",  40, 70), p(11, "LW",  10, 56),
      ],
      away: [
        p(1,  "GK",  50, 92), p(2,  "RB",  74, 72), p(3,  "CB",  42, 78),
        p(4,  "CB",  60, 78), p(5,  "LB",  24, 68), p(6,  "RM",  72, 65),
        p(7,  "CM",  48, 64), p(8,  "CM",  60, 64), p(9,  "LM",  26, 60),
        p(10, "ST",  42, 55), p(11, "ST",  56, 55),
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
        p(1,  "GK",  50,  8), p(2,  "RB",  72, 32), p(3,  "CB",  40, 20),
        p(4,  "CB",  60, 20), p(5,  "LB",  28, 32), p(6,  "CDM", 50, 44),
        p(7,  "CM",  34, 52), p(8,  "CM",  66, 52), p(9,  "RW",  76, 44),
        p(10, "ST",  50, 62), p(11, "LW",  24, 44),
      ],
      away: [
        p(1,  "GK",  50, 92), p(2,  "RB",  74, 56), p(3,  "CB",  40, 64),
        p(4,  "CB",  60, 64), p(5,  "LB",  26, 56), p(6,  "RM",  76, 44),
        p(7,  "CM",  40, 46), p(8,  "CM",  60, 46), p(9,  "LM",  24, 44),
        p(10, "ST",  42, 36), p(11, "ST",  58, 36),
      ],
    },
    {
      hold: 1800,
      label: "Passe verticale directe — ST fixe, RW lance sa course",
      ball: { x: 58, y: 62 },
      home: [
        p(1,  "GK",  50,  8), p(2,  "RB",  80, 42), p(3,  "CB",  40, 18),
        p(4,  "CB",  60, 18), p(5,  "LB",  20, 42), p(6,  "CDM", 50, 38),
        p(7,  "CM",  30, 50), p(8,  "CM",  70, 50), p(9,  "RW",  84, 52),
        p(10, "ST",  52, 64), p(11, "LW",  16, 54),
      ],
      away: [
        p(1,  "GK",  50, 92), p(2,  "RB",  74, 60), p(3,  "CB",  42, 66),
        p(4,  "CB",  60, 66), p(5,  "LB",  26, 58), p(6,  "RM",  76, 50),
        p(7,  "CM",  44, 52), p(8,  "CM",  60, 52), p(9,  "LM",  26, 50),
        p(10, "ST",  46, 44), p(11, "ST",  58, 44),
      ],
    },
    {
      hold: 1800,
      label: "RW dans le dos de la défense — away CB pris de vitesse",
      ball: { x: 82, y: 68 },
      home: [
        p(1,  "GK",  50,  8), p(2,  "RB",  82, 52), p(3,  "CB",  38, 16),
        p(4,  "CB",  60, 16), p(5,  "LB",  18, 52), p(6,  "CDM", 50, 36),
        p(7,  "CM",  28, 50), p(8,  "CM",  70, 52), p(9,  "RW",  88, 66),
        p(10, "ST",  54, 68), p(11, "LW",  14, 62),
      ],
      away: [
        p(1,  "GK",  50, 92), p(2,  "RB",  76, 66), p(3,  "CB",  44, 70),
        p(4,  "CB",  62, 70), p(5,  "LB",  28, 62), p(6,  "RM",  78, 58),
        p(7,  "CM",  46, 56), p(8,  "CM",  62, 56), p(9,  "LM",  28, 56),
        p(10, "ST",  50, 52), p(11, "ST",  62, 52),
      ],
    },
    {
      hold: 2000,
      label: "Face au but — 3 contre 2, défense dépassée",
      ball: { x: 84, y: 76 },
      home: [
        p(1,  "GK",  50,  8), p(2,  "RB",  82, 60), p(3,  "CB",  38, 16),
        p(4,  "CB",  58, 16), p(5,  "LB",  16, 60), p(6,  "CDM", 50, 36),
        p(7,  "CM",  28, 52), p(8,  "CM",  68, 56), p(9,  "RW",  90, 76),
        p(10, "ST",  56, 76), p(11, "LW",  14, 70),
      ],
      away: [
        p(1,  "GK",  50, 92), p(2,  "RB",  78, 76), p(3,  "CB",  46, 78),
        p(4,  "CB",  64, 74), p(5,  "LB",  30, 72), p(6,  "RM",  80, 64),
        p(7,  "CM",  50, 62), p(8,  "CM",  64, 62), p(9,  "LM",  30, 62),
        p(10, "ST",  52, 58), p(11, "ST",  64, 58),
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
      label: "CB en possession — ailiers écartés au max, ST positionné",
      ball: { x: 60, y: 22 },
      home: [
        p(1,  "GK",  50,  8), p(2,  "RB",  78, 28), p(3,  "CB",  40, 20),
        p(4,  "CB",  60, 20), p(5,  "LB",  22, 28), p(6,  "CDM", 50, 40),
        p(7,  "CM",  34, 50), p(8,  "CM",  66, 50), p(9,  "RW",  92, 44),
        p(10, "ST",  50, 66), p(11, "LW",   8, 44),
      ],
      away: [
        p(1,  "GK",  50, 92), p(2,  "RB",  72, 68), p(3,  "CB",  40, 65),
        p(4,  "CB",  60, 65), p(5,  "LB",  28, 68), p(6,  "RM",  72, 56),
        p(7,  "CM",  40, 54), p(8,  "CM",  60, 54), p(9,  "LM",  28, 56),
        p(10, "ST",  42, 44), p(11, "ST",  58, 44),
      ],
    },
    {
      hold: 1600,
      label: "Long ball joué — ST fait sa course dans le dos",
      ball: { x: 52, y: 52 },
      home: [
        p(1,  "GK",  50,  8), p(2,  "RB",  80, 34), p(3,  "CB",  40, 20),
        p(4,  "CB",  60, 20), p(5,  "LB",  20, 34), p(6,  "CDM", 50, 42),
        p(7,  "CM",  34, 52), p(8,  "CM",  66, 52), p(9,  "RW",  90, 50),
        p(10, "ST",  52, 72), p(11, "LW",  10, 50),
      ],
      away: [
        p(1,  "GK",  50, 92), p(2,  "RB",  72, 70), p(3,  "CB",  42, 68),
        p(4,  "CB",  60, 68), p(5,  "LB",  28, 70), p(6,  "RM",  72, 58),
        p(7,  "CM",  40, 56), p(8,  "CM",  60, 56), p(9,  "LM",  28, 58),
        p(10, "ST",  44, 46), p(11, "ST",  58, 46),
      ],
    },
    {
      hold: 2000,
      label: "ST contre le CB — un contre un dans la surface",
      ball: { x: 52, y: 76 },
      home: [
        p(1,  "GK",  50,  8), p(2,  "RB",  82, 44), p(3,  "CB",  40, 20),
        p(4,  "CB",  60, 20), p(5,  "LB",  18, 44), p(6,  "CDM", 50, 44),
        p(7,  "CM",  34, 56), p(8,  "CM",  66, 56), p(9,  "RW",  88, 62),
        p(10, "ST",  52, 78), p(11, "LW",  12, 62),
      ],
      away: [
        p(1,  "GK",  50, 92), p(2,  "RB",  74, 76), p(3,  "CB",  44, 74),
        p(4,  "CB",  58, 72), p(5,  "LB",  26, 76), p(6,  "RM",  74, 64),
        p(7,  "CM",  42, 60), p(8,  "CM",  60, 60), p(9,  "LM",  28, 64),
        p(10, "ST",  46, 52), p(11, "ST",  60, 52),
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
        p(1,  "GK",  50, 10), p(2,  "RB",  74, 26), p(3,  "CB",  40, 20),
        p(4,  "CB",  60, 20), p(5,  "LB",  26, 26), p(6,  "RM",  74, 36),
        p(7,  "CM",  40, 38), p(8,  "CM",  60, 38), p(9,  "LM",  26, 36),
        p(10, "AM",  50, 46), p(11, "ST",  50, 54),
      ],
      away: [
        p(1,  "GK",  50, 92), p(2,  "RB",  78, 68), p(3,  "CB",  40, 74),
        p(4,  "CB",  60, 74), p(5,  "LB",  22, 68), p(6,  "CDM", 50, 62),
        p(7,  "CM",  32, 54), p(8,  "CM",  68, 54), p(9,  "RW",  82, 44),
        p(10, "ST",  50, 40), p(11, "LW",  18, 44),
      ],
    },
    {
      hold: 2000,
      label: "Away probe le couloir droit — home se décale et protège l'axe",
      ball: { x: 82, y: 44 },
      home: [
        p(1,  "GK",  52, 10), p(2,  "RB",  78, 24), p(3,  "CB",  44, 20),
        p(4,  "CB",  62, 20), p(5,  "LB",  28, 26), p(6,  "RM",  80, 34),
        p(7,  "CM",  46, 36), p(8,  "CM",  62, 36), p(9,  "LM",  30, 36),
        p(10, "AM",  54, 44), p(11, "ST",  52, 52),
      ],
      away: [
        p(1,  "GK",  50, 92), p(2,  "RB",  84, 64), p(3,  "CB",  42, 74),
        p(4,  "CB",  62, 74), p(5,  "LB",  24, 68), p(6,  "CDM", 54, 60),
        p(7,  "CM",  36, 54), p(8,  "CM",  70, 52), p(9,  "RW",  88, 42),
        p(10, "ST",  56, 40), p(11, "LW",  20, 48),
      ],
    },
    {
      hold: 2000,
      label: "Switch gauche — home se réorganise, bloc reste compact",
      ball: { x: 18, y: 46 },
      home: [
        p(1,  "GK",  48, 10), p(2,  "RB",  72, 26), p(3,  "CB",  38, 20),
        p(4,  "CB",  58, 20), p(5,  "LB",  24, 24), p(6,  "RM",  70, 36),
        p(7,  "CM",  38, 36), p(8,  "CM",  58, 36), p(9,  "LM",  22, 34),
        p(10, "AM",  46, 44), p(11, "ST",  48, 52),
      ],
      away: [
        p(1,  "GK",  50, 92), p(2,  "RB",  78, 68), p(3,  "CB",  40, 74),
        p(4,  "CB",  60, 74), p(5,  "LB",  20, 64), p(6,  "CDM", 46, 60),
        p(7,  "CM",  30, 54), p(8,  "CM",  64, 54), p(9,  "RW",  78, 48),
        p(10, "ST",  46, 40), p(11, "LW",  14, 44),
      ],
    },
    {
      hold: 2200,
      label: "Away entre les lignes — home ferme et récupère",
      ball: { x: 48, y: 50 },
      home: [
        p(1,  "GK",  50, 10), p(2,  "RB",  72, 24), p(3,  "CB",  38, 18),
        p(4,  "CB",  60, 18), p(5,  "LB",  26, 24), p(6,  "RM",  72, 34),
        p(7,  "CM",  38, 36), p(8,  "CM",  60, 36), p(9,  "LM",  26, 34),
        p(10, "AM",  48, 46), p(11, "ST",  50, 53),
      ],
      away: [
        p(1,  "GK",  50, 92), p(2,  "RB",  76, 68), p(3,  "CB",  40, 74),
        p(4,  "CB",  60, 74), p(5,  "LB",  24, 68), p(6,  "CDM", 50, 62),
        p(7,  "CM",  34, 56), p(8,  "CM",  66, 56), p(9,  "RW",  80, 46),
        p(10, "ST",  48, 48), p(11, "LW",  20, 46),
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
        p(1,  "GK",  50, 10), p(2,  "RB",  74, 28), p(3,  "CB",  40, 22),
        p(4,  "CB",  60, 22), p(5,  "LB",  26, 28), p(6,  "RM",  74, 44),
        p(7,  "CM",  40, 46), p(8,  "CM",  60, 46), p(9,  "LM",  26, 44),
        p(10, "ST",  40, 58), p(11, "ST",  60, 58),
      ],
      away: [
        p(1,  "GK",  50, 92), p(2,  "RB",  78, 70), p(3,  "CB",  40, 76),
        p(4,  "CB",  60, 76), p(5,  "LB",  22, 70), p(6,  "CDM", 50, 62),
        p(7,  "CM",  32, 54), p(8,  "CM",  68, 54), p(9,  "RW",  80, 46),
        p(10, "ST",  50, 40), p(11, "LW",  20, 46),
      ],
    },
    {
      hold: 2000,
      label: "CM adverse porte — home monte pour presser",
      ball: { x: 50, y: 52 },
      home: [
        p(1,  "GK",  50, 10), p(2,  "RB",  74, 32), p(3,  "CB",  40, 24),
        p(4,  "CB",  60, 24), p(5,  "LB",  26, 32), p(6,  "RM",  72, 48),
        p(7,  "CM",  38, 50), p(8,  "CM",  60, 50), p(9,  "LM",  26, 48),
        p(10, "ST",  40, 60), p(11, "ST",  60, 60),
      ],
      away: [
        p(1,  "GK",  50, 92), p(2,  "RB",  76, 70), p(3,  "CB",  40, 76),
        p(4,  "CB",  60, 76), p(5,  "LB",  24, 70), p(6,  "CDM", 50, 64),
        p(7,  "CM",  36, 56), p(8,  "CM",  64, 56), p(9,  "RW",  78, 48),
        p(10, "ST",  48, 42), p(11, "LW",  22, 48),
      ],
    },
    {
      hold: 1800,
      label: "Interception — home récupère entre les lignes",
      ball: { x: 54, y: 48 },
      home: [
        p(1,  "GK",  50, 10), p(2,  "RB",  74, 32), p(3,  "CB",  40, 22),
        p(4,  "CB",  60, 22), p(5,  "LB",  26, 32), p(6,  "RM",  72, 46),
        p(7,  "CM",  40, 48), p(8,  "CM",  62, 48), p(9,  "LM",  26, 46),
        p(10, "ST",  42, 58), p(11, "ST",  62, 58),
      ],
      away: [
        p(1,  "GK",  50, 92), p(2,  "RB",  74, 68), p(3,  "CB",  40, 74),
        p(4,  "CB",  60, 74), p(5,  "LB",  26, 68), p(6,  "CDM", 52, 64),
        p(7,  "CM",  38, 58), p(8,  "CM",  66, 58), p(9,  "RW",  76, 50),
        p(10, "ST",  50, 46), p(11, "LW",  24, 50),
      ],
    },
    {
      hold: 2200,
      label: "Contre éclair — away déséquilibré, home se projette",
      ball: { x: 62, y: 56 },
      home: [
        p(1,  "GK",  50, 10), p(2,  "RB",  78, 40), p(3,  "CB",  40, 22),
        p(4,  "CB",  58, 22), p(5,  "LB",  22, 40), p(6,  "RM",  80, 52),
        p(7,  "CM",  38, 52), p(8,  "CM",  66, 52), p(9,  "LM",  22, 52),
        p(10, "ST",  46, 66), p(11, "ST",  66, 64),
      ],
      away: [
        p(1,  "GK",  50, 92), p(2,  "RB",  74, 66), p(3,  "CB",  42, 72),
        p(4,  "CB",  60, 72), p(5,  "LB",  28, 66), p(6,  "CDM", 54, 64),
        p(7,  "CM",  40, 60), p(8,  "CM",  68, 58), p(9,  "RW",  74, 52),
        p(10, "ST",  52, 50), p(11, "LW",  26, 52),
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
      label: "GK adverse en possession — home monte le bloc très haut",
      ball: { x: 50, y: 88 },
      home: [
        p(1,  "GK",  50, 22), p(2,  "RB",  74, 42), p(3,  "CB",  40, 36),
        p(4,  "CB",  60, 36), p(5,  "LB",  26, 42), p(6,  "RM",  74, 54),
        p(7,  "CM",  40, 56), p(8,  "CM",  60, 56), p(9,  "LM",  26, 54),
        p(10, "ST",  40, 68), p(11, "ST",  60, 68),
      ],
      away: [
        p(1,  "GK",  50, 92), p(2,  "RB",  72, 80), p(3,  "CB",  40, 84),
        p(4,  "CB",  60, 84), p(5,  "LB",  28, 80), p(6,  "CDM", 50, 72),
        p(7,  "CM",  36, 64), p(8,  "CM",  64, 64), p(9,  "RW",  72, 56),
        p(10, "ST",  50, 52), p(11, "LW",  28, 56),
      ],
    },
    {
      hold: 1800,
      label: "ST presse le GK — les lignes de passe courtes coupées",
      ball: { x: 50, y: 90 },
      home: [
        p(1,  "GK",  50, 22), p(2,  "RB",  72, 44), p(3,  "CB",  40, 38),
        p(4,  "CB",  60, 38), p(5,  "LB",  28, 44), p(6,  "RM",  72, 56),
        p(7,  "CM",  38, 58), p(8,  "CM",  62, 58), p(9,  "LM",  28, 56),
        p(10, "ST",  44, 76), p(11, "ST",  56, 76),
      ],
      away: [
        p(1,  "GK",  50, 92), p(2,  "RB",  70, 82), p(3,  "CB",  40, 86),
        p(4,  "CB",  60, 86), p(5,  "LB",  30, 82), p(6,  "CDM", 50, 74),
        p(7,  "CM",  36, 66), p(8,  "CM",  64, 66), p(9,  "RW",  70, 58),
        p(10, "ST",  48, 54), p(11, "LW",  30, 58),
      ],
    },
    {
      hold: 1800,
      label: "CB forcé au long — home saute pour le second ballon",
      ball: { x: 50, y: 68 },
      home: [
        p(1,  "GK",  50, 24), p(2,  "RB",  72, 46), p(3,  "CB",  40, 40),
        p(4,  "CB",  60, 40), p(5,  "LB",  28, 46), p(6,  "RM",  72, 58),
        p(7,  "CM",  38, 60), p(8,  "CM",  62, 60), p(9,  "LM",  28, 58),
        p(10, "ST",  42, 72), p(11, "ST",  58, 72),
      ],
      away: [
        p(1,  "GK",  50, 94), p(2,  "RB",  70, 82), p(3,  "CB",  40, 86),
        p(4,  "CB",  60, 86), p(5,  "LB",  30, 82), p(6,  "CDM", 50, 74),
        p(7,  "CM",  36, 66), p(8,  "CM",  64, 66), p(9,  "RW",  70, 60),
        p(10, "ST",  46, 56), p(11, "LW",  30, 60),
      ],
    },
    {
      hold: 2200,
      label: "Second ballon gagné — home récupère haut, away désorganisé",
      ball: { x: 46, y: 64 },
      home: [
        p(1,  "GK",  50, 24), p(2,  "RB",  74, 46), p(3,  "CB",  40, 40),
        p(4,  "CB",  60, 40), p(5,  "LB",  26, 46), p(6,  "RM",  74, 56),
        p(7,  "CM",  40, 60), p(8,  "CM",  62, 58), p(9,  "LM",  26, 56),
        p(10, "ST",  42, 68), p(11, "ST",  58, 70),
      ],
      away: [
        p(1,  "GK",  50, 94), p(2,  "RB",  70, 80), p(3,  "CB",  40, 84),
        p(4,  "CB",  60, 84), p(5,  "LB",  30, 80), p(6,  "CDM", 50, 72),
        p(7,  "CM",  38, 66), p(8,  "CM",  62, 66), p(9,  "RW",  70, 60),
        p(10, "ST",  46, 58), p(11, "LW",  30, 60),
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
