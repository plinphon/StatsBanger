import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPlayerById, fetchPlayerSeasonStat, fetchPlayerMatchHistory } from "../lib/api";
import type { Player } from "../models/player";
import type { PlayerSeasonStat } from "../models/player-season-stat";
import type { PlayerMatchStat } from "../models/player-match-stat"; 

const UNIQUE_TOURNAMENT_ID = 8;
const SEASON_ID = 52376;

export default function PlayerMatchHistory() {
  const { id } = useParams<{ id: string }>();
  const PLAYER_ID = parseInt(id || "", 10);
  const navigate = useNavigate();

  const [player, setPlayer] = useState<Player | null>(null);
  const [stats, setStats] = useState<PlayerSeasonStat | null>(null);
  const [matches, setMatches] = useState<PlayerMatchStat[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [playerInfo, playerSeasonStat] = await Promise.all([
        fetchPlayerById(PLAYER_ID),
        fetchPlayerSeasonStat(UNIQUE_TOURNAMENT_ID, SEASON_ID, PLAYER_ID)
      ]);
      setPlayer(playerInfo);
      setStats(playerSeasonStat);
    }
    if (PLAYER_ID) loadData();
  }, [PLAYER_ID]);

  useEffect(() => {
    async function loadMatches() {
      setLoadingMatches(true);
      try {
        const matchHistory = await fetchPlayerMatchHistory(PLAYER_ID);
        setMatches(matchHistory);
      } catch (e) {
        setMatches([]);
      }
      setLoadingMatches(false);
    }
    if (PLAYER_ID) loadMatches();
  }, [PLAYER_ID]);

  if (!player || !stats) return <p className="p-4">Loading...</p>;

  return (
    <div className="relative min-h-screen bg-gray-100">
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
      </div>

      {/* Match History Section */}
      <div className="bg-white rounded-2xl shadow p-6 mt-8 max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Match History</h3>
        {loadingMatches ? (
          <div>Loading match history...</div>
        ) : matches.length === 0 ? (
          <div>No match history found.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {matches.map((match) => (
              <li key={match.id} className="py-3">
                <span className="font-semibold">{match.opponent}</span>
                <span className="ml-2 text-gray-500">
                  {match.date} | {match.result}
                </span>
                {/* Add more match details as needed */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}