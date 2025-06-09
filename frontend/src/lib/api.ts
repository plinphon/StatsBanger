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

export async function fetchPlayerById(playerId: number): Promise<Player> {
  const res = await fetch(`${API_BASE_URL}/api/player/${playerId}`)
  if (!res.ok) throw new Error("Failed to fetch player by ID")
  return await res.json()
}

export async function searchPlayerByName(name: string): Promise<Player[]> {
  const res = await fetch(`${API_BASE_URL}/api/player?name=${encodeURIComponent(name)}`)
  if (!res.ok) throw new Error("Failed to search player by name")
  return await res.json()
}

export async function fetchPlayerMatchStat(matchID: number, playerID: number): Promise<PlayerMatchStat> {
  const res = await fetch(`${API_BASE_URL}/api/player-match-stat?matchID=${matchID}&playerID=${playerID}`)
  if (!res.ok) throw new Error("Failed to fetch player match stat")
  return await res.json()
}

export async function fetchPlayerSeasonStat(uniqueTournamentID: number, seasonID: number, playerID: number): Promise<PlayerSeasonStat> {
  const res = await fetch(`${API_BASE_URL}/api/player-season-stat?uniqueTournamentID=${uniqueTournamentID}&seasonID=${seasonID}&playerID=${playerID}`)
  if (!res.ok) throw new Error("Failed to fetch player season stat")
  return await res.json()
}

export async function fetchTopPlayers(
  statName: string,
  uniqueTournamentID: number,
  seasonID: number,
  limit?: number,
  position?: string
): Promise<TopPlayer[]> {
  let url = `${API_BASE_URL}/api/top-players?statName=${statName}&uniqueTournamentID=${uniqueTournamentID}&seasonID=${seasonID}`
  if (limit) url += `&limit=${limit}`
  if (position) url += `&position=${position}`

  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch top players")
  return await res.json()
}


// ----------------------------
// Team APIs
// ----------------------------

export async function fetchTeamById(teamID: number): Promise<Team> {
  const res = await fetch(`${API_BASE_URL}/api/team/${teamID}`)
  if (!res.ok) throw new Error("Failed to fetch team by ID")
  return await res.json()
}

export async function searchTeamByName(name: string): Promise<Team[]> {
  const res = await fetch(`${API_BASE_URL}/api/team?name=${encodeURIComponent(name)}`)
  if (!res.ok) throw new Error("Failed to search team by name")
  return await res.json()
}

export async function fetchTeamMatchStat(matchId: number, teamId: number): Promise<TeamMatchStat> {
  const res = await fetch(`${API_BASE_URL}/api/team-match-stat?matchID=${matchId}&teamID=${teamId}`)
  if (!res.ok) throw new Error("Failed to fetch team match stat")
  return await res.json()
}

export async function fetchTeamSeasonStat(uniqueTournamentID: number, seasonID: number, teamID: number): Promise<TeamSeasonStat> {
  const res = await fetch(`${API_BASE_URL}/api/team-season-stat?uniqueTournamentID=${uniqueTournamentID}&seasonID=${seasonID}&teamID=${teamID}`)
  if (!res.ok) throw new Error("Failed to fetch team season stat")
  return await res.json()
}

export async function fetchTopTeams(
  statName: string,
  uniqueTournamentID: number,
  seasonID: number,
  limit?: number
): Promise<TopTeam[]> {
  let url = `${API_BASE_URL}/api/top-teams?statName=${statName}&uniqueTournamentID=${uniqueTournamentID}&seasonID=${seasonID}`
  if (limit) url += `&limit=${limit}`

  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch top teams")
  return await res.json()
}

// ----------------------------
// Match APIs
// ----------------------------

export async function fetchMatchById(matchId: number): Promise<Match> {
  const res = await fetch(`${API_BASE_URL}/api/matches/${matchId}`)
  if (!res.ok) throw new Error("Failed to fetch match by ID")
  return await res.json()
}

export async function fetchMatchesByTeamId(teamID: number): Promise<Match[]> {
  const res = await fetch(`${API_BASE_URL}/api/matches?teamID=${teamID}`)
  if (!res.ok) throw new Error("Failed to fetch matches by team ID")
  return await res.json()
}

export async function fetchPlayerMatchHistory(playerId: number) {
  const res = await fetch(`${API_BASE_URL}/api/player/${playerId}/matches`);
  if (!res.ok) throw new Error("Failed to fetch player match history");
  return await res.json();
}