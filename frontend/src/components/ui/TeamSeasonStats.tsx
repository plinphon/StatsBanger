import { TEAM_SEASON_STAT_CATEGORIES, TEAM_SEASON_CATEGORY_LABELS, isTeamSeasonPercentageStat, formatTeamSeasonMetricName } from "../../utils/categories/teamSeasonStatCategories";
import type { TeamSeasonStat } from "../../models/team-season-stat";

// Enhanced formatStatValue that uses the helper function to detect percentages
const formatStatValue = (key: string, value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return "0";
  }

  // Use the helper function to check if it's a percentage stat
  if (isTeamSeasonPercentageStat(key)) {
    return `${value.toFixed(1)}%`;
  }
  
  // For whole numbers, show as integer
  if (value % 1 === 0) {
    return Math.round(value).toString();
  }
  
  // For decimal numbers, show with appropriate precision
  return value.toFixed(2);
};

// For Team Season Stats
export function SeasonTeamStats({ stats }: { stats: TeamSeasonStat }) {

  const categorizedStats = Object.entries(TEAM_SEASON_STAT_CATEGORIES)
    .filter(([category]) => category !== 'identifiers')
    .reduce((acc, [category, statKeys]) => {
      const categoryStats = statKeys
        .map(key => [key, stats?.stats?.[key] ?? 0]);
      
      if (categoryStats.length > 0) {
        acc[category] = categoryStats;
      }
      return acc;
    }, {} as Record<string, [string, any][]>);

  return (
    <div className="flex-1 bg-white rounded-2xl shadow p-6 mb-8 max-w-full mx-auto">
      <button className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-4 focus:outline-none">
        <span>Team Stats</span>
      </button>
      
      {stats?.stats && (
        <div className="space-y-6">
          {Object.entries(categorizedStats).map(([category, categoryStats]) => (
            <div key={category}>
              <h4 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
                {TEAM_SEASON_CATEGORY_LABELS[category]?.name || category}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categoryStats.map(([statKey, value]) => (
                  <div key={statKey} className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      {formatTeamSeasonMetricName(statKey)}:
                    </span>
                    <span className="font-semibold text-black">
                      {formatStatValue(statKey, value)}
                    </span>
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