import React, { useState, useMemo, useCallback } from "react";
import { ResponsiveContainer, Radar, RadarChart, PolarAngleAxis, PolarRadiusAxis, Customized, Tooltip } from 'recharts';
import type { TooltipProps } from 'recharts';
import { normalizeTeamData, getMetricDisplayLabel } from '../../utils/dataTransformation';
import type { Team } from '../../models/team';
import type { TeamSeasonStat } from "../../models/team-season-stat";
import { TeamRadarChartCustomizer } from "../customizerd_chart/radar/TeamSeasonRadar";

// Team-specific metrics for the radar chart
const teamAttacking = ["goals", "shotsTotal", "shotsOnTarget", "bigChancesCreated", "cornerKicks", "crosses", "offside"];
const teamDefending = ["concededGoals", "tackles", "interceptions", "clearances", "blocks", "saves", "cleanSheet"];
const teamPossession = ["possession", "passes", "accuratePassesPercentage", "longBalls", "crosses", "fouls", "yellowCards"];
const teamSetPieces = ["cornerKicks", "freeKicks", "throwIns", "penalties", "goalKicks"];

// Stat categories for dynamic radar chart
const TEAM_STAT_CATEGORIES = {
  attacking: {
    name: "Attacking",
    stats: ["goals", "shotsTotal", "shotsOnTarget", "bigChancesCreated", "cornerKicks", "crosses"]
  },
  defending: {
    name: "Defending", 
    stats: ["concededGoals", "tackles", "interceptions", "clearances", "blocks", "saves", "cleanSheet"]
  },
  possession: {
    name: "Possession",
    stats: ["possession", "passes", "accuratePassesPercentage", "longBalls", "crosses", "fouls"]
  },
  setpieces: {
    name: "Set Pieces",
    stats: ["cornerKicks", "freeKicks", "throwIns", "penalties", "goalKicks", "offside"]
  },
  discipline: {
    name: "Discipline",
    stats: ["fouls", "yellowCards", "redCards", "offside"]
  }
};

// Enhanced colors for better distinction between teams
const TEAM_COLORS = [
  "#6366f1", // Indigo
  "#10b981", // Emerald  
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Violet
  "#06b6d4", // Cyan
  "#84cc16", // Lime
  "#f97316"  // Orange
];

// Interface for team with stats data - should match TeamSeasonStat structure
interface TeamWithStats {
  teamId: number;
  name: string;
  shortName?: string;
  country?: string;
  founded?: number;
  venue?: string;
  logo?: string;
  stats: Record<string, number | null>;
  // Optional league info from TeamSeasonStat
  uniqueTournamentId?: number;
  seasonId?: number;
}

interface TeamSeasonRadarProps {
  data: Record<string, number | null>;
  teamName?: string;
  teamId?: string;
  onTeamSearch?: (query: string) => Promise<Team[]>;
  uniqueTournamentID?: number;
  seasonID?: number;
  onFetchTeamStats?: (uniqueTournamentID: number, seasonID: number, teamID: number) => Promise<TeamSeasonStat[]>;
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

// Single Radar Chart Component for individual team view
const SingleRadarChart = ({ 
  data, 
  teamName, 
  teamColor, 
  radarMetrics, 
  isHovered, 
  onMouseEnter, 
  onMouseLeave 
}: {
  data: Record<string, number | null>;
  teamName: string;
  teamColor: string;
  radarMetrics: string[];
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => {
  const normalizedTeamData = useMemo(() => {
    return normalizeTeamData(data);
  }, [data]);

  const chartData = useMemo(() => {
    const { rawData, normalizedData } = normalizedTeamData;
    
    return radarMetrics.map(metric => ({
      label: getMetricDisplayLabel(metric),
      value: normalizedData[metric] ?? 0,  
      rawValue: rawData[metric] ?? 0       
    }));
  }, [radarMetrics, normalizedTeamData]);

  const topOfAxis = 100;

  return (
    <div className="flex flex-col items-center">
      {/* Team name with color indicator */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: teamColor }} />
        <h4 className="text-lg font-semibold text-gray-800">{teamName}</h4>
      </div>
      
      <div 
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="relative"
        style={{ 
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          filter: isHovered 
            ? `drop-shadow(0 0 20px ${teamColor}40) drop-shadow(0 0 40px ${teamColor}20)` 
            : `drop-shadow(0 0 10px ${teamColor}20)`
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
              name={teamName}
              dataKey="value"
              stroke={teamColor}
              fill={teamColor}
              fillOpacity={isHovered ? 0.35 : 0.25}
              strokeWidth={isHovered ? 3 : 2.5}
              animationDuration={50}
              animationEasing="ease-out"
              style={{
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                filter: isHovered 
                  ? `drop-shadow(0 0 15px ${teamColor}90) drop-shadow(0 0 30px ${teamColor}50)`
                  : `drop-shadow(0 0 8px ${teamColor}70) drop-shadow(0 0 15px ${teamColor}30)`
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export function TeamSeasonRadar({ 
  data, 
  teamName = "Team",
  teamId = "main",
  onTeamSearch,
  uniqueTournamentID,
  seasonID,
  onFetchTeamStats
}: TeamSeasonRadarProps) {
  const [hoveredTeam, setHoveredTeam] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("attacking");
  const [customMode, setCustomMode] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  
  // Comparison state
  const [compareMode, setCompareMode] = useState(false);
  const [comparisonTeams, setComparisonTeams] = useState<TeamWithStats[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Team[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Memoized function to get metrics based on current state
  const radarMetrics = useMemo(() => {
    if (customMode && selectedMetrics.length > 0) {
      return selectedMetrics;
    }
    
    if (selectedCategory === "attacking") {
      return teamAttacking;
    }
    
    const categoryKeys = Object.keys(TEAM_STAT_CATEGORIES) as Array<keyof typeof TEAM_STAT_CATEGORIES>;
    const category = categoryKeys.includes(selectedCategory as keyof typeof TEAM_STAT_CATEGORIES) 
      ? TEAM_STAT_CATEGORIES[selectedCategory as keyof typeof TEAM_STAT_CATEGORIES] 
      : null;
    
    return category?.stats || teamAttacking;
  }, [customMode, selectedMetrics, selectedCategory]);

  // Get all teams for comparison (main + comparison teams with stats)
  const allTeamsForComparison = useMemo(() => {
    const teams = [{
      name: teamName,
      data: data,
      id: 'main',
      color: TEAM_COLORS[0]
    }];

    comparisonTeams.forEach((team, index) => {
      if (team.stats && Object.keys(team.stats).length > 0) {
        teams.push({
          name: team.name,
          data: team.stats,
          id: team.teamId.toString(),
          color: TEAM_COLORS[index + 1] || TEAM_COLORS[TEAM_COLORS.length - 1]
        });
      }
    });

    return teams;
  }, [teamName, data, comparisonTeams]);

  // Enhanced overlapping chart data for comparison mode
  const overlappingChartData = useMemo(() => {
    if (!compareMode || allTeamsForComparison.length <= 1) {
      return [];
    }

    return radarMetrics.map(metric => {
      const point: any = {
        label: getMetricDisplayLabel(metric),
        metric: metric
      };

      allTeamsForComparison.forEach((team, index) => {
        const normalizedData = normalizeTeamData(team.data);
        point[`value${index}`] = normalizedData.normalizedData[metric] ?? 0;
        point[`raw${index}`] = normalizedData.rawData[metric] ?? 0;
        point[`name${index}`] = team.name;
      });

      return point;
    });
  }, [compareMode, allTeamsForComparison, radarMetrics]);

  // Search for teams
  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (query.length < 0) {
      setSearchResults([]);
      return;
    }

    if (!onTeamSearch) return;

    setIsSearching(true);
    try {
      const results = await onTeamSearch(query);
      setSearchResults(results.filter(t => t.teamId.toString() !== teamId));
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [onTeamSearch, teamId]);

  // Fetch team stats and add to comparison
  const addTeamToComparison = useCallback(async (team: Team) => {
    if (comparisonTeams.length >= 7) return; // Increased limit for more teams
    if (!onFetchTeamStats || !uniqueTournamentID || !seasonID) {
      console.error('Missing required props for fetching team stats');
      return;
    }

    try {
      setSearchQuery("");
      setSearchResults([]);

      console.log('Fetching stats for team:', team.name, team.teamId);

      // Fetch team stats using the provided function
      const teamSeasonStats = await onFetchTeamStats(
        uniqueTournamentID,
        seasonID,
        team.teamId
      );

      console.log('Received TeamSeasonStats:', teamSeasonStats);

      if (teamSeasonStats && teamSeasonStats.length > 0) {
        // The API returns TeamSeasonStat[], so we need teamSeasonStats[0].stats
        const rawTeamStats = teamSeasonStats[0].stats || {};
        
        console.log('Raw stats for', team.name, ':', rawTeamStats);
        console.log('Raw stats keys:', Object.keys(rawTeamStats));
        
        // Convert snake_case to camelCase for comparison team stats
        const convertedStats: Record<string, number | null> = {};
        for (const [key, value] of Object.entries(rawTeamStats)) {
          const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
          convertedStats[camelKey] = typeof value === 'number' ? value : null;
        }
        
        console.log('Converted stats for', team.name, ':', convertedStats);
        console.log('Converted stats keys:', Object.keys(convertedStats));
        
        // Create team with actual stats from TeamSeasonStat
        const teamWithStats: TeamWithStats = {
          teamId: teamSeasonStats[0].teamId,
          name: teamSeasonStats[0].team.name,
          shortName: teamSeasonStats[0].team.shortName,
          country: teamSeasonStats[0].team.country,
          founded: teamSeasonStats[0].team.founded,
          venue: teamSeasonStats[0].team.homeStadium,
          logo: teamSeasonStats[0].team.logo,
          stats: convertedStats,
          uniqueTournamentId: teamSeasonStats[0].uniqueTournamentId,
          seasonId: teamSeasonStats[0].seasonId
        };

        console.log('Final team with stats:', teamWithStats);
        
        // Add team with actual stats
        setComparisonTeams(prev => [...prev, teamWithStats]);
      } else {
        console.log('No stats found for team:', team.name);
        alert(`No season stats found for ${team.name} in this tournament/season.`);
      }
    } catch (error) {
      console.error('Error adding team to comparison:', error);
      alert(`Error fetching stats for ${team.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [comparisonTeams.length, onFetchTeamStats, uniqueTournamentID, seasonID]);

  // Remove team from comparison
  const removeTeamFromComparison = useCallback((teamIdToRemove: string) => {
    setComparisonTeams(prev => prev.filter(t => t.teamId.toString() !== teamIdToRemove));
  }, []);

  // Toggle comparison mode
  const toggleCompareMode = useCallback(() => {
    setCompareMode(!compareMode);
    if (compareMode) {
      setComparisonTeams([]);
    }
  }, [compareMode]);

  const topOfAxis = 100;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-black">
            Team Statistics {compareMode && allTeamsForComparison.length > 1 && `(Comparing ${allTeamsForComparison.length} teams)`}
          </h3>
          
          {/* Team tags when in comparison mode */}
          {compareMode && (
            <div className="flex flex-wrap gap-2 mt-2">
              {allTeamsForComparison.map((team, index) => (
                <div key={team.id} className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team.color }} />
                  <span className="text-gray-700">{team.name}</span>
                  {index > 0 && (
                    <button
                      onClick={() => removeTeamFromComparison(team.id)}
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
          {onTeamSearch && (
            <button
              onClick={toggleCompareMode}
              className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                compareMode 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {compareMode ? 'Exit Compare' : 'Compare Teams'}
            </button>
          )}
        </div>
      </div>

      {/* Team search in compare mode */}
      {compareMode && onTeamSearch && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search teams to compare..."
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
              {searchResults.map((team) => (
                <div key={team.teamId} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
                  <div>
                    <div className="font-medium">{team.name}</div>
                    <div className="text-sm text-gray-500">{team.shortName} • {team.country}</div>
                  </div>
                  <button
                    onClick={() => addTeamToComparison(team)}
                    disabled={comparisonTeams.length >= 7}
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
        {!compareMode || allTeamsForComparison.length === 1 ? (
          // Single team mode - now uses 600x600 like comparison mode
          <div className="flex justify-center">
            <SingleRadarChart
              data={data}
              teamName={teamName}
              teamColor={TEAM_COLORS[0]}
              radarMetrics={radarMetrics}
              isHovered={hoveredTeam === 'main'}
              onMouseEnter={() => setHoveredTeam('main')}
              onMouseLeave={() => setHoveredTeam(null)}
            />
          </div>
        ) : (
          // Enhanced overlapping comparison mode (stays 600x600)
          <div className="flex flex-col items-center">
            {/* Enhanced legend with hover effects */}
            <div className="mb-6 flex flex-wrap justify-center gap-4">
              {allTeamsForComparison.map((team, index) => (
                <div 
                  key={team.id} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-300 cursor-pointer ${
                    hoveredTeam === team.id || hoveredTeam === null
                      ? 'bg-white shadow-lg transform scale-105' 
                      : 'bg-gray-100 opacity-60'
                  }`}
                  style={{ 
                    borderColor: team.color,
                    boxShadow: hoveredTeam === team.id ? `0 0 20px ${team.color}40` : 'none'
                  }}
                  onMouseEnter={() => setHoveredTeam(team.id)}
                  onMouseLeave={() => setHoveredTeam(null)}
                >
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: team.color }} 
                  />
                  <span className="text-sm font-medium text-gray-800">{team.name}</span>
                  {index > 0 && (
                    <button
                      onClick={() => removeTeamFromComparison(team.id)}
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
              onMouseLeave={() => setHoveredTeam(null)}
              style={{ 
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hoveredTeam ? 'scale(1.02)' : 'scale(1)',
                filter: hoveredTeam
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
                              {allTeamsForComparison.map((team, index) => {
                                const rawValue = dataPoint[`raw${index}`];
                                const normalizedValue = dataPoint[`value${index}`];
                                
                                return (
                                  <div 
                                    key={team.id} 
                                    className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                                      hoveredTeam === team.id || hoveredTeam === null
                                        ? 'bg-gray-800/60 transform scale-105' 
                                        : 'bg-gray-800/20 opacity-60'
                                    }`}
                                    style={{
                                      borderLeft: `3px solid ${team.color}`,
                                      boxShadow: hoveredTeam === team.id ? `0 0 10px ${team.color}40` : 'none'
                                    }}
                                  >
                                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: team.color }} />
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
                  
                  {/* Render radar for each team with enhanced visual effects */}
                  {allTeamsForComparison.map((team, index) => (
                    <Radar
                      key={team.id}
                      name={team.name}
                      dataKey={`value${index}`}
                      stroke={team.color}
                      fill={team.color}
                      fillOpacity={
                        hoveredTeam === null ? 0.15 : 
                        hoveredTeam === team.id ? 0.35 : 0.05
                      }
                      strokeWidth={
                        hoveredTeam === null ? 2.5 : 
                        hoveredTeam === team.id ? 4 : 1.5
                      }
                      animationDuration={50}
                      animationEasing="ease-out"
                      style={{
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        filter: hoveredTeam === null || hoveredTeam === team.id
                          ? `drop-shadow(0 0 12px ${team.color}80) drop-shadow(0 0 25px ${team.color}40)`
                          : `drop-shadow(0 0 4px ${team.color}40)`,
                        opacity: hoveredTeam === null || hoveredTeam === team.id ? 1 : 0.4
                      }}
                    />
                  ))}
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {/* Customizer Component */}
        <div className="absolute bottom-4 right-4">
          <TeamRadarChartCustomizer
            currentCategory={selectedCategory}
            customMode={customMode}
            selectedMetrics={selectedMetrics}
            onCategoryChange={setSelectedCategory}
            onCustomModeChange={setCustomMode}
            onSelectedMetricsChange={setSelectedMetrics}
          />
        </div>
      </div>
    </div>
  );
}

// Search function implementation
export const createTeamSearchFunction = (searchApiEndpoint: string) => {
  return async (query: string): Promise<Team[]> => {
    if (!query || query.length < 2) return [];
    
    try {
      const response = await fetch(`${searchApiEndpoint}?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
      
      const results = await response.json();
      
      // Filter to only return Team objects
      const teams = results.filter((result: any): result is Team => {
        return 'teamId' in result && 
               typeof result.teamId === 'number' &&
               'name' in result;
      });
      
      return teams;
    } catch (error) {
      console.error('Team search error:', error);
      return [];
    }
  };
};