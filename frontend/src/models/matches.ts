export interface Match {
    id: number;
    uniqueTournamentId: number;
    seasonID: number;
    matchday: number;
    homeTeamID: number;
    homeTeamName: string;
    awayTeamID: number;
    awayTeamName: string;
    homeWin?: number | null;
    homeScore?: number | null;
    awayScore?: number | null;
    injuryTime1?: number | null;
    injuryTime2?: number | null;
    currentPeriodStartTimestamp: string;
  }