package info

import (
	"github.com/plinphon/StatsBanger/backend/models"
	"errors"
)

var ErrDuplicateMatch = errors.New("duplicate player")

type PlayerService struct {
	repo *PlayerRepository
}

func NewPlayerService(repo *PlayerRepository) *PlayerService {
    return &PlayerService{repo: repo}
}
/*
func (s *PlayerService) CreatePlayer(player models.Player) error {

	if existing, _ := s.repo.GetByID(player.PlayerId); existing != nil {
		return ErrDuplicateMatch
	}

	return s.repo.Create(&player)
}*/

func (s *PlayerService) GetPlayerByID(playerID int) (*models.Player, error) {
    player, err := s.repo.GetByID(playerID)
    if err != nil {
        return nil, err
    }

    return player, nil
}

func (s *PlayerService) SearchPlayersByName(name string) ([]*models.Player, error) {
    players, err := s.repo.SearchByName(name)
    if err != nil {
        return nil, err
    }

    return players, nil
}
