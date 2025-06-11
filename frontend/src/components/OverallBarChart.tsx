import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

import type { TeamMatchStat } from '../models/team-match-stat';


interface Props {
  data: TeamMatchStat[];
}

const MatchMirrorBarChart = ({ data }: Props) => {
  if (data.length < 2) return <div>Not enough data</div>;

    const [home, away] = data;

    const statKeys = Object.keys(home.stats);

    const chartData = statKeys.map((stat) => {
      const homeValue = home.stats[stat] ?? 0;
      const awayValue = away.stats[stat] ?? 0;
      const total = homeValue + awayValue || 1;

      return {
        label: stat,
        home: -((homeValue / total) * 100),
        away: (awayValue / total) * 100,
        homeValue,
        awayValue,
      };
    });

  return (
    <ResponsiveContainer width={600} height={400}>
      <BarChart
        layout="vertical"
        data={chartData}
        margin={{ top: 20, bottom: 20, left: 10, right: 10 }}
        stackOffset="sign" // This is important for mirror effect
      >
        <XAxis
          type="number"
          domain={[-100, 100]}
          tickFormatter={(val) => `${Math.abs(val)}%`}
        />
        <YAxis dataKey="label" type="category" />
        <Tooltip 
          formatter={(value: number, name: string, props: any) => {
            // Show both percentage and actual value in tooltip
            const percentage = Math.abs(value).toFixed(1);
            const actualValue = name.includes('Home') 
              ? props.payload.homeValue 
              : props.payload.awayValue;
            return [`${percentage}%`, `(${actualValue})`];
          }}
          labelFormatter={(label) => label}
        />
        
        <Bar dataKey="home" fill="#8884d8" name="Home Team">
          <LabelList
            dataKey="home"
            position="insideLeft"
            formatter={(v: number) => `${Math.abs(v).toFixed(0)}%`}
            fill="#fff"
          />
        </Bar>
        <Bar dataKey="away" fill="#82ca9d" name="Away Team">
          <LabelList
            dataKey="away"
            position="insideRight"
            formatter={(v: number) => `${v.toFixed(0)}%`}
            fill="#fff"
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MatchMirrorBarChart;