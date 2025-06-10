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
/*
func (s *PlayerMatchStatService) CreateStat(stat models.PlayerMatchStat) error {

	if existing, _ := s.repo.GetByID(stat.MatchID, stat.PlayerID); existing != nil {
		return ErrDuplicateMatch
	}

	return s.repo.Create(stat)
}
*/
func (s *PlayerMatchStatService) GetStatsByMatchID(matchID int, statFields []string) ([]*models.PlayerMatchStat, error) {
	return s.repo.GetByMatchId(matchID, statFields)
}

func (s *PlayerMatchStatService) GetAllMatchesByPlayerID(playerID int) ([]models.PlayerMatchStat, error) {
	return s.repo.GetAllMatchesByPlayerId(playerID)
}

func (s *PlayerMatchStatService) GetByPlayerAndMatchID(playerID int, matchID int) (*models.PlayerMatchStat, error) {
    return s.repo.GetByPlayerAndMatchId(playerID, matchID)
}