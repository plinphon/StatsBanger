package models

import "time"

type Match struct {
    Id                     int       `gorm:"primaryKey;column:match_id" json:"id"`
    UniqueTournamentId     int       `gorm:"column:unique_tournament_id" json:"uniqueTournamentId"`
    SeasonId               int       `gorm:"column:season_id" json:"seasonId"`
    Matchday               int       `gorm:"column:matchday" json:"matchday"`

    HomeTeamId             int       `gorm:"column:home_team_id" json:"homeTeamId"`
    AwayTeamId             int       `gorm:"column:away_team_id" json:"awayTeamId"`

    HomeTeam               Team      `gorm:"foreignKey:HomeTeamId;references:TeamId" json:"homeTeam"`
    AwayTeam               Team      `gorm:"foreignKey:AwayTeamId;references:TeamId" json:"awayTeam"`

    HomeWin                *int      `gorm:"column:home_win" json:"homeWin,omitempty"`
    HomeScore              *int      `gorm:"column:home_score" json:"homeScore,omitempty"`
    AwayScore              *int      `gorm:"column:away_score" json:"awayScore,omitempty"`
    InjuryTime1            *int      `gorm:"column:injury_time_1" json:"injuryTime1,omitempty"`
    InjuryTime2            *int      `gorm:"column:injury_time_2" json:"injuryTime2,omitempty"`
    CurrentPeriodStartTimestamp time.Time `gorm:"column:current_period_start_timestamp" json:"currentPeriodStartTimestamp"`
}

func (Match) TableName() string {
	return "match_info"
}
