const API_BASE_URL = "http://localhost:3000"

import type { Player } from "../models/player"
import type { PlayerMatchStat } from "../models/player-match-stat"
import type { PlayerSeasonStat } from "../models/player-season-stat"

import type { Team } from "../models/team"
import type { TeamMatchStat } from "../models/team-match-stat"
import type { TeamSeasonStat } from "../models/team-season-stat"

import type { Match } from "../models/match"

import type { TopPlayer } from "../models/top-stat"
import type { TopTeam } from "../models/top-stat" 

// ----------------------------
// Player APIs
// ----------------------------

// Match APIs
export async function fetchMatchById(matchId: number): Promise<Match> {
  const res = await fetch(`${API_BASE_URL}/api/match/${matchId}`)
  if (!res.ok) throw new Error("Failed to fetch match by ID")
  return await res.json()
}

export async function fetchMatchesByTeamId(teamId: number): Promise<Match[]> {
  const res = await fetch(`${API_BASE_URL}/api/match?teamID=${teamId}`)
  if (!res.ok) throw new Error("Failed to fetch matches by team ID")
  return await res.json()
}

// Player APIs
export async function fetchPlayerById(playerId: number): Promise<Player> {
  const res = await fetch(`${API_BASE_URL}/api/player/${playerId}`)
  if (!res.ok) throw new Error("Failed to fetch player by ID")
  return await res.json()
}

export async function searchPlayersByName(name: string): Promise<Player[]> {
  const res = await fetch(`${API_BASE_URL}/api/player?name=${encodeURIComponent(name)}`)
  if (!res.ok) throw new Error("Failed to search players by name")
  return await res.json()
}

// Player Match Stat APIs
export async function fetchPlayerStatsByMatch(matchID: number, statFields?: string): Promise<PlayerMatchStat[]> {
  const url = new URL(`${API_BASE_URL}/api/player-match-stat`)
  url.searchParams.append("matchID", matchID.toString())
  if (statFields) url.searchParams.append("statFields", statFields)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error("Failed to fetch player match stats")
  return await res.json()
}

export async function fetchAllMatchStatsByPlayerId(playerId: number): Promise<PlayerMatchStat[]> {
  const res = await fetch(`${API_BASE_URL}/api/player-match-stat/player/${playerId}`)
  if (!res.ok) throw new Error("Failed to fetch matches by player ID")
  return await res.json()
}

export async function fetchStatByPlayerAndMatch(playerId: number, matchId: number): Promise<PlayerMatchStat> {
  const res = await fetch(`${API_BASE_URL}/api/player-match-stat/player/${playerId}/match/${matchId}`)
  if (!res.ok) throw new Error("Failed to fetch stats by player and match ID")
  return await res.json()
}

// Player Season Stat APIs
export async function fetchTopPlayersByStat(
  statFields: string,
  uniqueTournamentID: number,
  seasonID: number,
  limit?: number,
  position?: string
): Promise<TopPlayer[]> {
  const url = new URL(`${API_BASE_URL}/api/player-season-stat/top-players`)
  url.searchParams.append("statFields", statFields)
  url.searchParams.append("uniqueTournamentID", uniqueTournamentID.toString())
  url.searchParams.append("seasonID", seasonID.toString())
  if (limit) url.searchParams.append("limit", limit.toString())
  if (position) url.searchParams.append("position", position)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error("Failed to fetch top players")
  return await res.json()
}

export async function fetchPlayerSeasonStatsWithMeta(
  uniqueTournamentID: number,
  seasonID: number,
  playerID?: number,
  statFields?: string
): Promise<PlayerSeasonStat[]> {
  const url = new URL(`${API_BASE_URL}/api/player-season-stat`)
  if (playerID) url.searchParams.append("playerID", playerID.toString())
  url.searchParams.append("uniqueTournamentID", uniqueTournamentID.toString())
  url.searchParams.append("seasonID", seasonID.toString())
  if (statFields) url.searchParams.append("statFields", statFields)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error("Failed to fetch player stats with meta")
  return await res.json()
}

// Team Info APIs
export async function fetchTeamById(teamId: number): Promise<Team> {
  const res = await fetch(`${API_BASE_URL}/api/team/${teamId}`)
  if (!res.ok) throw new Error("Failed to fetch team by ID")
  return await res.json()
}

export async function searchTeamsByName(name: string): Promise<Team[]> {
  const res = await fetch(`${API_BASE_URL}/api/team?name=${encodeURIComponent(name)}`)
  if (!res.ok) throw new Error("Failed to search teams by name")
  return await res.json()
}

// Team Match Stat APIs
export async function fetchTeamMatchStats(
  matchID: number,
  teamID: number,
  statFields?: string
): Promise<TeamMatchStat> {
  const url = new URL(`${API_BASE_URL}/api/team-match-stat`)
  url.searchParams.append("matchID", matchID.toString())
  url.searchParams.append("teamID", teamID.toString())
  if (statFields) url.searchParams.append("statFields", statFields)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error("Failed to fetch team match stats")
  return await res.json()
}

export async function fetchAllTeamMatches(teamID: number): Promise<any[]> {
  const res = await fetch(`${API_BASE_URL}/api/team-match-stat/team/${teamID}`)
  if (!res.ok) throw new Error("Failed to fetch team matches")
  return await res.json()
}

// Team Season Stat APIs
export async function fetchTeamSeasonStatsWithMeta(
  uniqueTournamentID: number,
  seasonID: number,
  teamID?: number, 
  statFields?: string
): Promise<TeamSeasonStat[]> {
  const url = new URL(`${API_BASE_URL}/api/team-season-stat`)
  if (teamID) url.searchParams.append("teamID", teamID.toString())
  url.searchParams.append("uniqueTournamentID", uniqueTournamentID.toString())
  url.searchParams.append("seasonID", seasonID.toString())
  if (statFields) url.searchParams.append("statFields", statFields)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error("Failed to fetch team stats with meta")
  return await res.json()
}

export async function fetchTopTeamsByStat(
  statFields: string,
  uniqueTournamentID: number,
  seasonID: number,
  limit?: number
): Promise<TopTeam[]> {
  const url = new URL(`${API_BASE_URL}/api/team-season-stat/top-teams`)
  url.searchParams.append("statFields", statFields)
  url.searchParams.append("uniqueTournamentID", uniqueTournamentID.toString())
  url.searchParams.append("seasonID",seasonID.toString())
  if (limit) url.searchParams.append("limit", limit.toString())

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error("Failed to fetch top teams")
  return await res.json()
}
