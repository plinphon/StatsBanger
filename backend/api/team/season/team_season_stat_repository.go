package season

import (
	"database/sql"
	"errors"
	"fmt"
	"github.com/plinphon/StatsBanger/backend/models"
	"log"
	"strings"

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
			id, team_id, unique_tournament_id, season_id,
			goals_scored, goals_conceded, own_goals, assists, shots,
			penalty_goals, penalties_taken, free_kick_goals, free_kick_shots,
			goals_from_inside_the_box, goals_from_outside_the_box, shots_from_inside_the_box,
			shots_from_outside_the_box, headed_goals, left_foot_goals, right_foot_goals,
			big_chances, big_chances_created, big_chances_missed, shots_on_target,
			shots_off_target, blocked_scoring_attempt, successful_dribbles, dribble_attempts,
			corners, hit_woodwork, fast_breaks, fast_break_goals, fast_break_shots,
			average_ball_possession, total_passes, accurate_passes, accurate_passes_percentage,
			total_own_half_passes, accurate_own_half_passes, accurate_own_half_passes_percentage,
			total_opposition_half_passes, accurate_opposition_half_passes, accurate_opposition_half_passes_percentage,
			total_long_balls, accurate_long_balls, accurate_long_balls_percentage, total_crosses,
			accurate_crosses, accurate_crosses_percentage, clean_sheets, tackles, interceptions,
			saves, errors_leading_to_goal, errors_leading_to_shot, penalties_committed,
			penalty_goals_conceded, clearances, clearances_off_line, last_man_tackles,
			total_duels, duels_won, duels_won_percentage, total_ground_duels,
			ground_duels_won, ground_duels_won_percentage, total_aerial_duels,
			aerial_duels_won, aerial_duels_won_percentage, possession_lost,
			offsides, fouls, yellow_cards, yellow_red_cards, red_cards,
			accurate_final_third_passes_against, accurate_opposition_half_passes_against,
			accurate_own_half_passes_against, accurate_passes_against, big_chances_against,
			big_chances_created_against, big_chances_missed_against, clearances_against,
			corners_against, crosses_successful_against, crosses_total_against,
			dribble_attempts_total_against, dribble_attempts_won_against,
			errors_leading_to_goal_against, errors_leading_to_shot_against, hit_woodwork_against,
			interceptions_against, key_passes_against, long_balls_successful_against
		) VALUES (
			?, ?, ?, ?,
			?, ?, ?, ?, ?,
			?, ?, ?, ?,
			?, ?, ?,
			?, ?, ?, ?,
			?, ?, ?, ?,
			?, ?, ?, ?,
			?, ?, ?, ?, ?,
			?, ?, ?, ?,
			?, ?, ?,
			?, ?, ?,
			?, ?, ?, ?,
			?, ?, ?, ?, ?,
			?, ?, ?, ?,
			?, ?, ?, ?,
			?, ?, ?, ?,
			?, ?, ?, ?, ?,
			?, ?, ?, ?,
			?, ?, ?, ?,
			?, ?, ?, ?,
			?, ?, ?
		)
	`

	_, err := r.db.Exec(query,
		stat.ID, stat.TeamID, stat.UniqueTournamentID, stat.SeasonID,
		stat.GoalsScored, stat.GoalsConceded, stat.OwnGoals, stat.Assists, stat.Shots,
		stat.PenaltyGoals, stat.PenaltiesTaken, stat.FreeKickGoals, stat.FreeKickShots,
		stat.GoalsFromInsideTheBox, stat.GoalsFromOutsideTheBox, stat.ShotsFromInsideTheBox,
		stat.ShotsFromOutsideTheBox, stat.HeadedGoals, stat.LeftFootGoals, stat.RightFootGoals,
		stat.BigChances, stat.BigChancesCreated, stat.BigChancesMissed, stat.ShotsOnTarget,
		stat.ShotsOffTarget, stat.BlockedScoringAttempt, stat.SuccessfulDribbles, stat.DribbleAttempts,
		stat.Corners, stat.HitWoodwork, stat.FastBreaks, stat.FastBreakGoals, stat.FastBreakShots,
		stat.AverageBallPossession, stat.TotalPasses, stat.AccuratePasses, stat.AccuratePassesPercentage,
		stat.TotalOwnHalfPasses, stat.AccurateOwnHalfPasses, stat.AccurateOwnHalfPassesPercentage,
		stat.TotalOppositionHalfPasses, stat.AccurateOppositionHalfPasses, stat.AccurateOppositionHalfPassesPercentage,
		stat.TotalLongBalls, stat.AccurateLongBalls, stat.AccurateLongBallsPercentage, stat.TotalCrosses,
		stat.AccurateCrosses, stat.AccurateCrossesPercentage, stat.CleanSheets, stat.Tackles, stat.Interceptions,
		stat.Saves, stat.ErrorsLeadingToGoal, stat.ErrorsLeadingToShot, stat.PenaltiesCommitted,
		stat.PenaltyGoalsConceded, stat.Clearances, stat.ClearancesOffLine, stat.LastManTackles,
		stat.TotalDuels, stat.DuelsWon, stat.DuelsWonPercentage, stat.TotalGroundDuels,
		stat.GroundDuelsWon, stat.GroundDuelsWonPercentage, stat.TotalAerialDuels,
		stat.AerialDuelsWon, stat.AerialDuelsWonPercentage, stat.PossessionLost,
		stat.Offsides, stat.Fouls, stat.YellowCards, stat.YellowRedCards, stat.RedCards,
		stat.AccurateFinalThirdPassesAgainst, stat.AccurateOppositionHalfPassesAgainst,
		stat.AccurateOwnHalfPassesAgainst, stat.AccuratePassesAgainst, stat.BigChancesAgainst,
		stat.BigChancesCreatedAgainst, stat.BigChancesMissedAgainst, stat.ClearancesAgainst,
		stat.CornersAgainst, stat.CrossesSuccessfulAgainst, stat.CrossesTotalAgainst,
		stat.DribbleAttemptsTotalAgainst, stat.DribbleAttemptsWonAgainst,
		stat.ErrorsLeadingToGoalAgainst, stat.ErrorsLeadingToShotAgainst, stat.HitWoodworkAgainst,
		stat.InterceptionsAgainst, stat.KeyPassesAgainst, stat.LongBallsSuccessfulAgainst,
	)

	return err
}

func (r *TeamSeasonStatRepository) GetByID(uniqueTournamentID int, seasonID int, teamID int) (*models.TeamSeasonStat, error) {
	query := `
		SELECT
			id, team_id, unique_tournament_id, season_id,
			goals_scored, goals_conceded, own_goals, assists, shots,
			penalty_goals, penalties_taken, free_kick_goals, free_kick_shots,
			goals_from_inside_the_box, goals_from_outside_the_box, shots_from_inside_the_box,
			shots_from_outside_the_box, headed_goals, left_foot_goals, right_foot_goals,
			big_chances, big_chances_created, big_chances_missed, shots_on_target,
			shots_off_target, blocked_scoring_attempt, successful_dribbles, dribble_attempts,
			corners, hit_woodwork, fast_breaks, fast_break_goals, fast_break_shots,
			average_ball_possession, total_passes, accurate_passes, accurate_passes_percentage,
			total_own_half_passes, accurate_own_half_passes, accurate_own_half_passes_percentage,
			total_opposition_half_passes, accurate_opposition_half_passes, accurate_opposition_half_passes_percentage,
			total_long_balls, accurate_long_balls, accurate_long_balls_percentage, total_crosses,
			accurate_crosses, accurate_crosses_percentage, clean_sheets, tackles, interceptions,
			saves, errors_leading_to_goal, errors_leading_to_shot, penalties_committed,
			penalty_goals_conceded, clearances, clearances_off_line, last_man_tackles,
			total_duels, duels_won, duels_won_percentage, total_ground_duels,
			ground_duels_won, ground_duels_won_percentage, total_aerial_duels,
			aerial_duels_won, aerial_duels_won_percentage, possession_lost,
			offsides, fouls, yellow_cards, yellow_red_cards, red_cards,
			accurate_final_third_passes_against, accurate_opposition_half_passes_against,
			accurate_own_half_passes_against, accurate_passes_against, big_chances_against,
			big_chances_created_against, big_chances_missed_against, clearances_against,
			corners_against, crosses_successful_against, crosses_total_against,
			dribble_attempts_total_against, dribble_attempts_won_against,
			errors_leading_to_goal_against, errors_leading_to_shot_against, hit_woodwork_against,
			interceptions_against, key_passes_against, long_balls_successful_against
		FROM team_stat
		WHERE unique_tournament_id = ? AND season_id = ? AND team_id = ?
	`

	stat := models.TeamSeasonStat{}

	err := r.db.QueryRow(query, uniqueTournamentID, seasonID, teamID).Scan(
		&stat.ID, &stat.TeamID, &stat.UniqueTournamentID, &stat.SeasonID,
		&stat.GoalsScored, &stat.GoalsConceded, &stat.OwnGoals, &stat.Assists, &stat.Shots,
		&stat.PenaltyGoals, &stat.PenaltiesTaken, &stat.FreeKickGoals, &stat.FreeKickShots,
		&stat.GoalsFromInsideTheBox, &stat.GoalsFromOutsideTheBox, &stat.ShotsFromInsideTheBox,
		&stat.ShotsFromOutsideTheBox, &stat.HeadedGoals, &stat.LeftFootGoals, &stat.RightFootGoals,
		&stat.BigChances, &stat.BigChancesCreated, &stat.BigChancesMissed, &stat.ShotsOnTarget,
		&stat.ShotsOffTarget, &stat.BlockedScoringAttempt, &stat.SuccessfulDribbles, &stat.DribbleAttempts,
		&stat.Corners, &stat.HitWoodwork, &stat.FastBreaks, &stat.FastBreakGoals, &stat.FastBreakShots,
		&stat.AverageBallPossession, &stat.TotalPasses, &stat.AccuratePasses, &stat.AccuratePassesPercentage,
		&stat.TotalOwnHalfPasses, &stat.AccurateOwnHalfPasses, &stat.AccurateOwnHalfPassesPercentage,
		&stat.TotalOppositionHalfPasses, &stat.AccurateOppositionHalfPasses, &stat.AccurateOppositionHalfPassesPercentage,
		&stat.TotalLongBalls, &stat.AccurateLongBalls, &stat.AccurateLongBallsPercentage, &stat.TotalCrosses,
		&stat.AccurateCrosses, &stat.AccurateCrossesPercentage, &stat.CleanSheets, &stat.Tackles, &stat.Interceptions,
		&stat.Saves, &stat.ErrorsLeadingToGoal, &stat.ErrorsLeadingToShot, &stat.PenaltiesCommitted,
		&stat.PenaltyGoalsConceded, &stat.Clearances, &stat.ClearancesOffLine, &stat.LastManTackles,
		&stat.TotalDuels, &stat.DuelsWon, &stat.DuelsWonPercentage, &stat.TotalGroundDuels,
		&stat.GroundDuelsWon, &stat.GroundDuelsWonPercentage, &stat.TotalAerialDuels,
		&stat.AerialDuelsWon, &stat.AerialDuelsWonPercentage, &stat.PossessionLost,
		&stat.Offsides, &stat.Fouls, &stat.YellowCards, &stat.YellowRedCards, &stat.RedCards,
		&stat.AccurateFinalThirdPassesAgainst, &stat.AccurateOppositionHalfPassesAgainst,
		&stat.AccurateOwnHalfPassesAgainst, &stat.AccuratePassesAgainst, &stat.BigChancesAgainst,
		&stat.BigChancesCreatedAgainst, &stat.BigChancesMissedAgainst, &stat.ClearancesAgainst,
		&stat.CornersAgainst, &stat.CrossesSuccessfulAgainst, &stat.CrossesTotalAgainst,
		&stat.DribbleAttemptsTotalAgainst, &stat.DribbleAttemptsWonAgainst,
		&stat.ErrorsLeadingToGoalAgainst, &stat.ErrorsLeadingToShotAgainst, &stat.HitWoodworkAgainst,
		&stat.InterceptionsAgainst, &stat.KeyPassesAgainst, &stat.LongBallsSuccessfulAgainst,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil // Not found
		}
		return nil, err
	}
	return &stat, nil
}

func (r *TeamSeasonStatRepository) GetTopTeamsByStat(statField string, uniqueTournamentID int, seasonID int, limit int) ([]models.TopTeamStatResult, error) {

    if !models.ValidTopTeamFields[statField] {
        return nil, fmt.Errorf("invalid stat field: %s", statField)
    }

    query := fmt.Sprintf(`
        SELECT ts.team_id, ti.team_name, ts.%s
        FROM team_stat ts
        JOIN team_info ti ON ts.team_id = ti.team_id
        WHERE ts.unique_tournament_id = ? AND ts.season_id = ?
        ORDER BY ts.%s DESC
    `, statField, statField)

    args := []interface{}{uniqueTournamentID, seasonID}

    if limit > 0 {
        query += " LIMIT ?"
        args = append(args, limit)
    }

    rows, err := r.db.Query(query, args...)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var results []models.TopTeamStatResult
    for rows.Next() {
        var teamID int
        var teamName string
        var value float64

        if err := rows.Scan(&teamID, &teamName, &value); err != nil {
            return nil, err
        }

        results = append(results, models.TopTeamStatResult{
            TeamID:    teamID,
            TeamName:  teamName,
            StatValue: value,
        })
    }

    return results, nil
}

func (r *TeamSeasonStatRepository) GetMultipleStatsByTeamID(
	statFields []string,
	uniqueTournamentID int,
	seasonID int,
	teamID int,
) (*models.TeamStatWithMeta, error) {
	log.Printf("statFields: %v", statFields)

	if len(statFields) == 0 {
		// Use all valid stat fields for SELECT
		statFields = make([]string, 0, len(models.ValidTopTeamFields))
		for field := range models.ValidTopTeamFields {
			statFields = append(statFields, field)
		}
	} else {
		// Validate requested fields
		for _, field := range statFields {
			if field == "" {
				continue // Skip empty fields
			}
			if !models.ValidTopTeamFields[field] {
				return nil, fmt.Errorf("invalid stat field: %s", field)
			}
		}
	}

	// Join stat fields to SELECT clause
	selectFields := ""
	if len(statFields) > 0 {
		selectFields = ", ts." + strings.Join(statFields, ", ts.")
	}

	query := fmt.Sprintf(`
		SELECT ts.team_id, ti.team_name %s
		FROM team_stat ts
		JOIN team_info ti ON ts.team_id = ti.team_id
		WHERE ts.unique_tournament_id = ? AND ts.season_id = ? AND ts.team_id = ?`, selectFields)

	args := []interface{}{uniqueTournamentID, seasonID, teamID}
	row := r.db.QueryRow(query, args...)

	var (
		teamIDOut   int
		teamName    string
	)

	nullableValues := make([]sql.NullFloat64, len(statFields))
	dest := make([]interface{}, 0, 2+len(statFields))

	// Append pointers to fixed fields
	dest = append(dest, &teamIDOut, &teamName)

	// Append pointers to dynamic stat values
	for i := range nullableValues {
		dest = append(dest, &nullableValues[i])
	}

	// Scan result
	if err := row.Scan(dest...); err == sql.ErrNoRows {
		return nil, errors.New("team stats not found")
	} else if err != nil {
		return nil, err
	}

	// Build stats map
	statsMap := make(map[string]*float64)
	for i, field := range statFields {
		if nullableValues[i].Valid {
			statsMap[field] = &nullableValues[i].Float64
		} else {
			statsMap[field] = nil
		}
	}

	return &models.TeamStatWithMeta{
		TeamID:   teamIDOut,
		TeamName: teamName,
		Stats:    statsMap,
	}, nil
}
