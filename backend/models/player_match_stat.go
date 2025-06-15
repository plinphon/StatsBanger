package models

type PlayerMatchStat struct {
    MatchId  int `gorm:"column:match_id" json:"matchId"`
    PlayerId int `gorm:"column:player_id" json:"playerId"`
    TeamId   int `gorm:"column:team_id" json:"teamId"`

    Match  Match  `gorm:"foreignKey:MatchId;references:Id" json:"match"`
    Player Player `gorm:"foreignKey:PlayerId;references:PlayerId" json:"player"`
    Team   Team   `gorm:"foreignKey:TeamId;references:TeamId" json:"team"`

    Stats map[string]*float64 `gorm:"-" json:"matchStats"`
}
func (PlayerMatchStat) TableName() string {
    return "player_match_stat"
}

var ValidPlayerMatchFields = map[string]bool{
	"match_id":                       true,
	"player_id":                      true,
	"team_id":                        true,
	"total_pass":                     true,
	"accurate_pass":                  true,
	"total_long_balls":              true,
	"accurate_long_balls":           true,
	"goal_assist":                    true,
	"saved_shots_from_inside_the_box": true,
	"saves":                          true,
	"minutes_played":                 true,
	"touches":                        true,
	"possession_lost_ctrl":           true,
	"key_pass":                       true,
	"goals_prevented":                true,
	"aerial_won":                     true,
	"duel_lost":                      true,
	"duel_won":                       true,
	"on_target_scoring_attempt":      true,
	"shot_off_target":                true,
	"goals":                          true,
	"total_clearance":                true,
	"interception_won":               true,
	"total_tackle":                   true,
	"was_fouled":                     true,
	"fouls":                          true,
	"expected_goals":                 true,
	"expected_assists":               true,
	"aerial_lost":                    true,
	"challenge_lost":                 true,
	"total_cross":                    true,
	"total_contest":                  true,
	"won_contest":                    true,
	"outfielder_block":               true,
	"big_chance_created":            true,
	"dispossessed":                   true,
	"accurate_cross":                true,
	"total_offside":                 true,
	"blocked_scoring_attempt":       true,
	"penalty_won":                    true,
	"penalty_conceded":              true,
	"big_chance_missed":             true,
	"total_keeper_sweeper":          true,
	"accurate_keeper_sweeper":      true,
	"good_high_claim":               true,
	"punches":                        true,
	"clearance_off_line":            true,
	"hit_woodwork":                  true,
	"error_lead_to_a_shot":          true,
	"own_goals":                     true,
	"last_man_tackle":              true,
	"error_lead_to_a_goal":          true,
	"penalty_save":                  true,
	"penalty_miss":                  true,
}
