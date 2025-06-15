import { SEASON_STAT_CATEGORIES, SEASON_CATEGORY_LABELS } from "../utils/playerSeasonStatsCategories";
import type { PlayerSeasonStat } from "../models/player-season-stat";

// For Season Stats
export function SeasonPlayerStats({ stats }: { stats: PlayerSeasonStat }) {

  const categorizedStats = Object.entries(SEASON_STAT_CATEGORIES)
    .filter(([category]) => category !== 'identifiers')
    .reduce((acc, [category, statKeys]) => {
      const categoryStats = statKeys
        .map(key => [key, stats?.stats?.[key] ?? 0]);
      
      if (categoryStats.length > 0) {
        acc[category] = categoryStats;
      }
      return acc;
    }, {} as Record<string, [string, any][]>);

  const formatStatName = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div className="flex-1 bg-white rounded-2xl shadow p-6 mb-8 max-w-full mx-auto">
      <button className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-4 focus:outline-none">
        <span>Player Stats</span>
      </button>
      
      {stats?.stats && (
        <div className="space-y-6">
          {Object.entries(categorizedStats).map(([category, categoryStats]) => (
            <div key={category}>
              <h4 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
                {SEASON_CATEGORY_LABELS[category] || category}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categoryStats.map(([statKey, value]) => (
                  <div key={statKey} className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      {formatStatName(statKey)}:
                    </span>
                    <span className="font-semibold text-black">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// For Match Stats
export function MatchPlayerStats({ matchItem }) {
  const getMatchStatCategory = (statKey: string): string => {
    for (const [category, statsList] of Object.entries(STAT_CATEGORIES)) {
      if (statsList.includes(statKey)) {
        return category;
      }
    }
    return 'other';
  };

  const categorizedStats = Object.entries(STAT_CATEGORIES)
    .filter(([category]) => category !== 'identifiers')
    .reduce((acc, [category, statKeys]) => {
      const categoryStats = statKeys
        .map(key => [key, matchItem.matchStats?.[key] ?? 0])
        .filter(([_, value]) => value > 0); // Only show stats with values > 0
      
      if (categoryStats.length > 0) {
        acc[category] = categoryStats;
      }
      return acc;
    }, {} as Record<string, [string, any][]>);

  const formatStatName = (key: string) => {
    return key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const isDNP = (match) => {
    const requiredKeys = ["match_id", "player_id", "team_id"];
    const matchKeys = Object.keys(match.matchStats || {});
    return matchKeys.length === 0 || matchKeys.every((key) => requiredKeys.includes(key));
  };

  return (
    <div className="flex-1 bg-white/90 rounded-2xl shadow p-6 mb-8 max-w-full mx-auto">
      <button className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-4 focus:outline-none">
        <span>Match Stats</span>
      </button>
      
      {isDNP(matchItem) ? (
        <div className="text-center text-gray-600 py-8">
          <p className="text-lg">Did Not Play</p>
          <div className="mt-4 space-x-4">
            <a href={`/match/${matchItem.match.id}`} className="text-blue-600 hover:underline">
              View Match
            </a>
            <a href={`/player/${matchItem.player.playerId}`} className="text-blue-600 hover:underline">
              View Player Profile
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex gap-4 pb-2 border-b mb-4">
            <a href={`/match/${matchItem.match.id}`} className="text-blue-600 hover:underline">
              View Match
            </a>
            <a href={`/player/${matchItem.player.playerId}`} className="text-blue-600 hover:underline">
              View Player Profile
            </a>
          </div>
          
          {Object.entries(categorizedStats).map(([category, categoryStats]) => (
            <div key={category}>
              <h4 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
                {CATEGORY_LABELS[category] || category}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categoryStats.map(([statKey, value]) => (
                  <div key={statKey} className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      {formatStatName(statKey)}:
                    </span>
                    <span className="font-semibold text-black">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}