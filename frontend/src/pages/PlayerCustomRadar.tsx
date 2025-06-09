import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPlayerById, fetchPlayerSeasonStat } from "../lib/api";
import { PlayerSeasonRadar } from "../components/allCharts";
import type { Player } from "../models/player";
import type { PlayerSeasonStat } from "../models/player-season-stat";

const UNIQUE_TOURNAMENT_ID = 8;
const SEASON_ID = 52376;

export default function PlayerCustomRadar() {
  const { id } = useParams<{ id: string }>();
  const PLAYER_ID = parseInt(id || "", 10);
  const navigate = useNavigate();

  const [player, setPlayer] = useState<Player | null>(null);
  const [stats, setStats] = useState<PlayerSeasonStat | null>(null);
  const [selectedStats, setSelectedStats] = useState<string[]>([]);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [playerInfo, playerSeasonStat] = await Promise.all([
        fetchPlayerById(PLAYER_ID),
        fetchPlayerSeasonStat(UNIQUE_TOURNAMENT_ID, SEASON_ID, PLAYER_ID)
      ]);
      setPlayer(playerInfo);
      setStats(playerSeasonStat);
      // Default: select first 5 numeric stats
      if (playerSeasonStat) {
        const numericKeys = Object.entries(playerSeasonStat)
          .filter(([, v]) => typeof v === "number" && isFinite(v))
          .map(([k]) => k);
        setSelectedStats(numericKeys.slice(0, 5));
      }
    }
    if (PLAYER_ID) loadData();
  }, [PLAYER_ID]);

  if (!player || !stats) return <p className="p-4">Loading...</p>;

  // All numeric stat keys
  const statKeys = Object.entries(stats)
    .filter(([, v]) => typeof v === "number" && isFinite(v))
    .map(([k]) => k);

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Overlay for stat selection */}
      {showOverlay && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Select Stats for Custom Radar</h2>
            <div className="max-h-64 overflow-y-auto grid grid-cols-1 gap-2 mb-4">
              {statKeys.map((key) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedStats.includes(key)}
                    onChange={() => {
                      setSelectedStats((prev) =>
                        prev.includes(key)
                          ? prev.filter((k) => k !== key)
                          : [...prev, key]
                      );
                    }}
                  />
                  <span className="capitalize">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>
            <div className="flex gap-2 mb-4">
              <button
                className="px-3 py-1 bg-gray-800 text-white rounded"
                onClick={() => setSelectedStats(statKeys)}
              >
                Select All
              </button>
              <button
                className="px-3 py-1 bg-gray-300 text-gray-800 rounded"
                onClick={() => setSelectedStats([])}
              >
                Clear All
              </button>
            </div>
            <button
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
              disabled={selectedStats.length < 3}
              onClick={() => setShowOverlay(false)}
            >
              {selectedStats.length < 3 ? "Select at least 3 stats" : "Show Radar"}
            </button>
          </div>
        </div>
      )}

      {/* Player Info Header */}
      <div className="flex items-center gap-4 bg-white rounded-2xl shadow p-4 mt-8 max-w-2xl mx-auto">
        <img
          src={player.photoUrl || "/default-player.png"}
          alt={player.name}
          className="w-20 h-20 rounded-full object-cover border-2 border-gray-400"
        />
        <div>
          <h2 className="text-xl font-bold text-gray-800">{player.name}</h2>
          <div className="text-gray-600">{player.position} | {player.teamName}</div>
        </div>
        <button
          className="ml-auto px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          onClick={() => setShowOverlay(true)}
        >
          Change Stats
        </button>
      </div>

      {/* Radar Chart */}
      <div className="bg-white rounded-2xl shadow p-6 mt-8 max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Custom Radar Chart</h3>
        {selectedStats.length < 3 ? (
          <div className="text-red-500">Please select at least 3 stats to display the radar chart.</div>
        ) : (
          <PlayerSeasonRadar
            data={Object.fromEntries(
              selectedStats.map((key) => [key, stats[key as keyof PlayerSeasonStat]])
            )}
            position={player.position?.charAt(0).toUpperCase() || "M"}
            customStats={selectedStats}
          />
        )}
      </div>
    </div>
  );
}