// src/pages/analytics.tsx
import React, { useEffect, useState } from "react"

import MirorBarChart from "../components/OverallBarChart"
import type { TeamMatchStat } from "../models/team-match-stat"
import { fetchMatchById, fetchPlayerStatsByMatch, fetchTeamMatchStats } from "../lib/api"
import type { Match } from "../models/match"
import MatchMirrorBarChart from "../components/OverallBarChart"
import type { PlayerMatchStat } from "../models/player-match-stat"
import { useParams } from "react-router-dom"
import { PlayerScatter2 } from "../components/allCharts2"
import { PlayerStat } from "../components/ui/PlayerStat"



export default function AnalyticsPage() {
  const [match, setMatch] = useState<Match>()
  const [homeStats, setHomeStats] = useState<TeamMatchStat>()
  const [awayStats, setAwayStats] = useState<TeamMatchStat>()
  const [allPlayerStats, setAllPlayerStats] = useState<PlayerMatchStat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  const { id } = useParams();

  const MATCH_ID = parseInt(id ?? '0', 10);

  useEffect(() => {
    async function loadStats() {
      try {
        const match = await fetchMatchById(MATCH_ID)
        
        const HOMETEAM_ID = match.homeTeam.id
        const AWAYTEAM_ID = match.awayTeam.id

        const homeStats = await fetchTeamMatchStats(MATCH_ID, HOMETEAM_ID)
        const awayStats = await fetchTeamMatchStats(MATCH_ID, AWAYTEAM_ID)

        const allPlayerStats = await fetchPlayerStatsByMatch(MATCH_ID)

        setMatch(match)
        setHomeStats(homeStats);
        setAwayStats(awayStats)
        setAllPlayerStats(allPlayerStats)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  if (loading) return <p className="p-4">Loading match stats...</p>
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>

  if (!homeStats || !awayStats) {
    return <p className="p-4">Stats are not available</p>
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Team Match Stats Analytics</h1>
      < MatchMirrorBarChart data={[homeStats, awayStats]} />

      <h1 className="text-3xl font-bold mb-6">Player Stats Analytics</h1>

            <div className="flex-1 bg-gray-100 rounded-2xl shadow p-6 max-w-4xl mx-auto">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Player Stats</h3>

          {allPlayerStats.length > 0 ? (
            <div className="space-y-6">
              {/* Group by teams */}
              {[match.homeTeam, match.awayTeam].map((team) => {
                const teamPlayers = allPlayerStats.filter(
                  (stat) => stat.teamId === team.id
                );

                return (
                  <div
                    key={team.id}
                    className="bg-white rounded-lg shadow transition overflow-hidden border"
                  >
                    <div className="bg-gray-50 px-4 py-3">
                      <h4 className="font-semibold text-gray-700">
                        {team.name} Players
                      </h4>
                    </div>

                    <div className="divide-y">
                      {teamPlayers.length > 0 ? (
                        teamPlayers.map((playerStat, index) => (
                          <PlayerStat
                            key={`${team.id}-${index}`}
                            matchItem={playerStat}
                          />
                        ))
                      ) : (
                        <div className="p-4 text-sm text-gray-500">No stats available.</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-600">No player stats available.</p>
          )}
        </div>

    </div>
  )
}
