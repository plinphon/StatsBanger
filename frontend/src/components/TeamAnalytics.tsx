// src/components/TeamAnalytics.tsx
import type { TeamMatchStat } from "../models/team-match-stat"
import { Card, CardContent } from "../components/ui/Card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

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

export default function TeamAnalytics({ data }: Props) {
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
