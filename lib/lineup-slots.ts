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
    { id:"gk",  pos:"GK",  label:"GB",  x:50, y:8  },
    { id:"lb",  pos:"DEF", label:"DG",  x:18, y:22 },
    { id:"cb1", pos:"DEF", label:"DC",  x:38, y:20 },
    { id:"cb2", pos:"DEF", label:"DC",  x:62, y:20 },
    { id:"rb",  pos:"DEF", label:"DD",  x:82, y:22 },
    { id:"cm1", pos:"MIL", label:"MC",  x:22, y:38 },
    { id:"cm2", pos:"MIL", label:"MC",  x:50, y:35 },
    { id:"cm3", pos:"MIL", label:"MC",  x:78, y:38 },
    { id:"lw",  pos:"ATT", label:"AG",  x:18, y:52 },
    { id:"st",  pos:"ATT", label:"BU",  x:50, y:48 },
    { id:"rw",  pos:"ATT", label:"AD",  x:82, y:52 },
  ],

  "4-2-3-1": [
    { id:"gk",   pos:"GK",  label:"GB",  x:50, y:8  },
    { id:"lb",   pos:"DEF", label:"DG",  x:18, y:22 },
    { id:"cb1",  pos:"DEF", label:"DC",  x:38, y:20 },
    { id:"cb2",  pos:"DEF", label:"DC",  x:62, y:20 },
    { id:"rb",   pos:"DEF", label:"DD",  x:82, y:22 },
    { id:"cdm1", pos:"MIL", label:"MDC", x:35, y:34 },
    { id:"cdm2", pos:"MIL", label:"MDC", x:65, y:34 },
    { id:"lm",   pos:"MIL", label:"MG",  x:18, y:46 },
    { id:"cam",  pos:"MIL", label:"MOC", x:50, y:44 },
    { id:"rm",   pos:"MIL", label:"MD",  x:82, y:46 },
    { id:"st",   pos:"ATT", label:"BU",  x:50, y:55 },
  ],

  "4-4-2": [
    { id:"gk",  pos:"GK",  label:"GB", x:50, y:8  },
    { id:"lb",  pos:"DEF", label:"DG", x:18, y:22 },
    { id:"cb1", pos:"DEF", label:"DC", x:38, y:20 },
    { id:"cb2", pos:"DEF", label:"DC", x:62, y:20 },
    { id:"rb",  pos:"DEF", label:"DD", x:82, y:22 },
    { id:"lm",  pos:"MIL", label:"MG", x:18, y:38 },
    { id:"cm1", pos:"MIL", label:"MC", x:40, y:36 },
    { id:"cm2", pos:"MIL", label:"MC", x:60, y:36 },
    { id:"rm",  pos:"MIL", label:"MD", x:82, y:38 },
    { id:"st1", pos:"ATT", label:"BU", x:38, y:50 },
    { id:"st2", pos:"ATT", label:"BU", x:62, y:50 },
  ],

  "3-5-2": [
    { id:"gk",  pos:"GK",  label:"GB",  x:50, y:8  },
    { id:"cb1", pos:"DEF", label:"DC",  x:25, y:20 },
    { id:"cb2", pos:"DEF", label:"DC",  x:50, y:18 },
    { id:"cb3", pos:"DEF", label:"DC",  x:75, y:20 },
    { id:"lwb", pos:"MIL", label:"PG", x:12, y:36 },
    { id:"cm1", pos:"MIL", label:"MC",  x:32, y:34 },
    { id:"cm2", pos:"MIL", label:"MC",  x:50, y:32 },
    { id:"cm3", pos:"MIL", label:"MC",  x:68, y:34 },
    { id:"rwb", pos:"MIL", label:"PD", x:88, y:36 },
    { id:"st1", pos:"ATT", label:"BU",  x:38, y:50 },
    { id:"st2", pos:"ATT", label:"BU",  x:62, y:50 },
  ],

  "5-3-2": [
    { id:"gk",  pos:"GK",  label:"GB",  x:50, y:8  },
    { id:"lwb", pos:"DEF", label:"PG", x:12, y:24 },
    { id:"cb1", pos:"DEF", label:"DC",  x:32, y:20 },
    { id:"cb2", pos:"DEF", label:"DC",  x:50, y:18 },
    { id:"cb3", pos:"DEF", label:"DC",  x:68, y:20 },
    { id:"rwb", pos:"DEF", label:"PD", x:88, y:24 },
    { id:"cm1", pos:"MIL", label:"MC",  x:28, y:38 },
    { id:"cm2", pos:"MIL", label:"MC",  x:50, y:36 },
    { id:"cm3", pos:"MIL", label:"MC",  x:72, y:38 },
    { id:"st1", pos:"ATT", label:"BU",  x:38, y:50 },
    { id:"st2", pos:"ATT", label:"BU",  x:62, y:50 },
  ],

  "3-4-3": [
    { id:"gk",  pos:"GK",  label:"GB", x:50, y:8  },
    { id:"cb1", pos:"DEF", label:"DC", x:25, y:20 },
    { id:"cb2", pos:"DEF", label:"DC", x:50, y:18 },
    { id:"cb3", pos:"DEF", label:"DC", x:75, y:20 },
    { id:"lm",  pos:"MIL", label:"MG", x:18, y:36 },
    { id:"cm1", pos:"MIL", label:"MC", x:40, y:34 },
    { id:"cm2", pos:"MIL", label:"MC", x:60, y:34 },
    { id:"rm",  pos:"MIL", label:"MD", x:82, y:36 },
    { id:"lw",  pos:"ATT", label:"AG", x:20, y:50 },
    { id:"st",  pos:"ATT", label:"BU", x:50, y:48 },
    { id:"rw",  pos:"ATT", label:"AD", x:80, y:50 },
  ],

  "4-1-4-1": [
    { id:"gk",  pos:"GK",  label:"GB",  x:50, y:8  },
    { id:"lb",  pos:"DEF", label:"DG",  x:18, y:22 },
    { id:"cb1", pos:"DEF", label:"DC",  x:38, y:20 },
    { id:"cb2", pos:"DEF", label:"DC",  x:62, y:20 },
    { id:"rb",  pos:"DEF", label:"DD",  x:82, y:22 },
    { id:"cdm", pos:"MIL", label:"MDC", x:50, y:32 },
    { id:"lm",  pos:"MIL", label:"MG",  x:18, y:42 },
    { id:"cm1", pos:"MIL", label:"MC",  x:40, y:42 },
    { id:"cm2", pos:"MIL", label:"MC",  x:60, y:42 },
    { id:"rm",  pos:"MIL", label:"MD",  x:82, y:42 },
    { id:"st",  pos:"ATT", label:"BU",  x:50, y:54 },
  ],
}

export const FORMATIONS_LIST = Object.keys(SLOTS)

export interface LineupData {
  slots:      Record<string, string>                          // slotId -> playerId
  positions?: Record<string, { x: number; y: number }>        // playerId -> position (override)
}
