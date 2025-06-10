// src/pages/analytics.tsx
import React, { useEffect, useState } from "react"
import TeamAnalytics from "../components/TeamAnalytics"
import MirrorBarChart from "../components/OverallBarChart"
import type { TeamMatchStat } from "../models/team-match-stat"
import { fetchTeamMatchStats } from "../lib/api"

const TEAM_ID = 2858
const MATCH_ID = 11369285

export default function AnalyticsPage() {
  const [stats, setStats] = useState<TeamMatchStat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadStats() {
      try {
        const teamMatchStat = await fetchTeamMatchStats(MATCH_ID, TEAM_ID)
        setStats([teamMatchStat]);
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

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Team Match Stats Analytics</h1>
      <TeamAnalytics data={stats} />
    </div>
  )
}
