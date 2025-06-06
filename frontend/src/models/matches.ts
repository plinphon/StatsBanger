export interface Match {
    matchId: number;
    uniqueTournamentId: number;
    seasonId: number;
    matchday: number;
    homeTeamId: number;
    homeTeamName: string;
    awayTeamId: number;
    awayTeamName: string;
    homeWin?: number | null;
    homeScore?: number | null;
    awayScore?: number | null;
    injuryTime1?: number | null;
    injuryTime2?: number | null;
    currentPeriodStartTimestamp: string;
  }