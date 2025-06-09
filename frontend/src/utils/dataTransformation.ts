import { statsF, statsM, statsG, statsO } from '../data';

// Position mapping to stats datasets
const POSITION_STATS_MAP = {
  'F': statsF,    // Forward
  'M': statsM,    // Midfielder  
  'D': statsO,    // Defender (using statsO as fallback for now)
  'G': statsG,    // Goalkeeper
  'O': statsO     // Other positions
} as const;

type Position = keyof typeof POSITION_STATS_MAP;

/**
 * Normalizes player data based on position-specific upper bounds
 * 
 * @param data - Raw player statistics
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
  // Ensure position is valid, default to 'O' (Other)
  const playerPosition = (position in POSITION_STATS_MAP ? position : 'O') as Position;
  const positionStats = POSITION_STATS_MAP[playerPosition];
  
  const rawData: Record<string, number> = {};
  const normalizedData: Record<string, number> = {};
  
  // Process each metric in the player data
  Object.entries(data).forEach(([metric, value]) => {
    const numericValue = value ?? 0;
    rawData[metric] = numericValue;
    
    // Get position-specific upper bound for this metric
    const statInfo = positionStats[metric];
    if (statInfo && statInfo.upperBound > 0) {
      // Normalize to percentage (0-100), capped at 100%
      const normalized = Math.min((numericValue / statInfo.upperBound) * 100, 100);
      normalizedData[metric] = Math.max(normalized, 0); // Ensure non-negative
    } else {
      // If no upper bound exists, use raw value (fallback)
      normalizedData[metric] = numericValue;
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