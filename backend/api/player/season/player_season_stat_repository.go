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



/*
func (r *PlayerSeasonStatRepository) GetTopPlayersByStat(statField string, uniqueTournamentId int, seasonId int, limit int, positionFilter string) ([]models.TopPlayerStatResult, error) {
	
	if !models.ValidPlayerSeasonFields[statField] {
		return nil, fmt.Errorf("invalid stat field: %s", statField)
	}

	query := fmt.Sprintf(`
		SELECT ps.player_id, pi.player_name AS player_name, pi.position, ps.%s 
		FROM player_stat ps
		JOIN player_info pi ON ps.player_id = pi.player_id
		WHERE ps.unique_tournament_id = ? AND ps.season_id = ?`, statField)

	args := []interface{}{uniqueTournamentId, seasonId}

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

	log.Printf("Executing SQL:\n%s", query)
	log.Printf("Parameters: %v", args)

	rows, err := r.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []models.TopPlayerStatResult 
	for rows.Next() {
		var playerId int
		var playerName, position string
		var value float64
	
		if err := rows.Scan(&playerId, &playerName, &position, &value); err != nil {
			return nil, err
		}
	
		results = append(results, models.TopPlayerStatResult{
			PlayerId:   playerId,
			PlayerName: playerName,
			Position:   position,
			StatValue:  value,
		})
	}
	
	return results, nil
} 

func (r *PlayerSeasonStatRepository) GetPlayerStatsPercentile(
	statFields []string,
	tournamentId int,
	seasonId int,
	playerId int,
	positionFilter *string,
) (*models.PlayerStatWithMeta, error) {
	if len(statFields) == 0 {
		return nil, fmt.Errorf("no stat fields provided")
	}

	// Validate stat fields
	for _, statField := range statFields {
		if statField == "" {
			continue
		}
		if !models.ValidPlayerSeasonFields[statField] {
			return nil, fmt.Errorf("invalid stat field: %s", statField)
		}
	}
	if positionFilter != nil && !models.ValidPositions[*positionFilter] {
		return nil, fmt.Errorf("invalid position filter: %s", *positionFilter)
	}

	// Build SELECT fields
	selectFields := ""
	if len(statFields) > 0 {
		selectFields = ", ps." + strings.Join(statFields, ", ps.")
	}

	query := fmt.Sprintf(`
		SELECT ps.player_id, pi.player_name, ps.team_id, ti.team_name %s
		FROM player_stat ps
		JOIN player_info pi ON ps.player_id = pi.player_id
		JOIN team_info ti ON ps.team_id = ti.team_id
		WHERE ps.unique_tournament_id = ? AND ps.season_id = ? AND ps.player_id = ?`, selectFields)

	args := []interface{}{tournamentId, seasonId, playerId}
	row := r.db.QueryRow(query, args...)

	// Prepare destinations
	var (
		playerIdOut int
		playerName  string
		teamId      int
		teamName    string
	)
	nullableValues := make([]sql.NullFloat64, len(statFields))
	dest := []interface{}{&playerIdOut, &playerName, &teamId, &teamName}
	for i := range nullableValues {
		dest = append(dest, &nullableValues[i])
	}

	// Scan once
	if err := row.Scan(dest...); err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("player %d stats not found", playerId)
		}
		return nil, err
	}

	// Calculate percentiles
	statsMap := make(map[string]*float64)
	for i, statField := range statFields {
		if !nullableValues[i].Valid {
			statsMap[statField] = nil
			continue
		}
		playerValue := nullableValues[i].Float64

		// Count below
		queryBelow := fmt.Sprintf(`
			SELECT COUNT(*)
			FROM player_stat ps
			JOIN player_info pi ON ps.player_id = pi.player_id
			WHERE ps.unique_tournament_id = ? AND ps.season_id = ? AND ps.%s IS NOT NULL AND ps.%s < ?`, statField, statField)

		argsBelow := []interface{}{tournamentId, seasonId, playerValue}
		if positionFilter != nil {
			queryBelow += " AND pi.position = ?"
			argsBelow = append(argsBelow, *positionFilter)
		}
		var numBelow int
		if err := r.db.QueryRow(queryBelow, argsBelow...).Scan(&numBelow); err != nil {
			return nil, fmt.Errorf("failed to count players below for %s: %w", statField, err)
		}

		// Count total
		queryTotal := fmt.Sprintf(`
			SELECT COUNT(*)
			FROM player_stat ps
			JOIN player_info pi ON ps.player_id = pi.player_id
			WHERE ps.unique_tournament_id = ? AND ps.season_id = ? AND ps.%s IS NOT NULL`, statField)

		argsTotal := []interface{}{tournamentId, seasonId}
		if positionFilter != nil {
			queryTotal += " AND pi.position = ?"
			argsTotal = append(argsTotal, *positionFilter)
		}
		var total int
		if err := r.db.QueryRow(queryTotal, argsTotal...).Scan(&total); err != nil {
			return nil, fmt.Errorf("failed to count total players for %s: %w", statField, err)
		}
		if total == 0 {
			statsMap[statField] = nil
			continue
		}
		p := float64(numBelow) / float64(total)
		statsMap[statField] = &p
	}

	return &models.PlayerStatWithMeta{
		PlayerId:   playerIdOut,
		PlayerName: playerName,
		TeamId:     teamId,
		TeamName:   teamName,
		Stats:      statsMap,
	}, nil
}
*/