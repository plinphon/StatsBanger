export const SEASON_STAT_CATEGORIES = {
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
  
    // General attacking stats
    attacking: [
      "goals",
      "expected_goals",
      "goals_assists_sum",
      "big_chances_missed",
      "goal_conversion_percentage",
      "hit_woodwork"
    ],
  
    // Shot statistics
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
  
    // Set pieces & penalties
    setPieces: [
      "penalties_taken",
      "penalty_goals", 
      "penalty_won",
      "penalty_conversion",
      "shot_from_set_piece",
      "free_kick_goal",
      "set_piece_conversion"
    ],
  
    // Skills & dribbling
    skills: [
      "successful_dribbles",
      "successful_dribbles_percentage",
      "dribbled_past"
    ],
  
    // Assists & creativity
    creativity: [
      "assists",
      "expected_assists",
      "big_chances_created",
      "key_passes",
      "pass_to_assist"
    ],
  
    // Passing stats
    passing: [
      "total_passes",
      "accurate_passes",
      "inaccurate_passes", 
      "accurate_passes_percentage",
      "accurate_own_half_passes",
      "accurate_opposition_half_passes",
      "accurate_final_third_passes"
    ],
  
    // Crossing & long balls
    distribution: [
      "total_cross",
      "accurate_crosses",
      "accurate_crosses_percentage",
      "total_long_balls",
      "accurate_long_balls",
      "accurate_long_balls_percentage"
    ],
  
    // Defensive stats
    defensive: [
      "tackles",
      "interceptions", 
      "clearances",
      "penaltyConceded"
    ],
  
    // Duels & contests
    duels: [
      "ground_duels_won",
      "ground_duels_won_percentage",
      "aerial_duels_won",
      "aerial_duels_won_percentage", 
      "total_duels_won",
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
  };
  
  // Display names for categories
  export const SEASON_CATEGORY_LABELS = {
    basic: "Season Overview",
    attacking: "Attack",
    shooting: "Shooting",
    goalBreakdown: "Goal Types",
    setPieces: "Set Pieces",
    skills: "Skills",
    creativity: "Creativity",
    passing: "Passing",
    distribution: "Distribution", 
    defensive: "Defense",
    duels: "Duels",
    goalkeeper: "Goalkeeping",
    possession: "Possession",
    disciplinary: "Discipline",
    errors: "Errors"
  };
  
  // Helper function to get category for a season stat
  export const getSeasonStatCategory = (statKey: string): string => {
    for (const [category, stats] of Object.entries(SEASON_STAT_CATEGORIES)) {
      if (stats.includes(statKey)) {
        return category;
      }
    }
    return 'other';
  };