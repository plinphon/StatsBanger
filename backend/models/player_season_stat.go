package models

type PlayerSeasonStat struct {
	PlayerID                    int      `json:"playerId"`
	UniqueTournamentID          int      `json:"uniqueTournamentId"`
	SeasonID                    int      `json:"seasonId"`
	TeamID                      int      `json:"teamId"`
	AccurateLongBalls           *float64 `json:"accurateLongBalls"`
	AccurateLongBallsPercentage *float64 `json:"accurateLongBallsPercentage"`
	AccuratePasses              *float64 `json:"accuratePasses"`
	AccuratePassesPercentage    *float64 `json:"accuratePassesPercentage"`
	AerialDuelsWon              *float64 `json:"aerialDuelsWon"`
	Assists                     *float64 `json:"assists"`
	BigChancesCreated           *float64 `json:"bigChancesCreated"`
	BigChancesMissed            *float64 `json:"bigChancesMissed"`
	CleanSheet                  *float64 `json:"cleanSheet"`
	DribbledPast                *float64 `json:"dribbledPast"`
	ErrorLeadToGoal             *float64 `json:"errorLeadToGoal"`
	ExpectedAssists             *float64 `json:"expectedAssists"`
	ExpectedGoals               *float64 `json:"expectedGoals"`
	Goals                       *float64 `json:"goals"`
	GoalsAssistsSum             *float64 `json:"goalsAssistsSum"`
	GoalsConceded               *float64 `json:"goalsConceded"`
	GoalsPrevented              *float64 `json:"goalsPrevented"`
	Interceptions               *float64 `json:"interceptions"`
	KeyPasses                   *float64 `json:"keyPasses"`
	MinutesPlayed               *float64 `json:"minutesPlayed"`
	PassToAssist                *float64 `json:"passToAssist"`
	PenaltyFaced                *float64 `json:"penaltyFaced"`
	PenaltySave                 *float64 `json:"penaltySave"`
	Rating                      *float64 `json:"rating"`
	RedCards                    *float64 `json:"redCards"`
	SavedShotsFromInsideTheBox  *float64 `json:"savedShotsFromInsideTheBox"`
	Saves                       *float64 `json:"saves"`
	SuccessfulDribbles          *float64 `json:"successfulDribbles"`
	Tackles                     *float64 `json:"tackles"`
	YellowCards                 *float64 `json:"yellowCards"`
	TotalRating                 *float64 `json:"totalRating"`
	CountRating                 *float64 `json:"countRating"`
	TotalLongBalls              *float64 `json:"totalLongBalls"`
	TotalPasses                 *float64 `json:"totalPasses"`
	ShotsFromInsideTheBox       *float64 `json:"shotsFromInsideTheBox"`
	Appearances                 *float64 `json:"appearances"`
	Type                        string   `json:"type"`
	ID                          *float64 `json:"id"`
	AccurateCrosses             *float64 `json:"accurateCrosses"`
	AccurateCrossesPercentage   *float64 `json:"accurateCrossesPercentage"`
	BlockedShots                *float64 `json:"blockedShots"`
	ShotsOnTarget               *float64 `json:"shotsOnTarget"`
	TotalShots                  *float64 `json:"totalShots"`
	TotalCross                  *float64 `json:"totalCross"`
}

var ValidTopPlayerFields = map[string]bool{
	"accurate_long_balls":               true,
	"accurate_long_balls_percentage":    true,
	"accurate_passes":                   true,
	"accurate_passes_percentage":        true,
	"aerial_duels_won":                  true,
	"assists":                           true,
	"big_chances_created":               true,
	"big_chances_missed":                true,
	"clean_sheet":                       true,
	"dribbled_past":                     true,
	"error_lead_to_goal":                true,
	"expected_assists":                  true,
	"expected_goals":                    true,
	"goals":                             true,
	"goals_assists_sum":                 true,
	"goals_conceded":                    true,
	"goals_prevented":                   true,
	"interceptions":                     true,
	"key_passes":                        true,
	"minutes_played":                    true,
	"pass_to_assist":                    true,
	"penalty_faced":                     true,
	"penalty_save":                      true,
	"rating":                            true,
	"red_cards":                         true,
	"saved_shots_from_inside_the_box":   true,
	"saves":                             true,
	"successful_dribbles":               true,
	"tackles":                           true,
	"yellow_cards":                      true,
	"total_rating":                      true,
	"count_rating":                      true,
	"total_long_balls":                  true,
	"total_passes":                      true,
	"shots_from_inside_the_box":         true,
	"appearances":                       true,
	"accurate_crosses":                  true,
	"accurate_crosses_percentage":       true,
	"blocked_shots":                     true,
	"shots_on_target":                   true,
	"total_shots":                       true,
	"total_cross":                       true,
}