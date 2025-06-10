import type { Team } from './team'

export interface Match {
  id: number
  uniqueTournamentId: number
  seasonId: number
  matchday: number

  homeTeamId: number
  awayTeamId: number

  homeTeam: Team
  awayTeam: Team

  homeWin?: number
  homeScore?: number
  awayScore?: number
  injuryTime1?: number
  injuryTime2?: number

  currentPeriodStartTimestamp: string 
}
