import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

interface TeamStats {
  label: string;
  home: number;
  away: number;
}

interface Props {
  data: TeamStats[];
}

const MirrorBarChart = ({ data }: Props) => {
  const chartData = data.map(item => {
    const total = item.home + item.away || 1; // prevent division by zero
    const homeRatio = (item.home / total) * 100;
    const awayRatio = (item.away / total) * 100;

    return {
      label: item.label,
      home: -homeRatio, // negative for left side
      away: awayRatio,
      homeValue: item.home, // store original values for tooltip
      awayValue: item.away,
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

export default MirrorBarChart;