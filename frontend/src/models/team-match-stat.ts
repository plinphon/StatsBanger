export interface TeamMatchStat {
  matchID: number
  teamID: number
  ballPossession: number | null
  expectedGoals: number | null
  bigChances: number | null
  totalShots: number | null
  goalkeeperSaves: number | null
  cornerKicks: number | null
  fouls: number | null
  passes: number | null
  tackles: number | null
  freeKicks: number | null
  yellowCards: number | null
  redCards: number | null
  shotsOnTarget: number | null
  hitWoodwork: number | null
  shotsOffTarget: number | null
  blockedShots: number | null
  shotsInsideBox: number | null
  shotsOutsideBox: number | null
  bigChancesScored: number | null
  bigChancesMissed: number | null
  throughBalls: number | null
  touchesInPenaltyArea: number | null
  fouledInFinalThird: number | null
  offsides: number | null
  accuratePasses: number | null
  throwIns: number | null
  finalThirdEntries: number | null
  finalThirdPhase: number | null
  longBalls: number | null
  crosses: number | null
  duels: number | null
  dispossessed: number | null
  groundDuels: number | null
  aerialDuels: number | null
  dribbles: number | null
  tacklesWon: number | null
  totalTackles: number | null
  interceptions: number | null
  recoveries: number | null
  clearances: number | null
  totalSaves: number | null
  goalsPrevented: number | null
  goalKicks: number | null
  bigSaves: number | null
  highClaims: number | null
  punches: number | null
  errorsLeadToAShot: number | null
  errorsLeadToAGoal: number | null
  penaltySaves: number | null
  
  [key: string]: number | null
}
