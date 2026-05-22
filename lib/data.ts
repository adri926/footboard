export interface Player {
  nom: string; club: string; ligue: string; poste: string; nat: string
  mj: number; min: number; buts: number; passes: number
  xg: number; xa: number; tirs90: number; passes_pct: number; dribbles: number; dist: number
}

export interface Team {
  pos: number; club: string; pays: string; mj: number
  v: number; n: number; d: number; bp: number; bc: number; pts: number
  forme: string[]; xg: number; xgc: number; poss: number
}

// ─── JOUEURS ──────────────────────────────────────────────────────────────────

export const PLAYERS: Player[] = [

  // ── PREMIER LEAGUE ──
  { nom:"Mohamed Salah",     club:"Liverpool",       ligue:"Premier League", poste:"ATT", nat:"🇪🇬", mj:30, min:2580, buts:24, passes:16, xg:20.4, xa:12.8, tirs90:4.4, passes_pct:80, dribbles:3.6, dist:10.6 },
  { nom:"Erling Haaland",    club:"Man City",        ligue:"Premier League", poste:"ATT", nat:"🇳🇴", mj:28, min:2360, buts:26, passes:5,  xg:27.2, xa:3.4,  tirs90:5.4, passes_pct:73, dribbles:1.2, dist:9.4  },
  { nom:"Bukayo Saka",       club:"Arsenal",         ligue:"Premier League", poste:"ATT", nat:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj:29, min:2430, buts:16, passes:14, xg:13.2, xa:11.6, tirs90:3.2, passes_pct:84, dribbles:3.4, dist:11.0 },
  { nom:"Phil Foden",        club:"Man City",        ligue:"Premier League", poste:"MIL", nat:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj:27, min:2180, buts:15, passes:12, xg:12.0, xa:9.4,  tirs90:2.9, passes_pct:88, dribbles:3.0, dist:10.4 },
  { nom:"Rodri",             club:"Man City",        ligue:"Premier League", poste:"MIL", nat:"🇪🇸", mj:25, min:2100, buts:4,  passes:10, xg:3.6,  xa:7.8,  tirs90:1.1, passes_pct:94, dribbles:1.0, dist:11.8 },
  { nom:"Cole Palmer",       club:"Chelsea",         ligue:"Premier League", poste:"MIL", nat:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj:28, min:2350, buts:18, passes:11, xg:14.6, xa:8.8,  tirs90:3.6, passes_pct:82, dribbles:2.8, dist:10.2 },
  { nom:"Ollie Watkins",     club:"Aston Villa",     ligue:"Premier League", poste:"ATT", nat:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj:30, min:2540, buts:19, passes:10, xg:17.4, xa:8.2,  tirs90:3.8, passes_pct:72, dribbles:1.8, dist:10.8 },
  { nom:"Alexander Isak",    club:"Newcastle",       ligue:"Premier League", poste:"ATT", nat:"🇸🇪", mj:26, min:2120, buts:18, passes:5,  xg:16.8, xa:4.0,  tirs90:4.2, passes_pct:74, dribbles:2.4, dist:9.8  },
  { nom:"Bernardo Silva",    club:"Man City",        ligue:"Premier League", poste:"MIL", nat:"🇵🇹", mj:29, min:2310, buts:8,  passes:12, xg:6.8,  xa:10.2, tirs90:2.0, passes_pct:91, dribbles:2.4, dist:11.2 },
  { nom:"Trent Alexander-Arnold",club:"Liverpool",   ligue:"Premier League", poste:"DEF", nat:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj:28, min:2380, buts:3,  passes:14, xg:2.6,  xa:11.4, tirs90:1.2, passes_pct:88, dribbles:1.0, dist:10.8 },
  { nom:"William Saliba",    club:"Arsenal",         ligue:"Premier League", poste:"DEF", nat:"🇫🇷", mj:31, min:2790, buts:2,  passes:1,  xg:1.8,  xa:0.6,  tirs90:0.3, passes_pct:93, dribbles:0.3, dist:11.4 },
  { nom:"Martin Ødegaard",   club:"Arsenal",         ligue:"Premier League", poste:"MIL", nat:"🇳🇴", mj:27, min:2260, buts:8,  passes:11, xg:7.2,  xa:9.6,  tirs90:2.4, passes_pct:89, dribbles:2.2, dist:10.6 },
  { nom:"Dominic Solanke",   club:"Tottenham",       ligue:"Premier League", poste:"ATT", nat:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj:28, min:2240, buts:14, passes:6,  xg:13.4, xa:4.6,  tirs90:3.4, passes_pct:70, dribbles:1.4, dist:9.6  },
  { nom:"Pedro Porro",       club:"Tottenham",       ligue:"Premier League", poste:"DEF", nat:"🇪🇸", mj:29, min:2410, buts:4,  passes:9,  xg:3.2,  xa:7.4,  tirs90:1.4, passes_pct:82, dribbles:1.8, dist:11.0 },
  { nom:"Alisson Becker",    club:"Liverpool",       ligue:"Premier League", poste:"GK",  nat:"🇧🇷", mj:29, min:2610, buts:0,  passes:0,  xg:0,    xa:0,    tirs90:0.0, passes_pct:75, dribbles:0.0, dist:6.4  },

  // ── LIGA ──
  { nom:"Kylian Mbappé",     club:"Real Madrid",     ligue:"Liga",           poste:"ATT", nat:"🇫🇷", mj:30, min:2560, buts:26, passes:9,  xg:22.8, xa:7.0,  tirs90:5.0, passes_pct:81, dribbles:3.4, dist:10.8 },
  { nom:"Vinícius Jr",       club:"Real Madrid",     ligue:"Liga",           poste:"ATT", nat:"🇧🇷", mj:29, min:2380, buts:20, passes:13, xg:17.2, xa:10.4, tirs90:4.2, passes_pct:78, dribbles:6.0, dist:11.2 },
  { nom:"Jude Bellingham",   club:"Real Madrid",     ligue:"Liga",           poste:"MIL", nat:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj:28, min:2320, buts:17, passes:11, xg:14.2, xa:9.0,  tirs90:3.6, passes_pct:87, dribbles:2.8, dist:11.4 },
  { nom:"Lamine Yamal",      club:"FC Barcelone",    ligue:"Liga",           poste:"ATT", nat:"🇪🇸", mj:31, min:2560, buts:14, passes:19, xg:11.6, xa:15.2, tirs90:2.8, passes_pct:80, dribbles:5.2, dist:10.2 },
  { nom:"Pedri",             club:"FC Barcelone",    ligue:"Liga",           poste:"MIL", nat:"🇪🇸", mj:24, min:1960, buts:7,  passes:11, xg:5.8,  xa:8.8,  tirs90:1.8, passes_pct:92, dribbles:2.6, dist:11.0 },
  { nom:"Ferran Torres",     club:"FC Barcelone",    ligue:"Liga",           poste:"ATT", nat:"🇪🇸", mj:25, min:1820, buts:12, passes:8,  xg:10.4, xa:6.2,  tirs90:3.0, passes_pct:78, dribbles:2.4, dist:9.8  },
  { nom:"Antoine Griezmann", club:"Atlético Madrid", ligue:"Liga",           poste:"ATT", nat:"🇫🇷", mj:30, min:2480, buts:15, passes:10, xg:13.2, xa:8.4,  tirs90:3.4, passes_pct:84, dribbles:2.0, dist:10.8 },
  { nom:"Marcos Llorente",   club:"Atlético Madrid", ligue:"Liga",           poste:"MIL", nat:"🇪🇸", mj:28, min:2180, buts:6,  passes:9,  xg:5.2,  xa:7.6,  tirs90:1.8, passes_pct:86, dribbles:2.2, dist:11.2 },
  { nom:"Gavi",              club:"FC Barcelone",    ligue:"Liga",           poste:"MIL", nat:"🇪🇸", mj:22, min:1760, buts:4,  passes:8,  xg:3.2,  xa:6.4,  tirs90:1.2, passes_pct:90, dribbles:3.0, dist:10.8 },
  { nom:"Thibaut Courtois",  club:"Real Madrid",     ligue:"Liga",           poste:"GK",  nat:"🇧🇪", mj:24, min:2160, buts:0,  passes:0,  xg:0,    xa:0,    tirs90:0.0, passes_pct:73, dribbles:0.0, dist:6.2  },
  { nom:"Jan Oblak",         club:"Atlético Madrid", ligue:"Liga",           poste:"GK",  nat:"🇸🇮", mj:28, min:2520, buts:0,  passes:0,  xg:0,    xa:0,    tirs90:0.0, passes_pct:70, dribbles:0.0, dist:6.0  },
  { nom:"David Alaba",       club:"Real Madrid",     ligue:"Liga",           poste:"DEF", nat:"🇦🇹", mj:18, min:1440, buts:1,  passes:3,  xg:1.0,  xa:2.4,  tirs90:0.6, passes_pct:91, dribbles:0.6, dist:10.4 },

  // ── LIGUE 1 ──
  { nom:"Ousmane Dembélé",   club:"PSG",             ligue:"Ligue 1",        poste:"ATT", nat:"🇫🇷", mj:28, min:2180, buts:13, passes:15, xg:10.6, xa:12.4, tirs90:3.0, passes_pct:76, dribbles:5.4, dist:10.4 },
  { nom:"Achraf Hakimi",     club:"PSG",             ligue:"Ligue 1",        poste:"DEF", nat:"🇲🇦", mj:30, min:2560, buts:5,  passes:12, xg:3.8,  xa:9.6,  tirs90:1.6, passes_pct:84, dribbles:2.8, dist:11.4 },
  { nom:"Vitinha",           club:"PSG",             ligue:"Ligue 1",        poste:"MIL", nat:"🇵🇹", mj:29, min:2420, buts:6,  passes:13, xg:5.0,  xa:10.8, tirs90:2.0, passes_pct:92, dribbles:2.0, dist:11.2 },
  { nom:"Bradley Barcola",   club:"PSG",             ligue:"Ligue 1",        poste:"ATT", nat:"🇫🇷", mj:27, min:2080, buts:14, passes:10, xg:11.8, xa:8.2,  tirs90:3.4, passes_pct:77, dribbles:4.8, dist:10.6 },
  { nom:"Wissam Ben Yedder", club:"Monaco",          ligue:"Ligue 1",        poste:"ATT", nat:"🇫🇷", mj:26, min:1980, buts:16, passes:7,  xg:14.8, xa:5.6,  tirs90:4.0, passes_pct:72, dribbles:1.6, dist:9.4  },
  { nom:"Khephren Thuram",   club:"Nice",            ligue:"Ligue 1",        poste:"MIL", nat:"🇫🇷", mj:28, min:2380, buts:5,  passes:8,  xg:4.2,  xa:6.4,  tirs90:1.4, passes_pct:87, dribbles:2.0, dist:11.6 },
  { nom:"Pierre-Emerick Aubameyang",club:"Marseille",ligue:"Ligue 1",        poste:"ATT", nat:"🇬🇦", mj:25, min:1860, buts:15, passes:5,  xg:13.6, xa:4.0,  tirs90:4.2, passes_pct:68, dribbles:1.8, dist:9.2  },
  { nom:"Jonathan David",    club:"Lille",           ligue:"Ligue 1",        poste:"ATT", nat:"🇨🇦", mj:29, min:2380, buts:22, passes:6,  xg:19.4, xa:4.8,  tirs90:4.6, passes_pct:70, dribbles:1.6, dist:9.8  },
  { nom:"Désiré Doué",       club:"PSG",             ligue:"Ligue 1",        poste:"ATT", nat:"🇫🇷", mj:24, min:1740, buts:9,  passes:11, xg:7.8,  xa:9.2,  tirs90:2.6, passes_pct:79, dribbles:4.6, dist:10.2 },
  { nom:"Gianluigi Donnarumma",club:"PSG",           ligue:"Ligue 1",        poste:"GK",  nat:"🇮🇹", mj:29, min:2610, buts:0,  passes:0,  xg:0,    xa:0,    tirs90:0.0, passes_pct:72, dribbles:0.0, dist:6.2  },

  // ── SERIE A ──
  { nom:"Victor Osimhen",    club:"Napoli",          ligue:"Serie A",        poste:"ATT", nat:"🇳🇬", mj:26, min:2120, buts:21, passes:4,  xg:19.6, xa:3.0,  tirs90:4.6, passes_pct:67, dribbles:2.2, dist:9.6  },
  { nom:"Lautaro Martínez",  club:"Inter Milan",     ligue:"Serie A",        poste:"ATT", nat:"🇦🇷", mj:30, min:2460, buts:22, passes:8,  xg:20.2, xa:6.4,  tirs90:4.2, passes_pct:74, dribbles:2.0, dist:10.2 },
  { nom:"Rafael Leão",       club:"AC Milan",        ligue:"Serie A",        poste:"ATT", nat:"🇵🇹", mj:28, min:2180, buts:14, passes:12, xg:12.4, xa:10.2, tirs90:3.2, passes_pct:77, dribbles:5.6, dist:10.8 },
  { nom:"Nicolò Barella",    club:"Inter Milan",     ligue:"Serie A",        poste:"MIL", nat:"🇮🇹", mj:30, min:2490, buts:6,  passes:11, xg:5.4,  xa:9.2,  tirs90:1.8, passes_pct:88, dribbles:2.4, dist:11.8 },
  { nom:"Khvicha Kvaratskhelia",club:"Napoli",       ligue:"Serie A",        poste:"ATT", nat:"🇬🇪", mj:27, min:2160, buts:12, passes:13, xg:10.8, xa:11.4, tirs90:3.0, passes_pct:79, dribbles:5.0, dist:10.6 },
  { nom:"Dusan Vlahovic",    club:"Juventus",        ligue:"Serie A",        poste:"ATT", nat:"🇷🇸", mj:27, min:2160, buts:18, passes:4,  xg:16.8, xa:3.2,  tirs90:4.0, passes_pct:66, dribbles:1.2, dist:9.4  },
  { nom:"Federico Chiesa",   club:"Juventus",        ligue:"Serie A",        poste:"ATT", nat:"🇮🇹", mj:22, min:1640, buts:8,  passes:9,  xg:7.2,  xa:7.6,  tirs90:2.8, passes_pct:76, dribbles:3.6, dist:10.4 },
  { nom:"Alessandro Bastoni",club:"Inter Milan",     ligue:"Serie A",        poste:"DEF", nat:"🇮🇹", mj:30, min:2610, buts:2,  passes:4,  xg:1.8,  xa:3.2,  tirs90:0.5, passes_pct:92, dribbles:0.6, dist:11.2 },
  { nom:"Gleison Bremer",    club:"Juventus",        ligue:"Serie A",        poste:"DEF", nat:"🇧🇷", mj:28, min:2380, buts:2,  passes:1,  xg:1.6,  xa:0.8,  tirs90:0.4, passes_pct:90, dribbles:0.3, dist:11.0 },
  { nom:"Mike Maignan",      club:"AC Milan",        ligue:"Serie A",        poste:"GK",  nat:"🇫🇷", mj:29, min:2610, buts:0,  passes:0,  xg:0,    xa:0,    tirs90:0.0, passes_pct:74, dribbles:0.0, dist:6.4  },

  // ── BUNDESLIGA ──
  { nom:"Harry Kane",        club:"Bayern Munich",   ligue:"Bundesliga",     poste:"ATT", nat:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj:30, min:2580, buts:30, passes:10, xg:27.4, xa:8.2,  tirs90:5.2, passes_pct:76, dribbles:1.4, dist:10.0 },
  { nom:"Florian Wirtz",     club:"Bayer Leverkusen",ligue:"Bundesliga",     poste:"MIL", nat:"🇩🇪", mj:29, min:2360, buts:16, passes:18, xg:13.2, xa:15.4, tirs90:3.2, passes_pct:86, dribbles:4.2, dist:11.0 },
  { nom:"Granit Xhaka",      club:"Bayer Leverkusen",ligue:"Bundesliga",     poste:"MIL", nat:"🇨🇭", mj:28, min:2380, buts:4,  passes:8,  xg:3.6,  xa:6.8,  tirs90:1.0, passes_pct:91, dribbles:0.8, dist:11.4 },
  { nom:"Serge Gnabry",      club:"Bayern Munich",   ligue:"Bundesliga",     poste:"ATT", nat:"🇩🇪", mj:24, min:1820, buts:11, passes:9,  xg:9.8,  xa:7.6,  tirs90:3.0, passes_pct:80, dribbles:3.4, dist:10.6 },
  { nom:"Karim Adeyemi",     club:"Borussia Dortmund",ligue:"Bundesliga",    poste:"ATT", nat:"🇩🇪", mj:26, min:1980, buts:13, passes:8,  xg:11.4, xa:6.8,  tirs90:3.4, passes_pct:74, dribbles:4.0, dist:10.4 },
  { nom:"Xabi Alonso",       club:"Bayer Leverkusen",ligue:"Bundesliga",     poste:"MIL", nat:"🇪🇸", mj:1,  min:40,   buts:0,  passes:0,  xg:0,    xa:0,    tirs90:0.0, passes_pct:0,  dribbles:0.0, dist:0    },
  { nom:"Joshua Kimmich",    club:"Bayern Munich",   ligue:"Bundesliga",     poste:"MIL", nat:"🇩🇪", mj:28, min:2380, buts:3,  passes:14, xg:2.8,  xa:12.2, tirs90:1.2, passes_pct:92, dribbles:1.2, dist:11.6 },
  { nom:"Leroy Sané",        club:"Bayern Munich",   ligue:"Bundesliga",     poste:"ATT", nat:"🇩🇪", mj:26, min:2000, buts:12, passes:11, xg:10.6, xa:9.4,  tirs90:3.2, passes_pct:81, dribbles:3.8, dist:10.8 },
  { nom:"Manuel Neuer",      club:"Bayern Munich",   ligue:"Bundesliga",     poste:"GK",  nat:"🇩🇪", mj:26, min:2340, buts:0,  passes:0,  xg:0,    xa:0,    tirs90:0.0, passes_pct:76, dribbles:0.0, dist:6.6  },
  { nom:"Mats Hummels",      club:"Borussia Dortmund",ligue:"Bundesliga",    poste:"DEF", nat:"🇩🇪", mj:27, min:2340, buts:3,  passes:2,  xg:2.4,  xa:1.6,  tirs90:0.6, passes_pct:91, dribbles:0.4, dist:10.8 },
]

// ─── CLASSEMENTS COMPLETS ─────────────────────────────────────────────────────

export const CLASSEMENTS: Record<string, Team[]> = {

  "Premier League": [
    { pos:1,  club:"Liverpool",       pays:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj:32, v:24, n:5,  d:3,  bp:76, bc:32, pts:77, forme:["V","V","N","V","V"], xg:71.2, xgc:30.4, poss:58 },
    { pos:2,  club:"Arsenal",         pays:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj:32, v:22, n:6,  d:4,  bp:68, bc:29, pts:72, forme:["V","V","V","N","V"], xg:64.8, xgc:27.6, poss:56 },
    { pos:3,  club:"Man City",        pays:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj:32, v:20, n:6,  d:6,  bp:72, bc:40, pts:66, forme:["D","V","V","V","D"], xg:68.2, xgc:36.4, poss:63 },
    { pos:4,  club:"Chelsea",         pays:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj:32, v:17, n:8,  d:7,  bp:60, bc:42, pts:59, forme:["V","N","V","D","V"], xg:57.4, xgc:40.2, poss:53 },
    { pos:5,  club:"Newcastle",       pays:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj:32, v:16, n:7,  d:9,  bp:55, bc:38, pts:55, forme:["N","V","D","V","N"], xg:51.6, xgc:36.0, poss:49 },
    { pos:6,  club:"Aston Villa",     pays:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj:32, v:15, n:8,  d:9,  bp:56, bc:45, pts:53, forme:["V","D","V","V","N"], xg:53.8, xgc:42.6, poss:51 },
    { pos:7,  club:"Tottenham",       pays:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj:32, v:14, n:7,  d:11, bp:51, bc:48, pts:49, forme:["D","V","D","V","D"], xg:49.4, xgc:46.0, poss:50 },
    { pos:8,  club:"Brighton",        pays:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj:32, v:13, n:10, d:9,  bp:52, bc:40, pts:49, forme:["D","N","V","N","V"], xg:51.2, xgc:38.8, poss:55 },
    { pos:9,  club:"Brentford",       pays:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj:32, v:13, n:6,  d:13, bp:48, bc:52, pts:45, forme:["V","D","N","D","V"], xg:46.2, xgc:50.4, poss:44 },
    { pos:10, club:"Fulham",          pays:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj:32, v:12, n:8,  d:12, bp:46, bc:50, pts:44, forme:["N","V","D","N","V"], xg:44.8, xgc:48.6, poss:47 },
    { pos:11, club:"West Ham",        pays:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj:32, v:11, n:8,  d:13, bp:42, bc:52, pts:41, forme:["D","D","N","V","D"], xg:41.4, xgc:50.8, poss:45 },
    { pos:12, club:"Man United",      pays:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj:32, v:11, n:7,  d:14, bp:38, bc:50, pts:40, forme:["D","N","D","V","D"], xg:39.6, xgc:48.4, poss:47 },
    { pos:13, club:"Crystal Palace",  pays:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj:32, v:10, n:9,  d:13, bp:40, bc:48, pts:39, forme:["N","V","N","D","N"], xg:38.4, xgc:46.2, poss:43 },
    { pos:14, club:"Wolverhampton",   pays:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj:32, v:10, n:7,  d:15, bp:38, bc:54, pts:37, forme:["D","N","D","V","D"], xg:37.0, xgc:52.6, poss:42 },
    { pos:15, club:"Everton",         pays:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj:32, v:9,  n:9,  d:14, bp:34, bc:50, pts:36, forme:["N","D","N","V","N"], xg:33.8, xgc:48.0, poss:41 },
    { pos:16, club:"Nottm Forest",    pays:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj:32, v:9,  n:8,  d:15, bp:36, bc:52, pts:35, forme:["D","N","V","D","N"], xg:35.2, xgc:50.4, poss:42 },
    { pos:17, club:"Bournemouth",     pays:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj:32, v:9,  n:6,  d:17, bp:40, bc:60, pts:33, forme:["D","V","D","D","V"], xg:39.4, xgc:58.6, poss:45 },
    { pos:18, club:"Ipswich Town",    pays:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj:32, v:6,  n:8,  d:18, bp:32, bc:64, pts:26, forme:["D","D","N","D","V"], xg:31.2, xgc:62.4, poss:40 },
    { pos:19, club:"Leicester City",  pays:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj:32, v:5,  n:7,  d:20, bp:28, bc:68, pts:22, forme:["D","D","D","N","D"], xg:27.6, xgc:66.8, poss:38 },
    { pos:20, club:"Southampton",     pays:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", mj:32, v:3,  n:6,  d:23, bp:26, bc:76, pts:15, forme:["D","D","D","D","N"], xg:25.4, xgc:74.2, poss:36 },
  ],

  "Liga": [
    { pos:1,  club:"Real Madrid",     pays:"🇪🇸", mj:32, v:24, n:4,  d:4,  bp:78, bc:30, pts:76, forme:["V","V","V","N","V"], xg:72.4, xgc:29.2, poss:59 },
    { pos:2,  club:"FC Barcelone",    pays:"🇪🇸", mj:32, v:22, n:5,  d:5,  bp:70, bc:36, pts:71, forme:["V","D","V","V","V"], xg:65.8, xgc:34.6, poss:61 },
    { pos:3,  club:"Atlético Madrid", pays:"🇪🇸", mj:32, v:18, n:8,  d:6,  bp:55, bc:28, pts:62, forme:["N","V","N","V","V"], xg:52.6, xgc:27.0, poss:49 },
    { pos:4,  club:"Athletic Bilbao", pays:"🇪🇸", mj:32, v:16, n:9,  d:7,  bp:52, bc:34, pts:57, forme:["V","V","N","D","V"], xg:49.4, xgc:33.2, poss:51 },
    { pos:5,  club:"Villarreal",      pays:"🇪🇸", mj:32, v:15, n:7,  d:10, bp:48, bc:40, pts:52, forme:["D","V","V","N","D"], xg:46.0, xgc:38.6, poss:53 },
    { pos:6,  club:"Real Sociedad",   pays:"🇪🇸", mj:32, v:14, n:7,  d:11, bp:46, bc:42, pts:49, forme:["N","D","V","V","N"], xg:44.2, xgc:40.8, poss:55 },
    { pos:7,  club:"Séville",         pays:"🇪🇸", mj:32, v:12, n:9,  d:11, bp:44, bc:40, pts:45, forme:["D","N","V","N","D"], xg:42.4, xgc:38.6, poss:50 },
    { pos:8,  club:"Girona",          pays:"🇪🇸", mj:32, v:13, n:6,  d:13, bp:50, bc:48, pts:45, forme:["V","D","V","D","V"], xg:48.6, xgc:46.4, poss:52 },
    { pos:9,  club:"Celta Vigo",      pays:"🇪🇸", mj:32, v:11, n:9,  d:12, bp:42, bc:44, pts:42, forme:["N","V","N","D","N"], xg:40.8, xgc:42.6, poss:47 },
    { pos:10, club:"Betis",           pays:"🇪🇸", mj:32, v:11, n:8,  d:13, bp:40, bc:46, pts:41, forme:["D","N","V","N","V"], xg:39.2, xgc:44.8, poss:52 },
    { pos:11, club:"Rayo Vallecano",  pays:"🇪🇸", mj:32, v:10, n:9,  d:13, bp:36, bc:44, pts:39, forme:["N","D","N","V","N"], xg:35.6, xgc:43.0, poss:44 },
    { pos:12, club:"Las Palmas",      pays:"🇪🇸", mj:32, v:9,  n:10, d:13, bp:38, bc:48, pts:37, forme:["D","N","V","N","D"], xg:37.2, xgc:46.6, poss:46 },
    { pos:13, club:"Getafe",          pays:"🇪🇸", mj:32, v:9,  n:7,  d:16, bp:30, bc:44, pts:34, forme:["D","N","D","V","N"], xg:29.4, xgc:43.2, poss:41 },
    { pos:14, club:"Osasuna",         pays:"🇪🇸", mj:32, v:8,  n:9,  d:15, bp:34, bc:50, pts:33, forme:["D","D","N","V","D"], xg:33.4, xgc:48.8, poss:43 },
    { pos:15, club:"Alavés",          pays:"🇪🇸", mj:32, v:9,  n:6,  d:17, bp:32, bc:52, pts:33, forme:["V","D","D","N","D"], xg:31.6, xgc:51.0, poss:40 },
    { pos:16, club:"Valladolid",      pays:"🇪🇸", mj:32, v:7,  n:8,  d:17, bp:28, bc:54, pts:29, forme:["D","N","D","D","V"], xg:27.8, xgc:53.2, poss:39 },
    { pos:17, club:"Espanyol",        pays:"🇪🇸", mj:32, v:6,  n:9,  d:17, bp:30, bc:56, pts:27, forme:["D","D","N","D","N"], xg:29.6, xgc:55.0, poss:41 },
    { pos:18, club:"Leganés",         pays:"🇪🇸", mj:32, v:5,  n:8,  d:19, bp:24, bc:60, pts:23, forme:["D","D","D","N","D"], xg:23.8, xgc:58.6, poss:38 },
    { pos:19, club:"Valencia",        pays:"🇪🇸", mj:32, v:5,  n:6,  d:21, bp:26, bc:64, pts:21, forme:["D","D","D","D","V"], xg:25.4, xgc:62.4, poss:43 },
    { pos:20, club:"Almeria",         pays:"🇪🇸", mj:32, v:3,  n:5,  d:24, bp:20, bc:72, pts:14, forme:["D","D","D","D","N"], xg:19.8, xgc:70.2, poss:36 },
  ],

  "Ligue 1": [
    { pos:1,  club:"PSG",             pays:"🇫🇷", mj:32, v:26, n:4,  d:2,  bp:86, bc:24, pts:82, forme:["V","V","V","V","V"], xg:80.4, xgc:23.2, poss:65 },
    { pos:2,  club:"Monaco",          pays:"🇫🇷", mj:32, v:20, n:7,  d:5,  bp:64, bc:32, pts:67, forme:["V","N","V","V","D"], xg:60.2, xgc:30.8, poss:55 },
    { pos:3,  club:"Nice",            pays:"🇫🇷", mj:32, v:18, n:7,  d:7,  bp:52, bc:30, pts:61, forme:["V","V","D","N","V"], xg:49.6, xgc:29.2, poss:53 },
    { pos:4,  club:"Marseille",       pays:"🇫🇷", mj:32, v:17, n:7,  d:8,  bp:54, bc:34, pts:58, forme:["D","V","V","N","V"], xg:52.0, xgc:33.0, poss:51 },
    { pos:5,  club:"Lille",           pays:"🇫🇷", mj:32, v:16, n:8,  d:8,  bp:48, bc:32, pts:56, forme:["N","V","N","V","V"], xg:46.2, xgc:31.4, poss:52 },
    { pos:6,  club:"Lens",            pays:"🇫🇷", mj:32, v:15, n:6,  d:11, bp:46, bc:38, pts:51, forme:["V","D","V","N","D"], xg:44.4, xgc:37.2, poss:49 },
    { pos:7,  club:"Lyon",            pays:"🇫🇷", mj:32, v:13, n:9,  d:10, bp:48, bc:42, pts:48, forme:["N","V","D","N","V"], xg:46.0, xgc:41.0, poss:54 },
    { pos:8,  club:"Rennes",          pays:"🇫🇷", mj:32, v:12, n:9,  d:11, bp:42, bc:40, pts:45, forme:["D","N","V","N","D"], xg:40.6, xgc:39.4, poss:50 },
    { pos:9,  club:"Strasbourg",      pays:"🇫🇷", mj:32, v:11, n:8,  d:13, bp:40, bc:44, pts:41, forme:["V","D","N","D","V"], xg:38.8, xgc:43.2, poss:47 },
    { pos:10, club:"Reims",           pays:"🇫🇷", mj:32, v:10, n:9,  d:13, bp:36, bc:42, pts:39, forme:["N","N","V","D","N"], xg:35.4, xgc:41.0, poss:45 },
    { pos:11, club:"Nantes",          pays:"🇫🇷", mj:32, v:10, n:7,  d:15, bp:38, bc:48, pts:37, forme:["D","V","D","N","V"], xg:37.2, xgc:47.2, poss:44 },
    { pos:12, club:"Brest",           pays:"🇫🇷", mj:32, v:9,  n:8,  d:15, bp:36, bc:46, pts:35, forme:["N","D","V","D","N"], xg:35.0, xgc:45.4, poss:46 },
    { pos:13, club:"Toulouse",        pays:"🇫🇷", mj:32, v:9,  n:7,  d:16, bp:34, bc:50, pts:34, forme:["D","N","D","V","D"], xg:33.4, xgc:49.0, poss:45 },
    { pos:14, club:"Montpellier",     pays:"🇫🇷", mj:32, v:7,  n:8,  d:17, bp:32, bc:54, pts:29, forme:["D","D","N","D","V"], xg:31.6, xgc:53.2, poss:43 },
    { pos:15, club:"Auxerre",         pays:"🇫🇷", mj:32, v:7,  n:7,  d:18, bp:30, bc:56, pts:28, forme:["D","D","V","D","N"], xg:29.8, xgc:55.0, poss:42 },
    { pos:16, club:"Angers",          pays:"🇫🇷", mj:32, v:6,  n:9,  d:17, bp:30, bc:58, pts:27, forme:["N","D","D","N","D"], xg:29.4, xgc:57.0, poss:41 },
    { pos:17, club:"Le Havre",        pays:"🇫🇷", mj:32, v:6,  n:7,  d:19, bp:28, bc:60, pts:25, forme:["D","D","N","D","V"], xg:27.6, xgc:59.2, poss:40 },
    { pos:18, club:"Saint-Étienne",   pays:"🇫🇷", mj:32, v:4,  n:6,  d:22, bp:22, bc:68, pts:18, forme:["D","D","D","D","D"], xg:21.8, xgc:66.8, poss:38 },
  ],

  "Serie A": [
    { pos:1,  club:"Napoli",          pays:"🇮🇹", mj:32, v:23, n:5,  d:4,  bp:68, bc:28, pts:74, forme:["V","V","V","N","V"], xg:64.6, xgc:27.2, poss:57 },
    { pos:2,  club:"Inter Milan",     pays:"🇮🇹", mj:32, v:22, n:6,  d:4,  bp:72, bc:30, pts:72, forme:["V","V","N","V","V"], xg:68.4, xgc:29.0, poss:56 },
    { pos:3,  club:"AC Milan",        pays:"🇮🇹", mj:32, v:19, n:6,  d:7,  bp:60, bc:34, pts:63, forme:["V","D","V","V","N"], xg:57.6, xgc:33.2, poss:53 },
    { pos:4,  club:"Juventus",        pays:"🇮🇹", mj:32, v:17, n:8,  d:7,  bp:54, bc:32, pts:59, forme:["N","V","V","N","V"], xg:51.4, xgc:31.4, poss:55 },
    { pos:5,  club:"Atalanta",        pays:"🇮🇹", mj:32, v:16, n:4,  d:12, bp:58, bc:50, pts:52, forme:["V","V","D","D","V"], xg:55.8, xgc:48.4, poss:49 },
    { pos:6,  club:"AS Roma",         pays:"🇮🇹", mj:32, v:15, n:7,  d:10, bp:50, bc:38, pts:52, forme:["D","V","N","V","D"], xg:48.0, xgc:37.0, poss:52 },
    { pos:7,  club:"Lazio",           pays:"🇮🇹", mj:32, v:14, n:8,  d:10, bp:48, bc:40, pts:50, forme:["V","N","D","V","N"], xg:46.2, xgc:39.2, poss:51 },
    { pos:8,  club:"Fiorentina",      pays:"🇮🇹", mj:32, v:13, n:9,  d:10, bp:46, bc:40, pts:48, forme:["N","D","V","N","V"], xg:44.2, xgc:39.0, poss:50 },
    { pos:9,  club:"Bologna",         pays:"🇮🇹", mj:32, v:13, n:7,  d:12, bp:44, bc:42, pts:46, forme:["V","N","D","V","N"], xg:42.6, xgc:41.4, poss:48 },
    { pos:10, club:"Torino",          pays:"🇮🇹", mj:32, v:11, n:9,  d:12, bp:40, bc:42, pts:42, forme:["N","V","D","N","V"], xg:39.0, xgc:41.2, poss:46 },
    { pos:11, club:"Udinese",         pays:"🇮🇹", mj:32, v:11, n:7,  d:14, bp:36, bc:44, pts:40, forme:["D","N","V","D","N"], xg:35.4, xgc:43.4, poss:43 },
    { pos:12, club:"Genoa",           pays:"🇮🇹", mj:32, v:10, n:8,  d:14, bp:38, bc:48, pts:38, forme:["N","D","N","V","D"], xg:37.2, xgc:47.2, poss:44 },
    { pos:13, club:"Hellas Verona",   pays:"🇮🇹", mj:32, v:9,  n:9,  d:14, bp:36, bc:48, pts:36, forme:["D","N","V","D","N"], xg:35.2, xgc:47.0, poss:43 },
    { pos:14, club:"Monza",           pays:"🇮🇹", mj:32, v:9,  n:8,  d:15, bp:34, bc:48, pts:35, forme:["D","D","V","N","D"], xg:33.6, xgc:47.4, poss:44 },
    { pos:15, club:"Lecce",           pays:"🇮🇹", mj:32, v:8,  n:9,  d:15, bp:32, bc:50, pts:33, forme:["N","D","D","V","N"], xg:31.8, xgc:49.2, poss:42 },
    { pos:16, club:"Cagliari",        pays:"🇮🇹", mj:32, v:8,  n:8,  d:16, bp:34, bc:54, pts:32, forme:["D","N","D","V","D"], xg:33.4, xgc:53.0, poss:43 },
    { pos:17, club:"Parma",           pays:"🇮🇹", mj:32, v:7,  n:8,  d:17, bp:30, bc:54, pts:29, forme:["D","D","N","D","V"], xg:29.6, xgc:53.4, poss:41 },
    { pos:18, club:"Venezia",         pays:"🇮🇹", mj:32, v:5,  n:7,  d:20, bp:26, bc:64, pts:22, forme:["D","D","D","N","D"], xg:25.8, xgc:63.2, poss:39 },
    { pos:19, club:"Como",            pays:"🇮🇹", mj:32, v:5,  n:5,  d:22, bp:24, bc:66, pts:20, forme:["D","D","D","D","N"], xg:23.8, xgc:65.0, poss:38 },
    { pos:20, club:"Empoli",          pays:"🇮🇹", mj:32, v:4,  n:6,  d:22, bp:22, bc:68, pts:18, forme:["D","D","D","D","D"], xg:21.6, xgc:67.2, poss:37 },
  ],

  "Bundesliga": [
    { pos:1,  club:"Bayer Leverkusen",pays:"🇩🇪", mj:30, v:24, n:5,  d:1,  bp:78, bc:26, pts:77, forme:["V","V","V","V","V"], xg:74.2, xgc:25.4, poss:59 },
    { pos:2,  club:"Bayern Munich",   pays:"🇩🇪", mj:30, v:22, n:4,  d:4,  bp:82, bc:36, pts:70, forme:["V","V","D","V","V"], xg:78.6, xgc:35.2, poss:63 },
    { pos:3,  club:"RB Leipzig",      pays:"🇩🇪", mj:30, v:17, n:6,  d:7,  bp:56, bc:36, pts:57, forme:["N","V","V","D","V"], xg:53.8, xgc:35.4, poss:56 },
    { pos:4,  club:"Borussia Dortmund",pays:"🇩🇪",mj:30, v:16, n:6,  d:8,  bp:62, bc:40, pts:54, forme:["V","D","V","N","V"], xg:59.4, xgc:39.2, poss:53 },
    { pos:5,  club:"Frankfurt",       pays:"🇩🇪", mj:30, v:14, n:8,  d:8,  bp:52, bc:42, pts:50, forme:["D","V","N","V","D"], xg:50.2, xgc:41.4, poss:50 },
    { pos:6,  club:"Freiburg",        pays:"🇩🇪", mj:30, v:13, n:9,  d:8,  bp:44, bc:38, pts:48, forme:["N","N","V","D","N"], xg:42.8, xgc:37.6, poss:47 },
    { pos:7,  club:"Stuttgart",       pays:"🇩🇪", mj:30, v:13, n:6,  d:11, bp:50, bc:48, pts:45, forme:["V","D","V","N","D"], xg:48.4, xgc:47.0, poss:51 },
    { pos:8,  club:"Hoffenheim",      pays:"🇩🇪", mj:30, v:12, n:7,  d:11, bp:46, bc:46, pts:43, forme:["N","V","D","N","V"], xg:44.6, xgc:45.4, poss:49 },
    { pos:9,  club:"Wolfsburg",       pays:"🇩🇪", mj:30, v:11, n:8,  d:11, bp:42, bc:44, pts:41, forme:["D","N","V","N","D"], xg:40.8, xgc:43.6, poss:47 },
    { pos:10, club:"Werder Bremen",   pays:"🇩🇪", mj:30, v:11, n:7,  d:12, bp:40, bc:44, pts:40, forme:["N","V","D","N","V"], xg:39.2, xgc:43.2, poss:46 },
    { pos:11, club:"Borussia M'gladbach",pays:"🇩🇪",mj:30,v:11,n:6, d:13, bp:42, bc:48, pts:39, forme:["D","V","N","D","V"], xg:40.6, xgc:47.4, poss:48 },
    { pos:12, club:"Augsburg",        pays:"🇩🇪", mj:30, v:10, n:7,  d:13, bp:36, bc:46, pts:37, forme:["D","N","V","D","N"], xg:35.4, xgc:45.6, poss:44 },
    { pos:13, club:"Union Berlin",    pays:"🇩🇪", mj:30, v:9,  n:8,  d:13, bp:38, bc:50, pts:35, forme:["N","D","N","V","D"], xg:37.2, xgc:49.4, poss:45 },
    { pos:14, club:"Mainz",           pays:"🇩🇪", mj:30, v:8,  n:9,  d:13, bp:36, bc:50, pts:33, forme:["D","N","D","V","N"], xg:35.6, xgc:49.2, poss:44 },
    { pos:15, club:"Bochum",          pays:"🇩🇪", mj:30, v:7,  n:7,  d:16, bp:30, bc:54, pts:28, forme:["D","D","N","V","D"], xg:29.4, xgc:53.4, poss:41 },
    { pos:16, club:"Heidenheim",      pays:"🇩🇪", mj:30, v:6,  n:8,  d:16, bp:28, bc:56, pts:26, forme:["D","N","D","D","V"], xg:27.6, xgc:55.0, poss:40 },
    { pos:17, club:"Holstein Kiel",   pays:"🇩🇪", mj:30, v:5,  n:6,  d:19, bp:26, bc:66, pts:21, forme:["D","D","D","N","D"], xg:25.8, xgc:65.2, poss:38 },
    { pos:18, club:"St. Pauli",       pays:"🇩🇪", mj:30, v:4,  n:5,  d:21, bp:24, bc:68, pts:17, forme:["D","D","D","D","N"], xg:23.4, xgc:67.4, poss:37 },
  ],
}
