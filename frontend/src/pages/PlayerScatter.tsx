import '../style.css'
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { TeamSeasonRadar, PlayerSeasonScatter } from "../components/allCharts"
import type { PlayerSeasonStat } from "../models/player-season-stat"
import type { Player } from "../models/player"
import { fetchPlayerSeasonStatsWithMeta, fetchPlayerById, fetchTopPlayersByStat } from "../lib/api"

const UNIQUE_TOURNAMENT_ID = 8;
const SEASON_ID = 52376;
const METRIC_X = "totalPasses";
const METRIC_Y = "accuratePassesPercentage";
const POSITION = "M";


export default function PlayerScatter() {
//   const { id } = useParams<{ id: string }>() 
//   const player_id = parseInt(id || "", 10)

    const [playerStats, setStats] = useState<Record<number, { stats: PlayerSeasonStat; info: Player }> | null>(null)
    const [player, setPlayer] = useState<Player | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showStats, setShowStats] = useState(true)

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true)
                const [players] = await Promise.all([
                        fetchTopPlayersByStat("appearances", UNIQUE_TOURNAMENT_ID, SEASON_ID, 600, POSITION)
                ])
                const playerIds = players.map(player => player.playerId);
                const playerDataPromises = playerIds.map(id => fetchPlayerById(id));
                const playerStatsPromises = playerIds.map(id => fetchPlayerSeasonStatsWithMeta(UNIQUE_TOURNAMENT_ID, SEASON_ID, id));
                const [playerData, playerStats] = await Promise.all([
                        Promise.all(playerDataPromises),
                        Promise.all(playerStatsPromises)
                ]);
                const playerDataMap = playerIds.reduce((acc, id, index) => {
                        acc[id] = {
                                stats: playerStats[index] as PlayerSeasonStat,
                                info: playerData[index] as Player,
                        };
                        return acc;
                }, {} as Record<number, { stats: PlayerSeasonStat; info: Player }>);

                setStats(playerDataMap);
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
    if (!playerStats) return <p className="p-4">No data found.</p>

    return (
        <div className="max-w-5xl mx-auto p-4">
            {/* Player Info Card */}
            <div className="flex flex-col md:flex-row items-center bg-gradient-to-r from-green-900/60 to-cyan-900/60 rounded-2xl shadow-lg p-6 mb-8 gap-6">
                <img
                    // src={player.photoUrl || "/default-player.png"}
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
            <PlayerSeasonScatter
                data={playerStats}
                xAxisMetric={METRIC_X}
                yAxisMetric={METRIC_Y}
            />
        </div>
        </div>
    )
}