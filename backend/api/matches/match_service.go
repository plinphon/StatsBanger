package matches

import (
	"github.com/plinphon/StatsBanger/backend/models"
	"errors"
)

var (
	ErrDuplicateMatch     = errors.New("match Id already exists")
	ErrInvalidTeamIds     = errors.New("home and away teams cannot be the same")
)

type MatchService struct {
	repo *MatchRepository
}

func NewMatchService(repo *MatchRepository) *MatchService {
    return &MatchService{repo: repo}
}
/*
func (s *MatchService) CreateMatch(match models.Match) error {
	if match.HomeTeamId == match.AwayTeamId {
		return ErrInvalidTeamIds
	}

	if existing, _ := s.repo.GetById(match.Id); existing != nil {
		return ErrDuplicateMatch
	}

	if match.CurrentPeriodStartTimestamp.IsZero() {
		match.CurrentPeriodStartTimestamp = time.Now()
	}

	return s.repo.Create(match)
}
*/
func (s *MatchService) GetMatchById(matchId int) (*models.Match, error) {
	return s.repo.GetById(matchId)
}

func (s *MatchService) GetMatchesByTeamId(teamId int) ([]models.Match, error) {
	return s.repo.GetByTeamId(teamId)
}