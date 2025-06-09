package info

import (
	"github.com/plinphon/StatsBanger/backend/models"
	"errors"
	"time"
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

    birthday := player.Birthday
    player.Age = CalculateAge(birthday)

    return player, nil
}

func (s *PlayerService) SearchPlayersByName(name string) ([]*models.Player, error) {
    players, err := s.repo.SearchByName(name)
    if err != nil {
        return nil, err
    }

    for _, player := range players {
        birthday := player.Birthday
        player.Age = CalculateAge(birthday)
    }

    return players, nil
}


func CalculateAge(birthday time.Time) int {
	now := time.Now()
	age := now.Year() - birthday.Year()

	// Check if birthday hasn't occurred yet this year
	if now.YearDay() < birthday.YearDay() {
		age--
	}
	return age
}

