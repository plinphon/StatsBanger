package season

import (
	"database/sql"
	"fmt"
	"log"
	"strings"
	"github.com/plinphon/StatsBanger/backend/models"

    "gorm.io/gorm"
    "gorm.io/driver/sqlite"
)

type PlayerSeasonStatRepository struct {
	db *gorm.DB
}

func NewPlayerSeasonStatRepository(dbPath string) (*PlayerSeasonStatRepository, error) {
    db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
    if err != nil {
        return nil, err
    }
    return &PlayerSeasonStatRepository{db: db}, nil
}
/*
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
		stat.PlayerId, stat.UniqueTournamentId, stat.SeasonId, stat.TeamId, stat.AccurateLongBalls,
		stat.AccurateLongBallsPercentage, stat.AccuratePasses, stat.AccuratePassesPercentage,
		stat.AerialDuelsWon, stat.Assists, stat.BigChancesCreated, stat.BigChancesMissed,
		stat.CleanSheet, stat.DribbledPast, stat.ErrorLeadToGoal, stat.ExpectedAssists,
		stat.ExpectedGoals, stat.Goals, stat.GoalsAssistsSum, stat.GoalsConceded, stat.GoalsPrevented,
		stat.Interceptions, stat.KeyPasses, stat.MinutesPlayed, stat.PassToAssist, stat.PenaltyFaced,
		stat.PenaltySave, stat.Rating, stat.RedCards, stat.SavedShotsFromInsideTheBox, stat.Saves,
		stat.SuccessfulDribbles, stat.Tackles, stat.YellowCards, stat.TotalRating, stat.CountRating,
		stat.TotalLongBalls, stat.TotalPasses, stat.ShotsFromInsideTheBox, stat.Appearances,
		stat.Type, stat.Id, stat.AccurateCrosses, stat.AccurateCrossesPercentage, stat.BlockedShots,
		stat.ShotsOnTarget, stat.TotalShots, stat.TotalCross,
	)

	return err
} */

func (r *PlayerSeasonStatRepository) GetMultipleStatsByPlayerId(
	statFields []string,
	uniqueTournamentId int,
	seasonId int,
	playerIdFields []int,
) ([]*models.PlayerSeasonStat, error) {
	log.Printf("Requested statFields: %v", statFields)

	// Validate or populate stat fields
	if len(statFields) == 0 {
		statFields = make([]string, 0, len(models.ValidPlayerSeasonFields))
		for field := range models.ValidPlayerSeasonFields {
			statFields = append(statFields, field)
		}
	} else {
		for _, field := range statFields {
			if field == "" {
				continue
			}
			if !models.ValidPlayerSeasonFields[field] {
				return nil, fmt.Errorf("invalid stat field: %s", field)
			}
		}
	}

	// Build base query
	query := r.db.Debug().
		Preload("Player").
		Preload("Team").
		Where("unique_tournament_id = ? AND season_id = ?", uniqueTournamentId, seasonId)

	if len(playerIdFields) > 0 {
		query = query.Where("player_id IN (?)", playerIdFields)
	}

	var stats []*models.PlayerSeasonStat
	if err := query.Find(&stats).Error; err != nil {
		return nil, err
	}

	// If no stat fields, return basic info only
	if len(statFields) == 0 {
		return stats, nil
	}

	// Prepare to fetch raw stats
	columns := "player_id, " + strings.Join(statFields, ", ")
	rows, err := r.db.Raw(
		"SELECT " + columns + " FROM player_stat WHERE unique_tournament_id = ? AND season_id = ?" + 
			func() string {
				if len(playerIdFields) > 0 {
					return " AND player_id IN ?"
				}
				return ""
			}(),
		func() []interface{} {
			args := []interface{}{uniqueTournamentId, seasonId}
			if len(playerIdFields) > 0 {
				args = append(args, playerIdFields)
			}
			return args
		}()...,
	).Rows()
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Build playerId -> stat map
	statMap := make(map[int]map[string]*float64)
	for rows.Next() {
		columns := make([]interface{}, len(statFields)+1)
		var playerID int
		columns[0] = &playerID

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
		statMap[playerID] = fieldMap
	}

	// Attach stats to each player
	for _, s := range stats {
		if fieldMap, exists := statMap[s.PlayerId]; exists {
			s.Stats = fieldMap
		} else {
			s.Stats = map[string]*float64{} // Empty if no stat row
		}
	}

	return stats, nil
}


func (r *PlayerSeasonStatRepository) GetTopPlayersByStat(
	statField string,
	uniqueTournamentId int,
	seasonId int,
	limit int,
	positionFilter string,
) ([]models.TopPlayerStatResult, error) {

	if !models.ValidPlayerSeasonFields[statField] {

		return nil, fmt.Errorf("invalid stat field: %s", statField)
	}

	if positionFilter != "" && !models.ValidPositions[positionFilter] {
		return nil, fmt.Errorf("invalid position filter: %s", positionFilter)
	}

	var results []models.TopPlayerStatResult

	// Base query
	query := r.db.Table("player_stat AS ps").
		Select("ps.player_id, pi.player_name, pi.position, ps."+statField+" AS stat_value").
		Joins("JOIN player_info pi ON ps.player_id = pi.player_id").
		Where("ps.unique_tournament_id = ? AND ps.season_id = ?", uniqueTournamentId, seasonId)

	// Optional position filter
	if positionFilter != "" {
		query = query.Where("pi.position = ?", positionFilter)
	}

	// Add ordering and limit
	query = query.Order("ps." + statField + " DESC")
	if limit > 0 {
		query = query.Limit(limit)
	}


	// Execute
	err := query.Scan(&results).Error

	if err != nil {
		return nil, err
	}

	return results, nil
}
