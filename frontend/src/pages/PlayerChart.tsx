import '../style.css'
import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { PlayerSeasonRadar } from "../components/allCharts"
import type { PlayerSeasonStat } from "../models/player-season-stat"
import type { Player } from "../models/player"
import { fetchPlayerSeasonStatsWithMeta, fetchPlayerById } from "../lib/api"

const UNIQUE_TOURNAMENT_ID = 8
const SEASON_ID = 52376

interface PlayerChartProps {
  playerId: number; // Define the type of playerId
}
/**
 * PlayerChart component displays detailed statistics for a specific player.
 * It fetches player data and season stats, then renders them in a user-friendly format.
 * 
 * @returns JSX Element representing the player chart page.
 */

// Utility function to convert snake_case to camelCase
function convertSnakeToCamelCase(obj: Record<string, unknown>): Record<string, number | null> {
  const result: Record<string, number | null> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    // Convert snake_case to camelCase
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = typeof value === 'number' ? value : null;
  }
  
  return result;
}

export default function PlayerChart() {
  const { id } = useParams<{ id: string }>() 
  const PLAYER_ID = parseInt(id || "", 10)

  const [stats, setStats] = useState<PlayerSeasonStat | null>(null)
  const [player, setPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showStats, setShowStats] = useState(true)
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
  
        if (isNaN(PLAYER_ID)) {
          throw new Error("Invalid PLAYER_ID");
        }
  
        const [playerData, statsData] = await Promise.all([
          fetchPlayerById(PLAYER_ID),
          fetchPlayerSeasonStatsWithMeta(UNIQUE_TOURNAMENT_ID, SEASON_ID, PLAYER_ID),
        ]);
  
        setPlayer(playerData);
        setStats(statsData?.length > 0 ? statsData[0] : null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
  
    loadData();
  }, [PLAYER_ID]);

  if (loading) return <p className="p-4">Loading player data...</p>
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>
  if (!player || !stats) return <p className="p-4">No data found.</p>

  return (
    <>
     <button
  className="fixed top-4 left-4 p-4 rounded-full bg-white text-black hover:bg-gray-200 transition z-50 shadow"
  onClick={() => navigate(-1)}
  aria-label="Go Back"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-8 h-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
</button>

      <div className="max-w-5xl mx-auto p-4 relative">
        {/* Player Info Card */}
        <div className="flex flex-col md:flex-row items-center bg-gradient-to-r from-green-900/60 to-cyan-900/60 rounded-2xl shadow-lg p-6 mb-8 gap-6">
          <img
            src="/default-player.png"
            alt={player.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-green-400 shadow"
          />
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-green-200 mb-2">{player.name}</h2>
            <div className="flex flex-wrap gap-4 text-gray-200 mb-4">
              <span className="bg-green-700/40 px-3 py-1 rounded-full text-sm font-medium border border-green-400/30">
                {player.position}
              </span>
              <span className="bg-blue-700/40 px-3 py-1 rounded-full text-sm font-medium border border-blue-400/30">
                {player.nationality}
              </span>
              <span className="bg-gray-700/40 px-3 py-1 rounded-full text-sm font-medium border border-gray-400/30">
                Age: {player.age}
              </span>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg font-semibold transition"
                onClick={() => navigate(`/player/${PLAYER_ID}/match-history`)}
              >
                View Match History
              </button>
            </div>
          </div>
        </div>

        {/* Stats Graph */}
        <div className="bg-gray-900/80 rounded-2xl shadow-lg p-6 mb-8 relative">
          <div className="flex justify-center items-center mb-4">
            <h3 className="text-2xl font-semibold text-cyan-200">Season Performance</h3>
          </div>
          <PlayerSeasonRadar
            data={stats?.stats ? convertSnakeToCamelCase(stats.stats) : {}}
            position={player.position?.charAt(0).toUpperCase() || "M"}
          />
        </div>

        {/* Descriptive Stats Section (Toggleable) */}
        <div className="bg-white/90 rounded-2xl shadow p-6">
          <button
            className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-4 focus:outline-none"
            onClick={() => setShowStats((prev) => !prev)}
          >
            <span>Player Stats</span>
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
                .filter(([, value]) => typeof value === "number" && isFinite(value))
                .map(([statKey, value]) => (
                  <div key={statKey}>
                    <span className="font-semibold capitalize">
                      {statKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                    </span>{" "}
                    {value}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}