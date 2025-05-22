package models

import "time"

type Match struct {
	MatchID                     int    `json:"match_id"`
	UniqueTournamentID          int     `json:"unique_tournament_id"`
	SeasonID                    int    `json:"season_id"`
	Matchday                    int       `json:"matchday"`
	HomeTeamID                  int    `json:"home_team_id"`
	AwayTeamID                  int     `json:"away_team_id"`
	HomeWin                     *int    `json:"home_win,omitempty"` //pointer to allow null
	HomeScore                   *int      `json:"home_score,omitempty"`
	AwayScore                   *int      `json:"away_score,omitempty"`
	InjuryTime1                 *int      `json:"injury_time1,omitempty"`
	InjuryTime2                 *int      `json:"injury_time2,omitempty"`
	CurrentPeriodStartTimestamp time.Time `json:"current_period_start_timestamp"`
}