package season

import (
	"database/sql"
	"errors"

	"github.com/plinphon/StatsBanger/backend/models"

	_ "github.com/mattn/go-sqlite3"
)

type TeamSeasonStatRepository struct {
	db *sql.DB
}

func NewTeamSeasonStatRepository(dbPath string) (*TeamSeasonStatRepository, error) {
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		return nil, err
	}
	if err = db.Ping(); err != nil {
		return nil, err
	}
	return &TeamSeasonStatRepository{db: db}, nil
}

func (r *TeamSeasonStatRepository) Create(stat models.TeamSeasonStat) error {
	query := `
	INSERT INTO team_stat (
		unique_tournament_id, season_id, team_id,
		accurate_long_balls, accurate_long_balls_percentage,
		accurate_passes, accurate_passes_percentage,
		aerial_duels_won, assists, big_chances_created,
		big_chances_missed, clean_sheet, dribbled_past,
		error_lead_to_goal, expected_assists, expected_goals,
		goals, goals_assists_sum, goals_conceded, goals_prevented,
		interceptions, key_passes, minutes_played, pass_to_assist,
		penalty_faced, penalty_save, rating, red_cards,
		saved_shots_from_inside_the_box, saves, successful_dribbles,
		tackles, yellow_cards, total_rating, count_rating,
		total_long_balls, total_passes, shots_from_inside_the_box,
		appearances, type, id, accurate_crosses,
		accurate_crosses_percentage, blocked_shots,
		shots_on_target, total_shots, total_cross
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := r.db.Exec(query,
		stat.UniqueTournamentID, stat.SeasonID, stat.TeamID,
		stat.AccurateLongBalls, stat.AccurateLongBallsPercentage,
		stat.AccuratePasses, stat.AccuratePassesPercentage,
		stat.AerialDuelsWon, stat.Assists, stat.BigChancesCreated,
		stat.BigChancesMissed, stat.CleanSheet, stat.DribbledPast,
		stat.ErrorLeadToGoal, stat.ExpectedAssists, stat.ExpectedGoals,
		stat.Goals, stat.GoalsAssistsSum, stat.GoalsConceded, stat.GoalsPrevented,
		stat.Interceptions, stat.KeyPasses, stat.MinutesPlayed, stat.PassToAssist,
		stat.PenaltyFaced, stat.PenaltySave, stat.Rating, stat.RedCards,
		stat.SavedShotsFromInsideTheBox, stat.Saves, stat.SuccessfulDribbles,
		stat.Tackles, stat.YellowCards, stat.TotalRating, stat.CountRating,
		stat.TotalLongBalls, stat.TotalPasses, stat.ShotsFromInsideTheBox,
		stat.Appearances, stat.Type, stat.ID, stat.AccurateCrosses,
		stat.AccurateCrossesPercentage, stat.BlockedShots,
		stat.ShotsOnTarget, stat.TotalShots, stat.TotalCross,
	)

	return err
}


func (r *TeamSeasonStatRepository) GetByID(uniqueTournamentID int, seasonID int, teamID int) (*models.TeamSeasonStat, error) {
	query := `SELECT 
		unique_tournament_id, season_id, team_id,
		COALESCE(accurate_long_balls, 0), COALESCE(accurate_long_balls_percentage, 0),
		COALESCE(accurate_passes, 0), COALESCE(accurate_passes_percentage, 0),
		COALESCE(aerial_duels_won, 0), COALESCE(assists, 0), COALESCE(big_chances_created, 0),
		COALESCE(big_chances_missed, 0), COALESCE(clean_sheet, 0), COALESCE(dribbled_past, 0),
		COALESCE(error_lead_to_goal, 0), COALESCE(expected_assists, 0), COALESCE(expected_goals, 0),
		COALESCE(goals, 0), COALESCE(goals_assists_sum, 0), COALESCE(goals_conceded, 0), COALESCE(goals_prevented, 0),
		COALESCE(interceptions, 0), COALESCE(key_passes, 0), COALESCE(minutes_played, 0), COALESCE(pass_to_assist, 0),
		COALESCE(penalty_faced, 0), COALESCE(penalty_save, 0), COALESCE(rating, 0), COALESCE(red_cards, 0),
		COALESCE(saved_shots_from_inside_the_box, 0), COALESCE(saves, 0), COALESCE(successful_dribbles, 0),
		COALESCE(tackles, 0), COALESCE(yellow_cards, 0), COALESCE(total_rating, 0), COALESCE(count_rating, 0),
		COALESCE(total_long_balls, 0), COALESCE(total_passes, 0), COALESCE(shots_from_inside_the_box, 0),
		COALESCE(appearances, 0), COALESCE(type, 0), COALESCE(id, 0), COALESCE(accurate_crosses, 0),
		COALESCE(accurate_crosses_percentage, 0), COALESCE(blocked_shots, 0),
		COALESCE(shots_on_target, 0), COALESCE(total_shots, 0), COALESCE(total_cross, 0)
	FROM team_stat
	WHERE unique_tournament_id = ? AND season_id = ? AND team_id = ?`

	row := r.db.QueryRow(query, uniqueTournamentID, seasonID, teamID)

	var stat models.TeamSeasonStat

	err := row.Scan(
		&stat.UniqueTournamentID, &stat.SeasonID, &stat.TeamID,
		&stat.AccurateLongBalls, &stat.AccurateLongBallsPercentage,
		&stat.AccuratePasses, &stat.AccuratePassesPercentage,
		&stat.AerialDuelsWon, &stat.Assists, &stat.BigChancesCreated,
		&stat.BigChancesMissed, &stat.CleanSheet, &stat.DribbledPast,
		&stat.ErrorLeadToGoal, &stat.ExpectedAssists, &stat.ExpectedGoals,
		&stat.Goals, &stat.GoalsAssistsSum, &stat.GoalsConceded, &stat.GoalsPrevented,
		&stat.Interceptions, &stat.KeyPasses, &stat.MinutesPlayed, &stat.PassToAssist,
		&stat.PenaltyFaced, &stat.PenaltySave, &stat.Rating, &stat.RedCards,
		&stat.SavedShotsFromInsideTheBox, &stat.Saves, &stat.SuccessfulDribbles,
		&stat.Tackles, &stat.YellowCards, &stat.TotalRating, &stat.CountRating,
		&stat.TotalLongBalls, &stat.TotalPasses, &stat.ShotsFromInsideTheBox,
		&stat.Appearances, &stat.Type, &stat.ID, &stat.AccurateCrosses,
		&stat.AccurateCrossesPercentage, &stat.BlockedShots,
		&stat.ShotsOnTarget, &stat.TotalShots, &stat.TotalCross,
	)

	if err == sql.ErrNoRows {
		return nil, errors.New("team season stat not found")
	} else if err != nil {
		return nil, err
	}

	return &stat, nil
}
