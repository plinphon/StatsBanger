export const STAT_CATEGORIES = {
    // Core identifiers - excluded from display
    identifiers: [
      "match_id",
      "player_id", 
      "team_id"
    ],
  
    // Basic match info
    basic: [
      "minutes_played"
    ],
  
    // Attacking stats
    attacking: [
      "goals",
      "goal_assist",
      "on_target_scoring_attempt",
      "shot_off_target",
      "big_chance_created",
      "big_chance_missed",
      "hit_woodwork",
      "expected_goals",
      "expected_assists"
    ],
  
    // Passing stats
    passing: [
      "total_pass",
      "accurate_pass",
      "total_long_balls",
      "accurate_long_balls",
      "key_pass",
      "total_cross",
      "accurate_cross"
    ],
  
    // Defensive stats
    defensive: [
      "total_tackle",
      "total_clearance",
      "interception_won",
      "outfielder_block",
      "blocked_scoring_attempt",
      "last_man_tackle",
      "clearance_off_line"
    ],
  
    // Duels & contests
    duels: [
      "duel_won",
      "duel_lost",
      "aerial_won",
      "aerial_lost",
      "challenge_lost",
      "total_contest",
      "won_contest"
    ],
  
    // Goalkeeper specific
    goalkeeper: [
      "saves",
      "saved_shots_from_inside_the_box",
      "goals_prevented",
      "total_keeper_sweeper",
      "accurate_keeper_sweeper",
      "good_high_claim",
      "punches",
      "penalty_save"
    ],
  
    // Possession & control
    possession: [
      "touches",
      "possession_lost_ctrl",
      "dispossessed"
    ],
  
    // Disciplinary & fouls
    disciplinary: [
      "fouls",
      "was_fouled",
      "penalty_won",
      "penalty_conceded",
      "total_offside"
    ],
  
    // Negative events/errors
    errors: [
      "error_lead_to_a_shot",
      "error_lead_to_a_goal",
      "own_goals",
      "penalty_miss"
    ]
  };
  
  // Helper function to get category for a stat
  export const getStatCategory = (statKey: string): string => {
    for (const [category, stats] of Object.entries(STAT_CATEGORIES)) {
      if (stats.includes(statKey)) {
        return category;
      }
    }
    return 'other';
  };
  
  // Display names for categories
  export const CATEGORY_LABELS = {
    basic: "Match Info",
    attacking: "Attack",
    passing: "Passing", 
    defensive: "Defense",
    duels: "Duels",
    goalkeeper: "Goalkeeping",
    possession: "Possession",
    disciplinary: "Fouls",
    errors: "Errors"
  };