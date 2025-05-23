package match

import (
	"database/sql"
	"errors"

	"github.com/plinphon/StatsBanger/backend/models"

	_ "github.com/mattn/go-sqlite3"
)

type PlayerMatchStatRepository struct {
	db *sql.DB
}

func NewPlayerMatchStatRepository(dbPath string) (*PlayerMatchStatRepository, error) {
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		return nil, err
	}
	if err = db.Ping(); err != nil {
		return nil, err
	}
	return &PlayerMatchStatRepository{db: db}, nil
}

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


func (r *PlayerMatchStatRepository) GetByID(matchID int, playerID int) (*models.PlayerMatchStat, error) {
	query := `SELECT 
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
	FROM player_match_stat 
	WHERE match_id = ? AND player_id = ?
	`

	row := r.db.QueryRow(query, matchID, playerID)

	var stat models.PlayerMatchStat

	err := row.Scan(
		&stat.MatchID, &stat.PlayerID, &stat.TotalPass, &stat.AccuratePass, &stat.TotalLongBalls, &stat.AccurateLongBalls,
		&stat.GoalAssist, &stat.SavedShotsFromInsideTheBox, &stat.Saves, &stat.MinutesPlayed, &stat.Touches, &stat.Rating,
		&stat.PossessionLostCtrl, &stat.KeyPass, &stat.GoalsPrevented, &stat.AerialWon, &stat.DuelLost, &stat.DuelWon,
		&stat.OnTargetScoringAttempt, &stat.Goals, &stat.TotalClearance, &stat.InterceptionWon, &stat.TotalTackle,
		&stat.WasFouled, &stat.Fouls, &stat.ExpectedGoals, &stat.ExpectedAssists, &stat.AerialLost, &stat.ChallengeLost,
		&stat.TotalCross, &stat.TotalContest, &stat.WonContest, &stat.OutfielderBlock, &stat.BigChanceCreated,
		&stat.Dispossessed, &stat.ShotOffTarget, &stat.AccurateCross, &stat.TotalOffside, &stat.BlockedScoringAttempt,
		&stat.PenaltyWon, &stat.PenaltyConceded, &stat.BigChanceMissed, &stat.TotalKeeperSweeper,
		&stat.AccurateKeeperSweeper, &stat.GoodHighClaim, &stat.Punches, &stat.ClearanceOffLine,
		&stat.HitWoodwork, &stat.ErrorLeadToAShot, &stat.OwnGoals, &stat.LastManTackle,
		&stat.ErrorLeadToAGoal, &stat.PenaltySave, &stat.PenaltyMiss,
	)

	if err == sql.ErrNoRows {
		return nil, errors.New("player match stat not found")
	} else if err != nil {
		return nil, err
	}

	return &stat, nil
}
