// Définit les positions par défaut sur le terrain pour chaque slot d'une formation
// x/y en % (0-100) — coordonnées sur le terrain 600x900

export interface Slot {
  id:    string
  pos:   "GK" | "DEF" | "MIL" | "ATT"
  label: string
  x:     number
  y:     number
}

export const SLOTS: Record<string, Slot[]> = {

  "4-3-3": [
    { id:"gk",  pos:"GK",  label:"GK",  x:50, y:8  },
    { id:"lb",  pos:"DEF", label:"LB",  x:18, y:22 },
    { id:"cb1", pos:"DEF", label:"CB",  x:38, y:20 },
    { id:"cb2", pos:"DEF", label:"CB",  x:62, y:20 },
    { id:"rb",  pos:"DEF", label:"RB",  x:82, y:22 },
    { id:"cm1", pos:"MIL", label:"CM",  x:22, y:38 },
    { id:"cm2", pos:"MIL", label:"CM",  x:50, y:35 },
    { id:"cm3", pos:"MIL", label:"CM",  x:78, y:38 },
    { id:"lw",  pos:"ATT", label:"LW",  x:18, y:52 },
    { id:"st",  pos:"ATT", label:"ST",  x:50, y:48 },
    { id:"rw",  pos:"ATT", label:"RW",  x:82, y:52 },
  ],

  "4-2-3-1": [
    { id:"gk",   pos:"GK",  label:"GK",  x:50, y:8  },
    { id:"lb",   pos:"DEF", label:"LB",  x:18, y:22 },
    { id:"cb1",  pos:"DEF", label:"CB",  x:38, y:20 },
    { id:"cb2",  pos:"DEF", label:"CB",  x:62, y:20 },
    { id:"rb",   pos:"DEF", label:"RB",  x:82, y:22 },
    { id:"cdm1", pos:"MIL", label:"CDM", x:35, y:34 },
    { id:"cdm2", pos:"MIL", label:"CDM", x:65, y:34 },
    { id:"lm",   pos:"MIL", label:"LM",  x:18, y:46 },
    { id:"cam",  pos:"MIL", label:"CAM", x:50, y:44 },
    { id:"rm",   pos:"MIL", label:"RM",  x:82, y:46 },
    { id:"st",   pos:"ATT", label:"ST",  x:50, y:55 },
  ],

  "4-4-2": [
    { id:"gk",  pos:"GK",  label:"GK", x:50, y:8  },
    { id:"lb",  pos:"DEF", label:"LB", x:18, y:22 },
    { id:"cb1", pos:"DEF", label:"CB", x:38, y:20 },
    { id:"cb2", pos:"DEF", label:"CB", x:62, y:20 },
    { id:"rb",  pos:"DEF", label:"RB", x:82, y:22 },
    { id:"lm",  pos:"MIL", label:"LM", x:18, y:38 },
    { id:"cm1", pos:"MIL", label:"CM", x:40, y:36 },
    { id:"cm2", pos:"MIL", label:"CM", x:60, y:36 },
    { id:"rm",  pos:"MIL", label:"RM", x:82, y:38 },
    { id:"st1", pos:"ATT", label:"ST", x:38, y:50 },
    { id:"st2", pos:"ATT", label:"ST", x:62, y:50 },
  ],

  "3-5-2": [
    { id:"gk",  pos:"GK",  label:"GK",  x:50, y:8  },
    { id:"cb1", pos:"DEF", label:"CB",  x:25, y:20 },
    { id:"cb2", pos:"DEF", label:"CB",  x:50, y:18 },
    { id:"cb3", pos:"DEF", label:"CB",  x:75, y:20 },
    { id:"lwb", pos:"MIL", label:"LWB", x:12, y:36 },
    { id:"cm1", pos:"MIL", label:"CM",  x:32, y:34 },
    { id:"cm2", pos:"MIL", label:"CM",  x:50, y:32 },
    { id:"cm3", pos:"MIL", label:"CM",  x:68, y:34 },
    { id:"rwb", pos:"MIL", label:"RWB", x:88, y:36 },
    { id:"st1", pos:"ATT", label:"ST",  x:38, y:50 },
    { id:"st2", pos:"ATT", label:"ST",  x:62, y:50 },
  ],

  "5-3-2": [
    { id:"gk",  pos:"GK",  label:"GK",  x:50, y:8  },
    { id:"lwb", pos:"DEF", label:"LWB", x:12, y:24 },
    { id:"cb1", pos:"DEF", label:"CB",  x:32, y:20 },
    { id:"cb2", pos:"DEF", label:"CB",  x:50, y:18 },
    { id:"cb3", pos:"DEF", label:"CB",  x:68, y:20 },
    { id:"rwb", pos:"DEF", label:"RWB", x:88, y:24 },
    { id:"cm1", pos:"MIL", label:"CM",  x:28, y:38 },
    { id:"cm2", pos:"MIL", label:"CM",  x:50, y:36 },
    { id:"cm3", pos:"MIL", label:"CM",  x:72, y:38 },
    { id:"st1", pos:"ATT", label:"ST",  x:38, y:50 },
    { id:"st2", pos:"ATT", label:"ST",  x:62, y:50 },
  ],

  "3-4-3": [
    { id:"gk",  pos:"GK",  label:"GK", x:50, y:8  },
    { id:"cb1", pos:"DEF", label:"CB", x:25, y:20 },
    { id:"cb2", pos:"DEF", label:"CB", x:50, y:18 },
    { id:"cb3", pos:"DEF", label:"CB", x:75, y:20 },
    { id:"lm",  pos:"MIL", label:"LM", x:18, y:36 },
    { id:"cm1", pos:"MIL", label:"CM", x:40, y:34 },
    { id:"cm2", pos:"MIL", label:"CM", x:60, y:34 },
    { id:"rm",  pos:"MIL", label:"RM", x:82, y:36 },
    { id:"lw",  pos:"ATT", label:"LW", x:20, y:50 },
    { id:"st",  pos:"ATT", label:"ST", x:50, y:48 },
    { id:"rw",  pos:"ATT", label:"RW", x:80, y:50 },
  ],

  "4-1-4-1": [
    { id:"gk",  pos:"GK",  label:"GK",  x:50, y:8  },
    { id:"lb",  pos:"DEF", label:"LB",  x:18, y:22 },
    { id:"cb1", pos:"DEF", label:"CB",  x:38, y:20 },
    { id:"cb2", pos:"DEF", label:"CB",  x:62, y:20 },
    { id:"rb",  pos:"DEF", label:"RB",  x:82, y:22 },
    { id:"cdm", pos:"MIL", label:"CDM", x:50, y:32 },
    { id:"lm",  pos:"MIL", label:"LM",  x:18, y:42 },
    { id:"cm1", pos:"MIL", label:"CM",  x:40, y:42 },
    { id:"cm2", pos:"MIL", label:"CM",  x:60, y:42 },
    { id:"rm",  pos:"MIL", label:"RM",  x:82, y:42 },
    { id:"st",  pos:"ATT", label:"ST",  x:50, y:54 },
  ],
}

export const FORMATIONS_LIST = Object.keys(SLOTS)

export interface LineupData {
  slots:      Record<string, string>                          // slotId -> playerId
  positions?: Record<string, { x: number; y: number }>        // playerId -> position (override)
}
