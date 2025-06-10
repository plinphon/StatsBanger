import type { Player } from './player'
import type { Team } from './team'

export interface PlayerSeasonStat {
  playerId: number
  player: Player
  teamId: number
  team: Team
  uniqueTournamentId: number
  seasonId: number
  stats?: Record<string, number | null>
}
