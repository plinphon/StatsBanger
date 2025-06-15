package match

import (
	"github.com/plinphon/StatsBanger/backend/models"
	"errors"
)

var ErrDuplicateMatch = errors.New("duplicate match stat")

type PlayerMatchStatService struct {
	repo *PlayerMatchStatRepository
}

func NewPlayerMatchStatService(repo *PlayerMatchStatRepository) *PlayerMatchStatService {
    return &PlayerMatchStatService{repo: repo}
}

func (s *PlayerMatchStatService) GetStatsByMatchID(matchID int, statFields []string) ([]*models.PlayerMatchStat, error) {
	stats, err := s.repo.GetByMatchId(matchID, statFields)
	if err != nil {
		return nil, err
	}
	for _, stat := range stats {
		s.injectTotalShots(stat)
	}

	return stats, nil
}

func (s *PlayerMatchStatService) GetAllMatchStatsByPlayerID(playerID int) ([]*models.PlayerMatchStat, error) {
	stats, err := s.repo.GetAllMatchStatsByPlayerId(playerID)
	if err != nil {
		return nil, err
	}
	for _, stat := range stats {
		s.injectTotalShots(stat)
	}

	return stats, nil
}

func (s *PlayerMatchStatService) GetByPlayerAndMatchID(playerID int, matchID int) (*models.PlayerMatchStat, error) {
    stat, err := s.repo.GetByPlayerAndMatchId(playerID, matchID)
	if err != nil {
		return nil, err
	}

	s.injectTotalShots(stat)

	return stat, nil
}


func (s *PlayerMatchStatService) injectTotalShots(stat *models.PlayerMatchStat) {
	if stat.Stats == nil {
		return
	}

	var totalShots float64
	var hasData bool

	if onTargetPtr, exists := stat.Stats["on_target_scoring_attempt"]; exists && onTargetPtr != nil {
		totalShots += *onTargetPtr
		hasData = true
	}

	if offTargetPtr, exists := stat.Stats["shot_off_target"]; exists && offTargetPtr != nil {
		totalShots += *offTargetPtr
		hasData = true
	}

	if hasData {
		stat.Stats["total_shots"] = &totalShots
	}
}