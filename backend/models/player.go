package models

import "time"

type Player struct {
	ID            int       `json:"id"`
	Name          string    `json:"name"`
	Birthday      time.Time `json:"birthdayTimestamp"`
	Age           int       `json:"age"`
	TeamID        int       `json:"teamId"`
	TeamName      string    `json:"teamName"`
	Position      string    `json:"position"`
	Height        float64   `json:"height"`
	PreferredFoot string    `json:"preferredFoot"`
	Nationality   string    `json:"nationality"`
}

var ValidPositions = map[string]bool{
	"D": true,
	"M": true,
	"F": true,
	"G": true,
}