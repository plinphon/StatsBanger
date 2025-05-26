export interface TeamMatchStat {
  MatchID: number
  TeamID: number
  BallPossession: number | null
  ExpectedGoals: number | null
  BigChances: number | null
  TotalShots: number | null
  ShotsOnTarget: number | null
  ShotsOffTarget: number | null
  YellowCards: number | null
  RedCards: number | null
  Fouls: number | null
  Passes: number | null
  Tackles: number | null
  Saves: number | null
  Interceptions: number | null
  [key: string]: number | null
}