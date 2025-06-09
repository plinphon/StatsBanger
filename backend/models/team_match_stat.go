package models

type TeamMatchStat struct {
	MatchID int    `gorm:"column:match_id"`
	Match   *Match `gorm:"foreignKey:MatchID"`

	TeamID int  `gorm:"column:team_id"`
	Team   Team `gorm:"foreignKey:TeamID"`

	Stats map[string]*float64 `gorm:"-" json:"stats"` // Assuming it's computed or not in DB
}