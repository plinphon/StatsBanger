package season

import (
	"database/sql"
	"errors"
	"fmt"
	"github.com/plinphon/StatsBanger/backend/models"

	_ "github.com/mattn/go-sqlite3"
)

type PlayerSeasonStatRepository struct {
	db *sql.DB
}

func NewPlayerSeasonStatRepository(dbPath string) (*PlayerSeasonStatRepository, error) {
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		return nil, err
	}
	if err = db.Ping(); err != nil {
		return nil, err
	}
	return &PlayerSeasonStatRepository{db: db}, nil
}

func (r *PlayerSeasonStatRepository) Create(stat models.PlayerSeasonStat) error {
	query := `
	INSERT INTO player_stat (
		player_id, unique_tournament_id, season_id, team_id, accurate_long_balls,
		accurate_long_balls_percentage, accurate_passes, accurate_passes_percentage,
		aerial_duels_won, assists, big_chances_created, big_chances_missed,
		clean_sheet, dribbled_past, error_lead_to_goal, expected_assists,
		expected_goals, goals, goals_assists_sum, goals_conceded, goals_prevented,
		interceptions, key_passes, minutes_played, pass_to_assist, penalty_faced,
		penalty_save, rating, red_cards, saved_shots_from_inside_the_box, saves,
		successful_dribbles, tackles, yellow_cards, total_rating, count_rating,
		total_long_balls, total_passes, shots_from_inside_the_box, appearances,
		type, id, accurate_crosses, accurate_crosses_percentage, blocked_shots,
		shots_on_target, total_shots, total_cross
	) VALUES (
		?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
	)`

	_, err := r.db.Exec(query,
		stat.PlayerID, stat.UniqueTournamentID, stat.SeasonID, stat.TeamID, stat.AccurateLongBalls,
		stat.AccurateLongBallsPercentage, stat.AccuratePasses, stat.AccuratePassesPercentage,
		stat.AerialDuelsWon, stat.Assists, stat.BigChancesCreated, stat.BigChancesMissed,
		stat.CleanSheet, stat.DribbledPast, stat.ErrorLeadToGoal, stat.ExpectedAssists,
		stat.ExpectedGoals, stat.Goals, stat.GoalsAssistsSum, stat.GoalsConceded, stat.GoalsPrevented,
		stat.Interceptions, stat.KeyPasses, stat.MinutesPlayed, stat.PassToAssist, stat.PenaltyFaced,
		stat.PenaltySave, stat.Rating, stat.RedCards, stat.SavedShotsFromInsideTheBox, stat.Saves,
		stat.SuccessfulDribbles, stat.Tackles, stat.YellowCards, stat.TotalRating, stat.CountRating,
		stat.TotalLongBalls, stat.TotalPasses, stat.ShotsFromInsideTheBox, stat.Appearances,
		stat.Type, stat.ID, stat.AccurateCrosses, stat.AccurateCrossesPercentage, stat.BlockedShots,
		stat.ShotsOnTarget, stat.TotalShots, stat.TotalCross,
	)

	return err
}

func (r *PlayerSeasonStatRepository) GetByID(uniqueTournamentID int, seasonID int, playerID int) (*models.PlayerSeasonStat, error) {
	query := `
	SELECT * 
	FROM player_stat 
	WHERE unique_tournament_id = ? AND season_id = ? AND player_id = ?`

	row := r.db.QueryRow(query, uniqueTournamentID, seasonID, playerID)

	var stat models.PlayerSeasonStat
	err := row.Scan(
		&stat.PlayerID, &stat.UniqueTournamentID, &stat.SeasonID, &stat.TeamID,
		&stat.AccurateLongBalls, &stat.AccurateLongBallsPercentage, &stat.AccuratePasses, &stat.AccuratePassesPercentage,
		&stat.AerialDuelsWon, &stat.Assists, &stat.BigChancesCreated, &stat.BigChancesMissed,
		&stat.CleanSheet, &stat.DribbledPast, &stat.ErrorLeadToGoal, &stat.ExpectedAssists,
		&stat.ExpectedGoals, &stat.Goals, &stat.GoalsAssistsSum, &stat.GoalsConceded,
		&stat.GoalsPrevented, &stat.Interceptions, &stat.KeyPasses, &stat.MinutesPlayed,
		&stat.PassToAssist, &stat.PenaltyFaced, &stat.PenaltySave, &stat.Rating,
		&stat.RedCards, &stat.SavedShotsFromInsideTheBox, &stat.Saves, &stat.SuccessfulDribbles,
		&stat.Tackles, &stat.YellowCards, &stat.TotalRating, &stat.CountRating,
		&stat.TotalLongBalls, &stat.TotalPasses, &stat.ShotsFromInsideTheBox, &stat.Appearances,
		&stat.Type, &stat.ID, &stat.AccurateCrosses, &stat.AccurateCrossesPercentage,
		&stat.BlockedShots, &stat.ShotsOnTarget, &stat.TotalShots, &stat.TotalCross,
	)

	if err == sql.ErrNoRows {
		return nil, errors.New("player match stat not found")
	} else if err != nil {
		return nil, err
	}

	return &stat, nil
}

func (r *PlayerSeasonStatRepository) GetTopPlayersByStat(statField string, uniqueTournamentID int, seasonID int, limit int, positionFilter string) ([]models.TopPlayerStatResult, error) {
	
	if !models.ValidTopPlayerFields[statField] {
		return nil, fmt.Errorf("invalid stat field: %s", statField)
	}

	query := fmt.Sprintf(`
		SELECT ps.player_id, pi.player_name AS player_name, pi.position, ps.%s 
		FROM player_stat ps
		JOIN player_info pi ON ps.player_id = pi.player_id
		WHERE ps.unique_tournament_id = ? AND ps.season_id = ?`, statField)

	args := []interface{}{uniqueTournamentID, seasonID}

	if positionFilter != "" {
		if !models.ValidPositions[positionFilter] {
			return nil, fmt.Errorf("invalid position filter: %s", positionFilter)
		}
		query += " AND pi.position = ?"
		args = append(args, positionFilter)
	}
	
	// Add order by statField descending
	query += fmt.Sprintf(" ORDER BY ps.%s DESC", statField)

	// Add limit if > 0 (no limit if limit <= 0)
	if limit > 0 {
		query += " LIMIT ?"
		args = append(args, limit)
	}

	rows, err := r.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []models.TopPlayerStatResult 
	for rows.Next() {
		var playerID int
		var playerName, position string
		var value float64
	
		if err := rows.Scan(&playerID, &playerName, &position, &value); err != nil {
			return nil, err
		}
	
		results = append(results, models.TopPlayerStatResult{
			PlayerID:   playerID,
			PlayerName: playerName,
			Position:   position,
			StatValue:  value,
		})
	}
	
	return results, nil
}