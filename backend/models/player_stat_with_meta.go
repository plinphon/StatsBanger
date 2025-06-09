package models

type PlayerStatWithMeta struct {
    PlayerID   int                `json:"playerId"`
    PlayerName string             `json:"playerName"`
    TeamID     int                `json:"teamId"`
    TeamName   string             `json:"teamName"`
    Stats      map[string]*float64 `json:"stats"`
}