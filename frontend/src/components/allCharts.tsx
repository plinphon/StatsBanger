// src/components/TeamAnalytics.tsx
import type { TeamMatchStat } from "../models/team-match-stat"
import { Card, CardContent } from "./ui/Card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter, CartesianGrid } from "recharts"

interface Props {
  data: TeamMatchStat[]
}

const topicF = ["goals", "penaltyGoals", "goalConversionPercentage", "totalShots", "keyPasses", "accurateFinalThirdPasses", "successfulDribbles", "aerialDuelsWon", "possessionLost"];
const topicM = ["accuratePassesPercentage", "accurateLongBalls", "keyPasses", "totalShots", "successfulDribbles", "totalDuelsWon", "tackles", "interceptions"];
const topicD = ["tackles", "interceptions", "clearances", "groundDuelsWonPercentage", "aerialDuelsWonPercentage", "fouls", "accuratePassesPercentage", "accurateLongBalls", "keyPasses"];
const topicG = ["saves", "goalsConcededOutsideTheBox", "goalsConcededInsideTheBox", "highClaims", "punches", "runsOut", "accuratePassesPercentage", "accurateLongBalls"];

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
  const metrics = (() => {
    switch (position) {
      case "F":
        return topicF;
      case "M":
        return topicM;
      case "D":
        return topicD;
      default:
        return topicG; // Fallback for goalkeepers or invalid positions
    }
  })();  
  const generateChartData = (data, metrics) => {
    return metrics.map(metric => ({
      label: metric,
      value: data[metric] ?? 0 // Default to 0 if the metric is null or undefined
    }));
  };
  const ChartData = generateChartData(data, metrics);
  
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={ChartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="label" />
          <PolarRadiusAxis />
          <Tooltip />
          <Radar name="Player1" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function TeamSeasonRadar({ data, metrics }) {
  const teamMetrics1 = [
    "expectedGoals",
    "totalShots",
    "shotsOnTarget",
    "shotsOffTarget",
    "fouls",
    "passes",
    "tackles"
  ]
  const generateChartData = (data, metrics) => {
    return metrics.map(metric => ({
      label: metric,
      value: data[metric] ?? 0 // Default to 0 if the metric is null or undefined
    }));
  };
  const ChartData = generateChartData(data, teamMetrics1);
  
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={ChartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="label" />
          <PolarRadiusAxis />
          <Tooltip />
          <Radar name="Team" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function TeamsMatchScatter({ data, metrics }) {
  const teamMetrics1 = [
    "expectedGoals",
    "totalShots",
    "shotsOnTarget",
    "shotsOffTarget",
    "fouls",
    "passes",
    "tackles"
  ]
  const generateChartData = (data, metrics) => {
    return metrics.map(metric => ({
      label: metric,
      value: data[metric] ?? 0 // Default to 0 if the metric is null or undefined
    }));
  };
  const ChartData = generateChartData(data, teamMetrics1);
  
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={ChartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="label" />
          <PolarRadiusAxis />
          <Tooltip />
          <Radar name="Team" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

type Props2 = {
  data: Array<{ [key: string]: number }>; // Adjust according to your data structure
  xAxisMetric: string;
  yAxisMetric: string;
};

type TeamSeasonStat = {
  [teamId: string]: {
    stats: { [key: string]: number }; // Numeric stats for the team
    info: { [key: string]: string }; // Additional info about the team
  };
};

type Props3 = {
  data: TeamSeasonStat;
  xAxisMetric: string;
  yAxisMetric: string;
};

export function TeamSeasonScatter({ data, xAxisMetric, yAxisMetric }) {
  // Transform the data into an array suitable for the ScatterChart
  const transformedData = Object.entries(data).map(([teamId, { stats, info }]) => ({
    teamId,
    ...stats,
    ...info,
  }));
  // Sort the transformed data based on the xAxisMetric
  const sortedData = transformedData.sort((a, b) => a[xAxisMetric] - b[xAxisMetric]);

  // Calculate min and max for xAxis and yAxis
  const xValues = sortedData.map(item => item[xAxisMetric]);
  const yValues = sortedData.map(item => item[yAxisMetric]);

  const xMin = Math.min(...xValues) * 0.95; // min - 5%
  const xMax = Math.max(...xValues) * 1.05; // max + 5%
  const yMin = Math.min(...yValues) * 0.95; // min - 5%
  const yMax = Math.max(...yValues) * 1.05; // max + 5%

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Team Season Scatter Plot</h2>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid />
          <XAxis dataKey={xAxisMetric} name={xAxisMetric} type="number" domain={[xMin, xMax]} />
          <YAxis dataKey={yAxisMetric} name={yAxisMetric} type="number" domain={[yMin, yMax]} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Team Performance" data={sortedData} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}