import type { PlayerMatchStat } from "../../models/player-match-stat";

const isDNP = (match :PlayerMatchStat) => {
    const requiredKeys = ["match_id", "player_id", "team_id"];
    const matchKeys = Object.keys(match.match_stats || {});
    return matchKeys.length === 0 || matchKeys.every((key) => requiredKeys.includes(key));
  };

interface PlayerStatProps {
matchItem: PlayerMatchStat;
}

export function PlayerStat({ matchItem }: PlayerStatProps){
return(
<div className="p-4 border-t">
{isDNP(matchItem) ? (
  <p className="text-red-500 font-semibold">DNP (Did Not Play)</p>
) : (
  <div> 
    <div className="text-right mb-2">
      <a href={`/match/${matchItem.match.id}`} className="text-blue-600 hover:underline inline-block mb-2">
        see full match stat &gt;&gt;
      </a>
  </div>
  <table className="text-xs text-gray-500 border-collapse border border-gray-300 w-full">
    <thead>
      <tr className="bg-gray-100">
        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Stat</th>
        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Value</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(matchItem.match_stats)
        .filter(([key]) => !key.includes("_id"))
        .map(([key, value], i) => (
          <tr key={key} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
            <td className="border border-gray-300 px-4 py-2">{key.replace(/_/g, " ")}</td>
            <td className="border border-gray-300 px-4 py-2">{value || 0}</td>
          </tr>
        ))}
    </tbody>
  </table>
  </div>
)}
</div>
)
}