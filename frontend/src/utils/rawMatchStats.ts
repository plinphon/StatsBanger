// Raw stat field names from Go model
export const RAW_MATCH_STATS = {
    // Basic info
    match_id: 'match_id',
    player_id: 'player_id',
    team_id: 'team_id',
    minutes_played: 'minutes_played',
  
    // Passing stats
    total_pass: 'total_pass',
    accurate_pass: 'accurate_pass',
    total_long_balls: 'total_long_balls',
    accurate_long_balls: 'accurate_long_balls',
    key_pass: 'key_pass',
    
    // Crossing stats
    total_cross: 'total_cross',
    accurate_cross: 'accurate_cross',
    
    // Attacking stats
    goals: 'goals',
    goal_assist: 'goal_assist',
    total_shots: 'total_shots',
    on_target_scoring_attempt: 'on_target_scoring_attempt',
    shot_off_target: 'shot_off_target',
    big_chance_created: 'big_chance_created',
    big_chance_missed: 'big_chance_missed',
    hit_woodwork: 'hit_woodwork',
    penalty_won: 'penalty_won',
    penalty_miss: 'penalty_miss',
    own_goals: 'own_goals',
    
    // Defensive stats
    total_tackle: 'total_tackle',
    total_clearance: 'total_clearance',
    interception_won: 'interception_won',
    outfielder_block: 'outfielder_block',
    blocked_scoring_attempt: 'blocked_scoring_attempt',
    last_man_tackle: 'last_man_tackle',
    clearance_off_line: 'clearance_off_line',
    
    // Duels and contests
    duel_won: 'duel_won',
    duel_lost: 'duel_lost',
    aerial_won: 'aerial_won',
    aerial_lost: 'aerial_lost',
    challenge_lost: 'challenge_lost',
    total_contest: 'total_contest',
    won_contest: 'won_contest',
    
    // Possession stats
    touches: 'touches',
    possession_lost_ctrl: 'possession_lost_ctrl',
    dispossessed: 'dispossessed',
    
    // Disciplinary
    fouls: 'fouls',
    was_fouled: 'was_fouled',
    penalty_conceded: 'penalty_conceded',
    total_offside: 'total_offside',
    
    // Goalkeeper stats
    saves: 'saves',
    saved_shots_from_inside_the_box: 'saved_shots_from_inside_the_box',
    goals_prevented: 'goals_prevented',
    total_keeper_sweeper: 'total_keeper_sweeper',
    accurate_keeper_sweeper: 'accurate_keeper_sweeper',
    good_high_claim: 'good_high_claim',
    punches: 'punches',
    penalty_save: 'penalty_save',
    
    // Advanced metrics
    expected_goals: 'expected_goals',
    expected_assists: 'expected_assists',
    error_lead_to_a_shot: 'error_lead_to_a_shot',
    error_lead_to_a_goal: 'error_lead_to_a_goal'
  } as const;
  
  // Calculated percentage/ratio stat names
  export const CALCULATED_STATS = {
    // Attacking percentages
    shot_accuracy: 'shot_accuracy',
    big_chance_conversion: 'big_chance_conversion',
    goals_per_shot: 'goals_per_shot',
    
    // Passing percentages
    pass_accuracy: 'pass_accuracy',
    long_ball_accuracy: 'long_ball_accuracy',
    cross_accuracy: 'cross_accuracy',
    assists_per_key_pass: 'assists_per_key_pass',
    
    // Duel percentages
    duel_win_rate: 'duel_win_rate',
    aerial_duel_rate: 'aerial_duel_rate',
    contest_win_rate: 'contest_win_rate',
    
    // Goalkeeper percentages
    keeper_sweeper_accuracy: 'keeper_sweeper_accuracy'
  } as const;
  
  // All available metrics combined
  export const ALL_AVAILABLE_METRICS = {
    ...RAW_MATCH_STATS,
    ...CALCULATED_STATS
  } as const;
  
  // Categorized raw stats for UI organization
  export const RAW_STAT_CATEGORIES = {
    attacking: [
      'goals',
      'goal_assist', 
      'total_shots',
      'on_target_scoring_attempt',
      'shot_off_target',
      'big_chance_created',
      'big_chance_missed',
      'hit_woodwork',
      'penalty_won',
      'penalty_miss'
    ],
    passing: [
      'total_pass',
      'accurate_pass',
      'key_pass',
      'total_long_balls',
      'accurate_long_balls'
    ],
    crossing: [
      'total_cross',
      'accurate_cross'
    ],
    defending: [
      'total_tackle',
      'total_clearance', 
      'interception_won',
      'outfielder_block',
      'blocked_scoring_attempt',
      'last_man_tackle',
      'clearance_off_line'
    ],
    duels: [
      'duel_won',
      'duel_lost',
      'aerial_won',
      'aerial_lost',
      'challenge_lost',
      'total_contest',
      'won_contest'
    ],
    possession: [
      'touches',
      'possession_lost_ctrl',
      'dispossessed'
    ],
    discipline: [
      'fouls',
      'was_fouled',
      'penalty_conceded',
      'total_offside'
    ],
    goalkeeper: [
      'saves',
      'saved_shots_from_inside_the_box',
      'goals_prevented',
      'total_keeper_sweeper',
      'accurate_keeper_sweeper',
      'good_high_claim',
      'punches',
      'penalty_save'
    ],
    advanced: [
      'expected_goals',
      'expected_assists',
      'error_lead_to_a_shot',
      'error_lead_to_a_goal'
    ],
    basic: [
      'minutes_played'
    ]
  } as const;
  
  // Categorized calculated stats
  export const CALCULATED_STAT_CATEGORIES = {
    calculated_attacking: [
      'shot_accuracy',
      'big_chance_conversion', 
      'goals_per_shot'
    ],
    calculated_passing: [
      'pass_accuracy',
      'long_ball_accuracy',
      'cross_accuracy',
      'assists_per_key_pass'
    ],
    calculated_duels: [
      'duel_win_rate',
      'aerial_duel_rate',
      'contest_win_rate'
    ],
    calculated_goalkeeper: [
      'keeper_sweeper_accuracy'
    ]
  } as const;
  
  // Combined categories for complete metric organization
  export const ALL_STAT_CATEGORIES = {
    ...RAW_STAT_CATEGORIES,
    ...CALCULATED_STAT_CATEGORIES
  } as const;
  
  // Category display labels
  export const STAT_CATEGORY_LABELS = {
    attacking: { name: 'Attacking', color: '#EF4444' },
    passing: { name: 'Passing', color: '#3B82F6' },
    crossing: { name: 'Crossing', color: '#8B5CF6' },
    defending: { name: 'Defending', color: '#10B981' },
    duels: { name: 'Duels & Contests', color: '#F59E0B' },
    possession: { name: 'Possession', color: '#EC4899' },
    discipline: { name: 'Discipline', color: '#6B7280' },
    goalkeeper: { name: 'Goalkeeper', color: '#14B8A6' },
    advanced: { name: 'Advanced', color: '#A855F7' },
    basic: { name: 'Basic', color: '#64748B' },
    calculated_attacking: { name: 'Attack %', color: '#DC2626' },
    calculated_passing: { name: 'Passing %', color: '#2563EB' },
    calculated_duels: { name: 'Duel %', color: '#D97706' },
    calculated_goalkeeper: { name: 'GK %', color: '#059669' }
  } as const;
  
  // Helper function to check if a metric is calculated
  export const isCalculatedStat = (statKey: string): boolean => {
    return Object.values(CALCULATED_STATS).includes(statKey as any);
  };
  
  // Helper function to check if a metric is raw
  export const isRawStat = (statKey: string): boolean => {
    return Object.values(RAW_MATCH_STATS).includes(statKey as any);
  };
  
  // Helper function to get category for a metric
  export const getStatCategory = (statKey: string): string | null => {
    for (const [category, stats] of Object.entries(ALL_STAT_CATEGORIES)) {
      if (stats.includes(statKey as any)) {
        return category;
      }
    }
    return null;
  };
  
  // Helper function to format metric names for display
  export const formatMetricName = (metric: string): string => {
    return metric
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };
  
  // Type definitions for better TypeScript support
  export type RawStatKey = keyof typeof RAW_MATCH_STATS;
  export type CalculatedStatKey = keyof typeof CALCULATED_STATS;
  export type AllStatKey = RawStatKey | CalculatedStatKey;
  export type StatCategory = keyof typeof ALL_STAT_CATEGORIES;