package models

import "time"

type Player struct {
	ID                int       `json:"id"`
	Name              string    `json:"name"`
	BirthdayTimestamp time.Time `json:"birthday_timestamp"`
	Age               int       `json:"age"`
	TeamID            int       `json:"team_id"`
	TeamName          string    `json:"team_name"`
	Position          string    `json:"position"`
	Height            float64   `json:"height"`
	PreferredFoot     string    `json:"preferred_foot"`
	Nationality       string    `json:"nationality"`
}
