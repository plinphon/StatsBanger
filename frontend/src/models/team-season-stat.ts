import type { Team } from './team'

export interface TeamSeasonStat {
  teamId: number
  team: Team
  uniqueTournamentId: number
  seasonId: number
  stats?: Record<string, number | null> 
}
