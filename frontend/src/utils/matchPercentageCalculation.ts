import type { PlayerMatchStat } from "../models/player-match-stat";
import { STAT_CATEGORIES, CATEGORY_LABELS } from "./categories/playerMatchStatsCategories";

// Configuration for percentage calculations
export const MATCH_PERCENTAGE_CALCULATIONS = {
    // Attacking percentages
    shot_accuracy: {
      numerator: 'on_target_scoring_attempt',
      denominator: ['on_target_scoring_attempt', 'shot_off_target'],
      label: 'Shot Accuracy',
      category: 'attacking',
      isPercentage: true
    },
    
    big_chance_conversion: {
      numerator: 'goals',
      denominator: 'big_chance_missed',
      operation: 'goals / (goals + big_chance_missed)',
      label: 'Big Chance Conversion',
      category: 'attacking',
      isPercentage: true
    },
  
    // Passing percentages
    pass_accuracy: {
      numerator: 'accurate_pass',
      denominator: 'total_pass',
      label: 'Pass Accuracy',
      category: 'passing',
      isPercentage: true
    },
  
    long_ball_accuracy: {
      numerator: 'accurate_long_balls',
      denominator: 'total_long_balls',
      label: 'Long Ball Accuracy',
      category: 'passing',
      isPercentage: true
    },
  
    cross_accuracy: {
      numerator: 'accurate_cross',
      denominator: 'total_cross',
      label: 'Cross Accuracy',
      category: 'passing',
      isPercentage: true
    },
  
    // Duel percentages
    duel_win_rate: {
      numerator: 'duel_won',
      denominator: ['duel_won', 'duel_lost'],
      label: 'Duel Win Rate',
      category: 'duels',
      isPercentage: true
    },
  
    aerial_duel_rate: {
      numerator: 'aerial_won',
      denominator: ['aerial_won', 'aerial_lost'],
      label: 'Aerial Duel Rate',
      category: 'duels',
      isPercentage: true
    },
  
    contest_win_rate: {
      numerator: 'won_contest',
      denominator: 'total_contest',
      label: 'Contest Win Rate',
      category: 'duels',
      isPercentage: true
    },
  
    // Goalkeeper percentages
    keeper_sweeper_accuracy: {
      numerator: 'accurate_keeper_sweeper',
      denominator: 'total_keeper_sweeper',
      label: 'Sweeper Accuracy',
      category: 'goalkeeper',
      isPercentage: true
    },
  
    // Additional ratios (these are NOT percentages)
    goals_per_shot: {
      numerator: 'goals',
      denominator: ['on_target_scoring_attempt', 'shot_off_target'],
      label: 'Goals per Shot',
      category: 'attacking',
      isRatio: true
    },
  
    assists_per_key_pass: {
      numerator: 'goal_assist',
      denominator: 'key_pass',
      label: 'Assists per Key Pass',
      category: 'passing',
      isRatio: true
    }
  };
  
  // Helper function to calculate percentage/ratio
  export const calculateStat = (
    numerator: number | null,
    denominator: number | number[] | null,
    isRatio: boolean = false
  ): number => {
    if (!numerator && numerator !== 0) return 0;
    
    let denom: number;
    
    if (Array.isArray(denominator)) {
      denom = denominator.reduce((sum, val) => sum + (val || 0), 0);
    } else {
      denom = denominator || 0;
    }
    
    if (denom === 0) return 0;
    
    const result = numerator / denom;
    
    if (isRatio) {
      return Math.round(result * 100) / 100; // 2 decimal places for ratios
    } else {
      return Math.round(result * 100 * 10) / 10; // 1 decimal place for percentages
    }
  };
  
  // Main function to calculate all percentages for a match stat
  export const calculateMatchPercentages = (matchStats: Record<string, number | null>) => {
    const calculated: Record<string, number> = {};
    
    Object.entries(MATCH_PERCENTAGE_CALCULATIONS).forEach(([key, config]) => {
      const numerator = matchStats[config.numerator] || 0;
      
      let denominator: number | number[];
      
      if (Array.isArray(config.denominator)) {
        denominator = config.denominator.map(field => matchStats[field] || 0);
      } else {
        denominator = matchStats[config.denominator] || 0;
      }
      
      calculated[key] = calculateStat(numerator, denominator, config.isRatio);
    });
    
    return calculated;
  };
  
  // Enhanced categories including calculated stats
  export const ENHANCED_STAT_CATEGORIES = {
    ...STAT_CATEGORIES,
    calculated_attacking: ['shot_accuracy', 'big_chance_conversion', 'goals_per_shot'],
    calculated_passing: ['pass_accuracy', 'long_ball_accuracy', 'cross_accuracy', 'assists_per_key_pass'],
    calculated_duels: ['duel_win_rate', 'aerial_duel_rate', 'contest_win_rate'],
    calculated_goalkeeper: ['keeper_sweeper_accuracy']
  };
  
  export const ENHANCED_CATEGORY_LABELS = {
    ...CATEGORY_LABELS,
    calculated_attacking: "Attack %",
    calculated_passing: "Passing %", 
    calculated_duels: "Duel %",
    calculated_goalkeeper: "GK %"
  };
  
  // Function to get stat label
  export const getStatLabel = (statKey: string): string => {
    const config = MATCH_PERCENTAGE_CALCULATIONS[statKey];
    return config ? config.label : statKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  // Function to format stat value for display
  export const formatStatValue = (statKey: string, value: number | null | undefined): string => {
    // Handle null/undefined values
    if (value === null || value === undefined || isNaN(value)) {
      return "0";
    }

    const config = MATCH_PERCENTAGE_CALCULATIONS[statKey];
    
    if (!config) {
      // For non-calculated stats, show as integer if whole number
      return value % 1 === 0 ? Math.round(value).toString() : value.toFixed(2);
    }
    
    if (config.isPercentage) {
      return `${value.toFixed(1)}%`;
    } else if (config.isRatio) {
      return value.toFixed(2);
    } else {
      return `${value.toFixed(1)}%`; // Default to percentage if neither flag is set
    }
  };