package match

import (
	"errors"
	"fmt"
	"strings"

	"github.com/plinphon/StatsBanger/backend/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"database/sql"
)

type TeamMatchStatRepository struct {
	db *gorm.DB
}


func NewTeamMatchStatRepository(dbPath string) (*TeamMatchStatRepository, error) {
	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		return nil, err
	}


	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}
	if err := sqlDB.Ping(); err != nil {
		return nil, err
	}

	return &TeamMatchStatRepository{db: db}, nil
}

/*
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
		stat.MatchId, stat.TeamId, stat.BallPossession, stat.ExpectedGoals, stat.BigChances,
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
*/

func (r *TeamMatchStatRepository) GetById(matchId int, teamId int, statFields []string) (*models.TeamMatchStat, error) {
    var stat models.TeamMatchStat

  
    err := r.db.
		Preload("Match.HomeTeam").
		Preload("Match.AwayTeam").
        Preload("Team").
        Where("match_id = ? AND team_id = ?", matchId, teamId).
        First(&stat).Error

    if err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return nil, errors.New("team match stat not found")
        }
        return nil, err
    }

    if len(statFields) == 0 {
        statFields = make([]string, 0, len(models.ValidTeamMatchFields))
        for field := range models.ValidTeamMatchFields {
            statFields = append(statFields, field)
        }
    } else {
        validFields := make([]string, 0, len(statFields))
        for _, field := range statFields {
            if field == "" {
                continue
            }
            if !models.ValidTeamMatchFields[field] {
                return nil, fmt.Errorf("invalid stat field: %s", field)
            }
            validFields = append(validFields, field)
        }
        statFields = validFields
    }

    if len(statFields) == 0 {
        stat.Stats = map[string]*float64{}
        return &stat, nil
    }

    columns := strings.Join(statFields, ", ")
    query := fmt.Sprintf("SELECT %s FROM team_match_stat WHERE match_id = ? AND team_id = ?", columns)

    row := r.db.Raw(query, matchId, teamId).Row()

    values := make([]sql.NullFloat64, len(statFields))
    scanTargets := make([]interface{}, len(statFields))
    for i := range values {
        scanTargets[i] = &values[i]
    }

    err = row.Scan(scanTargets...)
    if err != nil {
        if err == sql.ErrNoRows {
            // No stat row found, return empty stats map
            stat.Stats = map[string]*float64{}
            return &stat, nil
        }
        return nil, fmt.Errorf("failed to scan stat fields: %w", err)
    }

    statMap := make(map[string]*float64, len(statFields))
    for i, field := range statFields {
        if values[i].Valid {
            val := values[i].Float64
            statMap[field] = &val
        }
    }
    stat.Stats = statMap

    return &stat, nil
}

func (r *TeamMatchStatRepository) GetAllMatchesByTeamID(teamID int) ([]models.TeamMatchStat, error) {
    var stats []models.TeamMatchStat

    err := r.db.
		Preload("Match.HomeTeam").
		Preload("Match.AwayTeam").
        Preload("Team").
        Where("team_id = ?", teamID).
        Find(&stats).Error

    if err != nil {
        return nil, err
    }


    return stats, nil
}

