package match

import (
	"database/sql"
	"errors"

	"github.com/plinphon/StatsBanger/backend/models"

	_ "github.com/mattn/go-sqlite3"
)

type TeamMatchStatRepository struct {
	db *sql.DB
}

func NewTeamMatchStatRepository(dbPath string) (*TeamMatchStatRepository, error) {
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		return nil, err
	}
	if err = db.Ping(); err != nil {
		return nil, err
	}
	return &TeamMatchStatRepository{db: db}, nil
}

func (r *TeamMatchStatRepository) Create(stat models.TeamMatchStat) error {
	query := `
	INSERT INTO team_match_stat (
		match_id, team_id, ball_possession, expected_goals, big_chances, total_shots,
		goalkeeper_saves, corner_kicks, fouls, passes, tackles, free_kicks, yellow_cards, red_cards,
		shots_on_target, hit_woodwork, shots_off_target, blocked_shots, shots_inside_box, shots_outside_box,
		big_chances_scored, big_chances_missed, through_balls, touches_in_penalty_area, fouled_in_final_third,
		offsides, accurate_passes, throw_ins, final_third_entries, final_third_phase, long_balls, crosses,
		duels, dispossessed, ground_duels, aerial_duels, dribbles, tackles_won, total_tackles,
		interceptions, recoveries, clearances, total_saves, goals_prevented, goal_kicks, big_saves,
		high_claims, punches, errors_lead_to_a_shot, errors_lead_to_a_goal, penalty_saves
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err := r.db.Exec(query,
		stat.MatchID, stat.TeamID, stat.BallPossession, stat.ExpectedGoals, stat.BigChances,
		stat.TotalShots, stat.GoalkeeperSaves, stat.CornerKicks, stat.Fouls, stat.Passes,
		stat.Tackles, stat.FreeKicks, stat.YellowCards, stat.RedCards, stat.ShotsOnTarget,
		stat.HitWoodwork, stat.ShotsOffTarget, stat.BlockedShots, stat.ShotsInsideBox, stat.ShotsOutsideBox,
		stat.BigChancesScored, stat.BigChancesMissed, stat.ThroughBalls, stat.TouchesInPenaltyArea,
		stat.FouledInFinalThird, stat.Offsides, stat.AccuratePasses, stat.ThrowIns, stat.FinalThirdEntries,
		stat.FinalThirdPhase, stat.LongBalls, stat.Crosses, stat.Duels, stat.Dispossessed,
		stat.GroundDuels, stat.AerialDuels, stat.Dribbles, stat.TacklesWon, stat.TotalTackles,
		stat.Interceptions, stat.Recoveries, stat.Clearances, stat.TotalSaves, stat.GoalsPrevented,
		stat.GoalKicks, stat.BigSaves, stat.HighClaims, stat.Punches, stat.ErrorsLeadToAShot,
		stat.ErrorsLeadToAGoal, stat.PenaltySaves,
	)

	return err
}

func (r *TeamMatchStatRepository) GetByID(matchID int, teamID int) (*models.TeamMatchStat, error) {
	query := `
	SELECT * FROM team_match_stat 
	WHERE match_id = ? AND team_id = ?`

	row := r.db.QueryRow(query, matchID, teamID) 

	var stat models.TeamMatchStat

	err := row.Scan(
		&stat.MatchID, &stat.TeamID, &stat.BallPossession, &stat.ExpectedGoals, &stat.BigChances,
		&stat.TotalShots, &stat.GoalkeeperSaves, &stat.CornerKicks, &stat.Fouls, &stat.Passes,
		&stat.Tackles, &stat.FreeKicks, &stat.YellowCards, &stat.RedCards, &stat.ShotsOnTarget,
		&stat.HitWoodwork, &stat.ShotsOffTarget, &stat.BlockedShots, &stat.ShotsInsideBox, &stat.ShotsOutsideBox,
		&stat.BigChancesScored, &stat.BigChancesMissed, &stat.ThroughBalls, &stat.TouchesInPenaltyArea,
		&stat.FouledInFinalThird, &stat.Offsides, &stat.AccuratePasses, &stat.ThrowIns, &stat.FinalThirdEntries,
		&stat.FinalThirdPhase, &stat.LongBalls, &stat.Crosses, &stat.Duels, &stat.Dispossessed,
		&stat.GroundDuels, &stat.AerialDuels, &stat.Dribbles, &stat.TacklesWon, &stat.TotalTackles,
		&stat.Interceptions, &stat.Recoveries, &stat.Clearances, &stat.TotalSaves, &stat.GoalsPrevented,
		&stat.GoalKicks, &stat.BigSaves, &stat.HighClaims, &stat.Punches, &stat.ErrorsLeadToAShot,
		&stat.ErrorsLeadToAGoal, &stat.PenaltySaves,
	)

	if err == sql.ErrNoRows {
		return nil, errors.New("team match stat not found")
	} else if err != nil {
		return nil, err
	}

	return &stat, nil
}