import React, { useState, useMemo, useCallback } from "react";
import { Card, CardContent } from "./ui/Card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarAngleAxis, PolarRadiusAxis, Customized, PolarGrid, ScatterChart, Scatter, CartesianGrid } from 'recharts';
import type { TooltipProps } from 'recharts';
import { normalizePlayerData, getMetricDisplayLabel } from '../utils/dataTransformation';
import type { Player } from '../models/player';
import type { PlayerSeasonStat } from "../models/player-season-stat";

// Position-specific metrics for the radar chart
const topicF = ["goals", "penaltyGoals", "goalConversionPercentage", "totalShots", "keyPasses", "accurateFinalThirdPasses", "successfulDribbles", "aerialDuelsWon", "possessionLost"];
const topicM = ["accuratePassesPercentage", "accurateLongBalls", "keyPasses", "totalShots", "successfulDribbles", "totalDuelsWon", "tackles", "interceptions"];
const topicD = ["tackles", "interceptions", "clearances", "groundDuelsWonPercentage", "aerialDuelsWonPercentage", "fouls", "accuratePassesPercentage", "accurateLongBalls", "keyPasses"];
const topicG = ["saves", "goalsConcededOutsideTheBox", "goalsConcededInsideTheBox", "highClaims", "punches", "runsOut", "accuratePassesPercentage", "accurateLongBalls"];

// Stat categories for dynamic radar chart
const STAT_CATEGORIES = {
  attacking: {
    name: "Attacking",
    stats: ["goals", "assists", "expectedGoals", "bigChancesCreated", "shotsOnTarget", "totalShots"]
  },
  defending: {
    name: "Defending", 
    stats: ["tackles", "interceptions", "blockedShots", "aerialDuelsWon", "cleanSheet"]
  },
  passing: {
    name: "Passing",
    stats: ["accuratePassesPercentage", "keyPasses", "accurateLongBalls", "passToAssist", "totalPasses"]
  },
  dribbling: {
    name: "Dribbling",
    stats: ["successfulDribbles", "accurateCrosses", "dribbledPast"]
  },
  goalkeeping: {
    name: "Goalkeeping",
    stats: ["saves", "goalsConceded", "penaltySave", "savedShotsFromInsideTheBox", "cleanSheet"]
  },
  performance: {
    name: "Performance",
    stats: ["rating", "minutesPlayed", "appearances", "yellowCards", "redCards"]
  }
};

// Built-in presets for quick selection
const BUILT_IN_PRESETS = {
  "attacking": {
    name: "Attacking Focus",
    metrics: ["goals", "assists", "expectedGoals", "totalShots", "shotsOnTarget", "keyPasses"]
  },
  "defending": {
    name: "Defensive Profile", 
    metrics: ["tackles", "interceptions", "clearances", "aerialDuelsWon", "blockedShots", "cleanSheet"]
  },
  "playmaking": {
    name: "Playmaker Profile",
    metrics: ["keyPasses", "accuratePassesPercentage", "accurateLongBalls", "assists", "passToAssist", "totalPasses"]
  },
  "physical": {
    name: "Physical Dominance",
    metrics: ["aerialDuelsWon", "totalDuelsWon", "successfulDribbles", "dribbledPast", "possessionLost", "fouls"]
  }
};

// All available metrics organized by category
const ALL_METRICS = {
  attacking: ["goals", "assists", "expectedGoals", "bigChancesCreated", "shotsOnTarget", "totalShots", "goalConversionPercentage", "penaltyGoals"],
  defending: ["tackles", "interceptions", "blockedShots", "aerialDuelsWon", "cleanSheet", "clearances", "groundDuelsWonPercentage", "aerialDuelsWonPercentage"],
  passing: ["accuratePassesPercentage", "keyPasses", "accurateLongBalls", "passToAssist", "totalPasses", "accurateFinalThirdPasses"],
  dribbling: ["successfulDribbles", "accurateCrosses", "dribbledPast", "possessionLost"],
  goalkeeping: ["saves", "goalsConceded", "penaltySave", "savedShotsFromInsideTheBox", "goalsConcededOutsideTheBox", "goalsConcededInsideTheBox", "highClaims", "punches", "runsOut"],
  performance: ["rating", "minutesPlayed", "appearances", "yellowCards", "redCards", "fouls", "totalDuelsWon"]
};

// Enhanced colors for better distinction between players
const PLAYER_COLORS = [
  "#6366f1", // Indigo
  "#10b981", // Emerald  
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Violet
  "#06b6d4", // Cyan
  "#84cc16", // Lime
  "#f97316"  // Orange
];

// Interface for player with stats data - should match PlayerSeasonStat structure
interface PlayerWithStats {
  playerId: number;
  name: string;
  birthdayTimestamp: string;
  age?: number;
  position: string;
  height: number;
  preferredFoot: string;
  nationality: string;
  stats: Record<string, number | null>;
  // Optional team info from PlayerSeasonStat
  teamId?: number;
  team?: {
    teamId: number;
    name: string;
    homeStadium: string;
  };
}

interface PlayerSeasonRadarProps {
  data: Record<string, number | null>;
  position: string;
  playerName?: string;
  playerId?: string;
  onPlayerSearch?: (query: string) => Promise<Player[]>;
  uniqueTournamentID?: number;
  seasonID?: number;
  onFetchPlayerStats?: (uniqueTournamentID: number, seasonID: number, playerID: number) => Promise<PlayerSeasonStat[]>;
}

const CustomBackgroundLayers = ({ cx, cy, outerRadius, numSides }: { cx: number; cy: number; outerRadius: number; numSides: number }) => {
  const layers = [
    { radius: outerRadius * 0.9, fill: '#1f2937', opacity: 0.03 },
    { radius: outerRadius * 0.7, fill: '#111827', opacity: 0.05 },
    { radius: outerRadius * 0.5, fill: '#0f172a', opacity: 0.07 },
    { radius: outerRadius * 0.3, fill: '#020617', opacity: 0.09 }
  ];

  const generatePolygonPoints = (radius: number) => {
    const points = [];
    for (let i = 0; i < numSides; i++) {
      const angle = (i * 2 * Math.PI) / numSides - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  };

  return (
    <g>
      {layers.map((layer, index) => (
        <polygon
          key={index}
          points={generatePolygonPoints(layer.radius)}
          fill={layer.fill}
          fillOpacity={layer.opacity}
          stroke="none"
        />
      ))}
    </g>
  );
};

// Define specific types for the props passed by Recharts to custom components
interface RadarCustomizedProps {
  angleAxisMap?: { [key: number]: { cx?: number; cy?: number } };
  radiusAxisMap?: { [key: number]: { radius?: number } };
}

// Single Radar Chart Component for individual player view
const SingleRadarChart = ({ 
  data, 
  position, 
  playerName, 
  playerColor, 
  radarMetrics, 
  isHovered, 
  onMouseEnter, 
  onMouseLeave 
}: {
  data: Record<string, number | null>;
  position: string;
  playerName: string;
  playerColor: string;
  radarMetrics: string[];
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => {
  const normalizedPlayerData = useMemo(() => {
    return normalizePlayerData(data, position);
  }, [data, position]);

  const chartData = useMemo(() => {
    const { rawData, normalizedData } = normalizedPlayerData;
    
    return radarMetrics.map(metric => ({
      label: getMetricDisplayLabel(metric),
      value: normalizedData[metric] ?? 0,  
      rawValue: rawData[metric] ?? 0       
    }));
  }, [radarMetrics, normalizedPlayerData]);

  const topOfAxis = 100;

  return (
    <div className="flex flex-col items-center">
      {/* Player name with color indicator */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: playerColor }} />
        <h4 className="text-lg font-semibold text-gray-800">{playerName}</h4>
      </div>
      
      <div 
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="relative"
        style={{ 
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          filter: isHovered 
            ? `drop-shadow(0 0 20px ${playerColor}40) drop-shadow(0 0 40px ${playerColor}20)` 
            : `drop-shadow(0 0 10px ${playerColor}20)`
        }}
      >
        <ResponsiveContainer width={600} height={600}>
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius="75%"
            data={chartData}
          >
            <Customized
              component={(props: RadarCustomizedProps) => {
                const { angleAxisMap, radiusAxisMap } = props;
                const chartCx = angleAxisMap?.[0]?.cx || 0;
                const chartCy = angleAxisMap?.[0]?.cy || 0;
                const chartRadius = radiusAxisMap?.[0]?.radius || 0;

                return (
                  <CustomBackgroundLayers
                    cx={chartCx}
                    cy={chartCy}
                    outerRadius={chartRadius}
                    numSides={chartData.length}
                  />
                );
              }}
            />
            <PolarAngleAxis
              dataKey="label"
              tick={{ fill: 'black', fontSize: 12, fontWeight: 600 }}
              className="text-black"
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, topOfAxis]}
              tick={false}
              axisLine={false}
            />
            <Tooltip
              content={({ payload, label }: TooltipProps<number, string>) => {
                if (payload && payload.length) {
                  const dataPoint = payload[0].payload;
                  const normalizedValue = payload[0].value;
                  const rawValue = dataPoint.rawValue?.toFixed(2);
                  
                  return (
                    <div className="bg-gray-900/95 text-white p-4 rounded-xl shadow-2xl border border-gray-700/50 backdrop-blur-sm">
                      <p className="font-semibold text-green-300 mb-2">{label}</p>
                      <div className="space-y-1">
                        <p className="text-cyan-200">
                          Value: <span className="font-bold text-white">{rawValue}</span>
                        </p>
                        <p className="text-gray-400 text-sm">
                          Normalized: <span className="text-blue-300">{normalizedValue?.toFixed(1)}%</span>
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            
            <Radar
              name={playerName}
              dataKey="value"
              stroke={playerColor}
              fill={playerColor}
              fillOpacity={isHovered ? 0.35 : 0.25}
              strokeWidth={isHovered ? 3 : 2.5}
              style={{
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                filter: isHovered 
                  ? `drop-shadow(0 0 15px ${playerColor}90) drop-shadow(0 0 30px ${playerColor}50)`
                  : `drop-shadow(0 0 8px ${playerColor}70) drop-shadow(0 0 15px ${playerColor}30)`
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export function PlayerSeasonRadar({ 
  data, 
  position, 
  playerName = "Player",
  playerId = "main",
  onPlayerSearch,
  uniqueTournamentID,
  seasonID,
  onFetchPlayerStats
}: PlayerSeasonRadarProps) {
  const [hoveredPlayer, setHoveredPlayer] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("position");
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [customMode, setCustomMode] = useState(false);
  
  // Comparison state
  const [compareMode, setCompareMode] = useState(false);
  const [comparisonPlayers, setComparisonPlayers] = useState<PlayerWithStats[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Memoized function to get metrics based on current state
  const radarMetrics = useMemo(() => {
    if (customMode && selectedMetrics.length > 0) {
      return selectedMetrics;
    }
    
    if (selectedCategory === "position") {
      switch (position) {
        case "F": return topicF;
        case "M": return topicM;
        case "D": return topicD;
        default: return topicG;
      }
    }
    
    const categoryKeys = Object.keys(STAT_CATEGORIES) as Array<keyof typeof STAT_CATEGORIES>;
    const category = categoryKeys.includes(selectedCategory as keyof typeof STAT_CATEGORIES) 
      ? STAT_CATEGORIES[selectedCategory as keyof typeof STAT_CATEGORIES] 
      : null;
    
    return category?.stats || [];
  }, [customMode, selectedMetrics, selectedCategory, position]);

  // Get all players for comparison (main + comparison players with stats)
  const allPlayersForComparison = useMemo(() => {
    const players = [{
      name: playerName,
      data: data,
      position: position,
      id: 'main',
      color: PLAYER_COLORS[0]
    }];

    comparisonPlayers.forEach((player, index) => {
      if (player.stats && Object.keys(player.stats).length > 0) {
        players.push({
          name: player.name,
          data: player.stats,
          position: player.position,
          id: player.playerId.toString(),
          color: PLAYER_COLORS[index + 1] || PLAYER_COLORS[PLAYER_COLORS.length - 1]
        });
      }
    });

    return players;
  }, [playerName, data, position, comparisonPlayers]);

  // Enhanced overlapping chart data for comparison mode
  const overlappingChartData = useMemo(() => {
    if (!compareMode || allPlayersForComparison.length <= 1) {
      return [];
    }

    return radarMetrics.map(metric => {
      const point: any = {
        label: getMetricDisplayLabel(metric),
        metric: metric
      };

      allPlayersForComparison.forEach((player, index) => {
        const normalizedData = normalizePlayerData(player.data, player.position);
        point[`value${index}`] = normalizedData.normalizedData[metric] ?? 0;
        point[`raw${index}`] = normalizedData.rawData[metric] ?? 0;
        point[`name${index}`] = player.name;
      });

      return point;
    });
  }, [compareMode, allPlayersForComparison, radarMetrics]);

  // Search for players
  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    if (!onPlayerSearch) return;

    setIsSearching(true);
    try {
      const results = await onPlayerSearch(query);
      setSearchResults(results.filter(p => p.playerId.toString() !== playerId));
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [onPlayerSearch, playerId]);

  // Fetch player stats and add to comparison
  const addPlayerToComparison = useCallback(async (player: Player) => {
    if (comparisonPlayers.length >= 7) return; // Increased limit for more players
    if (!onFetchPlayerStats || !uniqueTournamentID || !seasonID) {
      console.error('Missing required props for fetching player stats');
      return;
    }

    try {
      setSearchQuery("");
      setSearchResults([]);

      console.log('Fetching stats for player:', player.name, player.playerId);

      // Fetch player stats using the provided function
      const playerSeasonStats = await onFetchPlayerStats(
        uniqueTournamentID,
        seasonID,
        player.playerId
      );

      console.log('Received PlayerSeasonStats:', playerSeasonStats);

      if (playerSeasonStats && playerSeasonStats.length > 0) {
        // The API returns PlayerSeasonStat[], so we need playerSeasonStats[0].stats
        const rawPlayerStats = playerSeasonStats[0].stats || {};
        
        console.log('Raw stats for', player.name, ':', rawPlayerStats);
        console.log('Raw stats keys:', Object.keys(rawPlayerStats));
        
        // Convert snake_case to camelCase for comparison player stats
        const convertedStats: Record<string, number | null> = {};
        for (const [key, value] of Object.entries(rawPlayerStats)) {
          const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
          convertedStats[camelKey] = typeof value === 'number' ? value : null;
        }
        
        console.log('Converted stats for', player.name, ':', convertedStats);
        console.log('Converted stats keys:', Object.keys(convertedStats));
        
        // Create player with actual stats from PlayerSeasonStat
        const playerWithStats: PlayerWithStats = {
          playerId: playerSeasonStats[0].playerId,
          name: playerSeasonStats[0].player.name,
          birthdayTimestamp: playerSeasonStats[0].player.birthdayTimestamp,
          age: playerSeasonStats[0].player.age,
          position: playerSeasonStats[0].player.position,
          height: playerSeasonStats[0].player.height,
          preferredFoot: playerSeasonStats[0].player.preferredFoot,
          nationality: playerSeasonStats[0].player.nationality,
          stats: convertedStats,
          teamId: playerSeasonStats[0].teamId,
          team: playerSeasonStats[0].team
        };

        console.log('Final player with stats:', playerWithStats);
        
        // Add player with actual stats
        setComparisonPlayers(prev => [...prev, playerWithStats]);
      } else {
        console.log('No stats found for player:', player.name);
        alert(`No season stats found for ${player.name} in this tournament/season.`);
      }
    } catch (error) {
      console.error('Error adding player to comparison:', error);
      alert(`Error fetching stats for ${player.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [comparisonPlayers.length, onFetchPlayerStats, uniqueTournamentID, seasonID]);

  // Remove player from comparison
  const removePlayerFromComparison = useCallback((playerIdToRemove: string) => {
    setComparisonPlayers(prev => prev.filter(p => p.playerId.toString() !== playerIdToRemove));
  }, []);

  // Toggle comparison mode
  const toggleCompareMode = useCallback(() => {
    setCompareMode(!compareMode);
    if (compareMode) {
      setComparisonPlayers([]);
    }
  }, [compareMode]);

  // Optimized callback functions using useCallback
  const handleMetricToggle = useCallback((metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  }, []);

  const handlePresetSelect = useCallback((presetKey: string) => {
    const preset = BUILT_IN_PRESETS[presetKey as keyof typeof BUILT_IN_PRESETS];
    if (preset) {
      setSelectedMetrics(preset.metrics);
    }
  }, []);

  const applyCustomization = useCallback(() => {
    if (selectedMetrics.length > 0) {
      setCustomMode(true);
    }
    setIsCustomizeOpen(false);
  }, [selectedMetrics.length]);

  const topOfAxis = 100;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-black">
            Player Statistics {compareMode && allPlayersForComparison.length > 1 && `(Comparing ${allPlayersForComparison.length} players)`}
          </h3>
          
          {/* Player tags when in comparison mode */}
          {compareMode && (
            <div className="flex flex-wrap gap-2 mt-2">
              {allPlayersForComparison.map((player, index) => (
                <div key={player.id} className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: player.color }} />
                  <span className="text-gray-700">{player.name}</span>
                  {index > 0 && (
                    <button
                      onClick={() => removePlayerFromComparison(player.id)}
                      className="text-gray-500 hover:text-red-500 ml-1"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          {onPlayerSearch && (
            <button
              onClick={toggleCompareMode}
              className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                compareMode 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {compareMode ? 'Exit Compare' : 'Compare Players'}
            </button>
          )}
          
          <div className="relative inline-block">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-gray-800 text-gray-200 px-6 py-2 pr-12 rounded-lg border border-gray-600 focus:border-green-400 focus:outline-none"
            >
              <option value="position">Position Default</option>
              {Object.entries(STAT_CATEGORIES).map(([key, category]) => (
                <option key={key} value={key}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Player search in compare mode */}
      {compareMode && onPlayerSearch && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search players to compare..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              {isSearching && (
                <div className="absolute right-3 top-2.5">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
          </div>
          
          {/* Search results */}
          {searchResults.length > 0 && (
            <div className="mt-2 max-h-40 overflow-y-auto">
              {searchResults.map((player) => (
                <div key={player.playerId} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
                  <div>
                    <div className="font-medium">{player.name}</div>
                    <div className="text-sm text-gray-500">{player.position} • {player.nationality}</div>
                  </div>
                  <button
                    onClick={() => addPlayerToComparison(player)}
                    disabled={comparisonPlayers.length >= 7}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Radar Charts - Both modes now use same size */}
      <div className="relative">
        {!compareMode || allPlayersForComparison.length === 1 ? (
          // Single player mode - now uses 600x600 like comparison mode
          <div className="flex justify-center">
            <SingleRadarChart
              data={data}
              position={position}
              playerName={playerName}
              playerColor={PLAYER_COLORS[0]}
              radarMetrics={radarMetrics}
              isHovered={hoveredPlayer === 'main'}
              onMouseEnter={() => setHoveredPlayer('main')}
              onMouseLeave={() => setHoveredPlayer(null)}
            />
          </div>
        ) : (
          // Enhanced overlapping comparison mode (stays 600x600)
          <div className="flex flex-col items-center">
            {/* Enhanced legend with hover effects */}
            <div className="mb-6 flex flex-wrap justify-center gap-4">
              {allPlayersForComparison.map((player, index) => (
                <div 
                  key={player.id} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-300 cursor-pointer ${
                    hoveredPlayer === player.id || hoveredPlayer === null
                      ? 'bg-white shadow-lg transform scale-105' 
                      : 'bg-gray-100 opacity-60'
                  }`}
                  style={{ 
                    borderColor: player.color,
                    boxShadow: hoveredPlayer === player.id ? `0 0 20px ${player.color}40` : 'none'
                  }}
                  onMouseEnter={() => setHoveredPlayer(player.id)}
                  onMouseLeave={() => setHoveredPlayer(null)}
                >
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: player.color }} 
                  />
                  <span className="text-sm font-medium text-gray-800">{player.name}</span>
                  <span className="text-xs text-gray-500">{player.position}</span>
                  {index > 0 && (
                    <button
                      onClick={() => removePlayerFromComparison(player.id)}
                      className="text-gray-400 hover:text-red-500 ml-1 text-lg leading-none"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Single overlapping radar chart */}
            <div 
              className="relative"
              onMouseLeave={() => setHoveredPlayer(null)}
              style={{ 
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hoveredPlayer ? 'scale(1.02)' : 'scale(1)',
                filter: hoveredPlayer
                  ? 'drop-shadow(0 0 30px rgba(16, 185, 129, 0.4)) drop-shadow(0 0 60px rgba(16, 185, 129, 0.2))' 
                  : 'drop-shadow(0 0 15px rgba(99, 102, 241, 0.2))'
              }}
            >
              <ResponsiveContainer width={600} height={600}>
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="75%"
                  data={overlappingChartData}
                >
                  <Customized
                    component={(props: RadarCustomizedProps) => {
                      const { angleAxisMap, radiusAxisMap } = props;
                      const chartCx = angleAxisMap?.[0]?.cx || 0;
                      const chartCy = angleAxisMap?.[0]?.cy || 0;
                      const chartRadius = radiusAxisMap?.[0]?.radius || 0;

                      return (
                        <CustomBackgroundLayers
                          cx={chartCx}
                          cy={chartCy}
                          outerRadius={chartRadius}
                          numSides={overlappingChartData.length}
                        />
                      );
                    }}
                  />
                  <PolarAngleAxis
                    dataKey="label"
                    tick={{ fill: 'black', fontSize: 12, fontWeight: 600 }}
                    className="text-black"
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, topOfAxis]}
                    tick={false}
                    axisLine={false}
                  />
                  <Tooltip
                    content={({ payload, label }: TooltipProps<number, string>) => {
                      if (payload && payload.length) {
                        const dataPoint = payload[0].payload;
                        
                        return (
                          <div className="bg-gray-900/95 text-white p-5 rounded-xl shadow-2xl border border-gray-700/50 backdrop-blur-sm max-w-xs">
                            <p className="font-semibold text-green-300 mb-3 text-center">{label}</p>
                            <div className="space-y-3">
                              {allPlayersForComparison.map((player, index) => {
                                const rawValue = dataPoint[`raw${index}`];
                                const normalizedValue = dataPoint[`value${index}`];
                                
                                return (
                                  <div 
                                    key={player.id} 
                                    className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                                      hoveredPlayer === player.id || hoveredPlayer === null
                                        ? 'bg-gray-800/60 transform scale-105' 
                                        : 'bg-gray-800/20 opacity-60'
                                    }`}
                                    style={{
                                      borderLeft: `3px solid ${player.color}`,
                                      boxShadow: hoveredPlayer === player.id ? `0 0 10px ${player.color}40` : 'none'
                                    }}
                                  >
                                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: player.color }} />
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-medium truncate">{dataPoint[`name${index}`]}</div>
                                      <div className="text-xs text-gray-400">
                                        <span className="text-white font-medium">{rawValue?.toFixed(2)}</span>
                                        {' '}(<span className="text-blue-300">{normalizedValue?.toFixed(1)}%</span>)
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  
                  {/* Render radar for each player with enhanced visual effects */}
                  {allPlayersForComparison.map((player, index) => (
                    <Radar
                      key={player.id}
                      name={player.name}
                      dataKey={`value${index}`}
                      stroke={player.color}
                      fill={player.color}
                      fillOpacity={
                        hoveredPlayer === null ? 0.15 : 
                        hoveredPlayer === player.id ? 0.35 : 0.05
                      }
                      strokeWidth={
                        hoveredPlayer === null ? 2.5 : 
                        hoveredPlayer === player.id ? 4 : 1.5
                      }
                      style={{
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        filter: hoveredPlayer === null || hoveredPlayer === player.id
                          ? `drop-shadow(0 0 12px ${player.color}80) drop-shadow(0 0 25px ${player.color}40)`
                          : `drop-shadow(0 0 4px ${player.color}40)`,
                        opacity: hoveredPlayer === null || hoveredPlayer === player.id ? 1 : 0.4
                      }}
                    />
                  ))}
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
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
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsCustomizeOpen(false)}
          />
          
          <div className="fixed right-0 top-0 h-full w-96 bg-gray-900 border-l border-gray-700 shadow-2xl z-50 transform transition-transform duration-300 ease-out">
            <div className="flex flex-col h-full">
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
              
              <div className="flex-1 overflow-y-auto p-6">
                <p className="text-gray-400 text-sm mb-6">
                  Select the metrics you want to display on your radar chart.
                </p>
                
                <div className="mb-6">
                  <h4 className="text-gray-300 text-sm font-medium mb-3">Quick Presets</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(BUILT_IN_PRESETS).map(([key, preset]) => (
                      <button
                        key={key}
                        onClick={() => handlePresetSelect(key)}
                        className="text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                      >
                        <div className="text-gray-200 text-sm font-medium">{preset.name}</div>
                        <div className="text-gray-400 text-xs mt-1">
                          {preset.metrics.length} metrics
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-gray-300 text-sm font-medium">Custom Selection</h4>
                    <span className="text-gray-400 text-xs">
                      {selectedMetrics.length} selected
                    </span>
                  </div>
                  
                  {Object.entries(ALL_METRICS).map(([category, metrics]) => (
                    <div key={category} className="space-y-2">
                      <h5 className="text-gray-400 text-xs font-medium uppercase tracking-wide">
                        {STAT_CATEGORIES[category as keyof typeof STAT_CATEGORIES]?.name || category}
                      </h5>
                      <div className="space-y-1">
                        {metrics.map((metric) => (
                          <label
                            key={metric}
                            className="flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={selectedMetrics.includes(metric)}
                              onChange={() => handleMetricToggle(metric)}
                              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <span className="ml-3 text-gray-300 text-sm">
                              {metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
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
                    disabled={selectedMetrics.length === 0}
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

// Search function implementation
export const createPlayerSearchFunction = (searchApiEndpoint: string) => {
  return async (query: string): Promise<Player[]> => {
    if (!query || query.length < 2) return [];
    
    try {
      const response = await fetch(`${searchApiEndpoint}?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
      
      const results = await response.json();
      
      // Filter to only return Player objects
      const players = results.filter((result: any): result is Player => {
        return 'playerId' in result && 
               typeof result.playerId === 'number' &&
               'name' in result &&
               'position' in result;
      });
      
      return players;
    } catch (error) {
      console.error('Player search error:', error);
      return [];
    }
  };
};