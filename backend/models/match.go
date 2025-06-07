package models

import "time"

type Match struct {
	ID                         int       `json:"id"`
	UniqueTournamentID          int       `json:"uniqueTournamentId"`
	SeasonID                   int       `json:"seasonId"`
	Matchday                   int       `json:"matchday"`
	HomeTeamID                 int       `json:"homeTeamId"`
	HomeTeamName               string    `json:"homeTeamName"`
	AwayTeamID                 int       `json:"awayTeamId"`
	AwayTeamName               string    `json:"awayTeamName"`
	HomeWin                    *int      `json:"homeWin,omitempty"`        // pointer to allow null
	HomeScore                  *int      `json:"homeScore,omitempty"`
	AwayScore                  *int      `json:"awayScore,omitempty"`
	InjuryTime1                *int      `json:"injuryTime1,omitempty"`
	InjuryTime2                *int      `json:"injuryTime2,omitempty"`
	CurrentPeriodStartTimestamp time.Time `json:"currentPeriodStartTimestamp"`
}
