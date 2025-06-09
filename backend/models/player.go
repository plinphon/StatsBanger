package models

import "time"

type Player struct {
	PlayerId      int       `json:"id" gorm:"primaryKey;column:player_id"`
	PlayerName    string    `json:"name" gorm:"column:player_name"`
	PlayerSeasonStat *PlayerSeasonStat `gorm:"foreignKey:PlayerId;references:PlayerId" json:"playerSeasonStat,omitempty"`
	Birthday      time.Time `json:"birthdayTimestamp" gorm:"column:birthday_timestamp"`
	Age           int       `json:"age" gorm:"-"`
	Position      string    `json:"position" gorm:"column:position"`
	Height        float64   `json:"height" gorm:"column:height"`
	PreferredFoot string    `json:"preferredFoot" gorm:"column:preferred_foot"`
	Nationality   string    `json:"nationality" gorm:"column:nationality"`
}

func (Player) TableName() string {
    return "player_info"
}

var ValidPositions = map[string]bool{
	"D": true,
	"M": true,
	"F": true,
	"G": true,
}