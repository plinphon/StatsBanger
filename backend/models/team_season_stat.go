package models

type TeamSeasonStat struct {
    ID                 int `json:"id"`
    Team Team `json:"team"`
    UniqueTournamentID int `json:"uniqueTournamentId"`
    SeasonID           int `json:"seasonId"`
}