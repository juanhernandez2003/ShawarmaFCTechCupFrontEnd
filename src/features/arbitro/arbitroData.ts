export interface MatchSummary {
  id: string
  local: string
  visitante: string
  fecha: string
  cancha: string
  marcador: string
}

export interface TableRow {
  id: string
  equipo: string
  pj: number
  g: number
  e: number
  p: number
  gf: number
  gc: number
  dg: number
  puntos: number
}

export interface TeamLineup {
  equipo: string
  jugadores: string[]
}

export interface ArbitroLineups {
  local: TeamLineup
  visitante: TeamLineup
}

export interface ReglamentoItem {
  titulo: string
  descripcion: string
  detalles?: string[]
}

export const partidosAsignados = 0
export const proximoPartido = '0'
export const canchaAsignada = 'Cancha A'

export const notificaciones = [
  'Nueva asignacion de partido: Los Tigres vs Halcones',
  'Recordatorio: tu proximo partido es manana a las 16:00',
  'Cambio de cancha: el partido del 15 Mar se movio a Cancha B',
]

export const tablaPosiciones: TableRow[] = [
  { id: '1', equipo: 'Blue Waves', pj: 9, g: 7, e: 1, p: 1, gf: 20, gc: 8, dg: 12, puntos: 22 },
  { id: '2', equipo: 'United FC', pj: 9, g: 6, e: 2, p: 1, gf: 18, gc: 10, dg: 8, puntos: 20 },
  { id: '3', equipo: 'Golden Eagles', pj: 9, g: 5, e: 2, p: 2, gf: 16, gc: 11, dg: 5, puntos: 17 },
  { id: '4', equipo: 'Ingenieria FC', pj: 9, g: 5, e: 1, p: 3, gf: 15, gc: 13, dg: 2, puntos: 16 },
  { id: '5', equipo: 'Los Tigres FC', pj: 9, g: 4, e: 2, p: 3, gf: 13, gc: 12, dg: 1, puntos: 14 },
  { id: '6', equipo: 'Dragones FC', pj: 9, g: 3, e: 2, p: 4, gf: 12, gc: 14, dg: -2, puntos: 11 },
  { id: '7', equipo: 'Halcones', pj: 9, g: 2, e: 2, p: 5, gf: 11, gc: 16, dg: -5, puntos: 8 },
  { id: '8', equipo: 'TechStars', pj: 9, g: 1, e: 2, p: 6, gf: 9, gc: 19, dg: -10, puntos: 5 },
]

export const alineaciones: ArbitroLineups = {
  local: {
    equipo: 'Blue Waves',
    jugadores: [
      'Juan Torres',
      'Andres Mejia',
      'Daniel Rios',
      'Camilo Vega',
      'Jhon Salas',
      'Kevin Mora',
      'Mateo Leon',
      'Brayan Arias',
      'Diego Bernal',
      'Santiago Gomez',
      'Cristian Ruiz',
    ],
  },
  visitante: {
    equipo: 'United FC',
    jugadores: [
      'Nicolas Peña',
      'Felipe Cardenas',
      'Juan Nieto',
      'Sebastian Rey',
      'Javier Cifuentes',
      'Luis Caro',
      'Pedro Reyes',
      'Victor Monroy',
      'Henry Sierra',
      'Juan Rosales',
      'Oscar Guzman',
    ],
  },
}

export const reglamento: ReglamentoItem[] = [
  {
    titulo: '1. Formato del torneo',
    descripcion: 'El torneo se jugara en fase de grupos seguida de rondas eliminatorias.',
    detalles: [
      'Los equipos estaran distribuidos en grupos.',
      'Cada equipo jugara contra todos los demas de su grupo.',
    ],
  },
  {
    titulo: '2. Clasificacion a fase final',
    descripcion:
      'Clasifican los mejores ocho: los primeros de cada uno de los cinco grupos y los tres mejores segundos segun la tabla general.',
  },
  {
    titulo: '3. Sistema de puntuacion',
    descripcion: 'Puntaje por partido:',
    detalles: [
      'Partido ganado: 3 puntos',
      'Partido empatado: 1 punto',
      'Partido perdido: 0 puntos',
    ],
  },
  {
    titulo: '4. Criterios de desempate',
    descripcion: 'En caso de empate en puntos entre dos o mas equipos se aplica este orden:',
    detalles: [
      'Mayor numero de puntos obtenidos',
      'Mayor diferencia de goles (goles a favor - goles en contra)',
      'Mayor numero de goles a favor',
      'Fair Play (menor numero de tarjetas)',
      'Tarjeta amarilla: -1 punto',
      'Tarjeta roja: -3 puntos',
      'Penaltis',
    ],
  },
  {
    titulo: '5. Numero de jugadores',
    descripcion: 'Cada equipo jugara con 8 jugadores en cancha (7 de campo + 1 arquero).',
    detalles: ['Se permiten cambios ilimitados y se permite el reingreso de jugadores.'],
  },
  {
    titulo: '6. Duracion de los partidos',
    descripcion: 'Los partidos tendran una duracion de 20 minutos.',
    detalles: ['La ronda de semifinal y final se disputara a 30 minutos.'],
  },
  {
    titulo: '7. Equipamiento',
    descripcion: 'Todos los jugadores deben usar uniforme adecuado.',
    detalles: [
      'En caso de colores similares, el equipo visitante debera cambiar uniforme o usar petos.',
    ],
  },
  {
    titulo: '8. Conducta y disciplina',
    descripcion: 'Se espera respeto entre jugadores, arbitros y organizacion.',
    detalles: ['Conductas antideportivas pueden ser sancionadas con tarjetas o expulsion.'],
  },
  {
    titulo: '9. Fase eliminatoria',
    descripcion: 'Si hay empate en partidos de eliminacion directa:',
    detalles: ['Se define por tanda de penales, sin tiempo extra.'],
  },
]
