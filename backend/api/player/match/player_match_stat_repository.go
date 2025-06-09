package match

import (
	"database/sql"

	"github.com/plinphon/StatsBanger/backend/models"
	"fmt"
	"strings"
	"gorm.io/gorm"
    "gorm.io/driver/sqlite"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

type PlayerMatchStatRepository struct {
    db *gorm.DB
}

func NewPlayerMatchStatRepository(dbPath string) (*PlayerMatchStatRepository, error) {
    db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
    if err != nil {
        return nil, err
    }
    return &PlayerMatchStatRepository{db: db}, nil
}
/*
func (r *PlayerMatchStatRepository) Create(stat models.PlayerMatchStat) error {
	query := `
	INSERT INTO player_match_stat (
		match_id, player_id, total_pass, accurate_pass, total_long_balls, accurate_long_balls,
		goal_assist, saved_shots_from_inside_the_box, saves, minutes_played, touches, rating,
		possession_lost_ctrl, key_pass, goals_prevented, aerial_won, duel_lost, duel_won,
		on_target_scoring_attempt, goals, total_clearance, interception_won, total_tackle,
		was_fouled, fouls, expected_goals, expected_assists, aerial_lost, challenge_lost,
		total_cross, total_contest, won_contest, outfielder_block, big_chance_created,
		dispossessed, shot_off_target, accurate_cross, total_offside, blocked_scoring_attempt,
		penalty_won, penalty_conceded, big_chance_missed, total_keeper_sweeper,
		accurate_keeper_sweeper, good_high_claim, punches, clearance_off_line,
		hit_woodwork, error_lead_to_a_shot, own_goals, last_man_tackle,
		error_lead_to_a_goal, penalty_save, penalty_miss
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`

	_, err := r.db.Exec(query,
		stat.MatchId, stat.PlayerId, stat.TotalPass, stat.AccuratePass, stat.TotalLongBalls,
		stat.AccurateLongBalls, stat.GoalAssist, stat.SavedShotsFromInsideTheBox, stat.Saves,
		stat.MinutesPlayed, stat.Touches, stat.Rating, stat.PossessionLostCtrl, stat.KeyPass,
		stat.GoalsPrevented, stat.AerialWon, stat.DuelLost, stat.DuelWon, stat.OnTargetScoringAttempt,
		stat.Goals, stat.TotalClearance, stat.InterceptionWon, stat.TotalTackle, stat.WasFouled,
		stat.Fouls, stat.ExpectedGoals, stat.ExpectedAssists, stat.AerialLost, stat.ChallengeLost,
		stat.TotalCross, stat.TotalContest, stat.WonContest, stat.OutfielderBlock,
		stat.BigChanceCreated, stat.Dispossessed, stat.ShotOffTarget, stat.AccurateCross,
		stat.TotalOffside, stat.BlockedScoringAttempt, stat.PenaltyWon, stat.PenaltyConceded,
		stat.BigChanceMissed, stat.TotalKeeperSweeper, stat.AccurateKeeperSweeper,
		stat.GoodHighClaim, stat.Punches, stat.ClearanceOffLine, stat.HitWoodwork,
		stat.ErrorLeadToAShot, stat.OwnGoals, stat.LastManTackle, stat.ErrorLeadToAGoal,
		stat.PenaltySave, stat.PenaltyMiss,
	)

	return err
}
*/
func (r *PlayerMatchStatRepository) GetByMatchId(matchId int, statFields []string) ([]*models.PlayerMatchStat, error) {
	var stats []*models.PlayerMatchStat

	// Validate or populate stat fields
	if len(statFields) == 0 {
		statFields = make([]string, 0, len(models.ValidPlayerMatchFields))
		for field := range models.ValidPlayerMatchFields {
			statFields = append(statFields, field)
		}
	} else {
		// Remove empty fields and validate
		validFields := make([]string, 0, len(statFields))
		for _, field := range statFields {
			if field == "" {
				continue
			}
			if !models.ValidPlayerMatchFields[field] {
				return nil, fmt.Errorf("invalid stat field: %s", field)
			}
			validFields = append(validFields, field)
		}
		statFields = validFields
	}

	// Load basic player match stat rows and relations
	err := r.db.
		Preload("Match").
		Preload("Player").
		Preload("Team").
		Where("match_id = ?", matchId).
		Find(&stats).Error
	if err != nil {
		return nil, fmt.Errorf("failed to load player match stats: %w", err)
	}

	if len(stats) == 0 {
		return stats, nil
	}

	// Raw SQL to get only stat fields by match_id
	columns := "player_id, " + strings.Join(statFields, ", ")
	query := "SELECT " + columns + " FROM player_match_stat WHERE match_id = ?"

	rows, err := r.db.Raw(query, matchId).Rows()
	if err != nil {
		return nil, fmt.Errorf("failed to execute stats query: %w", err)
	}
	defer func() {
		if err := rows.Close(); err != nil {
			// Log the error if closing fails
			log.Printf("failed to close rows: %v", err)
		}
	}()

	// Build stat map: player_id → {field: value}
	statMap := make(map[int]map[string]*float64)
	for rows.Next() {
		// Prepare scan targets
		var playerID int
		scanTargets := make([]interface{}, len(statFields)+1)
		scanTargets[0] = &playerID

		values := make([]sql.NullFloat64, len(statFields))
		for i := range values {
			scanTargets[i+1] = &values[i]
		}

		if err := rows.Scan(scanTargets...); err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}

		fieldMap := make(map[string]*float64, len(statFields))
		for i, field := range statFields {
			if values[i].Valid {
				val := values[i].Float64
				fieldMap[field] = &val
			}
		}
		statMap[playerID] = fieldMap
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error: %w", err)
	}

	// Attach stats to loaded models
	for _, stat := range stats {
		if fieldMap, exists := statMap[stat.PlayerId]; exists {
			stat.Stats = fieldMap
		} else {
			stat.Stats = make(map[string]*float64)
		}
	}

	return stats, nil
}

func (r *PlayerMatchStatRepository) GetByPlayerID(playerID int) ([]models.PlayerMatchStat, error) {
	var stats []models.PlayerMatchStat

	err := r.db.
		Preload("Match").
		Preload("Player").
		Preload("Team").
		Where("player_id = ?", playerID).
		Find(&stats).Error

	if err != nil {
		return nil, err
	}

	return stats, nil
}

