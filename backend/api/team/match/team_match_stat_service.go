package match

import (
	"github.com/plinphon/StatsBanger/backend/models"
	"errors"

)

var ErrDuplicateMatch = errors.New("duplicate match stat")

type TeamMatchStatService struct {
	repo *TeamMatchStatRepository
}

func NewTeamMatchStatService(repo *TeamMatchStatRepository) *TeamMatchStatService {
    return &TeamMatchStatService{repo: repo}
}

func (s *TeamMatchStatService) CreateStat(stat models.TeamMatchStat) error {

	if existing, _ := s.repo.GetByID(stat.MatchID, stat.TeamID); existing != nil {
		return ErrDuplicateMatch
	}

	return s.repo.Create(stat)
}

func (s *TeamMatchStatService) GetStatByID(matchID int, teamID int) (*models.TeamMatchStat, error) {
	return s.repo.GetByID(matchID, teamID)
}