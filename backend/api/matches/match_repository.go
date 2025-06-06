package matches

import (
	"github.com/plinphon/StatsBanger/backend/models"

	"database/sql"
	"errors"
	_ "github.com/mattn/go-sqlite3"
)


var ErrMatchNotFound = errors.New("match not found")

type MatchRepository struct {
	db *sql.DB
}

func NewMatchRepository(dbPath string) (*MatchRepository, error) {
    db, err := sql.Open("sqlite3", dbPath)
    if err != nil {
        return nil, err
    } 
    if err = db.Ping(); err != nil {
        return nil, err
    }

    return &MatchRepository{db: db}, nil
}

func (r *MatchRepository) Create(match models.Match) error {
	query := `
	INSERT INTO match_info (
		match_id, unique_tournament_id, season_id, matchday, 
		home_team_id, away_team_id, home_win, home_score, 
		away_score, injury_time1, injury_time2, current_period_start_timestamp
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_,err := r.db.Exec(query,
		match.MatchID,
		match.UniqueTournamentID,
		match.SeasonID,
		match.Matchday,
		match.HomeTeamID,
		match.AwayTeamID,
		match.HomeWin,
		match.HomeScore,
		match.AwayScore,
		match.InjuryTime1,
		match.InjuryTime2,
		match.CurrentPeriodStartTimestamp,
	)

	return err
}

func (r *MatchRepository) GetByID(matchID int) (*models.Match, error) {
	query := `
	SELECT 
		m.match_id, m.unique_tournament_id, m.season_id, m.matchday,
		m.home_team_id, ht.team_name AS home_team_name,
		m.away_team_id, at.team_name AS away_team_name,
		m.home_win, m.home_score, m.away_score,
		m.injury_time1, m.injury_time2, m.current_period_start_timestamp
	FROM match_info m
	JOIN team_info ht ON m.home_team_id = ht.team_id
	JOIN team_info at ON m.away_team_id = at.team_id
	WHERE m.match_id = ?
	`

	row := r.db.QueryRow(query, matchID)

	var match models.Match
	err := row.Scan(
		&match.MatchID,
		&match.UniqueTournamentID,
		&match.SeasonID,
		&match.Matchday,
		&match.HomeTeamID,
		&match.HomeTeamName,
		&match.AwayTeamID,
		&match.AwayTeamName,
		&match.HomeWin,
		&match.HomeScore,
		&match.AwayScore,
		&match.InjuryTime1,
		&match.InjuryTime2,
		&match.CurrentPeriodStartTimestamp,
	)

	if errors.Is(err, sql.ErrNoRows) {
		return nil, ErrMatchNotFound
	}

	return &match, err
}

func (r *MatchRepository) GetByTeamID(teamID int) ([]models.Match, error) {
	query := `
	SELECT 
		m.match_id, m.unique_tournament_id, m.season_id, m.matchday,
		m.home_team_id, ht.team_name AS home_team_name,
		m.away_team_id, at.team_name AS away_team_name,
		m.home_win, m.home_score, m.away_score,
		m.injury_time1, m.injury_time2, m.current_period_start_timestamp
	FROM match_info m
	JOIN team_info ht ON m.home_team_id = ht.team_id
	JOIN team_info at ON m.away_team_id = at.team_id
	WHERE m.home_team_id = ? OR m.away_team_id = ?
	`

	rows, err := r.db.Query(query, teamID, teamID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var matches []models.Match
	for rows.Next() {
		var match models.Match
		if err := rows.Scan(
			&match.MatchID,
			&match.UniqueTournamentID,
			&match.SeasonID,
			&match.Matchday,
			&match.HomeTeamID,
			&match.HomeTeamName,
			&match.AwayTeamID,
			&match.AwayTeamName,
			&match.HomeWin,
			&match.HomeScore,
			&match.AwayScore,
			&match.InjuryTime1,
			&match.InjuryTime2,
			&match.CurrentPeriodStartTimestamp,
		); err != nil {
			return nil, err
		}
		matches = append(matches, match)
	}

	return matches, nil
}
