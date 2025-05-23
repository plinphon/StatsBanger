package season

import (
	"github.com/plinphon/StatsBanger/backend/models"
	"errors"

)

var ErrDuplicateSeasonStat = errors.New("duplicate match stat")

type PlayerSeasonStatService struct {
	repo *PlayerSeasonStatRepository
}

func NewPlayerSeasonStatService(repo *PlayerSeasonStatRepository) *PlayerSeasonStatService {
    return &PlayerSeasonStatService{repo: repo}
}

func (s *PlayerSeasonStatService) CreateStat(stat models.PlayerSeasonStat) error {

	if existing, _ := s.repo.GetByID(stat.UniqueTournamentID, stat.SeasonID, stat.PlayerID); existing != nil {
		return ErrDuplicateSeasonStat
	}

	return s.repo.Create(stat)
}

func (s *PlayerSeasonStatService) GetStatByID(uniqueTournamentID int, seasonID int, playerID int) (*models.PlayerSeasonStat, error) {
	return s.repo.GetByID(uniqueTournamentID, seasonID, playerID)
}