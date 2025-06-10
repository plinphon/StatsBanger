import type { Match } from './match'
import type { Team } from './team'

export interface TeamMatchStat {
  matchId: number
  match?: Match | null

  teamId: number
  team: Team

  stats: Record<string, number | null> // map[string]*float64: number or null
}