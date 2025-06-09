package info

import (
	"errors"
	"github.com/plinphon/StatsBanger/backend/models"
	
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type PlayerRepository struct {
	db *gorm.DB
}

func NewPlayerRepository(dbPath string) (*PlayerRepository, error) {
	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		return nil, err
	}
	return &PlayerRepository{db: db}, nil
}

func (r *PlayerRepository) Create(player *models.Player) error {
	// You can use Create directly; it will insert or update based on primary key
	return r.db.Create(player).Error
}

func (r *PlayerRepository) GetByID(playerID int) (*models.Player, error) {
	var player models.Player
	err := r.db.First(&player, playerID).Error
	Preload("Player.PlayerSeasonStat.Team").
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, errors.New("player not found")
	}
	player.Team = PLayer.PlayerSeasonStat.Team
	return &player, err
}

func (r *PlayerRepository) SearchByName(name string) ([]*models.Player, error) {
	var players []*models.Player
	err := r.db.
		Where("player_name LIKE ?", "%"+name+"%").
		Limit(20).
		Find(&players).Error
	return players, err
}
