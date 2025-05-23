package season

import (
	"github.com/plinphon/StatsBanger/backend/models"
	"errors"

)

var ErrDuplicateSeasonStat = errors.New("duplicate season stat")

type TeamSeasonStatService struct {
	repo *TeamSeasonStatRepository
}

func NewTeamSeasonStatService(repo *TeamSeasonStatRepository) *TeamSeasonStatService {
    return &TeamSeasonStatService{repo: repo}
}

func (s *TeamSeasonStatService) CreateStat(stat models.TeamSeasonStat) error {

	if existing, _ := s.repo.GetByID(stat.UniqueTournamentID, stat.SeasonID, stat.TeamID); existing != nil {
		return ErrDuplicateSeasonStat
	}

	return s.repo.Create(stat)
}

func (s *TeamSeasonStatService) GetStatByID(uniqueTournamentID int, seasonID int, teamID int) (*models.TeamSeasonStat, error) {
	return s.repo.GetByID(uniqueTournamentID, seasonID, teamID)
}