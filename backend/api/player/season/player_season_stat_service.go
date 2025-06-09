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
/*
func (s *PlayerSeasonStatService) CreateStat(stat models.PlayerSeasonStat) error {

	if existing, _ := s.repo.GetByID(stat.UniqueTournamentId, stat.SeasonId, stat.PlayerId); existing != nil {
		return ErrDuplicateSeasonStat
	}

	return s.repo.Create(stat)
}*/

/*
func (s *PlayerSeasonStatService) GetTopPlayersByStat(statField string, uniqueTournamentId int, seasonId int, limit int, positionFilter string) ([]models.TopPlayerStatResult, error) {
	return s.repo.GetTopPlayersByStat(statField, uniqueTournamentId, seasonId, limit, positionFilter)
}
*/
func (s *PlayerSeasonStatService) GetPlayerStatsWithMeta(
	statFields []string,
	tournamentId int,
	seasonId int,
	playerIds []int, 
) ([]*models.PlayerSeasonStat, error) {
	stats, err := s.repo.GetMultipleStatsByPlayerId(statFields, tournamentId, seasonId, playerIds)
	if err != nil {
		return nil, err
	}

	return stats, nil
}


/*
func (s *PlayerSeasonStatService) GetPlayerStatWithPercentile(
	statField []string,
	tournamentId int,
	seasonId int,
	playerId int,
	positionFilter *string,
) (*models.PlayerSeasonStat, error) {
	return s.repo.GetPlayerStatsPercentile(statField, tournamentId, seasonId, playerId, positionFilter)
}
*/