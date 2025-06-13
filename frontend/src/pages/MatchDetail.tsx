// src/pages/analytics.tsx
import React, { useEffect, useState } from "react"

import MirorBarChart from "../components/OverallBarChart"
import type { TeamMatchStat } from "../models/team-match-stat"
import { fetchMatchById, fetchPlayerStatsByMatch, fetchTeamMatchStats } from "../lib/api"
import type { Match } from "../models/match"
import MatchMirrorBarChart from "../components/OverallBarChart"
import type { PlayerMatchStat } from "../models/player-match-stat"
import { useParams } from "react-router-dom"
import { PlayerMatchBar, PlayerScatter2 } from "../components/allCharts2"
import { PlayerStat } from "../components/ui/PlayerStat"
import { positionOrder } from "../utils/dataTransformation"
import TeamPlayerStats from "../components/ui/TeamPlayerStats"


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
        
        const HOMETEAM_ID = match.homeTeam.teamId
        const AWAYTEAM_ID = match.awayTeam.teamId

        const homeStats = await fetchTeamMatchStats(MATCH_ID, HOMETEAM_ID)
        const awayStats = await fetchTeamMatchStats(MATCH_ID, AWAYTEAM_ID)

        const allPlayerStats = await fetchPlayerStatsByMatch(MATCH_ID)
        console.log("Player Stats:", allPlayerStats);

        setMatch(match)
        console.log("Match:", match);
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
<div className="flex border p-6 max-w-full mx-auto min-h-screen">
  <div className="flex-1 w-full">
    <h1 className="text-3xl font-bold mb-8 text-center">Team Match Stats Analytics</h1>

    {allPlayerStats.length > 0 && match ? (
      <div className="flex space-x-8 w-full">
        {/* Home Team Stats */}
        <div className="w-80 flex-shrink-0">
          <TeamPlayerStats
            key={match.homeTeam.teamId}
            team={match.homeTeam}
            allPlayerStats={allPlayerStats}
            positionOrder={positionOrder}
          />
        </div>

        {/* Chart in the middle */}
        <div className="flex-1 min-w-0 flex flex-col space-y-6">
          <div className="w-full">
            <MatchMirrorBarChart data={[homeStats, awayStats]} />
          </div>
          <div className="w-full">
            <PlayerScatter2 data={allPlayerStats} xAxisMetric="accurate_pass" yAxisMetric="total_pass" />
          </div>
          <div className="w-full">
            <PlayerMatchBar data={allPlayerStats} yAxisMetric="total_pass" barLimit={10} />
          </div>
        </div>

        {/* Away Team Stats */}
        <div className="w-80 flex-shrink-0">
          <TeamPlayerStats
            key={match.awayTeam.teamId}
            team={match.awayTeam}
            allPlayerStats={allPlayerStats}
            positionOrder={positionOrder}
          />
        </div>
      </div>
    ) : (
      <p className="text-gray-600 text-center">No player stats available.</p>
    )}
  </div>
</div>

  )
}