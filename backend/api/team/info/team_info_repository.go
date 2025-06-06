package info

import (
	"database/sql"
	"errors"

	"github.com/plinphon/StatsBanger/backend/models"
	_ "github.com/mattn/go-sqlite3"
)

type TeamRepository struct {
	db *sql.DB
}

func NewTeamRepository(dbPath string) (*TeamRepository, error) {
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		return nil, err
	}
	if err = db.Ping(); err != nil {
		return nil, err
	}
	return &TeamRepository{db: db}, nil
}

func (r *TeamRepository) Create(team models.Team) error {
	query := `
	INSERT INTO team_info (
		team_id, team_name, home_stadium
	) VALUES (?, ?, ?)
	`

	_, err := r.db.Exec(query,
		team.ID,
		team.Name,
		team.HomeStadium,
	)

	return err
}

func (r *TeamRepository) GetByID(teamID int) (*models.Team, error) {
	query := `
	SELECT team_id, team_name, home_stadium
	FROM team_info
	WHERE team_id = ?
	`

	row := r.db.QueryRow(query, teamID)

	var team models.Team
	err := row.Scan(&team.ID, &team.Name, &team.HomeStadium)
	if err == sql.ErrNoRows {
		return nil, errors.New("team not found")
	} else if err != nil {
		return nil, err
	}

	return &team, nil
}

func (r *TeamRepository) SearchByName(name string) ([]*models.Team, error) {
	query := `
	SELECT team_id, team_name, home_stadium
	FROM team_info
	WHERE team_name LIKE ?
	LIMIT 20
	`

	rows, err := r.db.Query(query, "%"+name+"%")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var teams []*models.Team
	for rows.Next() {
		var team models.Team
		if err := rows.Scan(&team.ID, &team.Name, &team.HomeStadium); err != nil {
			return nil, err
		}
		teams = append(teams, &team)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return teams, nil
}
