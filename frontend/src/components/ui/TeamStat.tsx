import type { TeamMatchStat } from "../../models/team-match-stat";
import { TEAM_MATCH_STAT_CATEGORIES, TEAM_CATEGORY_LABELS } from "../../utils/teamMatchStatsCategories";

const hasNoStats = (teamMatch: TeamMatchStat) => {
  const stats = teamMatch.stats || {};
  const statKeys = Object.keys(stats);
  const identifierKeys = TEAM_MATCH_STAT_CATEGORIES.identifiers;
  
  return statKeys.length === 0 || 
         statKeys.every(key => identifierKeys.includes(key) || stats[key] === null || stats[key] === 0);
};

interface TeamStatProps {
  matchItem: TeamMatchStat;
}

export function TeamStat({ matchItem }: TeamStatProps) {
  const formatStatName = (key: string) => {
    return key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const categorizedStats = Object.entries(TEAM_MATCH_STAT_CATEGORIES)
    .filter(([category]) => category !== 'identifiers')
    .reduce((acc, [category, statKeys]) => {
      const categoryStats = [];
      
      statKeys.forEach(key => {
        const value = matchItem.stats?.[key];
        if (value !== null && value !== undefined) {
          categoryStats.push([key, value]);
        }
      });
      
      if (categoryStats.length > 0) {
        acc[category] = categoryStats;
      }
      return acc;
    }, {} as Record<string, [string, any][]>);

    console.log(matchItem)

  return (
    <div className="bg-white rounded border p-4">
      {hasNoStats(matchItem) ? (
        <div className="text-center text-gray-600">
          <p>No Stats Available</p>
          <a href={`/match/${matchItem.matchId}`} className="text-blue-600 text-sm">
            View Match
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-4 pb-2 border-b">
            <a href={`/match/${matchItem.matchId}`} className="text-blue-600 text-sm hover:underline">
              View Match
            </a>
            <a href={`/team/${matchItem.team.teamId}`} className="text-blue-600 text-sm hover:underline">
              View Team Profile
            </a>
          </div>
          
          <div className="mb-2">
            <h3 className="font-medium text-gray-800">{matchItem.team.name}</h3>
            <p className="text-sm text-gray-500">{matchItem.team.homeStadium}</p>
          </div>

          {Object.entries(categorizedStats).map(([category, stats]) => (
            <div key={category}>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                {TEAM_CATEGORY_LABELS[category as keyof typeof TEAM_CATEGORY_LABELS] || category}
              </h4>
              <div className="space-y-1">
                {stats.map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-700 text-sm">
                      {formatStatName(key)}
                    </span>
                    <span className="font-medium text-sm text-black">
                      {value ?? 0}
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