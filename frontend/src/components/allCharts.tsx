import React, { useState } from "react";
import { Card, CardContent } from "./ui/Card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarAngleAxis, PolarRadiusAxis, Customized } from 'recharts';
import type { TooltipProps } from 'recharts';
import { normalizePlayerData, getMetricDisplayLabel } from '../utils/dataTransformation';

// Define a basic interface for TeamMatchStat to resolve potential import errors
export interface TeamMatchStat {
  MatchID: number | string;
  [key: string]: number | string | null;
}

interface TeamAnalyticsProps {
  data: TeamMatchStat[];
}

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

// Position-specific metrics for the radar chart fallback
const topicF = ["goals", "penaltyGoals", "goalConversionPercentage", "totalShots", "keyPasses", "accurateFinalThirdPasses", "successfulDribbles", "aerialDuelsWon", "possessionLost"];
const topicM = ["accuratePassesPercentage", "accurateLongBalls", "keyPasses", "totalShots", "successfulDribbles", "totalDuelsWon", "tackles", "interceptions"];
const topicD = ["tackles", "interceptions", "clearances", "groundDuelsWonPercentage", "aerialDuelsWonPercentage", "fouls", "accuratePassesPercentage", "accurateLongBalls", "keyPasses"];
const topicG = ["saves", "goalsConcededOutsideTheBox", "goalsConcededInsideTheBox", "highClaims", "punches", "runsOut", "accuratePassesPercentage", "accurateLongBalls"];

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

// Metrics for the bar charts in TeamAnalytics
const teamAnalyticsMetrics = [
    "expectedGoals",
    "totalShots", 
    "shotsOnTarget",
    "shotsOffTarget",
    "fouls",
    "passes",
    "tackles"
];

export function TeamAnalytics({ data }: TeamAnalyticsProps) {
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {teamAnalyticsMetrics.map((metric) => (
        <Card key={metric} className="rounded-2xl shadow">
          <CardContent>
           <h2 className="text-xl font-semibold mb-4">{metric}</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data}>
                <XAxis dataKey="MatchID" />
                <YAxis />
                <Tooltip />
                <Bar dataKey={metric} fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

interface PlayerSeasonRadarProps {
  data: Record<string, number | null>;
  position: string;
}

const CustomBackgroundLayers = ({ cx, cy, outerRadius, numSides }: { cx: number; cy: number; outerRadius: number; numSides: number }) => {
  const layers = [
    { radius: outerRadius * 0.9, fill: '#1f2937', opacity: 0.08 },
    { radius: outerRadius * 0.7, fill: '#111827', opacity: 0.12 },
    { radius: outerRadius * 0.5, fill: '#0f172a', opacity: 0.15 },
    { radius: outerRadius * 0.3, fill: '#020617', opacity: 0.18 }
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

export function PlayerSeasonRadar({ data, position }: PlayerSeasonRadarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("position");
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [customMode, setCustomMode] = useState(false);

  const getMetrics = () => {
    // If in custom mode, use selected metrics
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
  };

  // Helper functions for the customization interface
  const handleMetricToggle = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const handlePresetSelect = (presetKey: string) => {
    const preset = BUILT_IN_PRESETS[presetKey as keyof typeof BUILT_IN_PRESETS];
    if (preset) {
      setSelectedMetrics(preset.metrics);
    }
  };

  const applyCustomization = () => {
    if (selectedMetrics.length > 0) {
      setCustomMode(true);
    }
    setIsCustomizeOpen(false);
  };

  const radarMetrics = getMetrics();
  
  // Normalize the data for better visualization while preserving raw values
  const { rawData, normalizedData } = normalizePlayerData(data, position);
  
  const ChartData = radarMetrics.map(metric => ({
    label: getMetricDisplayLabel(metric),
    value: normalizedData[metric] ?? 0,  // Use normalized for chart shape
    rawValue: rawData[metric] ?? 0       // Keep raw value for tooltips
  }));

  // Expand axis to create margin between radar shape and background layers
  const topOfAxis = 120; // 100% data now reaches only 83% of radius

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-300">Player Statistics</h3>
        
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
      
      <div 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative"
        style={{ 
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isHovered ? 'scale(1.015)' : 'scale(1)',
          filter: isHovered 
            ? 'drop-shadow(0 0 30px rgba(16, 185, 129, 0.4)) drop-shadow(0 0 60px rgba(16, 185, 129, 0.2))' 
            : 'drop-shadow(0 0 15px rgba(99, 102, 241, 0.2))'
        }}
      >
        <div className="radar-chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart
              cx="50%"
              cy="50%"
              outerRadius="85%"
              data={ChartData}
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
                      numSides={ChartData.length}
                    />
                  );
                }}
              />
              <PolarAngleAxis
                dataKey="label"
                tick={{ fill: '#e5e7eb', fontSize: 11, fontWeight: 500 }}
                className="text-gray-200"
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
                    const rawValue = dataPoint.rawValue;
                    
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
                name="Player Stats"
                dataKey="value"
                stroke={isHovered ? "#10b981" : "#6366f1"}
                fill={isHovered ? "#10b981" : "#6366f1"}
                fillOpacity={isHovered ? 0.35 : 0.25}
                strokeWidth={isHovered ? 3 : 2.5}
                style={{
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  filter: isHovered 
                    ? 'drop-shadow(0 0 25px rgba(16, 185, 129, 0.9)) drop-shadow(0 0 50px rgba(16, 185, 129, 0.5))'
                    : 'drop-shadow(0 0 15px rgba(99, 102, 241, 0.7)) drop-shadow(0 0 30px rgba(99, 102, 241, 0.3))'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
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
                  Select the metrics you want to display on your radar chart.
                </p>
                
                {/* Built-in Presets */}
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

                {/* Metrics Selection */}
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