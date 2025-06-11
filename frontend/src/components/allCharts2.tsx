import React, { useState, useMemo, useCallback } from "react";
import { Card, CardContent } from "./ui/Card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarAngleAxis, PolarRadiusAxis, Customized, PolarGrid, ScatterChart, Scatter, CartesianGrid } from 'recharts';
import type { TooltipProps } from 'recharts';
import { normalizePlayerData, getMetricDisplayLabel } from '../utils/dataTransformation';


// Position-specific metrics for the radar chart
const topicF = ["goals", "penaltyGoals", "goalConversionPercentage", "totalShots", "keyPasses", "accurateFinalThirdPasses", "successfulDribbles", "aerialDuelsWon", "possessionLost"];
const topicM = ["accuratePassesPercentage", "accurateLongBalls", "keyPasses", "totalShots", "successfulDribbles", "totalDuelsWon", "tackles", "interceptions"];
const topicD = ["tackles", "interceptions", "clearances", "groundDuelsWonPercentage", "aerialDuelsWonPercentage", "fouls", "accuratePassesPercentage", "accurateLongBalls", "keyPasses"];
const topicG = ["saves", "goalsConcededOutsideTheBox", "goalsConcededInsideTheBox", "highClaims", "punches", "runsOut", "accuratePassesPercentage", "accurateLongBalls"];

export function PlayerMatchScatter({ data, xAxisMetric, yAxisMetric }: PlayerSeasonScatterProps) {
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
        const playerName = payload[0].payload.playerName;
        const teamName = payload[0].payload.teamName;
        const xValue = payload[0].payload[xAxisMetric]; // Extract xAxis value
        const yValue = payload[0].payload[yAxisMetric]; // Extract yAxis value
        const dotColor = getDotColor(payload[0].payload.teamId); // Get dot color based on teamId
        return (
          <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px' }}>
            <h4>{`${playerName} (${teamName})`}</h4>
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
        <h2 className="text-xl font-bold mb-4">Player Season Scatter Plot</h2>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid />
            <XAxis dataKey={xAxisMetric} name={xAxisMetric} type="number" domain={[xMin, xMax]} />
            <YAxis dataKey={yAxisMetric} name={yAxisMetric} domain={[yMin, yMax]} />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Player Performance" data={sortedData} fill="#8884d8"/>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    );
  }