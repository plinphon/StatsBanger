package matches

import (
	"errors"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"github.com/plinphon/StatsBanger/backend/models"
)

var ErrMatchNotFound = errors.New("match not found")

type MatchRepository struct {
	db *gorm.DB
}

func NewMatchRepository(dbPath string) (*MatchRepository, error) {
	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}
	if err = sqlDB.Ping(); err != nil {
		return nil, err
	}

	return &MatchRepository{db: db}, nil
}
/*

func (r *MatchRepository) Create(match models.Match) error {
	query := `
	INSERT INTO match_info (
		match_id, unique_tournament_id, season_id, matchday, 
		home_team_id, away_team_id, home_win, home_score, 
		away_score, injury_time1, injury_time2, current_period_start_timestamp
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_,err := r.db.Exec(query,
		match.Id,
		match.UniqueTournamentId,
		match.SeasonId,
		match.Matchday,
		match.HomeTeamId,
		match.AwayTeamId,
		match.HomeWin,
		match.HomeScore,
		match.AwayScore,
		match.InjuryTime1,
		match.InjuryTime2,
		match.CurrentPeriodStartTimestamp,
	)

	return err
}*/

func (r *MatchRepository) GetById(matchId int) (*models.Match, error) {
	var match models.Match
	err := r.db.
		Preload("HomeTeam").
		Preload("AwayTeam").
		First(&match, "match_id = ?", matchId).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, ErrMatchNotFound
	}

	return &match, err
}

func (r *MatchRepository) GetByTeamId(teamId int) ([]models.Match, error) {
	var matches []models.Match

	err := r.db.
		Preload("HomeTeam").
		Preload("AwayTeam").
		Where("home_team_id = ? OR away_team_id = ?", teamId, teamId).
		Order("matchday ASC").
		Find(&matches).Error

	if err != nil {
		return nil, err
	}
	return matches, nil
}

