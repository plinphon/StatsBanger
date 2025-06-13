import React, { useState, useMemo, useCallback } from "react";
import { Card, CardContent } from "./ui/Card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarAngleAxis, PolarRadiusAxis, Customized, PolarGrid, ScatterChart, Scatter, CartesianGrid } from 'recharts';
import type { TooltipProps } from 'recharts';
import { normalizePlayerData, getMetricDisplayLabel } from '../utils/dataTransformation';
import type { PlayerMatchStat } from "../models/player-match-stat";


// Position-specific metrics for the radar chart
const topicF = ["goals", "penaltyGoals", "goalConversionPercentage", "totalShots", "keyPasses", "accurateFinalThirdPasses", "successfulDribbles", "aerialDuelsWon", "possessionLost"];
const topicM = ["accuratePassesPercentage", "accurateLongBalls", "keyPasses", "totalShots", "successfulDribbles", "totalDuelsWon", "tackles", "interceptions"];
const topicD = ["tackles", "interceptions", "clearances", "groundDuelsWonPercentage", "aerialDuelsWonPercentage", "fouls", "accuratePassesPercentage", "accurateLongBalls", "keyPasses"];
const topicG = ["saves", "goalsConcededOutsideTheBox", "goalsConcededInsideTheBox", "highClaims", "punches", "runsOut", "accuratePassesPercentage", "accurateLongBalls"];



interface PlayerScatter2Props {
  data: PlayerMatchStat[];
  xAxisMetric: string;
  yAxisMetric: string;
}

export function PlayerScatter2({ data, xAxisMetric, yAxisMetric }: PlayerScatter2Props) {
  // Filter out entries where the stats are null or undefined
  const filteredData = data.filter(
    (item) =>
      item.matchStats[xAxisMetric] != null &&
      item.matchStats[yAxisMetric] != null
  );

  // Sort by xAxisMetric
  const sortedData = filteredData.sort(
    (a, b) =>
      (a.matchStats[xAxisMetric] as number) - (b.matchStats[xAxisMetric] as number)
  );

  // Extract values for domain calculation
  const xValues = sortedData.map((item) => item.matchStats[xAxisMetric] as number);
  const yValues = sortedData.map((item) => item.matchStats[yAxisMetric] as number);

  const pad = 0.05;
  const xMin = Math.min(...xValues) * (1 - pad);
  const xMax = Math.max(...xValues) * (1 + pad);
  const yMin = Math.min(...yValues) * (1 - pad);
  const yMax = Math.max(...yValues) * (1 + pad);

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px' }}>
          <h4>{`${p.player.playerName} (${p.team.teamName})`}</h4>
          <div>{`${xAxisMetric}: ${p.matchStats[xAxisMetric]}`}</div>
          <div>{`${yAxisMetric}: ${p.matchStats[yAxisMetric]}`}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Player Scatter Plot</h2>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid />
          <XAxis
            dataKey={`matchStats.${xAxisMetric}`}
            name={xAxisMetric}
            type="number"
            domain={[xMin, xMax]}
          />
          <YAxis
            dataKey={`matchStats.${yAxisMetric}`}
            name={yAxisMetric}
            domain={[yMin, yMax]}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Player Performance" data={sortedData} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

  type TeamScatter2Props = {
    data: Array<Record<string, any>>; 
    xAxisMetric: string;
    yAxisMetric: string;
  };
  
export function TeamScatter2({ data, xAxisMetric, yAxisMetric }: TeamScatter2Props) {
    // Sort the transformed data based on the xAxisMetric
    const sortedData = data.sort((a, b) => a[xAxisMetric] - b[xAxisMetric]);

    // Calculate min and max for xAxis and yAxis
    const xValues = sortedData.map(item => item[xAxisMetric]);
    const yValues = sortedData.map(item => item[yAxisMetric]);

    const pad = 0.05;
    const xMin = Math.min(...xValues) * (1-pad);
    const xMax = Math.max(...xValues) * (1+pad);
    const yMin = Math.min(...yValues) * (1-pad);
    const yMax = Math.max(...yValues) * (1+pad);

    // Custom Tooltip component  
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const teamName = payload[0].payload.teamName;
            const xValue = payload[0].payload[xAxisMetric]; // Extract xAxis value
            const yValue = payload[0].payload[yAxisMetric]; // Extract yAxis value
            return (
                <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px' }}>
                    <h4>{`${teamName}`}</h4>
                    <div>{`${xAxisMetric}: ${xValue}`}</div>
                    <div>{`${yAxisMetric}: ${yValue}`}</div>
                </div>
            );
        return null;
    };
        return null;
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Team Season Scatter Plot</h2>
            <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                    <CartesianGrid />
                    <XAxis dataKey={xAxisMetric} name={xAxisMetric} type="number" domain={[xMin, xMax]} />
                    <YAxis dataKey={yAxisMetric} name={yAxisMetric} domain={[yMin, yMax]} />
                    <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Team Performance" data={sortedData} fill="#8884d8"/>
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
}



interface PlayerMatchBarProps {
  data: PlayerMatchStat[];
  yAxisMetric: string;
  barLimit: number;
}


export function PlayerMatchBar({ data, yAxisMetric, barLimit }: PlayerMatchBarProps) {

  const filteredData = data.filter(
    (item) =>
      item.matchStats[yAxisMetric] != null
  );

  const values = filteredData
  .map(item => item.matchStats[yAxisMetric])
  .filter((val): val is number => val !== null && val !== undefined); 

  const computedBarLimit = Math.max(...values);

  const sortedData = [...filteredData]
    .sort((a, b) => {
      const valA = a.matchStats[yAxisMetric] ?? 0;
      const valB = b.matchStats[yAxisMetric] ?? 0;
      return valB - valA;
    })
    .slice(0, computedBarLimit); 

    const dataForChart = sortedData.map(item => ({
      ...item,
      playerName: item.player.name,
      [yAxisMetric]: item.matchStats[yAxisMetric] ?? 0,  // flatten metric here
    }));
  
  // Custom Tooltip component  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const playerName = payload[0].payload.player.name;
      const teamName = payload[0].payload.team.name;
      const yValue = payload[0].payload.matchStats[yAxisMetric] ?? 'N/A'; 
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px' }}>
          <h4>{`${playerName} (${teamName})`}</h4>
          <div>{`${yAxisMetric}: ${yValue}`}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Player Season Bar Chart</h2>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={dataForChart} layout="vertical">
          <YAxis type="category" dataKey="playerName" name="Player Name" />
          <XAxis type="number"/> {/* Reverse the X-axis to show largest value on the left */}
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Bar dataKey={yAxisMetric} fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
  }
