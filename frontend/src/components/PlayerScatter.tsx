import { useState } from 'react';
import { ResponsiveContainer, ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, Scatter } from 'recharts';
import type { PlayerMatchStat } from '../models/player-match-stat';
import { STAT_COMBINATIONS } from '../utils/stats_combo';

interface PlayerScatter2Props {
  data: PlayerMatchStat[];
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
    const [highlightedPlayerIds, setHighlightedPlayerIds] = useState<Set<number>>(new Set());
  
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
  
    // Calculate square domain - use the larger range for both axes to maintain square aspect
    const xRange = Math.max(...xValues) - Math.min(...xValues);
    const yRange = Math.max(...yValues) - Math.min(...yValues);
    const maxRange = Math.max(xRange, yRange);
    
    const pad = 0.1; // Slightly more padding for square layout
    
    // Center the smaller range within the larger range
    const xCenter = (Math.max(...xValues) + Math.min(...xValues)) / 2;
    const yCenter = (Math.max(...yValues) + Math.min(...yValues)) / 2;
    
    const halfRange = (maxRange * (1 + pad)) / 2;
    
    const xMin = xCenter - halfRange;
    const xMax = xCenter + halfRange;
    const yMin = yCenter - halfRange;
    const yMax = yCenter + halfRange;
  
    // Format metric names
    const formatMetricName = (metric: string) => {
      return metric
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
    };
  

      // Get team colors for scatter points
      const getTeamColor = (teamId: number, teamName: string, homeTeamId: number, awayTeamId: number) => {
        if (teamId === homeTeamId) {
          return '#15803d'; // green-700 for home team
        } else if (teamId === awayTeamId) {
          return '#dc2626'; // red-600 for away team
        }
        // Fallback for any other teams (shouldn't happen in a 2-team match)
        return '#6b7280'; // gray-500
      };

      // Enhanced data with team-based colors
      const enhancedData = sortedData.map((item) => ({
        ...item,
        fill: getTeamColor(item.team.teamId, item.team.name, item.match.homeTeam.teamId, item.match.awayTeam.teamId),
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

  // Handle dot click
  const handleDotClick = (playerId: number) => {
    setHighlightedPlayerIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(playerId)) {
        newSet.delete(playerId);
      } else {
        newSet.add(playerId);
      }
      return newSet;
    });
  };

  // Get label positions with overlap prevention for both labels and dots
  const getLabelPositions = () => {
    const positions = new Map();
    const highlightedPlayers = enhancedData.filter(item => 
      highlightedPlayerIds.has(item.player.playerId)
    );
    
    // Sort by Y coordinate (higher values first - top of chart)
    highlightedPlayers.sort((a, b) => {
      const aY = (a.matchStats[currentYMetric] as number);
      const bY = (b.matchStats[currentYMetric] as number);
      return bY - aY;
    });
    
    // Chart scale for coordinate conversion
    const scale = 500 / (xMax - xMin); // Square chart dimension
    
    for (let i = 0; i < highlightedPlayers.length; i++) {
      const player = highlightedPlayers[i];
      const playerX = (player.matchStats[currentXMetric] as number);
      const playerY = (player.matchStats[currentYMetric] as number);
      
      let foundValidPosition = false;
      
      // Try different positions until we find one that doesn't overlap
      const positionsToTry = [
        { x: 0, y: -25 },    // Above center
        { x: -25, y: -25 },  // Above left
        { x: 25, y: -25 },   // Above right
        { x: -40, y: -25 },  // Further left
        { x: 40, y: -25 },   // Further right
        { x: 0, y: -40 },    // Higher up
        { x: -25, y: -40 },  // Higher up left
        { x: 25, y: -40 },   // Higher up right
        { x: 0, y: 30 },     // Below
        { x: -25, y: 30 },   // Below left
        { x: 25, y: 30 },    // Below right
        { x: -40, y: 0 },    // Left side
        { x: 40, y: 0 },     // Right side
        { x: -50, y: -15 },  // Far left up
        { x: 50, y: -15 },   // Far right up
      ];
      
      for (const tryPos of positionsToTry) {
        let hasOverlap = false;
        
        // Convert to screen coordinates for overlap checking
        const currentLabelX = (playerX - xMin) * scale + tryPos.x;
        const currentLabelY = (yMax - playerY) * scale + tryPos.y;
        
        // Check against existing labels
        for (let j = 0; j < i; j++) {
          const prevPlayer = highlightedPlayers[j];
          const prevPos = positions.get(prevPlayer.player.playerId);
          
          if (prevPos) {
            const prevPlayerX = (prevPlayer.matchStats[currentXMetric] as number);
            const prevPlayerY = (prevPlayer.matchStats[currentYMetric] as number);
            
            const prevLabelX = (prevPlayerX - xMin) * scale + prevPos.offsetX;
            const prevLabelY = (yMax - prevPlayerY) * scale + prevPos.offsetY;
            
            const xDistance = Math.abs(currentLabelX - prevLabelX);
            const yDistance = Math.abs(currentLabelY - prevLabelY);
            
            // Check if labels would overlap (considering text width ~50px and height ~15px)
            if (xDistance < 55 && yDistance < 20) {
              hasOverlap = true;
              break;
            }
          }
        }
        
        // Check against ALL dots (not just highlighted ones)
        if (!hasOverlap) {
          for (const otherPlayer of enhancedData) {
            // Skip the current player
            if (otherPlayer.player.playerId === player.player.playerId) continue;
            
            const otherPlayerX = (otherPlayer.matchStats[currentXMetric] as number);
            const otherPlayerY = (otherPlayer.matchStats[currentYMetric] as number);
            
            const otherDotX = (otherPlayerX - xMin) * scale;
            const otherDotY = (yMax - otherPlayerY) * scale;
            
            // Calculate distance between label center and dot center
            const xDistance = Math.abs(currentLabelX - otherDotX);
            const yDistance = Math.abs(currentLabelY - otherDotY);
            
            // Check if label would overlap with dot
            // Label dimensions: ~50px width, ~15px height
            // Dot dimensions: ~12-16px diameter (radius ~6-8px)
            // Add some padding for better visual separation
            const labelHalfWidth = 30; // Half of estimated label width + padding
            const labelHalfHeight = 10; // Half of estimated label height + padding
            const dotRadius = 10; // Dot radius + padding
            
            if (xDistance < (labelHalfWidth + dotRadius) && yDistance < (labelHalfHeight + dotRadius)) {
              hasOverlap = true;
              break;
            }
          }
        }
        
        if (!hasOverlap) {
          foundValidPosition = true;
          positions.set(player.player.playerId, { offsetX: tryPos.x, offsetY: tryPos.y });
          break;
        }
      }
      
      // If no valid position found, use a fallback strategy
      if (!foundValidPosition) {
        // Try to find the least crowded area by checking in a spiral pattern
        let bestPos = { x: 0, y: -25 };
        let minOverlaps = Infinity;
        
        for (let radius = 25; radius <= 80; radius += 15) {
          for (let angle = 0; angle < 360; angle += 30) {
            const radians = (angle * Math.PI) / 180;
            const testX = Math.cos(radians) * radius;
            const testY = Math.sin(radians) * radius;
            
            const testLabelX = (playerX - xMin) * scale + testX;
            const testLabelY = (yMax - playerY) * scale + testY;
            
            let overlapCount = 0;
            
            // Count overlaps with other elements
            for (const otherPlayer of enhancedData) {
              if (otherPlayer.player.playerId === player.player.playerId) continue;
              
              const otherPlayerX = (otherPlayer.matchStats[currentXMetric] as number);
              const otherPlayerY = (otherPlayer.matchStats[currentYMetric] as number);
              const otherDotX = (otherPlayerX - xMin) * scale;
              const otherDotY = (yMax - otherPlayerY) * scale;
              
              const xDistance = Math.abs(testLabelX - otherDotX);
              const yDistance = Math.abs(testLabelY - otherDotY);
              
              if (xDistance < 40 && yDistance < 15) {
                overlapCount++;
              }
            }
            
            if (overlapCount < minOverlaps) {
              minOverlaps = overlapCount;
              bestPos = { x: testX, y: testY };
              if (overlapCount === 0) break;
            }
          }
          if (minOverlaps === 0) break;
        }
        
        positions.set(player.player.playerId, { offsetX: bestPos.x, offsetY: bestPos.y });
      }
    }
    
    return positions;
  };

  const labelPositions = getLabelPositions();

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
    const isHighlighted = highlightedPlayerIds.has(payload.player.playerId);
    
    // Get simple offset position
    const labelPos = labelPositions.get(payload.player.playerId);
    
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={isHighlighted ? 8 : 6}
          fill={payload.fill}
          stroke={isHighlighted ? "#000000" : "#ffffff"}
          strokeWidth={isHighlighted ? 3 : 2}
          className="transition-all duration-200 cursor-pointer"
          style={{
            filter: isHighlighted 
              ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' 
              : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleDotClick(payload.player.playerId);
          }}
        />
        {isHighlighted && labelPos && (
          <>
           {/* Connection line from dot to label */}
           <line
              x1={cx}
              y1={cy}
              x2={cx + labelPos.offsetX}
              y2={cy + labelPos.offsetY}
              stroke="#666666"
              strokeWidth={1}
              strokeDasharray="2,2"
              className="pointer-events-none"
            />
            {/* Label text */}
            <text
              x={cx + labelPos.offsetX}
              y={cy + labelPos.offsetY}
              textAnchor="middle"
              className="text-xs font-semibold fill-gray-800 pointer-events-none"
              dominantBaseline="middle"
            >
              {payload.player.name}
            </text>
          </>
        )}
      </g>
    );
  };

  const applyCustomization = () => {
    setIsCustomizeOpen(false);
    setHighlightedPlayerIds(new Set());
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
      <div className="bg-gray-600 p-6">
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
        {/* Instructions */}
        <div className="mb-4 text-center">
          <p className="text-sm text-gray-600">
            Click on any dot to highlight a player and show their name. Click again to remove highlight.
          </p>
        </div>

        {/* Square Chart Container */}
        <div className="flex justify-center">
          <div style={{ width: '600px', height: '600px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart 
                margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                width={600}
                height={600}
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
                  dataKey={`matchStats.${currentXMetric}`}
                  name={formatMetricName(currentXMetric)}
                  type="number"
                  domain={[xMin, xMax]}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickLine={{ stroke: '#cbd5e1' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickFormatter={(value) => Number(value).toFixed(2)}
                  label={{ 
                    value: formatMetricName(currentXMetric), 
                    position: 'insideBottom', 
                    offset: -10,
                    style: { textAnchor: 'middle', fill: '#374151', fontSize: '14px', fontWeight: '600' }
                  }}
                />
                <YAxis
                  dataKey={`matchStats.${currentYMetric}`}
                  name={formatMetricName(currentYMetric)}
                  domain={[yMin, yMax]}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickLine={{ stroke: '#cbd5e1' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickFormatter={(value) => Number(value).toFixed(2)}
                  label={{ 
                    value: formatMetricName(currentYMetric), 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fill: '#374151', fontSize: '14px', fontWeight: '600' }
                  }}
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
          </div>
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

        {/* Clear All Highlights Button */}
        {highlightedPlayerIds.size > 0 && (
          <div className="absolute top-20 right-4 flex flex-col gap-2">
            <button
              className="bg-red-600/90 hover:bg-red-500/90 text-white px-4 py-2 rounded-lg border border-red-500 hover:border-red-400 transition-all duration-200 text-sm font-medium backdrop-blur-sm"
              onClick={() => setHighlightedPlayerIds(new Set())}
            >
              Clear All ({highlightedPlayerIds.size})
            </button>
          </div>
        )}

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