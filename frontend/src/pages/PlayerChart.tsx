// src/pages/analytics.tsx
import '../style.css'

import React, { useEffect, useState } from "react"
import { TeamAnalytics, PlayerSeasonRadar } from "../components/allCharts"
import type { TeamMatchStat } from "../models/team-match-stat"
import type { PlayerSeasonStat } from "../models/player-season-stat"
import { fetchTeamMatchStat, fetchPlayerSeasonStat } from "../lib/api"



const UNIQUE_TOURNAMENT_ID = 8
const SEASON_ID = 52376
const PLAYER_ID = 1402912 //lamine yamal

export default function AnalyticsPage() {
  const [stats, setStats] = useState<PlayerSeasonStat | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadStats() {
      try {
        const playerSeasonStat = await fetchPlayerSeasonStat(UNIQUE_TOURNAMENT_ID, SEASON_ID, PLAYER_ID)
        setStats(playerSeasonStat);
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
      <PlayerSeasonRadar data={stats!} position="M" />
    </div>
  )
}
