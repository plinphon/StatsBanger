package info

import (
	"errors"
	"github.com/plinphon/StatsBanger/backend/models"
)

var ErrDuplicateTeam = errors.New("duplicate team")

type TeamService struct {
	repo *TeamRepository
}

func NewTeamService(repo *TeamRepository) *TeamService {
	return &TeamService{repo: repo}
}

func (s *TeamService) CreateTeam(team models.Team) error {
	existing, err := s.repo.GetByID(team.ID)
	if err == nil && existing != nil {
		return ErrDuplicateTeam
	}
	if err != nil && err.Error() != "team not found" {
		return err
	}
	return s.repo.Create(team)
}

func (s *TeamService) GetTeamByID(teamID int) (*models.Team, error) {
	return s.repo.GetByID(teamID)
}

func (s *TeamService) SearchTeamsByName(name string) ([]*models.Team, error) {
	return s.repo.SearchByName(name)
}
