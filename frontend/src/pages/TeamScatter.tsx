import '../style.css'
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { TeamSeasonRadar, TeamSeasonScatter } from "../components/allCharts"
import type { TeamSeasonStat } from "../models/team-season-stat"
import type { Team } from "../models/team"
import { fetchTeamSeasonStatsWithMeta, fetchTeamById, fetchTopTeamsByStat } from "../lib/api"

const UNIQUE_TOURNAMENT_ID = 8;
const SEASON_ID = 52376;
const METRIC_X = "shots";
const METRIC_Y = "goalsScored";


export default function TeamScatter() {
//   const { id } = useParams<{ id: string }>() 
//   const team_id = parseInt(id || "", 10)

  const [teamStats, setStats] = useState<Record<number, { stats: TeamSeasonStat; info: Team }> | null>(null)
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showStats, setShowStats] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [teams] = await Promise.all([
          fetchTopTeamsByStat("shots", UNIQUE_TOURNAMENT_ID, SEASON_ID, 20)
        ])
        const teamIds = teams.map(team => team.teamId);
        const teamDataPromises = teamIds.map(id => fetchTeamById(id));
        const teamStatsPromises = teamIds.map(id => fetchTeamSeasonStatsWithMeta(UNIQUE_TOURNAMENT_ID, SEASON_ID, id));
        const [teamData, teamStats] = await Promise.all([
            Promise.all(teamDataPromises),
            Promise.all(teamStatsPromises)
        ]);
        const teamDataMap = teamIds.reduce((acc, id, index) => {
            acc[id] = {
                stats: (teamStats[index][0]) as TeamSeasonStat,
                info: teamData[index] as Team,
            };
            return acc;
        }, {} as Record<number, { stats: TeamSeasonStat; info: Team }>);

        setStats(teamDataMap);
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) return <p className="p-4">Loading player data...</p>
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>
  if (!teamStats) return <p className="p-4">No data found.</p>

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Team Info Card */}
      <div className="flex flex-col md:flex-row items-center bg-gradient-to-r from-green-900/60 to-cyan-900/60 rounded-2xl shadow-lg p-6 mb-8 gap-6">
        <img
          // src={team.photoUrl || "/default-player.png"}
          alt="0"
          className="w-32 h-32 rounded-full object-cover border-4 border-green-400 shadow"
        />
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-green-200 mb-2">Laliga</h2>
          <div className="flex flex-wrap gap-4 text-gray-200">
            <span className="bg-green-700/40 px-3 py-1 rounded-full text-sm font-medium border border-green-400/30">
              Stadium: 0
            </span>
          </div>
        </div>
      </div>

      {/* Stats Graph */}
    <div className="bg-gray-900/80 rounded-2xl shadow-lg p-6 mb-8">
      <h3 className="text-2xl font-semibold text-cyan-200 mb-4">Season Performance</h3>
      <TeamSeasonScatter
        data={teamStats}
        xAxisMetric={METRIC_X}
        yAxisMetric={METRIC_Y}
      />
    </div>
    </div>
  )
}