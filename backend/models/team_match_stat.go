package models

type TeamMatchStat struct {
    MatchId int    `gorm:"column:match_id;primaryKey" json:"matchId"`
    Match   *Match `gorm:"foreignKey:MatchId;references:Id" json:"match"`

    TeamId int  `gorm:"column:team_id;primaryKey" json:"teamId"`
    Team   Team `gorm:"foreignKey:TeamId;references:TeamId" json:"team"`
    
    Stats map[string]*float64 `gorm:"-" json:"stats"` // Assuming it's computed or not in DB
}

func (TeamMatchStat) TableName() string {
    return "team_match_stat"
}

var ValidTeamMatchFields = map[string]bool{
	"match_id":               true,
	"team_id":                true,
	"ball_possession":        true,
	"expected_goals":         true,
	"big_chances":            true,
	"total_shots":            true,
	"goalkeeper_saves":       true,
	"corner_kicks":           true,
	"fouls":                  true,
	"passes":                 true,
	"tackles":                true,
	"free_kicks":             true,
	"yellow_cards":           true,
	"red_cards":              true,
	"shots_on_target":        true,
	"hit_woodwork":           true,
	"shots_off_target":       true,
	"blocked_shots":          true,
	"shots_inside_box":       true,
	"shots_outside_box":      true,
	"big_chances_scored":     true,
	"big_chances_missed":     true,
	"through_balls":          true,
	"touches_in_penalty_area": true,
	"fouled_in_final_third":  true,
	"offsides":               true,
	"accurate_passes":        true,
	"throw_ins":              true,
	"final_third_entries":    true,
	"final_third_phase":      true,
	"long_balls":             true,
	"crosses":                true,
	"duels":                  true,
	"dispossessed":           true,
	"ground_duels":           true,
	"aerial_duels":           true,
	"dribbles":               true,
	"tackles_won":            true,
	"total_tackles":          true,
	"interceptions":          true,
	"recoveries":             true,
	"clearances":             true,
	"total_saves":            true,
	"goals_prevented":        true,
	"goal_kicks":             true,
	"big_saves":              true,
	"high_claims":            true,
	"punches":                true,
	"errors_lead_to_a_shot":  true,
	"errors_lead_to_a_goal":  true,
	"penalty_saves":          true,
}
