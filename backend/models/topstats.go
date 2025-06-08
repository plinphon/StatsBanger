package models

type TopPlayerStatResult struct {
	PlayerID   int     `json:"playerId"`
	PlayerName string  `json:"playerName"`
	Position   string  `json:"position"`
	StatValue  float64 `json:"statValue"`
}

type TopTeamStatResult struct {
	TeamID    int     `json:"teamId"`
	TeamName  string  `json:"teamName"`
	StatValue float64 `json:"statValue"`
}
