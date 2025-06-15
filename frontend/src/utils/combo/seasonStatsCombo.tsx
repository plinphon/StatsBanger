export const SEASON_STAT_COMBINATIONS = {
    // Attacking & Scoring
    goals_assists: {
      name: "Goal Contributions",
      description: "Goals vs Assists - Direct attacking impact",
      xMetric: "goals",
      yMetric: "assists",
      category: "attacking",
    },
    
    goals_vs_xg: {
      name: "Finishing Efficiency",
      description: "Goals vs Expected Goals - Clinical finishing",
      xMetric: "expected_goals",
      yMetric: "goals",
      category: "attacking",
    },
    
    shooting_accuracy: {
      name: "Shooting Accuracy",
      description: "Total shots vs Shots on target",
      xMetric: "total_shots",
      yMetric: "shots_on_target",
      category: "attacking",
    },
    
    shooting_volume_efficiency: {
      name: "Shot Volume vs Conversion",
      description: "Total shots vs Goal conversion percentage",
      xMetric: "total_shots",
      yMetric: "goal_conversion_percentage",
      category: "attacking",
    },
    
    assists_vs_xa: {
      name: "Creative Efficiency",
      description: "Assists vs Expected Assists - Playmaking accuracy",
      xMetric: "expected_assists",
      yMetric: "assists",
      category: "attacking",
    },
    
    big_chances: {
      name: "Big Chance Performance",
      description: "Big chances created vs Big chances missed",
      xMetric: "big_chances_created",
      yMetric: "big_chances_missed",
      category: "attacking",
    },
    
    dribbling_success: {
      name: "Dribbling Success",
      description: "Successful dribbles vs Dribble percentage",
      xMetric: "successful_dribbles",
      yMetric: "successful_dribbles_percentage",
      category: "attacking",
    },
    
    box_finishing: {
      name: "Box Finishing",
      description: "Shots inside box vs Goals from inside box",
      xMetric: "shots_from_inside_the_box",
      yMetric: "goals_from_inside_the_box",
      category: "attacking",
    },
    
    // Passing & Distribution
    passing_accuracy: {
      name: "Passing Accuracy",
      description: "Total passes vs Accurate passes percentage",
      xMetric: "total_passes",
      yMetric: "accurate_passes_percentage",
      category: "passing",
    },
    
    passing_volume: {
      name: "Passing Volume",
      description: "Accurate passes vs Inaccurate passes",
      xMetric: "accurate_passes",
      yMetric: "inaccurate_passes",
      category: "passing",
    },
    
    long_ball_accuracy: {
      name: "Long Ball Distribution",
      description: "Total long balls vs Accurate long balls",
      xMetric: "total_long_balls",
      yMetric: "accurate_long_balls",
      category: "passing",
    },
    
    crossing_accuracy: {
      name: "Crossing Quality",
      description: "Total crosses vs Accurate crosses",
      xMetric: "total_cross",
      yMetric: "accurate_crosses",
      category: "passing",
    },
    
    key_passes_assists: {
      name: "Playmaking Impact",
      description: "Key passes vs Assists",
      xMetric: "key_passes",
      yMetric: "assists",
      category: "passing",
    },
    
    progressive_passing: {
      name: "Progressive Passing",
      description: "Opposition half passes vs Final third passes",
      xMetric: "accurate_opposition_half_passes",
      yMetric: "accurate_final_third_passes",
      category: "passing",
    },
    
    // Defending
    defensive_actions: {
      name: "Defensive Actions",
      description: "Tackles vs Interceptions",
      xMetric: "tackles",
      yMetric: "interceptions",
      category: "defending",
    },
    
    aerial_dominance: {
      name: "Aerial Dominance",
      description: "Aerial duels won vs Aerial win percentage",
      xMetric: "aerial_duels_won",
      yMetric: "aerial_duels_won_percentage",
      category: "defending",
    },
    
    ground_duels: {
      name: "Ground Dueling",
      description: "Ground duels won vs Ground duel percentage",
      xMetric: "ground_duels_won",
      yMetric: "ground_duels_won_percentage",
      category: "defending",
    },
    
    total_dueling: {
      name: "Overall Dueling",
      description: "Total duels won vs Total duel percentage",
      xMetric: "total_duels_won",
      yMetric: "total_duels_won_percentage",
      category: "defending",
    },
    
    defensive_reliability: {
      name: "Defensive Reliability",
      description: "Clearances vs Errors leading to goals",
      xMetric: "clearances",
      yMetric: "error_lead_to_goal",
      category: "defending",
    },
    
    // Goalkeeping
    shot_stopping: {
      name: "Shot Stopping",
      description: "Total saves vs Goals prevented",
      xMetric: "saves",
      yMetric: "goals_prevented",
      category: "goalkeeping",
    },
    
    box_saves: {
      name: "Box Shot Stopping",
      description: "Saves inside box vs Saves outside box",
      xMetric: "saved_shots_from_inside_the_box",
      yMetric: "saved_shots_from_outside_the_box",
      category: "goalkeeping",
    },
    
    penalty_performance: {
      name: "Penalty Performance",
      description: "Penalties faced vs Penalty saves",
      xMetric: "penalty_faced",
      yMetric: "penalty_save",
      category: "goalkeeping",
    },
    
    distribution_keeping: {
      name: "Goalkeeper Distribution",
      description: "Runs out vs Successful runs out",
      xMetric: "runs_out",
      yMetric: "successful_runs_out",
      category: "goalkeeping",
    },
    
    aerial_keeping: {
      name: "Aerial Keeping",
      description: "High claims vs Crosses not claimed",
      xMetric: "high_claims",
      yMetric: "crosses_not_claimed",
      category: "goalkeeping",
    },
    
    clean_sheet_performance: {
      name: "Clean Sheet Performance",
      description: "Clean sheets vs Goals conceded",
      xMetric: "clean_sheet",
      yMetric: "goals_conceded",
      category: "goalkeeping",
    },
    
    // Discipline & Physical
    fouling_behavior: {
      name: "Fouling Behavior",
      description: "Fouls committed vs Was fouled",
      xMetric: "fouls",
      yMetric: "was_fouled",
      category: "discipline",
    },
    
    card_discipline: {
      name: "Card Discipline",
      description: "Yellow cards vs Red cards",
      xMetric: "yellow_cards",
      yMetric: "red_cards",
      category: "discipline",
    },
    
    possession_security: {
      name: "Possession Security",
      description: "Dispossessed vs Possession lost",
      xMetric: "dispossessed",
      yMetric: "possession_lost",
      category: "possession",
    },
    
    // Performance & Activity
    activity_level: {
      name: "Activity Level",
      description: "Minutes played vs Appearances",
      xMetric: "minutes_played",
      yMetric: "appearances",
      category: "performance",
    },
    
    starting_impact: {
      name: "Starting Impact",
      description: "Matches started vs Appearances",
      xMetric: "matches_started",
      yMetric: "appearances",
      category: "performance",
    },
    
    error_rate: {
      name: "Error Rate",
      description: "Errors leading to shots vs Errors leading to goals",
      xMetric: "error_lead_to_shot",
      yMetric: "error_lead_to_goal",
      category: "performance",
    },
    
    // Set Pieces
    penalty_taking: {
      name: "Penalty Taking",
      description: "Penalties taken vs Penalty goals",
      xMetric: "penalties_taken",
      yMetric: "penalty_goals",
      category: "set_pieces",
    },
    
    penalty_efficiency: {
      name: "Penalty Conversion",
      description: "Penalties taken vs Penalty conversion rate",
      xMetric: "penalties_taken",
      yMetric: "penalty_conversion",
      category: "set_pieces",
    },
    
    set_piece_threat: {
      name: "Set Piece Threat",
      description: "Shots from set pieces vs Free kick goals",
      xMetric: "shot_from_set_piece",
      yMetric: "free_kick_goal",
      category: "set_pieces",
    },
    
    // Advanced Metrics
    goal_variety: {
      name: "Goal Variety",
      description: "Headed goals vs Left foot goals",
      xMetric: "headed_goals",
      yMetric: "left_foot_goals",
      category: "advanced",
    },
    
    foot_preference: {
      name: "Foot Usage",
      description: "Left foot goals vs Right foot goals",
      xMetric: "left_foot_goals",
      yMetric: "right_foot_goals",
      category: "advanced",
    },
    
    near_miss_analysis: {
      name: "Near Miss Analysis",
      description: "Hit woodwork vs Shots off target",
      xMetric: "hit_woodwork",
      yMetric: "shots_off_target",
      category: "advanced",
    },
    
    positioning_discipline: {
      name: "Positioning Discipline",
      description: "Offsides vs Appearances",
      xMetric: "offsides",
      yMetric: "appearances",
      category: "advanced",
    },
    
    // Comprehensive Performance
    overall_attacking: {
      name: "Overall Attacking",
      description: "Goals + Assists vs Expected Goals + Expected Assists",
      xMetric: "goals_assists_sum",
      yMetric: "expected_goals", // Could be combined xG + xA if available
      category: "comprehensive",
    },
    
    shot_location_preference: {
      name: "Shot Location Preference",
      description: "Shots inside box vs Shots outside box",
      xMetric: "shots_from_inside_the_box",
      yMetric: "shots_from_outside_the_box",
      category: "comprehensive",
    },
    
    goal_location_efficiency: {
      name: "Goal Location Efficiency",
      description: "Goals inside box vs Goals outside box",
      xMetric: "goals_from_inside_the_box",
      yMetric: "goals_from_outside_the_box",
      category: "comprehensive",
    }
  };