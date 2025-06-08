// src/components/TeamAnalytics.tsx
import { useState } from "react"
import type { TeamMatchStat } from "../models/team-match-stat"
import { Card, CardContent } from "./ui/Card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis} from 'recharts';

interface Props {
  data: TeamMatchStat[]
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

// Position-specific metrics (legacy support)
const topicF = ["goals", "penaltyGoals", "goalConversionPercentage", "totalShots", "keyPasses", "accurateFinalThirdPasses", "successfulDribbles", "aerialDuelsWon", "possessionLost"]
const topicM = ["accuratePassesPercentage", "accurateLongBalls", "keyPasses", "totalShots", "successfulDribbles", "totalDuelsWon", "tackles", "interceptions"]
const topicD = ["tackles", "interceptions", "clearances", "groundDuelsWonPercentage", "aerialDuelsWonPercentage", "fouls", "accuratePassesPercentage", "accurateLongBalls", "keyPasses"]
const topicG = ["saves", "goalsConcededOutsideTheBox", "goalsConcededInsideTheBox", "highClaims", "punches", "runsOut", "accuratePassesPercentage", "accurateLongBalls"]

const metrics = [
    "expectedGoals",
    "totalShots", 
    "shotsOnTarget",
    "shotsOffTarget",
    "fouls",
    "passes",
    "tackles"
  ]

export function TeamAnalytics({ data }: Props) {
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {metrics.map((metric) => (
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
  )
}

interface PlayerSeasonRadarProps {
  data: Record<string, number | null>;
  position: string;
}

export function PlayerSeasonRadar({ data, position }: PlayerSeasonRadarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("position");

  const getMetrics = () => {
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
  
  const generateChartData = (data, metrics) => {
    return metrics.map(metric => ({
      label: metric,
      value: data[metric] ?? 0
    }));
  };
  
  const ChartData = generateChartData(data, getMetrics());

  
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-300">Player Statistics</h3>
        
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-gray-800 text-gray-200 px-4 py-2 rounded-lg border border-gray-600 focus:border-green-400 focus:outline-none"
        >
          <option value="position">Position Default</option>
          {Object.entries(STAT_CATEGORIES).map(([key, category]) => (
            <option key={key} value={key}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      
      <div 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative"
        style={{ 
          transition: 'transform 0.3s ease-in-out',
          transform: isHovered ? 'scale(1.02)' : 'scale(1)'
        }}
      >
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={ChartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="label" />
            <PolarRadiusAxis />
            <Tooltip 
              content={({ payload, label }) => {
                if (payload && payload[0]) {
                  return (
                    <div className="bg-gray-900/90 text-white p-3 rounded-lg shadow-lg border border-gray-700">
                      <p className="font-semibold text-green-300">{label}</p>
                      <p className="text-cyan-200">
                        Value: <span className="font-bold">{payload[0].value}</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Radar 
              name="Player Stats" 
              dataKey="value" 
              stroke={isHovered ? "#10b981" : "#8884d8"} 
              fill={isHovered ? "#10b981" : "#8884d8"} 
              fillOpacity={isHovered ? 0.8 : 0.6}
              strokeWidth={isHovered ? 3 : 2}
              style={{ transition: 'all 0.3s ease-in-out' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
