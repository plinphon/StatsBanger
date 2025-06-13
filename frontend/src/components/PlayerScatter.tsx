import { useState } from 'react';
import { ResponsiveContainer, ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, Scatter } from 'recharts';
import type { PlayerMatchStat } from '../models/player-match-stat';
import { STAT_COMBINATIONS } from '../utils/stats_combo';

interface PlayerScatter2Props {
  data: PlayerMatchStat[];
  xAxisMetric: string;
  yAxisMetric: string;
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
  dribbling: { name: 'Dribbling', color: '#F59E0B' },
  goalkeeping: { name: 'Goalkeeping', color: '#8B5CF6' },
  performance: { name: 'Performance', color: '#F97316' }
};

export function PlayerScatter({ data }: PlayerScatter2Props) {
    const [currentCombination, setCurrentCombination] = useState("passing_accuracy");
    const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  
    // Get current metrics from selected combination
    const selectedCombo = STAT_COMBINATIONS[currentCombination as keyof typeof STAT_COMBINATIONS];
    const currentXMetric = selectedCombo.xMetric;
    const currentYMetric = selectedCombo.yMetric;
  
    // Filter out entries where the stats are null or undefined
    const filteredData = data.filter(
      (item) =>
        item.matchStats[currentXMetric] != null &&
        item.matchStats[currentYMetric] != null
    );
  
    // Sort by xAxisMetric
    const sortedData = filteredData.sort(
      (a, b) =>
        (a.matchStats[currentXMetric] as number) - (b.matchStats[currentXMetric] as number)
    );
  
    // Extract values for domain calculation
    const xValues = sortedData.map((item) => item.matchStats[currentXMetric] as number);
    const yValues = sortedData.map((item) => item.matchStats[currentYMetric] as number);
  
    const pad = 0.05;
    const xMin = Math.min(...xValues) * (1 - pad);
    const xMax = Math.max(...xValues) * (1 + pad);
    const yMin = Math.min(...yValues) * (1 - pad);
    const yMax = Math.max(...yValues) * (1 + pad);
  
    // Format metric names
    const formatMetricName = (metric: string) => {
      return metric
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
    };
  
    // Get team colors for scatter points - improved color assignment
    const getTeamColor = (teamId: number, teamName: string) => {
      // Generate consistent colors based on team name hash
      let hash = 0;
      for (let i = 0; i < teamName.length; i++) {
        const char = teamName.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      
      const colors = [
        '#EF4444', // Red
        '#3B82F6', // Blue  
        '#10B981', // Green
        '#F59E0B', // Yellow
        '#8B5CF6', // Purple
        '#F97316', // Orange
        '#06B6D4', // Cyan
        '#84CC16', // Lime
        '#EC4899', // Pink
        '#6366F1'  // Indigo
      ];
      
      return colors[Math.abs(hash) % colors.length];
    };  

  // Enhanced data with team-based colors
  const enhancedData = sortedData.map((item) => ({
    ...item,
    fill: getTeamColor(item.team.teamId, item.team.name),
    size: 80
  }));

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
              <span className="text-xs text-gray-500">{formatMetricName(currentXMetric)}:</span>
              <span className="text-xs font-semibold text-blue-600">{p.matchStats[currentXMetric]}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">{formatMetricName(currentYMetric)}:</span>
              <span className="text-xs font-semibold text-green-600">{p.matchStats[currentYMetric]}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom dot component for scatter points
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={payload.fill}
        stroke="#ffffff"
        strokeWidth={2}
        className="transition-all duration-200 hover:r-8 cursor-pointer"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
        }}
      />
    );
  };

  const applyCustomization = () => {
    setIsCustomizeOpen(false);
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
          <p className="text-sm text-gray-500">No players have data for the selected metrics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden relative">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{selectedCombo.name}</h2>
            <p className="text-indigo-100 text-sm">
              {selectedCombo.description}
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6 relative">
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
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
              dataKey={`matchStats.${currentXMetric}`}
              name={formatMetricName(currentXMetric)}
              type="number"
              domain={[xMin, xMax]}
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickLine={{ stroke: '#cbd5e1' }}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              dataKey={`matchStats.${currentYMetric}`}
              name={formatMetricName(currentYMetric)}
              domain={[yMin, yMax]}
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickLine={{ stroke: '#cbd5e1' }}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ 
                stroke: '#6366f1', 
                strokeWidth: 2, 
                strokeDasharray: '5 5',
                fill: 'rgba(99, 102, 241, 0.1)'
              }} 
            />
            <Scatter 
              name="Player Performance" 
              data={enhancedData} 
              shape={<CustomDot />}
            />
          </ScatterChart>
        </ResponsiveContainer>

        {/* Team Legend */}
        <div className="mt-4 flex flex-wrap gap-3 justify-center">
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

        {/* Customize Chart Button*/}
        <button
          className="absolute bottom-4 right-4 bg-gray-800/90 hover:bg-gray-700/90 text-gray-200 hover:text-white px-4 py-2 rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-200 text-sm font-medium backdrop-blur-sm"
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
                <p className="text-gray-400 text-sm mb-6">
                  Choose from predefined stat combinations that work well together.
                </p>
                
                {/* Stat Combination Selection */}
                <div className="space-y-3">
                  <h4 className="text-gray-300 text-sm font-medium mb-4">Available Combinations</h4>
                  {Object.entries(STAT_COMBINATIONS).map(([key, combo]) => (
                    <button
                      key={key}
                      onClick={() => setCurrentCombination(key)}
                      className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                        currentCombination === key
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{combo.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{combo.name}</div>
                          <div className="text-xs opacity-75 mt-1">{combo.description}</div>
                        </div>
                        {currentCombination === key && (
                          <svg className="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
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
                    onClick={applyCustomization}
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