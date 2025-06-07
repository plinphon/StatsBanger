package matches

import (
	"github.com/plinphon/StatsBanger/backend/models"
	"errors"
	"time"
)

var (
	ErrDuplicateMatch     = errors.New("match ID already exists")
	ErrInvalidTeamIDs     = errors.New("home and away teams cannot be the same")
)

type MatchService struct {
	repo *MatchRepository
}

func NewMatchService(repo *MatchRepository) *MatchService {
    return &MatchService{repo: repo}
}

func (s *MatchService) CreateMatch(match models.Match) error {
	if match.HomeTeamID == match.AwayTeamID {
		return ErrInvalidTeamIDs
	}

	if existing, _ := s.repo.GetByID(match.ID); existing != nil {
		return ErrDuplicateMatch
	}

	if match.CurrentPeriodStartTimestamp.IsZero() {
		match.CurrentPeriodStartTimestamp = time.Now()
	}

	return s.repo.Create(match)
}

func (s *MatchService) GetMatchesByID(matchID int) (*models.Match, error) {
	return s.repo.GetByID(matchID)
}

func (s *MatchService) GetMatchesByTeamID(teamID int) ([]models.Match, error) {
	return s.repo.GetByTeamID(teamID)
}