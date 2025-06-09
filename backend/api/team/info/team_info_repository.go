package info

import (
	"errors"
	"github.com/plinphon/StatsBanger/backend/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type TeamRepository struct {
	db *gorm.DB
}

func NewTeamRepository(dbPath string) (*TeamRepository, error) {
	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		return nil, err
	}
	return &TeamRepository{db: db}, nil
}

func (r *TeamRepository) Create(team *models.Team) error {
	return r.db.Create(team).Error
}

func (r *TeamRepository) GetByID(teamID int) (*models.Team, error) {
	var team models.Team
	err := r.db.First(&team, teamID).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, errors.New("team not found")
	}
	return &team, err
}

func (r *TeamRepository) SearchByName(name string) ([]*models.Team, error) {
	var teams []*models.Team
	err := r.db.
		Where("team_name LIKE ?", "%"+name+"%").
		Limit(20).
		Find(&teams).Error
	return teams, err
}
