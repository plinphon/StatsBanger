import type { PlayerMatchStat } from "../../models/player-match-stat";

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
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getStatIcon = (key: string) => {
    const iconMap: { [key: string]: string } = {
      goals: "⚽",
      assists: "🎯",
      shots: "🏹",
      passes: "📍",
      tackles: "🛡️",
      saves: "🥅",
      cards: "🟨",
      fouls: "⚠️",
      corners: "📐",
      crosses: "➡️",
    };
    
    const matchedKey = Object.keys(iconMap).find(iconKey => 
      key.toLowerCase().includes(iconKey)
    );
    
    return matchedKey ? iconMap[matchedKey] : "📊";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
      {isDNP(matchItem) ? (
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Match Status</h3>
            <a 
              href={`/match/${matchItem.match.id}`} 
              className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 font-medium"
            >
              View Full Match
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          
          <div className="flex items-center justify-center p-8 bg-red-50 rounded-lg border border-red-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-red-600 font-bold text-lg mb-1">Did Not Play</p>
              <p className="text-red-500 text-sm">Player was not active in this match</p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-lg">Match Statistics</h3>
              <a 
                href={`/match/${matchItem.match.id}`} 
                className="inline-flex items-center px-3 py-1.5 text-sm bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors duration-200 font-medium backdrop-blur-sm"
              >
                View Full Match
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(matchItem.matchStats)
                .filter(([key]) => !key.includes("_id"))
                .map(([key, value], i) => (
                  <div 
                    key={key} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 border border-gray-100"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{getStatIcon(key)}</span>
                      <span className="font-medium text-gray-700 capitalize">
                        {formatStatName(key)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-blue-600">
                        {value || 0}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
            
            {Object.keys(matchItem.matchStats).filter(key => !key.includes("_id")).length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-gray-500">No statistics available</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}