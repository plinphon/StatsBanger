export const TEAM_MATCH_STAT_CATEGORIES = {
    // Core identifiers - excluded from display
    identifiers: [
      "match_id",
      "team_id"
    ],
  
    // Attacking stats
    attacking: [
      "expected_goals",
      "big_chances",
      "total_shots",
      "shots_on_target",
      "shots_off_target",
      "blocked_shots",
      "shots_inside_box",
      "shots_outside_box",
      "big_chances_scored",
      "big_chances_missed",
      "hit_woodwork",
      "through_balls",
      "touches_in_penalty_area"
    ],
  
    // Passing stats
    passing: [
      "passes",
      "accurate_passes",
      "long_balls",
      "crosses",
      "final_third_entries",
      "final_third_phase"
    ],
  
    // Defensive stats
    defensive: [
      "tackles",
      "tackles_won",
      "total_tackles",
      "interceptions",
      "recoveries",
      "clearances"
    ],
  
    // Duels & contests
    duels: [
      "duels",
      "ground_duels",
      "aerial_duels",
      "dribbles"
    ],
  
    // Goalkeeper specific
    goalkeeper: [
      "goalkeeper_saves",
      "total_saves",
      "goals_prevented",
      "goal_kicks",
      "big_saves",
      "high_claims",
      "punches",
      "penalty_saves"
    ],
  
    // Possession & control
    possession: [
      "ball_possession",
      "dispossessed",
      "throw_ins"
    ],
  
    // Set pieces & situations
    set_pieces: [
      "corner_kicks",
      "free_kicks",
      "offsides",
      "fouled_in_final_third"
    ],
  
    // Disciplinary
    disciplinary: [
      "fouls",
      "yellow_cards",
      "red_cards"
    ],
  
    // Errors
    errors: [
      "errors_lead_to_a_shot",
      "errors_lead_to_a_goal"
    ]
  };
  
  // Helper function to get category for a stat
  export const getTeamStatCategory = (statKey) => {
    for (const [category, stats] of Object.entries(TEAM_MATCH_STAT_CATEGORIES)) {
      if (stats.includes(statKey)) {
        return category;
      }
    }
    return 'other';
  };
  
  // Display names for categories
  export const TEAM_CATEGORY_LABELS = {
    attacking: "Attack",
    passing: "Passing",
    defensive: "Defense", 
    duels: "Duels",
    goalkeeper: "Goalkeeping",
    possession: "Possession",
    set_pieces: "Set Pieces",
    disciplinary: "Fouls & Cards",
    errors: "Errors"
  };
  
  // Get all displayable stats (excluding identifiers)
  export const getDisplayableTeamStats = () => {
    const { identifiers, ...displayCategories } = TEAM_MATCH_STAT_CATEGORIES;
    return Object.values(displayCategories).flat();
  };