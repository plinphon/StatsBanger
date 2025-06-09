package match

import (
	"database/sql"

	"github.com/plinphon/StatsBanger/backend/models"
	"fmt"
	"strings"
	"gorm.io/gorm"
    "gorm.io/driver/sqlite"

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
		stat.MatchID, stat.PlayerID, stat.TotalPass, stat.AccuratePass, stat.TotalLongBalls,
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
func (r *PlayerMatchStatRepository) GetByMatchID(matchID int, playerIdFields []int, statFields []string) ([]*models.PlayerMatchStat, error) {
	var stats []*models.PlayerMatchStat

	// Validate or populate stat fields
	if len(statFields) == 0 {
		statFields = make([]string, 0, len(models.ValidPlayerMatchFields))
		for field := range models.ValidPlayerMatchFields {
			statFields = append(statFields, field)
		}
	} else {
		for _, field := range statFields {
			if field == "" {
				continue
			}
			if !models.ValidPlayerMatchFields[field] {
				return nil, fmt.Errorf("invalid stat field: %s", field)
			}
		}
	}

	// Load player match stats with relations
	err := r.db.
		Preload("Player").
		Preload("Player.Team").
		Preload("Match").
		Where("match_id = ?", matchID).
		Find(&stats).Error
	if err != nil {
		return nil, err
	}

	// Set derived teams
	for _, stat := range stats {
		stat.Team = stat.Player.Team
	}

	// ---- Fetch Raw PlayerStat Data ----
	// Build player IDs from loaded stats (unless specific IDs provided)
	var playerIDs []int
	if len(playerIdFields) > 0 {
		playerIDs = playerIdFields
	} else {
		playerIDs = make([]int, 0, len(stats))
		for _, s := range stats {
			playerIDs = append(playerIDs, s.PlayerID)
		}
	}

	// Raw stat query
	columns := "player_id, " + strings.Join(statFields, ", ")
	query := "SELECT " + columns + " FROM player_stat WHERE player_id IN ?"
	rows, err := r.db.Raw(query, playerIDs).Rows()
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Map playerID -> field map
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

	// Attach stat map to each player
	for _, s := range stats {
		if fieldMap, exists := statMap[s.PlayerID]; exists {
			s.Stats = fieldMap
		} else {
			s.Stats = map[string]*float64{} // Default empty if none found
		}
	}

	return stats, nil
}
