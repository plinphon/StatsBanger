package models

type PlayerMatchStat struct {
	Player Player `json:"player"`
	Team   Team   `json:"team"`
	Match  Match  `json:"match"`	
    Stats  map[string]*float64 `json:"stats"`
}