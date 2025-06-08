package models

type TeamStatWithMeta struct {
    TeamID     int                `json:"teamId"`
    TeamName   string             `json:"teamName"`
    Stats      map[string]*float64 `json:"stats"`
}