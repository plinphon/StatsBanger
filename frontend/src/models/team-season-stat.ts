export interface TeamSeasonStat {
    uniqueTournamentID: number
    seasonID: number
    teamID: number
    accurateLongBalls: number | null
    accurateLongBallsPercentage: number | null
    accuratePasses: number | null
    accuratePassesPercentage: number | null
    aerialDuelsWon: number | null
    assists: number | null
    bigChancesCreated: number | null
    bigChancesMissed: number | null
    cleanSheet: number | null
    dribbledPast: number | null
    errorLeadToGoal: number | null
    expectedAssists: number | null
    expectedGoals: number | null
    goals: number | null
    goalsAssistsSum: number | null
    goalsConceded: number | null
    goalsPrevented: number | null
    interceptions: number | null
    keyPasses: number | null
    minutesPlayed: number | null
    passToAssist: number | null
    penaltyFaced: number | null
    penaltySave: number | null
    rating: number | null
    redCards: number | null
    savedShotsFromInsideTheBox: number | null
    saves: number | null
    successfulDribbles: number | null
    tackles: number | null
    yellowCards: number | null
    totalRating: number | null
    countRating: number | null
    totalLongBalls: number | null
    totalPasses: number | null
    shotsFromInsideTheBox: number | null
    appearances: number | null
    type: number | null
    id: number
    accurateCrosses: number | null
    accurateCrossesPercentage: number | null
    blockedShots: number | null
    shotsOnTarget: number | null
    totalShots: number | null
    totalCross: number | null
  }
  