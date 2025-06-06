import type { TeamMatchStat } from "../models/team-match-stat"
import type { PlayerSeasonStat } from "../models/player-season-stat"

const API_BASE_URL = "http://localhost:3000"

export async function fetchTeamMatchStat(matchId: number, teamId: number): Promise<TeamMatchStat> {
  const response = await fetch(`${API_BASE_URL}/api/team-match-stat?matchID=${matchId}&teamID=${teamId}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`)
  }
  const data = await response.json()
  return data as TeamMatchStat
}

export async function fetchPlayerSeasonStat(uniqueTournamentID: number, seasonID: number, playerID: number): Promise<PlayerSeasonStat> {
  const response = await fetch(`${API_BASE_URL}/api/player-season-stat/?uniqueTournamentID=${uniqueTournamentID}&seasonID=${seasonID}&playerID=${playerID}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`)
  }
  const data = await response.json()
  return data as PlayerSeasonStat
}