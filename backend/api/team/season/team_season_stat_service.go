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
/*
func (s *TeamSeasonStatService) CreateStat(stat models.TeamSeasonStat) error {

	if existing, _ := s.repo.GetByID(stat.UniqueTournamentID, stat.SeasonID, stat.TeamID); existing != nil {
		return ErrDuplicateSeasonStat
	}

	return s.repo.Create(stat)
}
*/
func (s *TeamSeasonStatService) GetTeamStatsWithMeta(
	statFields []string,
	tournamentId int,
	seasonId int,
	teamIds []int,
) ([]*models.TeamSeasonStat, error) {
	stats, err := s.repo.GetMultipleStatsByTeamId(statFields, tournamentId, seasonId, teamIds)
	if err != nil {
		return nil, err
	}

	return stats, nil
}

func (s *TeamSeasonStatService) GetTopTeamsByStat(
    statField string,
    uniqueTournamentId int,
    seasonId int,
    limit int,
) ([]models.TopTeamStatResult, error) {
    return s.repo.GetTopTeamsByStat(statField, uniqueTournamentId, seasonId, limit)
}