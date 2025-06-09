package models

import "time"

type Match struct {
	ID                         int       `json:"id"`
	UniqueTournamentID          int       `json:"uniqueTournamentId"`
	SeasonID                   int       `json:"seasonId"`
	Matchday                   int       `json:"matchday"`
	HomeTeamStat 				TeamMatchStat `json:"homeTeamStat"`
	AwayTeamStat 				TeamMatchStat `json:"awayTeamStat"`	
	HomeWin                    *int      `json:"homeWin,omitempty"`    
	HomeScore                  *int      `json:"homeScore,omitempty"`
	AwayScore                  *int      `json:"awayScore,omitempty"`
	InjuryTime1                *int      `json:"injuryTime1,omitempty"`
	InjuryTime2                *int      `json:"injuryTime2,omitempty"`
	CurrentPeriodStartTimestamp time.Time `json:"currentPeriodStartTimestamp"`
}

func (Match) TableName() string {
    return "match_info"
}
