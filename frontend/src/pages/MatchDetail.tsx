// src/pages/analytics.tsx
import React, { useEffect, useState } from "react"

import MirorBarChart from "../components/OverallBarChart"
import type { TeamMatchStat } from "../models/team-match-stat"
import { fetchMatchById, fetchTeamMatchStats } from "../lib/api"
import type { Match } from "../models/match"
import MatchMirrorBarChart from "../components/OverallBarChart"

const HOMETEAM_ID = 2828
const AWAYTEAM_ID = 2833
const MATCH_ID = 11369289

export default function AnalyticsPage() {
  const [match, setMatch] = useState<Match>()
  const [homeStats, setHomeStats] = useState<TeamMatchStat>()
  const [awayStats, setAwayStats] = useState<TeamMatchStat>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadStats() {
      try {
        const match = await fetchMatchById(MATCH_ID)
        const homeStats = await fetchTeamMatchStats(MATCH_ID, HOMETEAM_ID)
        const awayStats = await fetchTeamMatchStats(MATCH_ID, AWAYTEAM_ID)

        setMatch(match)
        setHomeStats(homeStats);
        setAwayStats(awayStats)
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
      < MatchMirrorBarChart data={[homeStats, awayStats]} />
    
    </div>
  )
}
