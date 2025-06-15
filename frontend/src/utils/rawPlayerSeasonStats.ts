// Raw season stat field names from Go model (non-percentage values)
export const RAW_SEASON_STATS = {
    // Core identifiers
    player_id: 'player_id',
    unique_tournament_id: 'unique_tournament_id',
    season_id: 'season_id',
    team_id: 'team_id',
  
    // Basic season info
    minutes_played: 'minutes_played',
    appearances: 'appearances',
    matches_started: 'matches_started',
  
    // Attacking stats (raw numbers)
    goals: 'goals',
    expected_goals: 'expected_goals',
    goals_assists_sum: 'goals_assists_sum',
    big_chances_missed: 'big_chances_missed',
    hit_woodwork: 'hit_woodwork',
  
    // Shot statistics (raw numbers)
    total_shots: 'total_shots',
    shots_on_target: 'shots_on_target',
    shots_off_target: 'shots_off_target',
    blocked_shots: 'blocked_shots',
    shots_from_inside_the_box: 'shots_from_inside_the_box',
    shots_from_outside_the_box: 'shots_from_outside_the_box',
  
    // Goal breakdown
    goals_from_inside_the_box: 'goals_from_inside_the_box',
    goals_from_outside_the_box: 'goals_from_outside_the_box',
    headed_goals: 'headed_goals',
    left_foot_goals: 'left_foot_goals',
    right_foot_goals: 'right_foot_goals',
  
    // Set pieces & penalties (raw numbers)
    penalties_taken: 'penalties_taken',
    penalty_goals: 'penalty_goals',
    penalty_won: 'penalty_won',
    shot_from_set_piece: 'shot_from_set_piece',
    free_kick_goal: 'free_kick_goal',
  
    // Skills & dribbling (raw numbers)
    successful_dribbles: 'successful_dribbles',
    dribbled_past: 'dribbled_past',
  
    // Assists & creativity
    assists: 'assists',
    expected_assists: 'expected_assists',
    big_chances_created: 'big_chances_created',
    key_passes: 'key_passes',
    pass_to_assist: 'pass_to_assist',
  
    // Passing stats (raw numbers)
    total_passes: 'total_passes',
    accurate_passes: 'accurate_passes',
    inaccurate_passes: 'inaccurate_passes',
    accurate_own_half_passes: 'accurate_own_half_passes',
    accurate_opposition_half_passes: 'accurate_opposition_half_passes',
    accurate_final_third_passes: 'accurate_final_third_passes',
  
    // Crossing & long balls (raw numbers)
    total_cross: 'total_cross',
    accurate_crosses: 'accurate_crosses',
    total_long_balls: 'total_long_balls',
    accurate_long_balls: 'accurate_long_balls',
  
    // Defensive stats
    tackles: 'tackles',
    interceptions: 'interceptions',
    clearances: 'clearances',
    penalty_conceded: 'penalty_conceded',
  
    // Duels & contests (raw numbers)
    ground_duels_won: 'ground_duels_won',
    aerial_duels_won: 'aerial_duels_won',
    total_duels_won: 'total_duels_won',
  
    // Goalkeeper specific
    saves: 'saves',
    goals_prevented: 'goals_prevented',
    clean_sheet: 'clean_sheet',
    penalty_faced: 'penalty_faced',
    penalty_save: 'penalty_save',
    saved_shots_from_inside_the_box: 'saved_shots_from_inside_the_box',
    saved_shots_from_outside_the_box: 'saved_shots_from_outside_the_box',
    goals_conceded: 'goals_conceded',
    goals_conceded_inside_the_box: 'goals_conceded_inside_the_box',
    goals_conceded_outside_the_box: 'goals_conceded_outside_the_box',
    punches: 'punches',
    runs_out: 'runs_out',
    successful_runs_out: 'successful_runs_out',
    high_claims: 'high_claims',
    crosses_not_claimed: 'crosses_not_claimed',
  
    // Possession & control
    dispossessed: 'dispossessed',
    possession_lost: 'possession_lost',
  
    // Disciplinary
    yellow_cards: 'yellow_cards',
    red_cards: 'red_cards',
    fouls: 'fouls',
    was_fouled: 'was_fouled',
    offsides: 'offsides',
  
    // Errors & negative events
    error_lead_to_goal: 'error_lead_to_goal',
    error_lead_to_shot: 'error_lead_to_shot',
    own_goals: 'own_goals'
  } as const;
  
  // Percentage/calculated stats from season data
  export const SEASON_PERCENTAGE_STATS = {
    // Attacking percentages
    goal_conversion_percentage: 'goal_conversion_percentage',
    big_chance_conversion: 'big_chance_conversion',
    
    // Set pieces percentages
    penalty_conversion: 'penalty_conversion',
    set_piece_conversion: 'set_piece_conversion',
    
    // Skills percentages
    successful_dribbles_percentage: 'successful_dribbles_percentage',
    
    // Passing percentages
    accurate_passes_percentage: 'accurate_passes_percentage',
    
    // Distribution percentages
    accurate_crosses_percentage: 'accurate_crosses_percentage',
    accurate_long_balls_percentage: 'accurate_long_balls_percentage',
    
    // Duels percentages
    ground_duels_won_percentage: 'ground_duels_won_percentage',
    aerial_duels_won_percentage: 'aerial_duels_won_percentage',
    total_duels_won_percentage: 'total_duels_won_percentage'
  } as const;
  
  // All season metrics combined
  export const ALL_SEASON_METRICS = {
    ...RAW_SEASON_STATS,
    ...SEASON_PERCENTAGE_STATS
  } as const;
  
  // Combined season stat categories (raw stats + percentages together)
  export const ALL_SEASON_STAT_CATEGORIES = {
    // Core identifiers - excluded from display
    identifiers: [
      "player_id",
      "unique_tournament_id", 
      "season_id",
      "team_id"
    ],
  
    // Basic season info
    basic: [
      "minutes_played",
      "appearances",
      "matches_started"
    ],
  
    // General attacking stats (raw numbers + percentages)
    attacking: [
      "goals",
      "expected_goals",
      "goals_assists_sum",
      "big_chances_missed",
      "hit_woodwork",
      "goal_conversion_percentage",
      "big_chance_conversion"
    ],
  
    // Shot statistics (raw numbers only)
    shooting: [
      "total_shots",
      "shots_on_target", 
      "shots_off_target",
      "blocked_shots",
      "shots_from_inside_the_box",
      "shots_from_outside_the_box"
    ],
  
    // Goal breakdown
    goalBreakdown: [
      "goals_from_inside_the_box",
      "goals_from_outside_the_box",
      "headed_goals",
      "left_foot_goals",
      "right_foot_goals"
    ],
  
    // Set pieces & penalties (raw numbers + percentages)
    setPieces: [
      "penalties_taken",
      "penalty_goals", 
      "penalty_won",
      "shot_from_set_piece",
      "free_kick_goal",
      "penalty_conversion",
      "set_piece_conversion"
    ],
  
    // Skills & dribbling (raw numbers + percentages)
    skills: [
      "successful_dribbles",
      "dribbled_past",
      "successful_dribbles_percentage"
    ],
  
    // Assists & creativity
    creativity: [
      "assists",
      "expected_assists",
      "big_chances_created",
      "key_passes",
      "pass_to_assist"
    ],
  
    // Passing stats (raw numbers + percentages)
    passing: [
      "total_passes",
      "accurate_passes",
      "inaccurate_passes",
      "accurate_own_half_passes",
      "accurate_opposition_half_passes",
      "accurate_final_third_passes",
      "accurate_passes_percentage"
    ],
  
    // Crossing & long balls (raw numbers + percentages)
    distribution: [
      "total_cross",
      "accurate_crosses",
      "total_long_balls",
      "accurate_long_balls",
      "accurate_crosses_percentage",
      "accurate_long_balls_percentage"
    ],
  
    // Defensive stats
    defensive: [
      "tackles",
      "interceptions", 
      "clearances",
      "penalty_conceded"
    ],
  
    // Duels & contests (raw numbers + percentages)
    duels: [
      "ground_duels_won",
      "aerial_duels_won",
      "total_duels_won",
      "ground_duels_won_percentage",
      "aerial_duels_won_percentage",
      "total_duels_won_percentage"
    ],
  
    // Goalkeeper specific
    goalkeeper: [
      "saves",
      "goals_prevented",
      "clean_sheet",
      "penalty_faced",
      "penalty_save",
      "saved_shots_from_inside_the_box",
      "saved_shots_from_outside_the_box",
      "goals_conceded",
      "goals_conceded_inside_the_box",
      "goals_conceded_outside_the_box",
      "punches",
      "runs_out",
      "successful_runs_out",
      "high_claims",
      "crosses_not_claimed"
    ],
  
    // Possession & control
    possession: [
      "dispossessed",
      "possession_lost"
    ],
  
    // Disciplinary
    disciplinary: [
      "yellow_cards",
      "red_cards",
      "fouls",
      "was_fouled",
      "offsides"
    ],
  
    // Errors & negative events
    errors: [
      "error_lead_to_goal",
      "error_lead_to_shot", 
      "own_goals"
    ]
  } as const;
  
  // Category display labels
  export const SEASON_STAT_CATEGORY_LABELS = {
    basic: { name: "Season Overview", color: "#64748B" },
    attacking: { name: "Attack", color: "#EF4444" },
    shooting: { name: "Shooting", color: "#F97316" },
    goalBreakdown: { name: "Goal Types", color: "#EAB308" },
    setPieces: { name: "Set Pieces", color: "#8B5CF6" },
    skills: { name: "Skills", color: "#EC4899" },
    creativity: { name: "Creativity", color: "#06B6D4" },
    passing: { name: "Passing", color: "#3B82F6" },
    distribution: { name: "Distribution", color: "#6366F1" },
    defensive: { name: "Defense", color: "#10B981" },
    duels: { name: "Duels", color: "#F59E0B" },
    goalkeeper: { name: "Goalkeeping", color: "#14B8A6" },
    possession: { name: "Possession", color: "#84CC16" },
    disciplinary: { name: "Discipline", color: "#6B7280" },
    errors: { name: "Errors", color: "#DC2626" }
  } as const;
  
  // Helper functions
  export const isSeasonPercentageStat = (statKey: string): boolean => {
    return Object.values(SEASON_PERCENTAGE_STATS).includes(statKey as any);
  };
  
  export const isRawSeasonStat = (statKey: string): boolean => {
    return Object.values(RAW_SEASON_STATS).includes(statKey as any);
  };
  
  export const getSeasonStatCategory = (statKey: string): string | null => {
    for (const [category, stats] of Object.entries(ALL_SEASON_STAT_CATEGORIES)) {
      if (stats.includes(statKey as any)) {
        return category;
      }
    }
    return null;
  };
  
  export const formatSeasonMetricName = (metric: string): string => {
    return metric
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };
  
  // Type definitions
  export type RawSeasonStatKey = keyof typeof RAW_SEASON_STATS;
  export type SeasonPercentageStatKey = keyof typeof SEASON_PERCENTAGE_STATS;
  export type AllSeasonStatKey = RawSeasonStatKey | SeasonPercentageStatKey;
  export type SeasonStatCategory = keyof typeof ALL_SEASON_STAT_CATEGORIES;