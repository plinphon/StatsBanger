package models

type TeamSeasonStat struct {
    ID                 int `json:"id"`
    TeamID             int `json:"teamId"`
    UniqueTournamentID int `json:"uniqueTournamentId"`
    SeasonID           int `json:"seasonId"`

    GoalsScored                          *float64 `json:"goalsScored"`
    GoalsConceded                        *float64 `json:"goalsConceded"`
    OwnGoals                             *float64 `json:"ownGoals"`
    Assists                              *float64 `json:"assists"`
    Shots                                *float64 `json:"shots"`
    PenaltyGoals                         *float64 `json:"penaltyGoals"`
    PenaltiesTaken                       *float64 `json:"penaltiesTaken"`
    FreeKickGoals                        *float64 `json:"freeKickGoals"`
    FreeKickShots                        *float64 `json:"freeKickShots"`
    GoalsFromInsideTheBox               *float64 `json:"goalsFromInsideTheBox"`
    GoalsFromOutsideTheBox              *float64 `json:"goalsFromOutsideTheBox"`
    ShotsFromInsideTheBox               *float64 `json:"shotsFromInsideTheBox"`
    ShotsFromOutsideTheBox              *float64 `json:"shotsFromOutsideTheBox"`
    HeadedGoals                          *float64 `json:"headedGoals"`
    LeftFootGoals                        *float64 `json:"leftFootGoals"`
    RightFootGoals                       *float64 `json:"rightFootGoals"`
    BigChances                           *float64 `json:"bigChances"`
    BigChancesCreated                    *float64 `json:"bigChancesCreated"`
    BigChancesMissed                     *float64 `json:"bigChancesMissed"`
    ShotsOnTarget                        *float64 `json:"shotsOnTarget"`
    ShotsOffTarget                       *float64 `json:"shotsOffTarget"`
    BlockedScoringAttempt                *float64 `json:"blockedScoringAttempt"`
    SuccessfulDribbles                   *float64 `json:"successfulDribbles"`
    DribbleAttempts                      *float64 `json:"dribbleAttempts"`
    Corners                              *float64 `json:"corners"`
    HitWoodwork                          *float64 `json:"hitWoodwork"`
    FastBreaks                           *float64 `json:"fastBreaks"`
    FastBreakGoals                       *float64 `json:"fastBreakGoals"`
    FastBreakShots                       *float64 `json:"fastBreakShots"`
    AverageBallPossession                *float64 `json:"averageBallPossession"`
    TotalPasses                          *float64 `json:"totalPasses"`
    AccuratePasses                       *float64 `json:"accuratePasses"`
    AccuratePassesPercentage             *float64 `json:"accuratePassesPercentage"`
    TotalOwnHalfPasses                   *float64 `json:"totalOwnHalfPasses"`
    AccurateOwnHalfPasses                *float64 `json:"accurateOwnHalfPasses"`
    AccurateOwnHalfPassesPercentage      *float64 `json:"accurateOwnHalfPassesPercentage"`
    TotalOppositionHalfPasses            *float64 `json:"totalOppositionHalfPasses"`
    AccurateOppositionHalfPasses         *float64 `json:"accurateOppositionHalfPasses"`
    AccurateOppositionHalfPassesPercentage *float64 `json:"accurateOppositionHalfPassesPercentage"`
    TotalLongBalls                       *float64 `json:"totalLongBalls"`
    AccurateLongBalls                    *float64 `json:"accurateLongBalls"`
    AccurateLongBallsPercentage          *float64 `json:"accurateLongBallsPercentage"`
    TotalCrosses                         *float64 `json:"totalCrosses"`
    AccurateCrosses                      *float64 `json:"accurateCrosses"`
    AccurateCrossesPercentage            *float64 `json:"accurateCrossesPercentage"`
    CleanSheets                          *float64 `json:"cleanSheets"`
    Tackles                              *float64 `json:"tackles"`
    Interceptions                        *float64 `json:"interceptions"`
    Saves                                *float64 `json:"saves"`
    ErrorsLeadingToGoal                  *float64 `json:"errorsLeadingToGoal"`
    ErrorsLeadingToShot                  *float64 `json:"errorsLeadingToShot"`
    PenaltiesCommitted                   *float64 `json:"penaltiesCommitted"`
    PenaltyGoalsConceded                 *float64 `json:"penaltyGoalsConceded"`
    Clearances                           *float64 `json:"clearances"`
    ClearancesOffLine                    *float64 `json:"clearancesOffLine"`
    LastManTackles                       *float64 `json:"lastManTackles"`
    TotalDuels                           *float64 `json:"totalDuels"`
    DuelsWon                             *float64 `json:"duelsWon"`
    DuelsWonPercentage                   *float64 `json:"duelsWonPercentage"`
    TotalGroundDuels                     *float64 `json:"totalGroundDuels"`
    GroundDuelsWon                       *float64 `json:"groundDuelsWon"`
    GroundDuelsWonPercentage             *float64 `json:"groundDuelsWonPercentage"`
    TotalAerialDuels                     *float64 `json:"totalAerialDuels"`
    AerialDuelsWon                       *float64 `json:"aerialDuelsWon"`
    AerialDuelsWonPercentage             *float64 `json:"aerialDuelsWonPercentage"`
    PossessionLost                       *float64 `json:"possessionLost"`
    Offsides                             *float64 `json:"offsides"`
    Fouls                                *float64 `json:"fouls"`
    YellowCards                          *float64 `json:"yellowCards"`
    YellowRedCards                       *float64 `json:"yellowRedCards"`
    RedCards                             *float64 `json:"redCards"`
    AccurateFinalThirdPassesAgainst      *float64 `json:"accurateFinalThirdPassesAgainst"`
    AccurateOppositionHalfPassesAgainst  *float64 `json:"accurateOppositionHalfPassesAgainst"`
    AccurateOwnHalfPassesAgainst         *float64 `json:"accurateOwnHalfPassesAgainst"`
    AccuratePassesAgainst                *float64 `json:"accuratePassesAgainst"`
    BigChancesAgainst                    *float64 `json:"bigChancesAgainst"`
    BigChancesCreatedAgainst             *float64 `json:"bigChancesCreatedAgainst"`
    BigChancesMissedAgainst              *float64 `json:"bigChancesMissedAgainst"`
    ClearancesAgainst                    *float64 `json:"clearancesAgainst"`
    CornersAgainst                       *float64 `json:"cornersAgainst"`
    CrossesSuccessfulAgainst             *float64 `json:"crossesSuccessfulAgainst"`
    CrossesTotalAgainst                  *float64 `json:"crossesTotalAgainst"`
    DribbleAttemptsTotalAgainst          *float64 `json:"dribbleAttemptsTotalAgainst"`
    DribbleAttemptsWonAgainst            *float64 `json:"dribbleAttemptsWonAgainst"`
    ErrorsLeadingToGoalAgainst           *float64 `json:"errorsLeadingToGoalAgainst"`
    ErrorsLeadingToShotAgainst           *float64 `json:"errorsLeadingToShotAgainst"`
    HitWoodworkAgainst                   *float64 `json:"hitWoodworkAgainst"`
    InterceptionsAgainst                 *float64 `json:"interceptionsAgainst"`
    KeyPassesAgainst                     *float64 `json:"keyPassesAgainst"`
    LongBallsSuccessfulAgainst           *float64 `json:"longBallsSuccessfulAgainst"`
    LongBallsTotalAgainst                *float64 `json:"longBallsTotalAgainst"`
    OffsidesAgainst                      *float64 `json:"offsidesAgainst"`
    RedCardsAgainst                      *float64 `json:"redCardsAgainst"`
    ShotsAgainst                         *float64 `json:"shotsAgainst"`
    ShotsBlockedAgainst                  *float64 `json:"shotsBlockedAgainst"`
    ShotsFromInsideTheBoxAgainst         *float64 `json:"shotsFromInsideTheBoxAgainst"`
    ShotsFromOutsideTheBoxAgainst        *float64 `json:"shotsFromOutsideTheBoxAgainst"`
    ShotsOffTargetAgainst                *float64 `json:"shotsOffTargetAgainst"`
    ShotsOnTargetAgainst                 *float64 `json:"shotsOnTargetAgainst"`
    BlockedScoringAttemptAgainst         *float64 `json:"blockedScoringAttemptAgainst"`
    TacklesAgainst                       *float64 `json:"tacklesAgainst"`
    TotalFinalThirdPassesAgainst         *float64 `json:"totalFinalThirdPassesAgainst"`
    OppositionHalfPassesTotalAgainst     *float64 `json:"oppositionHalfPassesTotalAgainst"`
    OwnHalfPassesTotalAgainst            *float64 `json:"ownHalfPassesTotalAgainst"`
    TotalPassesAgainst                   *float64 `json:"totalPassesAgainst"`
    YellowCardsAgainst                   *float64 `json:"yellowCardsAgainst"`
    ThrowIns                             *float64 `json:"throwIns"`
    GoalKicks                            *float64 `json:"goalKicks"`
    BallRecovery                         *float64 `json:"ballRecovery"`
    FreeKicks                            *float64 `json:"freeKicks"`
    Matches                              *float64 `json:"matches"`
    AwardedMatches                       *float64 `json:"awardedMatches"`
}


var ValidTopTeamFields = map[string]bool{
    "goals_scored":                   true,
    "goals_conceded":                 true,
    "own_goals":                     true,
    "assists":                       true,
    "shots":                        true,
    "penalty_goals":                 true,
    "penalties_taken":               true,
    "free_kick_goals":               true,
    "free_kick_shots":               true,
    "goals_from_inside_the_box":      true,
    "goals_from_outside_the_box":     true,
    "shots_from_inside_the_box":      true,
    "shots_from_outside_the_box":     true,
    "headed_goals":                  true,
    "left_foot_goals":               true,
    "right_foot_goals":              true,
    "big_chances":                   true,
    "big_chances_created":           true,
    "big_chances_missed":            true,
    "shots_on_target":               true,
    "shots_off_target":              true,
    "blocked_scoring_attempt":        true,
    "successful_dribbles":            true,
    "dribble_attempts":               true,
    "corners":                      true,
    "hit_woodwork":                 true,
    "fast_breaks":                  true,
    "fast_break_goals":             true,
    "fast_break_shots":             true,
    "average_ball_possession":        true,
    "total_passes":                 true,
    "accurate_passes":              true,
    "accurate_passes_percentage":    true,
    "total_own_half_passes":         true,
    "accurate_own_half_passes":       true,
    "accurate_own_half_passes_percentage": true,
    "total_opposition_half_passes":  true,
    "accurate_opposition_half_passes": true,
    "accurate_opposition_half_passes_percentage": true,
    "total_long_balls":             true,
    "accurate_long_balls":          true,
    "accurate_long_balls_percentage": true,
    "total_crosses":                true,
    "accurate_crosses":             true,
    "accurate_crosses_percentage":   true,
    "clean_sheets":                 true,
    "tackles":                     true,
    "interceptions":               true,
    "saves":                      true,
    "errors_leading_to_goal":       true,
    "errors_leading_to_shot":       true,
    "penalties_committed":          true,
    "penalty_goals_conceded":       true,
    "clearances":                  true,
    "clearances_off_line":          true,
    "last_man_tackles":             true,
    "total_duels":                 true,
    "duels_won":                  true,
    "duels_won_percentage":         true,
    "total_ground_duels":          true,
    "ground_duels_won":             true,
    "ground_duels_won_percentage":  true,
    "total_aerial_duels":          true,
    "aerial_duels_won":             true,
    "aerial_duels_won_percentage":  true,
    "possession_lost":             true,
    "offsides":                   true,
    "fouls":                      true,
    "yellow_cards":                true,
    "yellow_red_cards":            true,
    "red_cards":                  true,
    "accurate_final_third_passes_against": true,
    "accurate_opposition_half_passes_against": true,
    "accurate_own_half_passes_against": true,
    "accurate_passes_against":     true,
    "big_chances_against":          true,
    "big_chances_created_against":  true,
    "big_chances_missed_against":   true,
    "clearances_against":           true,
    "corners_against":             true,
    "crosses_successful_against":   true,
    "crosses_total_against":        true,
    "dribble_attempts_total_against": true,
    "dribble_attempts_won_against": true,
    "errors_leading_to_goal_against": true,
    "errors_leading_to_shot_against": true,
    "hit_woodwork_against":         true,
    "interceptions_against":       true,
    "key_passes_against":           true,
    "long_balls_successful_against": true,
    "long_balls_total_against":     true,
    "offsides_against":            true,
    "red_cards_against":           true,
    "shots_against":               true,
    "shots_blocked_against":        true,
    "shots_from_inside_the_box_against": true,
    "shots_from_outside_the_box_against": true,
    "shots_off_target_against":     true,
    "shots_on_target_against":      true,
    "blocked_scoring_attempt_against": true,
    "tackles_against":             true,
    "total_final_third_passes_against": true,
    "opposition_half_passes_total_against": true,
    "own_half_passes_total_against": true,
    "total_passes_against":        true,
    "yellow_cards_against":         true,
    "throw_ins":                  true,
    "goal_kicks":                 true,
    "ball_recovery":              true,
    "free_kicks":                 true,
    "matches":                   true,
    "awarded_matches":            true,
}
