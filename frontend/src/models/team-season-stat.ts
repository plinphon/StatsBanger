import type { Team } from './team'

export interface TeamSeasonStat {
  id: number
  teamId: number
  team: Team
  uniqueTournamentId: number
  seasonId: number
  stats?: Record<string, number | null> 
}
