export interface SquadPlayer {
  nom: string; poste: "GK"|"DEF"|"MIL"|"ATT"; nat: string
  mj: number; buts: number; passes: number; min: number
}

export interface Squad { ligue: string; players: SquadPlayer[] }

// Notation compacte : [nom, poste, nat, mj, buts, passes, min]
function p(nom:string, poste:"GK"|"DEF"|"MIL"|"ATT", nat:string, mj:number, buts:number, passes:number, min:number): SquadPlayer {
  return { nom, poste, nat, mj, buts, passes, min }
}

export const SQUADS: Record<string, Squad> = {

  // ══════════════════════════════════════════════════════════
  //  PREMIER LEAGUE
  // ══════════════════════════════════════════════════════════

  "Liverpool": { ligue: "Premier League", players: [
    p("Alisson Becker",      "GK",  "🇧🇷", 29, 0, 0, 2610),
    p("Trent Alexander-Arnold","DEF","🏴󠁧󠁢󠁥󠁮󠁧󠁿",28, 3,14, 2380),
    p("Virgil van Dijk",     "DEF", "🇳🇱", 31, 4, 2, 2790),
    p("Ibrahima Konaté",     "DEF", "🇫🇷", 26, 2, 1, 2160),
    p("Andrew Robertson",    "DEF", "🏴󠁧󠁢󠁳󠁣󠁴󠁿", 27, 1, 9, 2310),
    p("Dominik Szoboszlai",  "MIL", "🇭🇺", 28, 7,11, 2180),
    p("Alexis Mac Allister", "MIL", "🇦🇷", 30, 5,12, 2460),
    p("Ryan Gravenberch",    "MIL", "🇳🇱", 30, 3, 8, 2520),
    p("Harvey Elliott",      "MIL", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 24, 4, 7, 1680),
    p("Mohamed Salah",       "ATT", "🇪🇬", 30,24,16, 2580),
    p("Luis Díaz",           "ATT", "🇨🇴", 28,13, 9, 2240),
    p("Darwin Núñez",        "ATT", "🇺🇾", 26,12, 5, 1820),
    p("Diogo Jota",          "ATT", "🇵🇹", 22, 9, 4, 1540),
  ]},

  "Arsenal": { ligue: "Premier League", players: [
    p("David Raya",          "GK",  "🇪🇸", 32, 0, 0, 2880),
    p("Ben White",           "DEF", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 29, 2, 8, 2430),
    p("William Saliba",      "DEF", "🇫🇷", 31, 2, 1, 2790),
    p("Gabriel Magalhães",   "DEF", "🇧🇷", 30, 5, 2, 2610),
    p("Oleks. Zinchenko",    "DEF", "🇺🇦", 20, 1, 5, 1680),
    p("Martin Ødegaard",     "MIL", "🇳🇴", 27, 8,11, 2260),
    p("Declan Rice",         "MIL", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 30, 7, 7, 2520),
    p("Thomas Partey",       "MIL", "🇬🇭", 24, 2, 4, 1920),
    p("Bukayo Saka",         "ATT", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 29,16,14, 2430),
    p("Leandro Trossard",    "ATT", "🇧🇪", 26, 9, 7, 1860),
    p("Gabriel Martinelli",  "ATT", "🇧🇷", 24, 8, 6, 1680),
    p("Kai Havertz",         "ATT", "🇩🇪", 27,11, 8, 2160),
  ]},

  "Man City": { ligue: "Premier League", players: [
    p("Ederson",             "GK",  "🇧🇷", 28, 0, 0, 2520),
    p("Kyle Walker",         "DEF", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 26, 1, 4, 2160),
    p("Rúben Dias",          "DEF", "🇵🇹", 27, 1, 2, 2430),
    p("Manuel Akanji",       "DEF", "🇨🇭", 25, 0, 1, 2100),
    p("Joško Gvardiol",      "DEF", "🇭🇷", 28, 6, 4, 2380),
    p("Rodri",               "MIL", "🇪🇸", 25, 4,10, 2100),
    p("Kevin De Bruyne",     "MIL", "🇧🇪", 22, 5,14, 1760),
    p("Bernardo Silva",      "MIL", "🇵🇹", 29, 8,12, 2310),
    p("Phil Foden",          "MIL", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 27,15,12, 2180),
    p("Erling Haaland",      "ATT", "🇳🇴", 28,26, 5, 2360),
    p("Jeremy Doku",         "ATT", "🇧🇪", 25, 6, 9, 1820),
    p("Jack Grealish",       "ATT", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 20, 4, 6, 1400),
  ]},

  "Chelsea": { ligue: "Premier League", players: [
    p("Robert Sánchez",      "GK",  "🇪🇸", 29, 0, 0, 2610),
    p("Reece James",         "DEF", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 18, 1, 5, 1440),
    p("Levi Colwill",        "DEF", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 27, 2, 2, 2160),
    p("Benoît Badiashile",   "DEF", "🇫🇷", 24, 1, 1, 1920),
    p("Marc Cucurella",      "DEF", "🇪🇸", 28, 2, 5, 2240),
    p("Moises Caicedo",      "MIL", "🇪🇨", 30, 3, 6, 2460),
    p("Enzo Fernández",      "MIL", "🇦🇷", 26, 5, 9, 2080),
    p("Cole Palmer",         "MIL", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 28,18,11, 2350),
    p("Noni Madueke",        "ATT", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 25, 9, 7, 1800),
    p("Nicolas Jackson",     "ATT", "🇸🇳", 28,14, 6, 2100),
    p("Christopher Nkunku",  "ATT", "🇫🇷", 18, 6, 4, 1200),
    p("Raheem Sterling",     "ATT", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 14, 3, 3,  900),
  ]},

  "Newcastle": { ligue: "Premier League", players: [
    p("Nick Pope",           "GK",  "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 28, 0, 0, 2520),
    p("Kieran Trippier",     "DEF", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 26, 3, 8, 2160),
    p("Fabian Schär",        "DEF", "🇨🇭", 30, 3, 2, 2610),
    p("Dan Burn",            "DEF", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 28, 2, 3, 2380),
    p("Sven Botman",         "DEF", "🇳🇱", 22, 0, 1, 1800),
    p("Bruno Guimarães",     "MIL", "🇧🇷", 29, 6,10, 2430),
    p("Joelinton",           "MIL", "🇧🇷", 26, 4, 6, 2040),
    p("Sandro Tonali",       "MIL", "🇮🇹", 24, 4, 7, 1920),
    p("Alexander Isak",      "ATT", "🇸🇪", 26,18, 5, 2120),
    p("Anthony Gordon",      "ATT", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 28,11, 9, 2240),
    p("Harvey Barnes",       "ATT", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 22, 7, 5, 1540),
  ]},

  "Aston Villa": { ligue: "Premier League", players: [
    p("Emiliano Martínez",   "GK",  "🇦🇷", 30, 0, 0, 2700),
    p("Matty Cash",          "DEF", "🇵🇱", 27, 2, 5, 2160),
    p("Pau Torres",          "DEF", "🇪🇸", 28, 2, 2, 2380),
    p("Ezri Konsa",          "DEF", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 26, 3, 1, 2160),
    p("Lucas Digne",         "DEF", "🇫🇷", 22, 1, 4, 1760),
    p("Douglas Luiz",        "MIL", "🇧🇷", 22, 3, 5, 1760),
    p("Youri Tielemans",     "MIL", "🇧🇪", 26, 5, 7, 2040),
    p("John McGinn",         "MIL", "🏴󠁧󠁢󠁳󠁣󠁴󠁿", 28, 6, 5, 2240),
    p("Ollie Watkins",       "ATT", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 30,19,10, 2540),
    p("Leon Bailey",         "ATT", "🇯🇲", 24, 8, 7, 1680),
    p("Moussa Diaby",        "ATT", "🇫🇷", 22, 6, 5, 1540),
  ]},

  "Tottenham": { ligue: "Premier League", players: [
    p("Guglielmo Vicario",   "GK",  "🇮🇹", 30, 0, 0, 2700),
    p("Pedro Porro",         "DEF", "🇪🇸", 29, 4, 9, 2410),
    p("Micky van de Ven",    "DEF", "🇳🇱", 22, 1, 1, 1800),
    p("Cristian Romero",     "DEF", "🇦🇷", 26, 2, 1, 2160),
    p("Destiny Udogie",      "DEF", "🇮🇹", 24, 2, 4, 1920),
    p("Yves Bissouma",       "MIL", "🇲🇱", 28, 2, 3, 2200),
    p("James Maddison",      "MIL", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 24, 8,10, 1920),
    p("Dejan Kulusevski",    "ATT", "🇸🇪", 26, 9, 8, 2100),
    p("Dominic Solanke",     "ATT", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 28,14, 6, 2240),
    p("Son Heung-min",       "ATT", "🇰🇷", 27,12, 7, 2160),
    p("Brennan Johnson",     "ATT", "🏴󠁧󠁢󠁷󠁬󠁳󠁿", 22, 7, 5, 1660),
  ]},

  "Brighton": { ligue: "Premier League", players: [
    p("Bart Verbruggen",     "GK",  "🇳🇱", 28, 0, 0, 2520),
    p("Joel Veltman",        "DEF", "🇳🇱", 24, 1, 3, 1920),
    p("Lewis Dunk",          "DEF", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 30, 2, 1, 2610),
    p("Adam Webster",        "DEF", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 22, 1, 0, 1760),
    p("Pervis Estupiñán",    "DEF", "🇪🇨", 20, 1, 4, 1580),
    p("Moisés Caicedo",      "MIL", "🇪🇨", 14, 1, 2, 1080),
    p("Pascal Groß",         "MIL", "🇩🇪", 26, 5, 9, 2040),
    p("Kaoru Mitoma",        "ATT", "🇯🇵", 24, 9, 8, 1920),
    p("Joao Pedro",          "ATT", "🇧🇷", 27,13, 7, 2160),
    p("Facundo Buonanotte",  "ATT", "🇦🇷", 22, 5, 6, 1540),
    p("Evan Ferguson",       "ATT", "🇮🇪", 18, 6, 3, 1200),
  ]},

  "Brentford": { ligue: "Premier League", players: [
    p("Mark Flekken",        "GK",  "🇳🇱", 28, 0, 0, 2520),
    p("Aaron Hickey",        "DEF", "🏴󠁧󠁢󠁳󠁣󠁴󠁿", 22, 2, 4, 1720),
    p("Ethan Pinnock",       "DEF", "🇯🇲", 26, 2, 0, 2160),
    p("Ben Mee",             "DEF", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 24, 1, 0, 1920),
    p("Rico Henry",          "DEF", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 20, 1, 3, 1600),
    p("Vitaly Janelt",       "MIL", "🇩🇪", 26, 4, 5, 2080),
    p("Christian Nørgaard",  "MIL", "🇩🇰", 28, 3, 4, 2240),
    p("Kevin Schade",        "ATT", "🇩🇪", 22, 6, 5, 1620),
    p("Bryan Mbeumo",        "ATT", "🇨🇲", 28,16, 9, 2240),
    p("Yoane Wissa",         "ATT", "🇨🇩", 24,13, 6, 1920),
    p("Ivan Toney",          "ATT", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 14, 7, 3,  980),
  ]},

  "Fulham": { ligue: "Premier League", players: [
    p("Bernd Leno",          "GK",  "🇩🇪", 30, 0, 0, 2700),
    p("Kenny Tete",          "DEF", "🇳🇱", 24, 1, 4, 1920),
    p("Calvin Bassey",       "DEF", "🇳🇬", 26, 2, 1, 2080),
    p("Tosin Adarabioyo",    "DEF", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 28, 2, 0, 2380),
    p("Antonee Robinson",    "DEF", "🇺🇸", 26, 2, 5, 2080),
    p("Andreas Pereira",     "MIL", "🇧🇷", 28, 6, 9, 2240),
    p("Tom Cairney",         "MIL", "🏴󠁧󠁢󠁳󠁣󠁴󠁿", 20, 2, 4, 1560),
    p("Sasa Lukic",          "MIL", "🇷🇸", 22, 3, 4, 1680),
    p("Raúl Jiménez",        "ATT", "🇲🇽", 26,12, 5, 1980),
    p("Willian",             "ATT", "🇧🇷", 18, 3, 5, 1260),
    p("Rodrigo Muniz",       "ATT", "🇧🇷", 24,10, 4, 1800),
  ]},

  "West Ham": { ligue: "Premier League", players: [
    p("Lukasz Fabianski",    "GK",  "🇵🇱", 24, 0, 0, 2160),
    p("Ben Johnson",         "DEF", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 20, 0, 2, 1560),
    p("Nayef Aguerd",        "DEF", "🇲🇦", 22, 1, 0, 1760),
    p("Kurt Zouma",          "DEF", "🇫🇷", 20, 1, 0, 1620),
    p("Emerson Palmieri",    "DEF", "🇮🇹", 18, 0, 2, 1380),
    p("Tomáš Souček",        "MIL", "🇨🇿", 28, 6, 4, 2240),
    p("James Ward-Prowse",   "MIL", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 26, 7, 6, 2000),
    p("Lucas Paquetá",       "MIL", "🇧🇷", 24, 5, 8, 1920),
    p("Mohammed Kudus",      "ATT", "🇬🇭", 26,11, 7, 1980),
    p("Jarrod Bowen",        "ATT", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 28, 9, 7, 2240),
    p("Danny Ings",          "ATT", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 16, 4, 3, 1080),
  ]},

  "Man United": { ligue: "Premier League", players: [
    p("André Onana",         "GK",  "🇨🇲", 28, 0, 0, 2520),
    p("Diogo Dalot",         "DEF", "🇵🇹", 26, 2, 5, 2080),
    p("Raphaël Varane",      "DEF", "🇫🇷", 16, 0, 0, 1280),
    p("Lisandro Martínez",   "DEF", "🇦🇷", 14, 1, 0, 1100),
    p("Luke Shaw",           "DEF", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 12, 1, 3,  960),
    p("Casemiro",            "MIL", "🇧🇷", 22, 3, 3, 1760),
    p("Bruno Fernandes",     "MIL", "🇵🇹", 28,10,13, 2380),
    p("Mason Mount",         "MIL", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 14, 2, 3,  980),
    p("Marcus Rashford",     "ATT", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 22, 8, 4, 1680),
    p("Rasmus Højlund",      "ATT", "🇩🇰", 24,10, 3, 1920),
    p("Alejandro Garnacho",  "ATT", "🇦🇷", 24, 7, 6, 1800),
  ]},

  "Crystal Palace": { ligue: "Premier League", players: [
    p("Dean Henderson",      "GK",  "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 28, 0, 0, 2520),
    p("Joel Ward",           "DEF", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 22, 0, 2, 1760),
    p("Marc Guéhi",          "DEF", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 30, 2, 1, 2610),
    p("Joachim Andersen",    "DEF", "🇩🇰", 26, 1, 1, 2080),
    p("Tyrick Mitchell",     "DEF", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 24, 1, 3, 1920),
    p("Cheick Doucouré",     "MIL", "🇲🇱", 22, 2, 3, 1760),
    p("Eberechi Eze",        "ATT", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 28,12,10, 2240),
    p("Michael Olise",       "ATT", "🇫🇷", 20, 8, 7, 1560),
    p("Jean-Philippe Mateta","ATT", "🇫🇷", 28,16, 5, 2100),
    p("Jordan Ayew",         "ATT", "🇬🇭", 20, 4, 3, 1400),
  ]},

  "Wolverhampton": { ligue: "Premier League", players: [
    p("José Sá",             "GK",  "🇵🇹", 28, 0, 0, 2520),
    p("Matt Doherty",        "DEF", "🇮🇪", 20, 1, 3, 1600),
    p("Max Kilman",          "DEF", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 28, 1, 1, 2380),
    p("Toti",                "DEF", "🇵🇹", 22, 0, 0, 1760),
    p("Rayan Aït-Nouri",     "DEF", "🇫🇷", 26, 2, 5, 2080),
    p("João Gomes",          "MIL", "🇧🇷", 26, 3, 4, 2000),
    p("Matheus Nunes",       "MIL", "🇵🇹", 24, 4, 6, 1920),
    p("Pedro Neto",          "ATT", "🇵🇹", 22, 6, 8, 1720),
    p("Pablo Sarabia",       "ATT", "🇪🇸", 18, 4, 4, 1260),
    p("Hee-chan Hwang",       "ATT", "🇰🇷", 24, 9, 4, 1800),
    p("Matheus Cunha",       "ATT", "🇧🇷", 26,12, 7, 2080),
  ]},

  "Everton": { ligue: "Premier League", players: [
    p("Jordan Pickford",     "GK",  "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 30, 0, 0, 2700),
    p("Seamus Coleman",      "DEF", "🇮🇪", 16, 0, 1, 1200),
    p("James Tarkowski",     "DEF", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 28, 2, 0, 2380),
    p("Michael Keane",       "DEF", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 22, 1, 0, 1760),
    p("Vitaliy Mykolenko",   "DEF", "🇺🇦", 22, 0, 2, 1720),
    p("Idrissa Gueye",       "MIL", "🇸🇳", 22, 2, 3, 1680),
    p("Abdoulaye Doucouré",  "MIL", "🇫🇷", 24, 4, 4, 1920),
    p("Dwight McNeil",       "ATT", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 26, 6, 7, 2080),
    p("Dominic Calvert-Lewin","ATT","🏴󠁧󠁢󠁥󠁮󠁧󠁿", 22, 9, 3, 1620),
    p("Beto",                "ATT", "🇵🇹", 20, 6, 2, 1440),
  ]},

  "Nottm Forest": { ligue: "Premier League", players: [
    p("Matt Turner",         "GK",  "🇺🇸", 14, 0, 0, 1260),
    p("Neco Williams",       "DEF", "🏴󠁧󠁢󠁷󠁬󠁳󠁿", 26, 2, 4, 2080),
    p("Joe Worrall",         "DEF", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 22, 1, 0, 1760),
    p("Murillo",             "DEF", "🇧🇷", 26, 2, 0, 2080),
    p("Harry Toffolo",       "DEF", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 18, 0, 2, 1380),
    p("Danilo",              "MIL", "🇧🇷", 22, 3, 4, 1760),
    p("Morgan Gibbs-White",  "MIL", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 26, 7, 8, 2080),
    p("Anthony Elanga",      "ATT", "🇸🇪", 24, 8, 6, 1920),
    p("Callum Hudson-Odoi",  "ATT", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 20, 5, 6, 1540),
    p("Chris Wood",          "ATT", "🇳🇿", 24,12, 3, 1800),
  ]},

  "Bournemouth": { ligue: "Premier League", players: [
    p("Neto",                "GK",  "🇧🇷", 28, 0, 0, 2520),
    p("Adam Smith",          "DEF", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 18, 0, 2, 1380),
    p("Lloyd Kelly",         "DEF", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 22, 1, 0, 1760),
    p("Chris Mepham",        "DEF", "🏴󠁧󠁢󠁷󠁬󠁳󠁿", 20, 0, 0, 1560),
    p("Milos Kerkez",        "DEF", "🇭🇺", 22, 2, 5, 1760),
    p("Ryan Christie",       "MIL", "🏴󠁧󠁢󠁳󠁣󠁴󠁿", 24, 4, 5, 1920),
    p("Alex Scott",          "MIL", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 20, 3, 5, 1580),
    p("Justin Kluivert",     "ATT", "🇳🇱", 24,11, 8, 1920),
    p("Dominic Solanke",     "ATT", "🏴󠁧󠁢󠁥󠁮󠁧󠁿",  8, 3, 1,  560),
    p("Antoine Semenyo",     "ATT", "🇬🇭", 22, 8, 4, 1680),
    p("Dango Ouattara",      "ATT", "🇧🇫", 20, 6, 5, 1480),
  ]},

  "Ipswich Town": { ligue: "Premier League", players: [
    p("Arijanet Muric",      "GK",  "🇽🇰", 26, 0, 0, 2340),
    p("Leif Davis",          "DEF", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 24, 2, 5, 1920),
    p("Cameron Burgess",     "DEF", "🇦🇺", 22, 1, 0, 1760),
    p("Luke Woolfenden",     "DEF", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 20, 0, 0, 1560),
    p("Sam Morsy",           "MIL", "🇪🇬", 22, 2, 3, 1760),
    p("Kalvin Phillips",     "MIL", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 16, 1, 2, 1200),
    p("Omari Hutchinson",    "ATT", "🇦🇬", 22, 5, 6, 1680),
    p("Liam Delap",          "ATT", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 26, 9, 3, 1980),
    p("Wes Burns",           "ATT", "🏴󠁧󠁢󠁷󠁬󠁳󠁿", 18, 3, 4, 1260),
  ]},

  "Leicester City": { ligue: "Premier League", players: [
    p("Mads Hermansen",      "GK",  "🇩🇰", 24, 0, 0, 2160),
    p("James Justin",        "DEF", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 18, 1, 2, 1380),
    p("Wout Faes",           "DEF", "🇧🇪", 22, 1, 0, 1760),
    p("Jannik Vestergaard",  "DEF", "🇩🇰", 20, 1, 0, 1560),
    p("Stephy Mavididi",     "ATT", "🇨🇩", 20, 5, 4, 1540),
    p("Kiernan Dewsbury-Hall","MIL","🏴󠁧󠁢󠁥󠁮󠁧󠁿", 22, 5, 7, 1760),
    p("Wilfred Ndidi",       "MIL", "🇳🇬", 18, 1, 2, 1380),
    p("Jamie Vardy",         "ATT", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 14, 4, 2,  980),
  ]},

  "Southampton": { ligue: "Premier League", players: [
    p("Aaron Ramsdale",      "GK",  "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 20, 0, 0, 1800),
    p("Kyle Walker-Peters",  "DEF", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 18, 1, 2, 1380),
    p("Jan Bednarek",        "DEF", "🇵🇱", 22, 0, 0, 1760),
    p("Yukinari Sugawara",   "DEF", "🇯🇵", 16, 0, 2, 1200),
    p("Flynn Downes",        "MIL", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 18, 1, 2, 1380),
    p("Adam Armstrong",      "ATT", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 20, 5, 2, 1480),
    p("Che Adams",           "ATT", "🏴󠁧󠁢󠁳󠁣󠁴󠁿", 16, 4, 2, 1200),
  ]},

  // ══════════════════════════════════════════════════════════
  //  LIGA
  // ══════════════════════════════════════════════════════════

  "Real Madrid": { ligue: "Liga", players: [
    p("Thibaut Courtois",    "GK",  "🇧🇪", 24, 0, 0, 2160),
    p("Dani Carvajal",       "DEF", "🇪🇸", 26, 2, 6, 2160),
    p("Éder Militão",        "DEF", "🇧🇷", 28, 2, 1, 2380),
    p("Antonio Rüdiger",     "DEF", "🇩🇪", 30, 3, 1, 2610),
    p("David Alaba",         "DEF", "🇦🇹", 18, 1, 3, 1440),
    p("Luka Modrić",         "MIL", "🇭🇷", 22, 3, 8, 1760),
    p("Aurélien Tchouaméni", "MIL", "🇫🇷", 26, 4, 5, 2080),
    p("Eduardo Camavinga",   "MIL", "🇫🇷", 24, 3, 6, 1920),
    p("Jude Bellingham",     "MIL", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 28,17,11, 2320),
    p("Kylian Mbappé",       "ATT", "🇫🇷", 30,26, 9, 2560),
    p("Vinícius Jr",         "ATT", "🇧🇷", 29,20,13, 2380),
    p("Rodrygo",             "ATT", "🇧🇷", 26, 9, 8, 1980),
  ]},

  "FC Barcelone": { ligue: "Liga", players: [
    p("Marc-André ter Stegen","GK", "🇩🇪",  8, 0, 0,  720),
    p("Iñigo Martínez",      "DEF", "🇪🇸", 26, 2, 1, 2160),
    p("Ronald Araújo",       "DEF", "🇺🇾", 22, 1, 0, 1760),
    p("Pau Cubarsí",         "DEF", "🇪🇸", 24, 2, 1, 1920),
    p("Alejandro Balde",     "DEF", "🇪🇸", 26, 2, 6, 2080),
    p("Pedri",               "MIL", "🇪🇸", 24, 7,11, 1960),
    p("Gavi",                "MIL", "🇪🇸", 22, 4, 8, 1760),
    p("Frenkie de Jong",     "MIL", "🇳🇱", 20, 2, 5, 1580),
    p("Lamine Yamal",        "ATT", "🇪🇸", 31,14,19, 2560),
    p("Raphinha",            "ATT", "🇧🇷", 28,14,11, 2240),
    p("Ferran Torres",       "ATT", "🇪🇸", 25,12, 8, 1820),
    p("Robert Lewandowski",  "ATT", "🇵🇱", 26,16, 6, 2080),
  ]},

  "Atlético Madrid": { ligue: "Liga", players: [
    p("Jan Oblak",           "GK",  "🇸🇮", 28, 0, 0, 2520),
    p("Nahuel Molina",       "DEF", "🇦🇷", 26, 3, 5, 2080),
    p("José María Giménez",  "DEF", "🇺🇾", 24, 2, 0, 1920),
    p("César Azpilicueta",   "DEF", "🇪🇸", 20, 0, 2, 1580),
    p("Reinildo Mandava",    "DEF", "🇲🇿", 22, 0, 1, 1760),
    p("Marcos Llorente",     "MIL", "🇪🇸", 28, 6, 9, 2180),
    p("Koke",                "MIL", "🇪🇸", 24, 2, 5, 1920),
    p("Rodrigo De Paul",     "MIL", "🇦🇷", 24, 4, 6, 1920),
    p("Antoine Griezmann",   "ATT", "🇫🇷", 30,15,10, 2480),
    p("Álvaro Morata",       "ATT", "🇪🇸", 24,11, 5, 1920),
    p("Samuel Lino",         "ATT", "🇵🇹", 22, 6, 6, 1680),
  ]},

  "Athletic Bilbao": { ligue: "Liga", players: [
    p("Unai Simón",          "GK",  "🇪🇸", 30, 0, 0, 2700),
    p("Dani Vivian",         "DEF", "🇪🇸", 28, 2, 1, 2380),
    p("Yeray Álvarez",       "DEF", "🇪🇸", 26, 2, 0, 2160),
    p("Mikel Jauregizar",    "DEF", "🇪🇸", 20, 0, 1, 1560),
    p("Oihan Sancet",        "MIL", "🇪🇸", 28, 9, 8, 2240),
    p("Nico Williams",       "ATT", "🇪🇸", 30,13,10, 2480),
    p("Gorka Guruzeta",      "ATT", "🇪🇸", 26,14, 5, 2000),
    p("Alex Berenguer",      "ATT", "🇪🇸", 22, 6, 5, 1680),
  ]},

  // ══════════════════════════════════════════════════════════
  //  LIGUE 1
  // ══════════════════════════════════════════════════════════

  "PSG": { ligue: "Ligue 1", players: [
    p("Gianluigi Donnarumma","GK",  "🇮🇹", 29, 0, 0, 2610),
    p("Achraf Hakimi",       "DEF", "🇲🇦", 30, 5,12, 2560),
    p("Marquinhos",          "DEF", "🇧🇷", 28, 3, 2, 2380),
    p("Lucas Hernández",     "DEF", "🇫🇷", 20, 0, 1, 1580),
    p("Nuno Mendes",         "DEF", "🇵🇹", 24, 2, 6, 1920),
    p("Vitinha",             "MIL", "🇵🇹", 29, 6,13, 2420),
    p("Warren Zaïre-Emery",  "MIL", "🇫🇷", 26, 5, 9, 2080),
    p("João Neves",          "MIL", "🇵🇹", 22, 3, 7, 1760),
    p("Ousmane Dembélé",     "ATT", "🇫🇷", 28,13,15, 2180),
    p("Bradley Barcola",     "ATT", "🇫🇷", 27,14,10, 2080),
    p("Désiré Doué",         "ATT", "🇫🇷", 24, 9,11, 1740),
    p("Gonçalo Ramos",       "ATT", "🇵🇹", 22, 8, 4, 1620),
  ]},

  "Monaco": { ligue: "Ligue 1", players: [
    p("Radoslaw Majecki",    "GK",  "🇵🇱", 26, 0, 0, 2340),
    p("Vanderson",           "DEF", "🇧🇷", 24, 2, 5, 1920),
    p("Wilfried Singo",      "DEF", "🇨🇮", 22, 1, 3, 1760),
    p("Mohamed Camara",      "MIL", "🇬🇳", 26, 3, 5, 2080),
    p("Denis Zakaria",       "MIL", "🇨🇭", 22, 4, 4, 1760),
    p("Wissam Ben Yedder",   "ATT", "🇫🇷", 26,16, 7, 1980),
    p("Takumi Minamino",     "ATT", "🇯🇵", 22, 7, 6, 1680),
    p("Folarin Balogun",     "ATT", "🇺🇸", 20, 6, 4, 1480),
  ]},

  "Marseille": { ligue: "Ligue 1", players: [
    p("Pau López",           "GK",  "🇪🇸", 28, 0, 0, 2520),
    p("Jonathan Clauss",     "DEF", "🇫🇷", 26, 3, 8, 2080),
    p("Samuel Gigot",        "DEF", "🇫🇷", 24, 2, 1, 1920),
    p("Chancel Mbemba",      "DEF", "🇨🇩", 22, 1, 0, 1760),
    p("Geoffrey Kondogbia",  "MIL", "🇨🇫", 22, 2, 3, 1760),
    p("Vitinha",             "MIL", "🇵🇹", 20, 4, 6, 1580),
    p("P.-E. Aubameyang",    "ATT", "🇬🇦", 25,15, 5, 1860),
    p("Iliman Ndiaye",       "ATT", "🇸🇳", 24, 9, 7, 1920),
    p("Ismaïla Sarr",        "ATT", "🇸🇳", 22, 7, 5, 1680),
  ]},

  "Lille": { ligue: "Ligue 1", players: [
    p("Lucas Chevalier",     "GK",  "🇫🇷", 28, 0, 0, 2520),
    p("Tiago Djaló",         "DEF", "🇵🇹", 18, 0, 0, 1380),
    p("Alexsandro",          "DEF", "🇧🇷", 24, 2, 1, 1920),
    p("Bafodé Diakité",      "DEF", "🇫🇷", 22, 1, 2, 1760),
    p("Benjamin André",      "MIL", "🇫🇷", 26, 3, 5, 2080),
    p("Angel Gomes",         "MIL", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 24, 5, 8, 1920),
    p("Jonathan David",      "ATT", "🇨🇦", 29,22, 6, 2380),
    p("Edon Zhegrova",       "ATT", "🇽🇰", 24, 8, 9, 1920),
    p("Mohamed Bayo",        "ATT", "🇫🇷", 18, 5, 3, 1260),
  ]},

  // ══════════════════════════════════════════════════════════
  //  SERIE A
  // ══════════════════════════════════════════════════════════

  "Napoli": { ligue: "Serie A", players: [
    p("Alex Meret",          "GK",  "🇮🇹", 28, 0, 0, 2520),
    p("Giovanni Di Lorenzo", "DEF", "🇮🇹", 30, 4, 7, 2610),
    p("Amir Rrahmani",       "DEF", "🇽🇰", 26, 2, 1, 2160),
    p("Natan",               "DEF", "🇧🇷", 24, 1, 0, 1920),
    p("Mario Rui",           "DEF", "🇵🇹", 22, 0, 3, 1760),
    p("Stanislav Lobotka",   "MIL", "🇸🇰", 28, 2, 7, 2240),
    p("Anguissa",            "MIL", "🇨🇲", 26, 4, 6, 2080),
    p("Kv. Kvaratskhelia",   "ATT", "🇬🇪", 27,12,13, 2160),
    p("Victor Osimhen",      "ATT", "🇳🇬", 26,21, 4, 2120),
    p("Matteo Politano",     "ATT", "🇮🇹", 22, 6, 5, 1680),
  ]},

  "Inter Milan": { ligue: "Serie A", players: [
    p("Yann Sommer",         "GK",  "🇨🇭", 30, 0, 0, 2700),
    p("Benjamin Pavard",     "DEF", "🇫🇷", 28, 3, 4, 2380),
    p("Francesco Acerbi",    "DEF", "🇮🇹", 26, 1, 0, 2160),
    p("Alessandro Bastoni",  "DEF", "🇮🇹", 30, 2, 4, 2610),
    p("Federico Dimarco",    "DEF", "🇮🇹", 28, 3, 8, 2240),
    p("Nicolò Barella",      "MIL", "🇮🇹", 30, 6,11, 2490),
    p("Henrikh Mkhitaryan",  "MIL", "🇦🇲", 22, 4, 6, 1760),
    p("Kristjan Asllani",    "MIL", "🇦🇱", 18, 1, 3, 1380),
    p("Lautaro Martínez",    "ATT", "🇦🇷", 30,22, 8, 2460),
    p("Marcus Thuram",       "ATT", "🇫🇷", 28,14, 9, 2240),
    p("Marko Arnautovic",    "ATT", "🇦🇹", 14, 4, 2,  980),
  ]},

  "AC Milan": { ligue: "Serie A", players: [
    p("Mike Maignan",        "GK",  "🇫🇷", 29, 0, 0, 2610),
    p("Davide Calabria",     "DEF", "🇮🇹", 24, 2, 4, 1920),
    p("Malick Thiaw",        "DEF", "🇩🇪", 26, 1, 0, 2080),
    p("Fikayo Tomori",       "DEF", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 22, 2, 1, 1760),
    p("Theo Hernández",      "DEF", "🇫🇷", 28, 5, 9, 2380),
    p("Tijjani Reijnders",   "MIL", "🇳🇱", 26, 6, 8, 2080),
    p("Ismael Bennacer",     "MIL", "🇩🇿", 18, 2, 4, 1380),
    p("Ruben Loftus-Cheek",  "MIL", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 22, 4, 5, 1760),
    p("Rafael Leão",         "ATT", "🇵🇹", 28,14,12, 2180),
    p("Christian Pulisic",   "ATT", "🇺🇸", 26,12, 9, 2080),
    p("Olivier Giroud",      "ATT", "🇫🇷", 18, 6, 2, 1260),
  ]},

  "Juventus": { ligue: "Serie A", players: [
    p("Wojciech Szczęsny",   "GK",  "🇵🇱", 26, 0, 0, 2340),
    p("Danilo",              "DEF", "🇧🇷", 22, 1, 3, 1760),
    p("Gleison Bremer",      "DEF", "🇧🇷", 28, 2, 1, 2380),
    p("Federico Gatti",      "DEF", "🇮🇹", 24, 3, 0, 1920),
    p("Alex Sandro",         "DEF", "🇧🇷", 16, 0, 2, 1200),
    p("Adrien Rabiot",       "MIL", "🇫🇷", 24, 5, 6, 1920),
    p("Manuel Locatelli",    "MIL", "🇮🇹", 26, 3, 5, 2080),
    p("Nicolás González",    "ATT", "🇦🇷", 22, 7, 5, 1680),
    p("Dusan Vlahovic",      "ATT", "🇷🇸", 27,18, 4, 2160),
    p("Federico Chiesa",     "ATT", "🇮🇹", 22, 8, 9, 1640),
    p("Kenan Yıldız",        "ATT", "🇹🇷", 20, 6, 5, 1480),
  ]},

  "Atalanta": { ligue: "Serie A", players: [
    p("Marco Carnesecchi",   "GK",  "🇮🇹", 28, 0, 0, 2520),
    p("Rafael Tolói",        "DEF", "🇧🇷", 20, 0, 0, 1580),
    p("Giorgio Scalvini",    "DEF", "🇮🇹", 24, 1, 1, 1920),
    p("Isak Hien",           "DEF", "🇸🇪", 22, 1, 0, 1760),
    p("Davide Zappacosta",   "DEF", "🇮🇹", 24, 2, 5, 1920),
    p("Ederson",             "MIL", "🇧🇷", 26, 4, 6, 2080),
    p("Teun Koopmeiners",    "MIL", "🇳🇱", 28, 8,10, 2240),
    p("Mario Pasalic",       "MIL", "🇭🇷", 22, 6, 5, 1760),
    p("Mateo Retegui",       "ATT", "🇮🇹", 26,14, 5, 2000),
    p("Charles De Ketelaere","ATT", "🇧🇪", 24,10, 9, 1920),
    p("Ademola Lookman",     "ATT", "🇳🇬", 26,13, 8, 2080),
  ]},

  // ══════════════════════════════════════════════════════════
  //  BUNDESLIGA
  // ══════════════════════════════════════════════════════════

  "Bayern Munich": { ligue: "Bundesliga", players: [
    p("Manuel Neuer",        "GK",  "🇩🇪", 26, 0, 0, 2340),
    p("Noussair Mazraoui",   "DEF", "🇲🇦", 22, 2, 5, 1760),
    p("Min-jae Kim",         "DEF", "🇰🇷", 26, 2, 0, 2160),
    p("Matthijs de Ligt",    "DEF", "🇳🇱", 22, 1, 0, 1760),
    p("Alphonso Davies",     "DEF", "🇨🇦", 26, 3, 8, 2080),
    p("Joshua Kimmich",      "MIL", "🇩🇪", 28, 3,14, 2380),
    p("Leon Goretzka",       "MIL", "🇩🇪", 22, 4, 5, 1760),
    p("Thomas Müller",       "MIL", "🇩🇪", 22, 5, 9, 1760),
    p("Leroy Sané",          "ATT", "🇩🇪", 26,12,11, 2000),
    p("Serge Gnabry",        "ATT", "🇩🇪", 24,11, 9, 1820),
    p("Harry Kane",          "ATT", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 30,30,10, 2580),
    p("Jamal Musiala",       "ATT", "🇩🇪", 28,14,12, 2240),
  ]},

  "Bayer Leverkusen": { ligue: "Bundesliga", players: [
    p("Lukáš Hrádecký",      "GK",  "🇫🇮", 28, 0, 0, 2520),
    p("Jeremie Frimpong",    "DEF", "🇳🇱", 28, 5,10, 2240),
    p("Jonathan Tah",        "DEF", "🇩🇪", 26, 2, 1, 2160),
    p("Odilon Kossounou",    "DEF", "🇨🇮", 24, 1, 0, 1920),
    p("Grimaldo",            "DEF", "🇪🇸", 26, 4, 9, 2080),
    p("Granit Xhaka",        "MIL", "🇨🇭", 28, 4, 8, 2380),
    p("Exequiel Palacios",   "MIL", "🇦🇷", 24, 3, 6, 1920),
    p("Florian Wirtz",       "MIL", "🇩🇪", 29,16,18, 2360),
    p("Jonas Hofmann",       "ATT", "🇩🇪", 22, 7, 8, 1760),
    p("Victor Boniface",     "ATT", "🇳🇬", 24,13, 7, 1920),
    p("Patrik Schick",       "ATT", "🇨🇿", 18, 8, 3, 1380),
  ]},

  "Borussia Dortmund": { ligue: "Bundesliga", players: [
    p("Gregor Kobel",        "GK",  "🇨🇭", 26, 0, 0, 2340),
    p("Julian Ryerson",      "DEF", "🇳🇴", 22, 2, 4, 1760),
    p("Niklas Süle",         "DEF", "🇩🇪", 22, 1, 1, 1760),
    p("Mats Hummels",        "DEF", "🇩🇪", 27, 3, 2, 2340),
    p("Ian Maatsen",         "DEF", "🇳🇱", 24, 2, 5, 1920),
    p("Emre Can",            "MIL", "🇩🇪", 24, 4, 4, 1920),
    p("Marcel Sabitzer",     "MIL", "🇦🇹", 22, 5, 7, 1760),
    p("Karim Adeyemi",       "ATT", "🇩🇪", 26,13, 8, 1980),
    p("Julian Brandt",       "ATT", "🇩🇪", 26, 9,12, 2080),
    p("Niclas Füllkrug",     "ATT", "🇩🇪", 20,10, 4, 1580),
    p("Jamie Bynoe-Gittens", "ATT", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", 22, 8, 7, 1680),
  ]},

  "RB Leipzig": { ligue: "Bundesliga", players: [
    p("Peter Gulácsi",       "GK",  "🇭🇺", 24, 0, 0, 2160),
    p("Lukas Klostermann",   "DEF", "🇩🇪", 20, 1, 3, 1580),
    p("Willi Orban",         "DEF", "🇩🇪", 22, 2, 0, 1760),
    p("Mohamed Simakan",     "DEF", "🇫🇷", 24, 1, 1, 1920),
    p("David Raum",          "DEF", "🇩🇪", 22, 2, 6, 1760),
    p("Nicolas Seiwald",     "MIL", "🇦🇹", 24, 3, 5, 1920),
    p("Xavi Simons",         "MIL", "🇳🇱", 26, 9,12, 2080),
    p("Benjamin Šeško",      "ATT", "🇸🇮", 26,16, 5, 2000),
    p("Lois Openda",         "ATT", "🇧🇪", 28,17, 7, 2240),
    p("Christoph Baumgartner","ATT","🇦🇹", 22, 7, 6, 1680),
  ]},

  "Frankfurt": { ligue: "Bundesliga", players: [
    p("Kevin Trapp",         "GK",  "🇩🇪", 28, 0, 0, 2520),
    p("Tuta",                "DEF", "🇧🇷", 24, 1, 0, 1920),
    p("Robin Koch",          "DEF", "🇩🇪", 22, 2, 1, 1760),
    p("Niels Nkounkou",      "DEF", "🇫🇷", 20, 1, 3, 1580),
    p("Ellyes Skhiri",       "MIL", "🇹🇳", 24, 3, 4, 1920),
    p("Hugo Larsson",        "MIL", "🇸🇪", 22, 4, 6, 1760),
    p("Ansgar Knauff",       "ATT", "🇩🇪", 24, 7, 7, 1920),
    p("Omar Marmoush",       "ATT", "🇪🇬", 26,16, 9, 2000),
    p("Jesper Lindstrøm",    "ATT", "🇩🇰", 22, 6, 5, 1680),
  ]},
}
