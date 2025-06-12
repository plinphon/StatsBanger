package models

import (
    "time"
    "gorm.io/gorm"
)

type Player struct {
	PlayerId      int       `json:"playerId" gorm:"primaryKey;column:player_id"`
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
// CalculateAge calculates age from birthday and current date
func CalculateAge(birthday time.Time) int {
	now := time.Now()
	age := now.Year() - birthday.Year()
	if now.YearDay() < birthday.YearDay() {
		age--
	}
	return age
}

// AfterFind is a GORM hook that runs after querying a Player
func (p *Player) AfterFind(tx *gorm.DB) (err error) {
	p.Age = CalculateAge(p.Birthday)
	return nil
}

var ValidPositions = map[string]bool{
	"D": true,
	"M": true,
	"F": true,
	"G": true,
}