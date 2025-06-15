import { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import type { PlayerMatchStat } from '../models/player-match-stat';
import { PlayerMatchBarCustomizer } from './customizerd_chart/barMatchCustomized';

interface PlayerMatchBarProps {
  data: PlayerMatchStat[];
  yAxisMetric: string;
  barLimit: number;
}

export function PlayerMatchBar({ data, yAxisMetric, barLimit }: PlayerMatchBarProps) {
  const [currentMetric, setCurrentMetric] = useState(yAxisMetric);
  const [currentBarLimit, setCurrentBarLimit] = useState(barLimit);

  const filteredData = data.filter(
    (item) => item.allStats[currentMetric] != null
  );

  const values = filteredData
    .map(item => item.allStats[currentMetric])
    .filter((val): val is number => val !== null && val !== undefined); 

  const computedBarLimit = Math.max(...values);

  const sortedData = [...filteredData]
    .sort((a, b) => {
      const valA = a.allStats[currentMetric] ?? 0;
      const valB = b.allStats[currentMetric] ?? 0;
      return valB - valA;
    })
    .slice(0, Math.min(currentBarLimit, filteredData.length));

  // Enhanced data with team-based colors
  const enhancedData = sortedData.map((item) => ({
    ...item,
    playerName: item.player.name,
    teamName: item.team.name,
    [currentMetric]: item.allStats[currentMetric] ?? 0,
    fill: item.team.teamId === item.match.homeTeam.teamId 
      ? '#15803d' // green-700 for home team
      : '#dc2626'  // red-600 for away team
  }));

  // Format metric names
  const formatMetricName = (metric: string) => {
    return metric
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Get unique teams for legend
  const uniqueTeams = Array.from(
    new Map(enhancedData.map(item => [item.team.teamId, item])).values()
  ).map(item => ({
    id: item.team.teamId,
    name: item.team.name,
    color: item.fill
  }));

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
              <span className="text-xs text-gray-500">{formatMetricName(currentMetric)}:</span>
              <span className="text-xs font-semibold text-blue-600">{p.allStats[currentMetric]}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Bar component for team-based colors
  const CustomBar = (props: any) => {
    const { fill, ...rest } = props;
    return <Bar {...rest} fill={fill} />;
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
          <p className="text-sm text-gray-500">No players have data for the selected metric</p>
        </div>
        
        {/* Customize Chart Button - still available when no data */}
        <div className="absolute bottom-4 right-4">
          <PlayerMatchBarCustomizer
            currentMetric={currentMetric}
            currentBarLimit={currentBarLimit}
            onMetricChange={setCurrentMetric}
            onBarLimitChange={setCurrentBarLimit}
          />
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Player Performance - {formatMetricName(currentMetric)}</h2>
            <p className="text-indigo-100 text-sm">
              Top {Math.min(currentBarLimit, enhancedData.length)} players ranked by {formatMetricName(currentMetric).toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="mb-4">
          <ResponsiveContainer width="100%" height={Math.max(400, enhancedData.length * 40 + 100)}>
            <BarChart 
              data={enhancedData} 
              layout="vertical"
              margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
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
                type="number"
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickLine={{ stroke: '#cbd5e1' }}
                axisLine={{ stroke: '#cbd5e1' }}
                label={{ 
                  value: formatMetricName(currentMetric), 
                  position: 'insideBottom', 
                  offset: -10,
                  style: { textAnchor: 'middle', fill: '#374151', fontSize: '14px', fontWeight: '600' }
                }}
              />
              <YAxis 
                type="category" 
                dataKey="playerName"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={{ stroke: '#cbd5e1' }}
                axisLine={{ stroke: '#cbd5e1' }}
                width={120}
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ 
                  fill: 'rgba(99, 102, 241, 0.1)',
                  stroke: '#6366f1',
                  strokeWidth: 1
                }} 
              />
              <Bar 
                dataKey={currentMetric} 
                fill={(entry: any) => entry.fill}
                radius={[0, 4, 4, 0]}
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}
              />
            </BarChart>
          </ResponsiveContainer>
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

        {/* Stats Summary */}
        <div className="mt-6 grid grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {enhancedData.length}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Players Shown
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.max(...enhancedData.map(p => p.allStats[currentMetric] ?? 0)).toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Highest Value
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {(enhancedData.reduce((sum, p) => sum + (p.allStats[currentMetric] ?? 0), 0) / enhancedData.length).toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Average
            </div>
          </div>
        </div>
      </div>

      {/* Customize Chart Button - positioned absolutely */}
      <div className="absolute bottom-4 right-4">
        <PlayerMatchBarCustomizer
          currentMetric={currentMetric}
          currentBarLimit={currentBarLimit}
          onMetricChange={setCurrentMetric}
          onBarLimitChange={setCurrentBarLimit}
        />
      </div>
    </div>
  );
}