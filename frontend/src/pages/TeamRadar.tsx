import '../style.css'
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { TeamSeasonRadar } from "../components/allCharts"
import type { TeamSeasonStat } from "../models/team-season-stat"
import type { Team } from "../models/team"
import { fetchTeamSeasonStatsWithMeta, fetchTeamById } from "../lib/api"

const UNIQUE_TOURNAMENT_ID = 8
const SEASON_ID = 52376

export default function TeamChart() {
  const { id } = useParams<{ id: string }>() 
  const TEAM_ID = parseInt(id || "", 10)

  const [stats, setStats] = useState<TeamSeasonStat | null>(null)
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showStats, setShowStats] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [teamInfo, teamSeasonStat] = await Promise.all([
          fetchTeamById(TEAM_ID),
          fetchTeamSeasonStatsWithMeta(UNIQUE_TOURNAMENT_ID, SEASON_ID, TEAM_ID)
        ])
        setTeam(teamInfo)
        setStats(teamSeasonStat)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (TEAM_ID) loadData()
  }, [TEAM_ID])

  if (loading) return <p className="p-4">Loading player data...</p>
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>
  if (!team || !stats) return <p className="p-4">No data found.</p>

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Team Info Card */}
      <div className="flex flex-col md:flex-row items-center bg-gradient-to-r from-green-900/60 to-cyan-900/60 rounded-2xl shadow-lg p-6 mb-8 gap-6">
        <img
          // src={team.photoUrl || "/default-player.png"}
          alt={team.name}
          className="w-32 h-32 rounded-full object-cover border-4 border-green-400 shadow"
        />
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-green-200 mb-2">{team.name}</h2>
          <div className="flex flex-wrap gap-4 text-gray-200">
            <span className="bg-green-700/40 px-3 py-1 rounded-full text-sm font-medium border border-green-400/30">
              Stadium: {team.homeStadium}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Graph */}
      <div className="bg-gray-900/80 rounded-2xl shadow-lg p-6 mb-8">
        <h3 className="text-2xl font-semibold text-cyan-200 mb-4">Season Performance</h3>
        <TeamSeasonRadar
          data={stats}
          metrics={"M"} // TODO: how to input???
        />
      </div>

      {/* Descriptive Stats Section (Toggleable) */}
      <div className="bg-white/90 rounded-2xl shadow p-6">
        <button
          className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-4 focus:outline-none"
          onClick={() => setShowStats((prev) => !prev)}
        >
          <span>Team Stats</span>
          <svg
            className={`w-5 h-5 transition-transform ${showStats ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            {Object.entries(stats)
              .filter(([key, value]) => typeof value === "number" && isFinite(value))
              .map(([key, value]) => (
                <div key={key}>
                  <span className="font-semibold capitalize">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                  </span>{" "}
                  {value}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}