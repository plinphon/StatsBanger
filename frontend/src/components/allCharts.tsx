// src/components/TeamAnalytics.tsx
import type { TeamMatchStat } from "../models/team-match-stat"
import { Card, CardContent } from "./ui/Card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis} from 'recharts';

interface Props {
  data: TeamMatchStat[]
}

const metrics = [
    "expectedGoals",
    "totalShots",
    "shotsOnTarget",
    "shotsOffTarget",
    "fouls",
    "passes",
    "tackles"
  ]

const topicF = ["goals", "penaltyGoals", "goalConversionPercentage", "totalShots", "keyPasses", "accurateFinalThirdPasses", "successfulDribbles", "aerialDuelsWon", "possessionLost"]
const topicM = ["accuratePassesPercentage", "accurateLongBalls", "keyPasses", "totalShots", "successfulDribbles", "totalDuelsWon", "tackles", "interceptions"]
const topicD = ["tackles", "interceptions", "clearances", "groundDuelsWonPercentage", "aerialDuelsWonPercentage", "fouls", "accuratePassesPercentage", "accurateLongBalls", "keyPasses"]
const topicG = ["saves", "goalsConcededOutsideTheBox", "goalsConcededInsideTheBox", "highClaims", "punches", "runsOut", "accuratePassesPercentage", "accurateLongBalls"]

const teamTopic1 = []

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

export function PlayerSeasonRadar({ data, position }) {
  const metrics = position === "F" ? topicF : position === "M" ? topicM : position === "D" ? topicD : topicG;

  const bounds = {
    accuratePassesPercentage: [0, 100],
    accurateLongBalls: [0, 30],
    keyPasses: [0, 10],
    totalShots: [0, 20],
    successfulDribbles: [0, 15],
    totalDuelsWon: [0, 25], // Upper bound is 25
    tackles: [0, 10],
    interceptions: [0, 10],
  };

  const generateChartData = (data, metrics) => {
    return metrics.map(metric => ({
      label: metric,
      value: data[metric] !== undefined ? data[metric] : 0 // Handle undefined values
    }));
  };

  const ChartData = generateChartData(data, metrics);

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={ChartData} style={{ backgroundColor: '#1a1a1a' }}>
          <PolarGrid stroke="#444" />
          <PolarAngleAxis dataKey="label" stroke="#fff" fontSize={14} />
          {metrics.map((metric, index) => (
            <PolarRadiusAxis key={index} domain={bounds[metric]} stroke="#fff" />
          ))}
          <Radar
            name="Player Performance"
            dataKey="value"
            stroke="#8884d8"
            fill="rgba(136, 132, 216, 0.6)"
            fillOpacity={0.8}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#333', borderColor: '#888' }} 
            labelStyle={{ color: '#fff' }}
            itemStyle={{ color: '#fff' }} 
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}