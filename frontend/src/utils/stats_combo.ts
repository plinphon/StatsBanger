export const STAT_COMBINATIONS = {
    // Passing & Distribution
    passing_accuracy: {
      name: "Passing Accuracy",
      description: "Total passes vs Accurate passes",
      xMetric: "total_pass",
      yMetric: "accurate_pass",
      category: "passing",
    },
    long_ball_accuracy: {
      name: "Long Ball Accuracy",
      description: "Total long balls vs Accurate long balls",
      xMetric: "total_long_balls",
      yMetric: "accurate_long_balls",
      category: "passing",
    },
    crossing_accuracy: {
      name: "Crossing Accuracy",
      description: "Total crosses vs Accurate crosses",
      xMetric: "total_cross",
      yMetric: "accurate_cross",
      category: "passing",
    },
   
    // Attacking & Scoring
    shooting_efficiency: {
      name: "Shooting Efficiency",
      description: "Shots on target vs Goals scored",
      xMetric: "on_target_scoring_attempt",
      yMetric: "goals",
      category: "attacking",
    },
    creative_output: {
      name: "Creative Output",
      description: "Key passes vs Goal assists",
      xMetric: "key_pass",
      yMetric: "goal_assist",
      category: "attacking",
    },
    expected_vs_actual: {
      name: "Expected vs Actual",
      description: "Expected goals vs Actual goals",
      xMetric: "expected_goals",
      yMetric: "goals",
      category: "attacking",
    },
    big_chance_conversion: {
      name: "Big Chance Conversion",
      description: "Big chances created vs Big chances missed",
      xMetric: "big_chance_created",
      yMetric: "big_chance_missed",
      category: "attacking",
    },
   
    defensive_actions: {
      name: "Defensive Actions",
      description: "Total tackles vs Interceptions won",
      xMetric: "total_tackle",
      yMetric: "interception_won",
      category: "defending",
    },
    aerial_dominance: {
      name: "Aerial Dominance",
      description: "Aerial duels won vs Aerial duels lost",
      xMetric: "aerial_won",
      yMetric: "aerial_lost",
      category: "defending",
    },
    dueling_success: {
      name: "Dueling Success",
      description: "Duels won vs Duels lost",
      xMetric: "duel_won",
      yMetric: "duel_lost",
      category: "defending",
    },
    contest_performance: {
      name: "Contest Performance",
      description: "Total contests vs Won contests",
      xMetric: "total_contest",
      yMetric: "won_contest",
      category: "defending",
    },
   
    // Goalkeeping
    shot_stopping: {
      name: "Shot Stopping",
      description: "Total saves vs Box saves",
      xMetric: "saves",
      yMetric: "saved_shots_from_inside_the_box",
      category: "goalkeeping",
    },
    sweeper_performance: {
      name: "Sweeper Performance",
      description: "Total sweeper actions vs Accurate sweeper actions",
      xMetric: "total_keeper_sweeper",
      yMetric: "accurate_keeper_sweeper",
      category: "goalkeeping",
    },
    advanced_goalkeeping: {
      name: "Advanced Goalkeeping",
      description: "High claims vs Punches",
      xMetric: "good_high_claim",
      yMetric: "punches",
      category: "goalkeeping",
    },
   
    // Physical & Discipline
    fouling_record: {
      name: "Fouling Record",
      description: "Fouls committed vs Was fouled",
      xMetric: "fouls",
      yMetric: "was_fouled",
      category: "discipline",
    },
    possession_security: {
      name: "Possession Security",
      description: "Touches vs Possession lost",
      xMetric: "touches",
      yMetric: "possession_lost_ctrl",
      category: "possession",
    },
    physical_battles: {
      name: "Physical Battles",
      description: "Challenges lost vs Dispossessed",
      xMetric: "challenge_lost",
      yMetric: "dispossessed",
      category: "possession",
    },
   
    // Performance Metrics
    activity_level: {
      name: "Activity Level",
      description: "Minutes played vs Touches",
      xMetric: "minutes_played",
      yMetric: "touches",
      category: "performance",
    },
    set_pieces: {
      name: "Set Piece Impact",
      description: "Penalties won vs Penalties conceded",
      xMetric: "penalty_won",
      yMetric: "penalty_conceded",
      category: "performance",
    },
    errors_impact: {
      name: "Error Impact",
      description: "Errors leading to shots vs Errors leading to goals",
      xMetric: "error_lead_to_a_shot",
      yMetric: "error_lead_to_a_goal",
      category: "performance",
    }
   };