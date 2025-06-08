package season

import (
	"github.com/plinphon/StatsBanger/backend/models"
	"errors"
	"fmt"
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
func (s *TeamSeasonStatService) GetTopTeamsByStat(statField string, uniqueTournamentID int, seasonID int, limit int) ([]models.TopTeamStatResult, error) {
	return s.repo.GetTopTeamsByStat(statField, uniqueTournamentID, seasonID, limit)
}

func (s *TeamSeasonStatService) GetTeamStatsWithMeta(
	statFields []string,
	uniqueTournamentID int,
	seasonID int,
	teamID int,
) (*models.TeamStatWithMeta, error) {

	teamStats, err := s.repo.GetMultipleStatsByTeamID(statFields, uniqueTournamentID, seasonID, teamID)
	if err != nil {
		return nil, fmt.Errorf("failed to get team stats: %w", err)
	}

	return teamStats, nil
}
