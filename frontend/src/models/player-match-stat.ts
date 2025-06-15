import type { Match } from './match'
import type { Player } from './player'
import type { Team } from './team'

import { calculateMatchPercentages } from "../utils/matchPercentageCalculation";

export interface PlayerMatchStat {
  matchId: number
  playerId: number
  teamId: number
  match: Match
  player: Player
  team: Team
  matchStats: Record<string, number | null>
  // Add calculated stats
  calculatedStats?: Record<string, number>
  // Combined for easy access
  allStats?: Record<string, number>
}

// Factory function to create enhanced PlayerMatchStat
export const createEnhancedPlayerMatchStat = (rawData: any): PlayerMatchStat => {
  const calculatedStats = calculateMatchPercentages(rawData.matchStats || {});
  
  return {
    ...rawData,
    calculatedStats,
    allStats: {
      ...rawData.matchStats,
      ...calculatedStats
    }
  };
};