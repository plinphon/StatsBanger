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
      description: "Shots vs Shots on target",
      xMetric: "total_shots",
      yMetric: "on_target_scoring_attempt",
      category: "attacking",
    },

    shot_vs_xG: {
      name: "Shooting Efficiency 2",
      description: "Shots vs xG",
      xMetric: "total_shots",
      yMetric: "expected_goals",
      category: "attacking",
    },

    creative_output: {
      name: "Creative Output",
      description: "Key passes vs xA",
      xMetric: "key_pass",
      yMetric: "expected_assists",
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

    errors_impact: {
      name: "Error Impact",
      description: "Errors leading to shots vs Possession lost",
      xMetric: "error_lead_to_a_shot",
      yMetric: "possession_lost_ctrl",
      category: "performance",
    }
   };