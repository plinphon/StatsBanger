import type { PlayerMatchStat } from "../../models/player-match-stat";
import { STAT_CATEGORIES, CATEGORY_LABELS } from "../../utils/playerMatchStatsCategories";
import { 
  MATCH_PERCENTAGE_CALCULATIONS,
  getStatLabel,
  formatStatValue 
} from "../../utils/matchPercentageCalculation";

const isDNP = (match: PlayerMatchStat) => {
  const requiredKeys = ["match_id", "player_id", "team_id"];
  const matchKeys = Object.keys(match.matchStats || {});
  return matchKeys.length === 0 || matchKeys.every((key) => requiredKeys.includes(key));
};

interface PlayerStatProps {
  matchItem: PlayerMatchStat;
}

export function PlayerStat({ matchItem }: PlayerStatProps) {
  const formatStatName = (key: string) => {
    return key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Use calculated stats from the enhanced model
  const calculatedStats = matchItem.calculatedStats || {};

  const categorizedStats = Object.entries(STAT_CATEGORIES)
    .filter(([category]) => category !== 'identifiers')
    .reduce((acc, [category, statKeys]) => {
      const categoryStats = [];
      const addedCalculations = new Set(); // Track which calculations we've already added
      
      statKeys.forEach(key => {
        // Add the original stat
        categoryStats.push([key, matchItem.matchStats?.[key] ?? 0, false]);
        
        // Add related percentage calculations (only once per category)
        Object.entries(calculatedStats).forEach(([calcKey, calcValue]) => {
          const calcConfig = MATCH_PERCENTAGE_CALCULATIONS[calcKey];
          if (calcConfig && 
              calcConfig.category === category && 
              !addedCalculations.has(calcKey) &&
              (calcConfig.numerator === key || 
               (Array.isArray(calcConfig.denominator) && calcConfig.denominator.includes(key)) ||
               calcConfig.denominator === key)) {
            categoryStats.push([calcKey, calcValue, true]);
            addedCalculations.add(calcKey);
          }
        });
      });
      
      if (categoryStats.length > 0) {
        acc[category] = categoryStats;
      }
      return acc;
    }, {} as Record<string, [string, any, boolean][]>);

  return (
    <div className="bg-white rounded border p-4">
      {isDNP(matchItem) ? (
        <div className="text-center text-gray-600">
          <p>Did Not Play</p>
          <a href={`/match/${matchItem.match.id}`} className="text-blue-600 text-sm">
            View Match
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-4 pb-2 border-b">
            <a href={`/match/${matchItem.match.id}`} className="text-blue-600 text-sm hover:underline">
              View Match
            </a>
            <a href={`/player/${matchItem.player.playerId}`} className="text-blue-600 text-sm hover:underline">
              View Player Profile
            </a>
          </div>
          {Object.entries(categorizedStats).map(([category, stats]) => (
            <div key={category}>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || category}
              </h4>
              <div className="space-y-1">
                {stats.map(([key, value, isCalculated]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-700 text-sm">
                      {isCalculated ? getStatLabel(key) : formatStatName(key)}
                    </span>
                    <span className="font-medium text-sm text-black">
                      {isCalculated ? formatStatValue(key, value) : (value ?? 0)}
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