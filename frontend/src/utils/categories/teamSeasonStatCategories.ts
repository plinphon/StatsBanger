export const TEAM_SEASON_STAT_CATEGORIES = {
    // Core identifiers - excluded from display
    identifiers: [
      "team_id",
      "unique_tournament_id",
      "season_id",
      "matches"
    ],
  
    // Attacking stats
    attacking: [
      "goals_scored",
      "expected_goals",
      "big_chances",
      "big_chances_created",
      "big_chances_missed",
      "shots",
      "shots_on_target",
      "shots_off_target",
      "shots_from_inside_the_box",
      "shots_from_outside_the_box",
      "goals_from_inside_the_box",
      "goals_from_outside_the_box",
      "headed_goals",
      "left_foot_goals",
      "right_foot_goals",
      "hit_woodwork",
      "fast_breaks",
      "fast_break_goals",
      "fast_break_shots",
      "penalty_goals",
      "penalties_taken",
      "free_kick_goals",
      "free_kick_shots",
      "blocked_scoring_attempt",
      "successful_dribbles",
      "dribble_attempts"
    ],
  
    // Passing stats
    passing: [
      "total_passes",
      "accurate_passes",
      "accurate_passes_percentage",
      "total_own_half_passes",
      "accurate_own_half_passes",
      "accurate_own_half_passes_percentage",
      "total_opposition_half_passes",
      "accurate_opposition_half_passes",
      "accurate_opposition_half_passes_percentage",
      "total_long_balls",
      "accurate_long_balls",
      "accurate_long_balls_percentage",
      "total_crosses",
      "accurate_crosses",
      "accurate_crosses_percentage"
    ],
  
    // Defensive stats
    defensive: [
      "goals_conceded",
      "expected_goals_conceded",
      "clean_sheets",
      "tackles",
      "interceptions",
      "saves",
      "clearances",
      "clearances_off_line",
      "last_man_tackles",
      "ball_recovery",
      "penalties_committed",
      "penalty_goals_conceded"
    ],
  
    // Duels & contests
    duels: [
      "total_duels",
      "duels_won",
      "duels_won_percentage",
      "total_ground_duels",
      "ground_duels_won",
      "ground_duels_won_percentage",
      "total_aerial_duels",
      "aerial_duels_won",
      "aerial_duels_won_percentage"
    ],
  
    // Set pieces & situations
    set_pieces: [
      "corners",
      "free_kicks",
      "goal_kicks",
      "throw_ins",
      "offsides"
    ],
  
    // Possession & control
    possession: [
      "average_ball_possession",
      "possession_lost"
    ],
  
    // Disciplinary
    disciplinary: [
      "fouls",
      "yellow_cards",
      "red_cards",
      "yellow_red_cards"
    ],
  
    // Errors & negative events
    errors: [
      "errors_leading_to_goal",
      "errors_leading_to_shot",
      "own_goals"
    ],
  
    // Creativity & assists
    creation: [
      "assists",
      "big_chances_created"
    ],
  
    // Opposition stats (stats conceded)
    opposition: [
      "accurate_final_third_passes_against",
      "accurate_opposition_half_passes_against",
      "accurate_own_half_passes_against",
      "accurate_passes_against",
      "big_chances_against",
      "big_chances_created_against",
      "big_chances_missed_against",
      "clearances_against",
      "corners_against",
      "crosses_successful_against",
      "crosses_total_against",
      "dribble_attempts_total_against",
      "dribble_attempts_won_against",
      "errors_leading_to_goal_against",
      "errors_leading_to_shot_against",
      "hit_woodwork_against",
      "interceptions_against",
      "key_passes_against",
      "long_balls_successful_against",
      "long_balls_total_against",
      "offsides_against",
      "red_cards_against",
      "shots_against",
      "shots_blocked_against",
      "shots_from_inside_the_box_against",
      "shots_from_outside_the_box_against",
      "shots_off_target_against",
      "shots_on_target_against",
      "blocked_scoring_attempt_against",
      "tackles_against",
      "total_final_third_passes_against",
      "opposition_half_passes_total_against",
      "own_half_passes_total_against",
      "total_passes_against",
      "yellow_cards_against"
    ]
  };
  
  // Helper function to get category for a stat
  export const getTeamSeasonStatCategory = (statKey) => {
    for (const [category, stats] of Object.entries(TEAM_SEASON_STAT_CATEGORIES)) {
      if (stats.includes(statKey)) {
        return category;
      }
    }
    return 'other';
  };
  
  // Display names for categories
  export const TEAM_SEASON_CATEGORY_LABELS = {
    attacking: "Attack",
    passing: "Passing",
    defensive: "Defense",
    duels: "Duels & Physical",
    set_pieces: "Set Pieces",
    possession: "Possession",
    disciplinary: "Discipline",
    errors: "Errors",
    creation: "Creativity",
    opposition: "Opposition Stats"
  };
  
  // Function to check if a stat is a percentage
  export const isTeamSeasonPercentageStat = (statKey) => {
    const percentageStats = [
      "accurate_passes_percentage",
      "accurate_own_half_passes_percentage",
      "accurate_opposition_half_passes_percentage", 
      "accurate_long_balls_percentage",
      "accurate_crosses_percentage",
      "duels_won_percentage",
      "ground_duels_won_percentage",
      "aerial_duels_won_percentage",
      "average_ball_possession"
    ];
    
    return percentageStats.includes(statKey);
  };
  
  // Function to format stat names for display
  export const formatTeamSeasonMetricName = (statKey) => {
    const customNames = {
      // Goals & Scoring
      "goals_scored": "Goals Scored",
      "goals_conceded": "Goals Conceded",
      "expected_goals": "Expected Goals (xG)",
      "expected_goals_conceded": "Expected Goals Conceded (xGC)",
      "own_goals": "Own Goals",
      "assists": "Assists",
      
      // Shooting
      "shots": "Total Shots",
      "shots_on_target": "Shots on Target",
      "shots_off_target": "Shots off Target",
      "shots_from_inside_the_box": "Shots from Inside Box",
      "shots_from_outside_the_box": "Shots from Outside Box",
      "goals_from_inside_the_box": "Goals from Inside Box",
      "goals_from_outside_the_box": "Goals from Outside Box",
      "headed_goals": "Headed Goals",
      "left_foot_goals": "Left Foot Goals",
      "right_foot_goals": "Right Foot Goals",
      "hit_woodwork": "Hit Woodwork",
      
      // Penalties & Set Pieces
      "penalty_goals": "Penalty Goals",
      "penalties_taken": "Penalties Taken",
      "penalties_committed": "Penalties Committed",
      "penalty_goals_conceded": "Penalty Goals Conceded",
      "free_kick_goals": "Free Kick Goals",
      "free_kick_shots": "Free Kick Shots",
      "free_kicks": "Free Kicks",
      
      // Big Chances
      "big_chances": "Big Chances",
      "big_chances_created": "Big Chances Created",
      "big_chances_missed": "Big Chances Missed",
      
      // Fast Breaks
      "fast_breaks": "Fast Breaks",
      "fast_break_goals": "Fast Break Goals", 
      "fast_break_shots": "Fast Break Shots",
      
      // Dribbling
      "successful_dribbles": "Successful Dribbles",
      "dribble_attempts": "Dribble Attempts",
      
      // Defensive Actions
      "blocked_scoring_attempt": "Blocked Shots",
      "clean_sheets": "Clean Sheets",
      "tackles": "Tackles",
      "interceptions": "Interceptions",
      "saves": "Saves",
      "clearances": "Clearances",
      "clearances_off_line": "Clearances off Line",
      "last_man_tackles": "Last Man Tackles",
      "ball_recovery": "Ball Recoveries",
      
      // Passing
      "total_passes": "Total Passes",
      "accurate_passes": "Accurate Passes",
      "accurate_passes_percentage": "Pass Accuracy",
      "total_own_half_passes": "Own Half Passes",
      "accurate_own_half_passes": "Accurate Own Half Passes",
      "accurate_own_half_passes_percentage": "Own Half Pass Accuracy",
      "total_opposition_half_passes": "Opposition Half Passes",
      "accurate_opposition_half_passes": "Accurate Opposition Half Passes",
      "accurate_opposition_half_passes_percentage": "Opposition Half Pass Accuracy",
      "total_long_balls": "Long Balls",
      "accurate_long_balls": "Accurate Long Balls",
      "accurate_long_balls_percentage": "Long Ball Accuracy",
      "total_crosses": "Total Crosses",
      "accurate_crosses": "Accurate Crosses",
      "accurate_crosses_percentage": "Cross Accuracy",
      
      // Duels
      "total_duels": "Total Duels",
      "duels_won": "Duels Won",
      "duels_won_percentage": "Duel Success Rate",
      "total_ground_duels": "Ground Duels",
      "ground_duels_won": "Ground Duels Won",
      "ground_duels_won_percentage": "Ground Duel Success Rate",
      "total_aerial_duels": "Aerial Duels",
      "aerial_duels_won": "Aerial Duels Won",
      "aerial_duels_won_percentage": "Aerial Duel Success Rate",
      
      // Set Pieces & Misc
      "corners": "Corner Kicks",
      "goal_kicks": "Goal Kicks",
      "throw_ins": "Throw Ins",
      "offsides": "Offsides",
      
      // Possession
      "average_ball_possession": "Average Possession",
      "possession_lost": "Possession Lost",
      
      // Discipline
      "fouls": "Fouls",
      "yellow_cards": "Yellow Cards",
      "red_cards": "Red Cards",
      "yellow_red_cards": "Second Yellow Cards",
      
      // Errors
      "errors_leading_to_goal": "Errors Leading to Goal",
      "errors_leading_to_shot": "Errors Leading to Shot",
      
      // Opposition stats (stats conceded)
      "accurate_final_third_passes_against": "Final Third Passes Allowed",
      "accurate_opposition_half_passes_against": "Opposition Half Passes Allowed",
      "accurate_own_half_passes_against": "Own Half Passes Allowed",
      "accurate_passes_against": "Accurate Passes Allowed",
      "big_chances_against": "Big Chances Conceded",
      "big_chances_created_against": "Big Chances Created Against",
      "big_chances_missed_against": "Big Chances Missed Against",
      "clearances_against": "Clearances Against",
      "corners_against": "Corners Conceded",
      "crosses_successful_against": "Successful Crosses Against",
      "crosses_total_against": "Total Crosses Against",
      "dribble_attempts_total_against": "Dribble Attempts Against",
      "dribble_attempts_won_against": "Dribbles Won Against",
      "errors_leading_to_goal_against": "Errors Leading to Goal Against",
      "errors_leading_to_shot_against": "Errors Leading to Shot Against",
      "hit_woodwork_against": "Hit Woodwork Against",
      "interceptions_against": "Interceptions Against",
      "key_passes_against": "Key Passes Against",
      "long_balls_successful_against": "Successful Long Balls Against",
      "long_balls_total_against": "Total Long Balls Against",
      "offsides_against": "Offsides Against",
      "red_cards_against": "Red Cards Against",
      "shots_against": "Shots Faced",
      "shots_blocked_against": "Shots Blocked Against",
      "shots_from_inside_the_box_against": "Shots from Inside Box Against",
      "shots_from_outside_the_box_against": "Shots from Outside Box Against",
      "shots_off_target_against": "Shots off Target Against",
      "shots_on_target_against": "Shots on Target Against",
      "blocked_scoring_attempt_against": "Blocked Scoring Attempts Against",
      "tackles_against": "Tackles Against",
      "total_final_third_passes_against": "Total Final Third Passes Against",
      "opposition_half_passes_total_against": "Opposition Half Passes Total Against",
      "own_half_passes_total_against": "Own Half Passes Total Against",
      "total_passes_against": "Total Passes Against",
      "yellow_cards_against": "Yellow Cards Against"
    };
    
    return customNames[statKey] || statKey.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  };
  
  // Get all displayable stats (excluding identifiers)
  export const getDisplayableTeamSeasonStats = () => {
    const { identifiers, ...displayCategories } = TEAM_SEASON_STAT_CATEGORIES;
    return Object.values(displayCategories).flat();
  };