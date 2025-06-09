package season

import (
	"fmt"
	"log"
	"strings"
	"github.com/plinphon/StatsBanger/backend/models"
	"log"
	"strings"

	"gorm.io/gorm"
	"gorm.io/driver/sqlite"
	"database/sql"
)

type TeamSeasonStatRepository struct {
	db *gorm.DB
}


func NewTeamSeasonStatRepository(dbPath string) (*TeamSeasonStatRepository, error) {
	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		return nil, err
	}
	return &TeamSeasonStatRepository{db: db}, nil
}

/*
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
*/

func (r *TeamSeasonStatRepository) GetMultipleStatsByTeamId(
    statFields []string,
    uniqueTournamentId int,
    seasonId int,
    teamIds []int,
) ([]*models.TeamSeasonStat, error) {
    log.Printf("Requested statFields: %v", statFields)

    // Validate or populate stat fields
    if len(statFields) == 0 {
        statFields = make([]string, 0, len(models.ValidTeamSeasonFields))
        for field := range models.ValidTeamSeasonFields {
            statFields = append(statFields, field)
        }
    } else {
        for _, field := range statFields {
            if field == "" {
                continue
            }
            if !models.ValidTeamSeasonFields[field] {
                return nil, fmt.Errorf("invalid stat field: %s", field)
            }
        }
    }

    // Build base query with preload Team data
    query := r.db.Debug().
        Preload("Team").
        Where("unique_tournament_id = ? AND season_id = ?", uniqueTournamentId, seasonId)


    if len(teamIds) > 0 {
        query = query.Where("team_id IN ?", teamIds)
    }

    var stats []*models.TeamSeasonStat
    if err := query.Find(&stats).Error; err != nil {
        return nil, err
    }

    if len(statFields) == 0 {
        return stats, nil
    }

    // Fetch raw stat values
    columns := "team_id, " + strings.Join(statFields, ", ")
    rows, err := r.db.Raw(
        "SELECT "+columns+" FROM team_stat WHERE unique_tournament_id = ? AND season_id = ?" +
            func() string {
                if len(teamIds) > 0 {
                    return " AND team_id IN ?"
                }
                return ""
            }(),
        func() []interface{} {
            args := []interface{}{uniqueTournamentId, seasonId}
            if len(teamIds) > 0 {
                args = append(args, teamIds)
            }
            return args
        }()...,
    ).Rows()
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    // Map: teamId -> map[fieldName]*float64
    statMap := make(map[int]map[string]*float64)
    for rows.Next() {
        columns := make([]interface{}, len(statFields)+1)
        var teamID int
        columns[0] = &teamID

        values := make([]sql.NullFloat64, len(statFields))
        for i := range statFields {
            columns[i+1] = &values[i]
        }

        if err := rows.Scan(columns...); err != nil {
            return nil, err
        }

        fieldMap := make(map[string]*float64)
        for i, field := range statFields {
            if values[i].Valid {
                val := values[i].Float64
                fieldMap[field] = &val
            }
        }
        statMap[teamID] = fieldMap
    }

    // Attach stats to each team stat struct
    for _, s := range stats {
        if fieldMap, exists := statMap[s.TeamID]; exists {
            s.Stats = fieldMap
        } else {
            s.Stats = map[string]*float64{}
        }
    }

    return stats, nil
}

func (r *TeamSeasonStatRepository) GetTopTeamsByStat(
    statField string,
    uniqueTournamentId int,
    seasonId int,
    limit int,
) ([]models.TopTeamStatResult, error) {

    // Validate statField is allowed for teams
    if !models.ValidTeamSeasonFields[statField] {
        return nil, fmt.Errorf("invalid stat field: %s", statField)
    }

    var results []models.TopTeamStatResult

    // Build the query
    query := r.db.Table("team_stat AS ts").
        Select("ts.team_id, ti.team_name, ts."+statField+" AS stat_value").
        Joins("JOIN team_info ti ON ts.team_id = ti.team_id").
        Where("ts.unique_tournament_id = ? AND ts.season_id = ?", uniqueTournamentId, seasonId).
        Order("ts." + statField + " DESC")

    if limit > 0 {
        query = query.Limit(limit)
    }

    // Run the query
    err := query.Scan(&results).Error
    if err != nil {
        return nil, err
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
