// Profils comportementaux par rôle.
// Chaque rôle encode sa position idéale relative au ballon selon la phase.

export type RoleId =
  | "GK" | "CB" | "RB" | "LB"
  | "CM" | "DM" | "CAM"
  | "RW" | "LW" | "ST"

// Map des IDs joueurs vers leur rôle
// Rouge 4-3-3 : r1=GK r2=RB r3=CBd r4=CBg r5=LB r6=CMd r7=CM r8=CMg r9=RW r10=ST r11=LW
// Bleu  4-4-2 : b1=GK b2=RB b3=CBd b4=CBg b5=LB b6=RM  b7=CM  b8=CM  b9=LM  b10=ST b11=ST
export const PLAYER_ROLES: Record<string, RoleId> = {
  r1: "GK", r2: "RB", r3: "CB", r4: "CB", r5: "LB",
  r6: "CM", r7: "CM", r8: "CM", r9: "RW", r10: "ST", r11: "LW",
  b1: "GK", b2: "RB", b3: "CB", b4: "CB", b5: "LB",
  b6: "RW", b7: "CM", b8: "CM", b9: "LW", b10: "ST", b11: "ST",
}

// Latéralité : détermine si un joueur est du côté droit, gauche, ou central
export type Side = "right" | "left" | "center"
export const PLAYER_SIDE: Record<string, Side> = {
  r2: "right", r3: "right", r4: "left", r5: "left",
  r6: "right", r7: "center", r8: "left",
  r9: "right", r10: "center", r11: "left",
  b2: "right", b3: "right", b4: "left", b5: "left",
  b6: "right", b7: "right", b8: "left", b9: "left",
  b10: "right", b11: "left",
  r1: "center", b1: "center",
}

// Profil de profondeur par rôle (0=but propre, 100=but adverse — perspective rouge)
export const BASE_DEPTH: Record<RoleId, number> = {
  GK:  6,
  CB:  20,
  RB:  22,
  LB:  22,
  DM:  30,
  CM:  38,
  CAM: 52,
  RW:  55,
  LW:  55,
  ST:  58,
}

// Amplitude latérale de référence (x) par rôle
export const BASE_WIDTH: Record<RoleId, { right: number; left: number; center: number }> = {
  GK:  { right: 50, left: 50, center: 50 },
  CB:  { right: 64, left: 36, center: 50 },
  RB:  { right: 80, left: 20, center: 50 },
  LB:  { right: 80, left: 20, center: 50 },
  DM:  { right: 62, left: 38, center: 50 },
  CM:  { right: 68, left: 32, center: 50 },
  CAM: { right: 65, left: 35, center: 50 },
  RW:  { right: 84, left: 16, center: 50 },
  LW:  { right: 84, left: 16, center: 50 },
  ST:  { right: 60, left: 40, center: 50 },
}
