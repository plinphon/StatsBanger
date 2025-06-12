import type { Match } from './match'
import type { Player } from './player'
import type { Team } from './team'

export interface PlayerMatchStat {
  matchId: number
  playerId: number
  teamId: number

  match: Match
  player: Player
  team: Team

  matchStats: Record<string, number | null>
}
