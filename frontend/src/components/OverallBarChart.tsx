

import type { TeamMatchStat } from '../models/team-match-stat';

interface Props {
  data: TeamMatchStat[];
}
const MatchMirrorBarChart = ({ data }: Props) => {
  if (data.length < 2) return <div>Not enough data</div>;

  const [home, away] = data;
  const statKeys = Object.keys(home.stats);

  const chartData = statKeys.map((stat) => {
    const homeValue = home.stats[stat] ?? 0;
    const awayValue = away.stats[stat] ?? 0;
    const maxValue = Math.max(homeValue, awayValue);

    return {
      label: stat,
      homeValue,
      awayValue,
      home: homeValue,
      away: awayValue,
      maxValue,
    };
  });

  const chartHeight = Math.max(chartData.length * 60, 400);

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-4">
      {/* Header with team names */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-semibold text-black">{home.team.name}</div>
        <div className="text-sm text-gray-500 font-medium">MATCH STATS</div>
        <div className="text-lg font-semibold text-black">{away.team.name}</div>
      </div>

      {/* Custom Mirror Layout */}
      <div className="space-y-1">
        {chartData.map((stat, index) => {
          const total = stat.homeValue + stat.awayValue || 1;
          const homeWidth = (stat.homeValue / total) * 100;
          const awayWidth = (stat.awayValue / total) * 100;

          return (
            <div key={index} className="space-y-1">
              {/* Stat name above tubes */}
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-700 bg-gray-50 px-3 py-1 rounded-lg inline-block">
                  {stat.label}
                </div>
              </div>
              
              {/* Tubes and values */}
              <div className="flex items-center">
                {/* Home team value */}
                <div className={`w-12 text-right text-lg font-bold ${
                    homeWidth > awayWidth 
                      ? 'text-[#FF8113]' 
                      : 'text-gray-600'
                  }`}>
                  {stat.homeValue}
                </div>
            {/* Home team bar */}
            <div className="flex-1 flex justify-end mr-2">
              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden relative">
                <div 
                  className={`absolute right-0 top-0 h-full rounded-full transition-all duration-500 ease-out ${
                    homeWidth > awayWidth 
                      ? 'bg-[#FF8113]' 
                      : 'bg-gray-500'
                  }`}
                  style={{ width: `${homeWidth}%` }}
                />
              </div>
            </div>

            {/* Away team bar */}
            <div className="flex-1 flex justify-start ml-2">
              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden relative">
                <div 
                  className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-out ${
                    awayWidth > homeWidth 
                      ? 'bg-[#FF8113]' 
                      : 'bg-gray-500'
                  }`}
                  style={{ width: `${awayWidth}%` }}
                />
              </div>
            </div>
                            
                {/* Away team value */}
                <div className={`w-12 text-right text-lg font-bold ${
                    awayWidth > homeWidth 
                      ? 'text-[#FF8113]' 
                      : 'text-gray-600'
                  }`}>
                  {stat.awayValue}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
    </div>
  );
};

export default MatchMirrorBarChart;