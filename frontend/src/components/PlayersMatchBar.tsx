import { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import type { PlayerMatchStat } from '../models/player-match-stat';

interface PlayerMatchBarProps {
  data: PlayerMatchStat[];
  yAxisMetric: string;
  barLimit: number;
}

// Available metrics for customization
const ALL_METRICS = {
  attacking: ['goals', 'assists', 'shots', 'shots_on_target', 'key_passes', 'crosses'],
  passing: ['total_pass', 'accurate_pass', 'pass_accuracy', 'long_balls', 'through_balls'],
  defending: ['tackles', 'interceptions', 'clearances', 'blocks', 'aerial_duels_won'],
  possession: ['touches', 'dribbles', 'successful_dribbles', 'dispossessed', 'ball_recoveries'],
  discipline: ['fouls_committed', 'fouls_won', 'yellow_cards', 'red_cards']
};

const STAT_CATEGORIES = {
  attacking: { name: 'Attacking', color: '#EF4444' },
  defending: { name: 'Defending', color: '#10B981' },
  passing: { name: 'Passing', color: '#3B82F6' },
  possession: { name: 'Possession', color: '#F59E0B' },
  discipline: { name: 'Discipline', color: '#8B5CF6' }
};

export function PlayerMatchBar({ data, yAxisMetric, barLimit }: PlayerMatchBarProps) {
  const [currentMetric, setCurrentMetric] = useState(yAxisMetric);
  const [currentBarLimit, setCurrentBarLimit] = useState(barLimit);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const filteredData = data.filter(
    (item) => item.matchStats[currentMetric] != null
  );

  const values = filteredData
    .map(item => item.matchStats[currentMetric])
    .filter((val): val is number => val !== null && val !== undefined); 

  const computedBarLimit = Math.max(...values);

  const sortedData = [...filteredData]
    .sort((a, b) => {
      const valA = a.matchStats[currentMetric] ?? 0;
      const valB = b.matchStats[currentMetric] ?? 0;
      return valB - valA;
    })
    .slice(0, Math.min(currentBarLimit, filteredData.length));

  // Enhanced data with team-based colors
  const enhancedData = sortedData.map((item) => ({
    ...item,
    playerName: item.player.name,
    teamName: item.team.name,
    [currentMetric]: item.matchStats[currentMetric] ?? 0,
    fill: item.team.teamId === item.match.homeTeam.teamId 
      ? '#15803d' // green-700 for home team
      : '#dc2626'  // red-600 for away team
  }));

  // Format metric names
  const formatMetricName = (metric: string) => {
    return metric
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Get unique teams for legend
  const uniqueTeams = Array.from(
    new Map(enhancedData.map(item => [item.team.teamId, item])).values()
  ).map(item => ({
    id: item.team.teamId,
    name: item.team.name,
    color: item.fill
  }));

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-xs">
          <div className="flex items-center space-x-2 mb-3">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: p.fill }}
            />
            <h4 className="font-bold text-gray-800 text-sm">{p.player.name}</h4>
          </div>
          <div className="text-xs text-gray-600 mb-2">{p.team.name}</div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">{formatMetricName(currentMetric)}:</span>
              <span className="text-xs font-semibold text-blue-600">{p.matchStats[currentMetric]}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Bar component for team-based colors
  const CustomBar = (props: any) => {
    const { fill, ...rest } = props;
    return <Bar {...rest} fill={fill} />;
  };

  if (filteredData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Data Available</h3>
          <p className="text-sm text-gray-500">No players have data for the selected metric</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-600 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Player Performance - {formatMetricName(currentMetric)}</h2>
            <p className="text-indigo-100 text-sm">
              Top {Math.min(currentBarLimit, enhancedData.length)} players ranked by {formatMetricName(currentMetric).toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="mb-4">
          <ResponsiveContainer width="100%" height={Math.max(400, enhancedData.length * 40 + 100)}>
            <BarChart 
              data={enhancedData} 
              layout="vertical"
              margin={{ top: 20, right: 40, bottom: 20, left: 120 }}
            >
              <defs>
                <linearGradient id="grid" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="100%" stopColor="#f1f5f9" />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#e2e8f0" 
                fill="url(#grid)"
              />
              <XAxis 
                type="number"
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickLine={{ stroke: '#cbd5e1' }}
                axisLine={{ stroke: '#cbd5e1' }}
                label={{ 
                  value: formatMetricName(currentMetric), 
                  position: 'insideBottom', 
                  offset: -10,
                  style: { textAnchor: 'middle', fill: '#374151', fontSize: '14px', fontWeight: '600' }
                }}
              />
              <YAxis 
                type="category" 
                dataKey="playerName"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={{ stroke: '#cbd5e1' }}
                axisLine={{ stroke: '#cbd5e1' }}
                width={100}
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ 
                  fill: 'rgba(99, 102, 241, 0.1)',
                  stroke: '#6366f1',
                  strokeWidth: 1
                }} 
              />
              <Bar 
                dataKey={currentMetric} 
                fill={(entry: any) => entry.fill}
                radius={[0, 4, 4, 0]}
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Team Legend */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          {uniqueTeams.map((team) => (
            <div key={team.id} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: team.color }}
              />
              <span className="text-xs text-gray-600 font-medium">{team.name}</span>
            </div>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="mt-6 grid grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {enhancedData.length}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Players Shown
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.max(...enhancedData.map(p => p.matchStats[currentMetric] ?? 0)).toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Highest Value
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {(enhancedData.reduce((sum, p) => sum + (p.matchStats[currentMetric] ?? 0), 0) / enhancedData.length).toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Average
            </div>
          </div>
        </div>

        {/* Customize Chart Button*/}
        <button
          className="absolute bottom-4 right-4 mt-12 bg-gray-800/90 hover:bg-gray-700/90 text-gray-200 hover:text-white px-4 py-2 rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-200 text-sm font-medium backdrop-blur-sm"
          onClick={() => setIsCustomizeOpen(true)}
        >
          Customize Chart
        </button>
      </div>
      
      {/* Customization Drawer */}
      {isCustomizeOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsCustomizeOpen(false)}
          />
          
          {/* Drawer Panel */}
          <div className="fixed right-0 top-0 h-full w-96 bg-gray-900 border-l border-gray-700 shadow-2xl z-50 transform transition-transform duration-300 ease-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-gray-200">Customize Chart</h3>
                <button
                  onClick={() => setIsCustomizeOpen(false)}
                  className="text-gray-400 hover:text-gray-200 transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Metric Selection */}
                  <div>
                    <h4 className="text-gray-300 text-sm font-medium mb-4">Select Metric</h4>
                    <div className="space-y-4">
                      {Object.entries(ALL_METRICS).map(([category, metrics]) => (
                        <div key={category}>
                          <div className="flex items-center space-x-2 mb-3">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: STAT_CATEGORIES[category as keyof typeof STAT_CATEGORIES].color }}
                            />
                            <h5 className="text-gray-400 text-xs font-medium uppercase tracking-wide">
                              {STAT_CATEGORIES[category as keyof typeof STAT_CATEGORIES].name}
                            </h5>
                          </div>
                          <div className="grid grid-cols-1 gap-2 ml-5">
                            {metrics.map((metric) => (
                              <button
                                key={metric}
                                onClick={() => setCurrentMetric(metric)}
                                className={`text-left p-3 rounded-lg border transition-all duration-200 text-sm ${
                                  currentMetric === metric
                                    ? 'bg-blue-600 border-blue-500 text-white'
                                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{formatMetricName(metric)}</span>
                                  {currentMetric === metric && (
                                    <svg className="w-4 h-4 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Bar Limit Selection */}
                  <div>
                    <h4 className="text-gray-300 text-sm font-medium mb-4">Number of Players to Show</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <label className="text-gray-400 text-sm min-w-0 flex-shrink-0">
                          Limit:
                        </label>
                        <input
                          type="range"
                          min="5"
                          max="50"
                          value={currentBarLimit}
                          onChange={(e) => setCurrentBarLimit(Number(e.target.value))}
                          className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <span className="text-gray-300 text-sm font-semibold min-w-0 flex-shrink-0">
                          {currentBarLimit}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {[10, 15, 20, 25].map((limit) => (
                          <button
                            key={limit}
                            onClick={() => setCurrentBarLimit(limit)}
                            className={`px-3 py-1 rounded text-xs transition-colors ${
                              currentBarLimit === limit
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            {limit}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-6 border-t border-gray-700">
                <div className="flex gap-3">
                  <button
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 py-2 px-4 rounded-lg transition-colors"
                    onClick={() => setIsCustomizeOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg transition-colors"
                    onClick={() => setIsCustomizeOpen(false)}
                  >
                    Apply Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}