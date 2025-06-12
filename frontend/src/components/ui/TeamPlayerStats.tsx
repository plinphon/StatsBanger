import React, { useState } from "react";
import type { PlayerMatchStat } from "../../models/player-match-stat";
import type { Team } from "../../models/team";
import { PlayerStat } from "./PlayerStat";

type TeamPlayersProps = {
  team: Team;
  allPlayerStats: PlayerMatchStat[];
  positionOrder: Record<"G" | "D" | "M" | "F", number>;
};

function isValidPosition(pos: string): pos is "G" | "D" | "M" | "F" {
    return ["G", "D", "M", "F"].includes(pos);
  }

const TeamPlayerStats: React.FC<TeamPlayersProps> = ({ team, allPlayerStats, positionOrder }) => {
  const [expandedPlayerIndex, setExpandedPlayerIndex] = useState<number | null>(null);

  const togglePlayer = (index: number, played: boolean) => {
    if (!played) return; // Don't toggle if player didn't play
    setExpandedPlayerIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const teamPlayers = allPlayerStats.filter(stat => stat.teamId === team.teamId);

    const sortedPlayers = teamPlayers
    .map(playerStat => ({
        ...playerStat,
        played: playerStat.matchStats && Object.keys(playerStat.matchStats).length > 3,
    }))
    .sort((a, b) => {
        if (a.played === b.played) {
        const posA = isValidPosition(a.player.position) ? positionOrder[a.player.position] : 99;
        const posB = isValidPosition(b.player.position) ? positionOrder[b.player.position] : 99;
        return posA - posB;
        }
        return a.played ? -1 : 1; // played first
    });

  return (
    <div className="bg-white rounded-lg shadow transition overflow-hidden border">
      <div className="bg-gray-50 px-4 py-3">
        <h4 className="font-semibold text-gray-700">{team.name}</h4>
      </div>

      <div className="divide-y">
        {sortedPlayers.length > 0 ? (
          sortedPlayers.map((playerStat, index) => {
            const isExpanded = expandedPlayerIndex === index;
            const played =Object.keys(playerStat.matchStats).length ? Object.keys(playerStat.matchStats).length > 3 : false;

            return (
              <div key={`${team.teamId}-${index}`} className="border-b last:border-0">
                <button
                  onClick={() => togglePlayer(index, played)}
                  className={`w-full text-left px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-blue-100 ${
                    !played ? "cursor-default" : ""
                  }`}
                  disabled={!played}
                >
                  <div>
                    <div className="font-semibold text-gray-700">{playerStat.player.name}</div>
                    <p className="text-sm text-gray-600">
                      Age: {playerStat.player.age} | Position: {playerStat.player.position}{" "}
                      {!played && "(Did not play)"}
                    </p>
                  </div>
                  {played && (
                    <span className="text-xl text-gray-400">{isExpanded ? "▲" : "▼"}</span>
                  )}
                </button>

                {isExpanded && played && (
                  <div className="p-4 bg-gray-50">
                    <PlayerStat matchItem={playerStat} />
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-4 text-sm text-gray-500">No stats available.</div>
        )}
      </div>
    </div>
  );
};

export default TeamPlayerStats;
