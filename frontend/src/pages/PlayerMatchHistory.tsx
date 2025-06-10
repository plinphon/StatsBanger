import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAllMatchesByPlayerId } from "../lib/api"; // Use the existing API function
import type { PlayerMatchStat } from "../models/player-match-stat"; // Import the type for match stats

export default function PlayerMatchHistory() {
  const { id: playerId } = useParams<{ id: string }>(); // Extract playerId from route params
  const [matchHistory, setMatchHistory] = useState<PlayerMatchStat[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!playerId) {
      setError("Player ID is missing.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchAllMatchesByPlayerId(Number(playerId)); // Fetch match history
        setMatchHistory(data);
      } catch (err) {
        setError("Failed to fetch match history.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [playerId]);

  if (loading) {
    return <div>Loading match history...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!matchHistory || matchHistory.length === 0) {
    return <div>No match history available for this player.</div>;
  }

  return (
    <div>
      <h1>Player Match History</h1>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Match ID</th>
            <th className="border border-gray-300 px-4 py-2">Stat Field</th>
            <th className="border border-gray-300 px-4 py-2">Value</th>
          </tr>
        </thead>
        <tbody>
          {matchHistory.map((match) => (
            <tr key={match.matchId}>
              <td className="border border-gray-300 px-4 py-2">{match.matchId}</td>
              <td className="border border-gray-300 px-4 py-2">{match.statField}</td>
              <td className="border border-gray-300 px-4 py-2">{match.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}