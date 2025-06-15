import { useState } from 'react';
import { ResponsiveContainer, ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, Scatter } from 'recharts';
import type { PlayerSeasonStat } from '../../models/player-season-stat';
import { SEASON_STAT_COMBINATIONS } from '../../utils/combo/seasonStatsCombo';
import { PlayerSeasonScatterCustomizer } from '../customizerd_chart/scatter/scatterSeasonPlayerCustomized';

interface PlayerSeasonScatterProps {
  data: PlayerSeasonStat[];
  currentPlayerId?: number; // Add current player ID to highlight
}

export function PlayerSeasonScatter({ data, currentPlayerId }: PlayerSeasonScatterProps) {
  const [currentCombination, setCurrentCombination] = useState("goals_assists");
  const [highlightedPlayerIds, setHighlightedPlayerIds] = useState<Set<number>>(new Set());

  // Get current metrics from selected combination
  const selectedCombo = SEASON_STAT_COMBINATIONS[currentCombination as keyof typeof SEASON_STAT_COMBINATIONS];
  const currentXMetric = selectedCombo.xMetric;
  const currentYMetric = selectedCombo.yMetric;

  // Handle combination change
  const handleCombinationChange = (newCombination: string) => {
    setCurrentCombination(newCombination);
    setHighlightedPlayerIds(new Set()); // Clear highlights when changing
  };

  // Filter out entries where the stats are null, undefined, or NaN
  const filteredData = data.filter(
    (item) =>
      item.stats[currentXMetric] != null &&
      item.stats[currentYMetric] != null &&
      !isNaN(Number(item.stats[currentXMetric])) &&
      !isNaN(Number(item.stats[currentYMetric])) &&
      isFinite(Number(item.stats[currentXMetric])) &&
      isFinite(Number(item.stats[currentYMetric]))
  );

  // Apply intelligent filtering based on metrics
  const getFilteredQualityData = (data: any[]) => {
    // Always include current player
    const currentPlayerData = currentPlayerId ? data.filter(item => item.player.playerId === currentPlayerId) : [];
    
    // Get all values for the current metrics
    const xValues = data.map(item => Number(item.stats[currentXMetric])).filter(val => isFinite(val));
    const yValues = data.map(item => Number(item.stats[currentYMetric])).filter(val => isFinite(val));
    
    // Calculate dynamic thresholds (25th percentile for each metric)
    const xSorted = [...xValues].sort((a, b) => b - a);
    const ySorted = [...yValues].sort((a, b) => b - a);
    const xThreshold = xSorted[Math.floor(xSorted.length * 0.20)] || 0;
    const yThreshold = ySorted[Math.floor(ySorted.length * 0.20)] || 0;
    
    // Filter players who perform above threshold in at least one metric
    let qualityFiltered = data.filter(item => {
      const xValue = Number(item.stats[currentXMetric]);
      const yValue = Number(item.stats[currentYMetric]);
      
      // Basic activity filter - must have some meaningful playing time
      const hasPlayingTime = !item.stats.minutes_played || Number(item.stats.minutes_played) >= 180; // 2 full games minimum
      
      // Must be above 25th percentile in at least one metric OR have decent playing time
      const isRelevant = (xValue >= xThreshold || yValue >= yThreshold) && hasPlayingTime;
      
      return isRelevant;
    });
    
    // If too few players (less than 15), be more lenient
    if (qualityFiltered.length < 15) {
      const relaxedXThreshold = xSorted[Math.floor(xSorted.length * 0.5)] || 0;
      const relaxedYThreshold = ySorted[Math.floor(ySorted.length * 0.5)] || 0;
      
      qualityFiltered = data.filter(item => {
        const xValue = Number(item.stats[currentXMetric]);
        const yValue = Number(item.stats[currentYMetric]);
        const hasMinimalTime = !item.stats.minutes_played || Number(item.stats.minutes_played) >= 90;
        
        return (xValue >= relaxedXThreshold || yValue >= relaxedYThreshold) && hasMinimalTime;
      });
    }
    
    // If still too few, show top 30 players by combined metric
    if (qualityFiltered.length < 10) {
      qualityFiltered = data
        .map(item => ({
          ...item,
          combinedScore: Number(item.stats[currentXMetric]) + Number(item.stats[currentYMetric])
        }))
        .sort((a, b) => b.combinedScore - a.combinedScore)
        .slice(0, 30);
    }
    
    // Combine current player with filtered data (remove duplicates)
    const combinedData = [...currentPlayerData];
    qualityFiltered.forEach(item => {
      if (!combinedData.some(existing => existing.player.playerId === item.player.playerId)) {
        combinedData.push(item);
      }
    });
    
    return combinedData;
  };

  const qualityData = getFilteredQualityData(filteredData);

  // Sort by xAxisMetric
  const sortedData = qualityData.sort(
    (a, b) =>
      (a.stats[currentXMetric] as number) - (b.stats[currentXMetric] as number)
  );

  // Extract values for domain calculation with additional safety checks
  const xValues = sortedData.map((item) => item.stats[currentXMetric] as number).filter(val => isFinite(val));
  const yValues = sortedData.map((item) => item.stats[currentYMetric] as number).filter(val => isFinite(val));

  // Early return if no valid data points
  if (xValues.length === 0 || yValues.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 relative">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Valid Data</h3>
          <p className="text-sm text-gray-500">No players have valid numeric data for the selected metrics</p>
          <p className="text-sm text-gray-400 mt-2">Try selecting different stat combinations</p>
        </div>
        <div className="absolute bottom-4 right-4">
          <PlayerSeasonScatterCustomizer
            currentCombination={currentCombination}
            onCombinationChange={handleCombinationChange}
          />
        </div>
      </div>
    );
  }

  // Calculate square domain with safety checks
  const xRange = Math.max(...xValues) - Math.min(...xValues);
  const yRange = Math.max(...yValues) - Math.min(...yValues);
  
  // Handle edge cases where all values are the same
  const maxRange = Math.max(xRange || 1, yRange || 1);
  
  const pad = 0.1;
  
  const xCenter = (Math.max(...xValues) + Math.min(...xValues)) / 2;
  const yCenter = (Math.max(...yValues) + Math.min(...yValues)) / 2;
  
  const halfRange = (maxRange * (1 + pad)) / 2;
  
  const xMin = isFinite(xCenter - halfRange) ? xCenter - halfRange : 0;
  const xMax = isFinite(xCenter + halfRange) ? xCenter + halfRange : 1;
  const yMin = isFinite(yCenter - halfRange) ? yCenter - halfRange : 0;
  const yMax = isFinite(yCenter + halfRange) ? yCenter + halfRange : 1;

  // Format metric names
  const formatMetricName = (metric: string) => {
    return metric
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Enhanced data with player-focused colors
  const enhancedData = sortedData.map((item) => {
    const isCurrentPlayer = currentPlayerId && item.player.playerId === currentPlayerId;
    const isHighlighted = highlightedPlayerIds.has(item.player.playerId);
    
    return {
      ...item,
      fill: isCurrentPlayer ? '#FF6B35' : (isHighlighted ? '#4F46E5' : '#9CA3AF'), // Orange for current, indigo for highlighted, gray for others
      size: isCurrentPlayer ? 120 : (isHighlighted ? 100 : 60), // Larger for current and highlighted
      strokeWidth: isCurrentPlayer ? 3 : (isHighlighted ? 2 : 1),
      stroke: isCurrentPlayer ? '#000000' : (isHighlighted ? '#1E1B4B' : '#6B7280'),
      opacity: isCurrentPlayer ? 1 : (isHighlighted ? 0.9 : 0.6) // Make non-selected players more transparent
    };
  });

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
    const playersToLabel = enhancedData.filter(item => 
      (currentPlayerId && item.player.playerId === currentPlayerId) || 
      highlightedPlayerIds.has(item.player.playerId)
    );
    
    // Sort by Y coordinate (higher values first - top of chart)
    playersToLabel.sort((a, b) => {
      const aY = (a.stats[currentYMetric] as number);
      const bY = (b.stats[currentYMetric] as number);
      return bY - aY;
    });
    
    // Chart scale for coordinate conversion
    const scale = 500 / (xMax - xMin); // Square chart dimension
    
    for (let i = 0; i < playersToLabel.length; i++) {
      const player = playersToLabel[i];
      const playerX = (player.stats[currentXMetric] as number);
      const playerY = (player.stats[currentYMetric] as number);
      
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
          const prevPlayer = playersToLabel[j];
          const prevPos = positions.get(prevPlayer.player.playerId);
          
          if (prevPos) {
            const prevPlayerX = (prevPlayer.stats[currentXMetric] as number);
            const prevPlayerY = (prevPlayer.stats[currentYMetric] as number);
            
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
            
            const otherPlayerX = (otherPlayer.stats[currentXMetric] as number);
            const otherPlayerY = (otherPlayer.stats[currentYMetric] as number);
            
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
              
              const otherPlayerX = (otherPlayer.stats[currentXMetric] as number);
              const otherPlayerY = (otherPlayer.stats[currentYMetric] as number);
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
      const isCurrentPlayer = currentPlayerId && p.player.playerId === currentPlayerId;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-xs">
          <div className="flex items-center space-x-2 mb-3">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: p.fill }}
            />
            <h4 className={`font-bold text-sm ${isCurrentPlayer ? 'text-orange-600' : 'text-gray-800'}`}>
              {p.player.name}
              {isCurrentPlayer && <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">Current</span>}
            </h4>
          </div>
          <div className="text-xs text-gray-600 mb-2">{p.team.name}</div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">{formatMetricName(currentXMetric)}:</span>
              <span className="text-xs font-semibold text-blue-600">{p.stats[currentXMetric]}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">{formatMetricName(currentYMetric)}:</span>
              <span className="text-xs font-semibold text-green-600">{p.stats[currentYMetric]}</span>
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
    const isCurrentPlayer = currentPlayerId && payload.player.playerId === currentPlayerId;
    
    // Get simple offset position
    const labelPos = labelPositions.get(payload.player.playerId);
    
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={isCurrentPlayer ? 10 : (isHighlighted ? 8 : 6)}
          fill={payload.fill}
          stroke={payload.stroke}
          strokeWidth={payload.strokeWidth}
          opacity={payload.opacity}
          className="transition-all duration-200 cursor-pointer"
          style={{
            filter: (isHighlighted || isCurrentPlayer)
              ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' 
              : 'drop-shadow(0 1px 3px rgba(0,0,0,0.2))',
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleDotClick(payload.player.playerId);
          }}
        />
        {/* Show labels for current player and highlighted players */}
        {(isCurrentPlayer || (isHighlighted && labelPos)) && (
          <>
           {/* Connection line from dot to label */}
           <line
              x1={cx}
              y1={cy}
              x2={cx + (labelPos?.offsetX || 0)}
              y2={cy + (labelPos?.offsetY || -30)}
              stroke={isCurrentPlayer ? "#FF6B35" : "#4F46E5"}
              strokeWidth={isCurrentPlayer ? 2 : 1}
              strokeDasharray="2,2"
              className="pointer-events-none"
            />
            {/* Label text */}
            <text
              x={cx + (labelPos?.offsetX || 0)}
              y={cy + (labelPos?.offsetY || -30)}
              textAnchor="middle"
              className={`text-xs font-semibold pointer-events-none ${
                isCurrentPlayer ? 'fill-orange-600' : 'fill-indigo-700'
              }`}
              dominantBaseline="middle"
            >
              {payload.player.name}
            </text>
          </>
        )}
      </g>
    );
  };

  if (filteredData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 relative">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Data Available</h3>
          <p className="text-sm text-gray-500">No players have data for the selected metrics</p>
          <p className="text-sm text-gray-400 mt-2">Try selecting different stat combinations</p>
        </div>

        {/* Customizer for No Data state */}
        <div className="absolute bottom-4 right-4">
          <PlayerSeasonScatterCustomizer
            currentCombination={currentCombination}
            onCombinationChange={handleCombinationChange}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden relative">
      {/* Header */}
      <div className="bg-indigo-600 p-6">
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
            {currentPlayerId ? 'Current player highlighted in orange. Click other dots to compare.' : 'Click dots to highlight players for comparison.'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Showing {qualityData.length} players based on performance in selected metrics
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
                  <linearGradient id="seasonGrid" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f8fafc" />
                    <stop offset="100%" stopColor="#f1f5f9" />
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#e2e8f0" 
                  fill="url(#seasonGrid)"
                />
                <XAxis
                  dataKey={`stats.${currentXMetric}`}
                  name={formatMetricName(currentXMetric)}
                  type="number"
                  domain={[
                    Math.max(xMin, -999999), 
                    Math.min(xMax, 999999)
                  ]}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickLine={{ stroke: '#cbd5e1' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickFormatter={(value) => {
                    const num = Number(value);
                    return isFinite(num) ? num.toFixed(2) : '0';
                  }}
                  label={{ 
                    value: formatMetricName(currentXMetric), 
                    position: 'insideBottom', 
                    offset: -10,
                    style: { textAnchor: 'middle', fill: '#374151', fontSize: '14px', fontWeight: '600' }
                  }}
                />
                <YAxis
                  dataKey={`stats.${currentYMetric}`}
                  name={formatMetricName(currentYMetric)}
                  domain={[
                    Math.max(yMin, -999999), 
                    Math.min(yMax, 999999)
                  ]}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickLine={{ stroke: '#cbd5e1' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickFormatter={(value) => {
                    const num = Number(value);
                    return isFinite(num) ? num.toFixed(2) : '0';
                  }}
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
                  name="Season Performance" 
                  data={enhancedData} 
                  shape={<CustomDot />}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          {currentPlayerId && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-orange-100 rounded-full border border-orange-300">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-xs text-orange-700 font-semibold">Selected Player</span>
            </div>
          )}
          {highlightedPlayerIds.size > 0 && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-indigo-100 rounded-full border border-indigo-300">
              <div className="w-3 h-3 rounded-full bg-indigo-600" />
              <span className="text-xs text-indigo-700 font-semibold">Highlighted ({highlightedPlayerIds.size})</span>
            </div>
          )}
          <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full border border-gray-300">
            <div className="w-3 h-3 rounded-full bg-gray-400" />
            <span className="text-xs text-gray-600 font-medium">Other Players</span>
          </div>
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

        {/* Customizer for normal state */}
        <div className="absolute bottom-4 right-4 mt-12">
          <PlayerSeasonScatterCustomizer
            currentCombination={currentCombination}
            onCombinationChange={handleCombinationChange}
          />
        </div>
      </div>
    </div>
  );
}