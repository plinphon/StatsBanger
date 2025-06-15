import { statsF, statsM, statsG, statsO } from '../data';

// Map positions to their stat ranges
const POSITION_STATS_MAP = {
  'F': statsF,    
  'M': statsM,    
  'D': statsO,    // using statsO for defenders
  'G': statsG,    
  'O': statsO     
} as const;

type Position = keyof typeof POSITION_STATS_MAP;

// Stats that are already percentages or per-game (don't touch these)
const PER_GAME_OR_PERCENTAGE_METRICS = new Set([
  'accuratePassesPercentage',
  'accurateLongBallsPercentage', 
  'successfulDribblesPercentage',
  'goalConversionPercentage',
  'groundDuelsWonPercentage',
  'aerialDuelsWonPercentage',
  'totalDuelsWonPercentage',
  'accurateCrossesPercentage',
  'penaltyConversion',
  'setPieceConversion', 
]);

// Keep these as season totals
const TOTAL_METRICS = new Set([
  'appearances',
  'matchesStarted',
  'minutesPlayed'
]);

// Convert season stats to per-90-minute averages
export function convertSeasonTotalsToPerGame(
  data: Record<string, number | null>
): Record<string, number> {
  const result: Record<string, number> = {};
  const minutesPlayed = data.minutesPlayed ?? 90; // fallback to one full game
  
  // Calculate equivalent full games (90 min = 1 game)
  const equivalentGames = Math.max(minutesPlayed / 90, 1);
  
  Object.entries(data).forEach(([metric, value]) => {
    const numericValue = value ?? 0;
    
    if (PER_GAME_OR_PERCENTAGE_METRICS.has(metric)) {
      result[metric] = numericValue;
    } else if (TOTAL_METRICS.has(metric)) {
      result[metric] = numericValue;
    } else {
      // Convert to per-90-minute rate
      result[metric] = numericValue / equivalentGames;
    }
  });
  
  return result;
}

/**
 * Normalizes player data based on position-specific upper bounds
 * Now handles season-to-per-game conversion automatically
 * 
 * @param data - Raw player statistics (season totals)
 * @param position - Player position (F, M, D, G, O)
 * @returns Object with both raw values and normalized percentages
 */
export function normalizePlayerData(
  data: Record<string, number | null>, 
  position: string
): {
  rawData: Record<string, number>;
  normalizedData: Record<string, number>;
} {
  const playerPosition = (position in POSITION_STATS_MAP ? position : 'O') as Position;
  const positionStats = POSITION_STATS_MAP[playerPosition];
  
  const perGameData = convertSeasonTotalsToPerGame(data);
  
  const rawData: Record<string, number> = {};
  const normalizedData: Record<string, number> = {};
  
  Object.entries(perGameData).forEach(([metric, value]) => {
    rawData[metric] = value;
    
    const statInfo = positionStats[metric];
    if (statInfo && statInfo.upperBound > 0) {
      const normalized = Math.min((value / statInfo.upperBound) * 100, 100);
      normalizedData[metric] = Math.max(normalized, 0);
    } else {
      normalizedData[metric] = value;
    }
  });
  
  return { rawData, normalizedData };
}

/**
 * Gets the display label for a metric
 * Converts camelCase to readable format
 */
export function getMetricDisplayLabel(metric: string): string {
  return metric
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

/**
 * Gets position-specific upper bound for a metric
 * Useful for understanding the normalization context
 */
export function getMetricUpperBound(metric: string, position: string): number | null {
  const playerPosition = (position in POSITION_STATS_MAP ? position : 'O') as Position;
  const positionStats = POSITION_STATS_MAP[playerPosition];
  return positionStats[metric]?.upperBound ?? null;
} 


type PositionKey = 'G' | 'D' | 'M' | 'F';

export const positionOrder: Record<PositionKey, number> = {
  G: 1,
  D: 2,
  M: 3,
  F: 4,
};
