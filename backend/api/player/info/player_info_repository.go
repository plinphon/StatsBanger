package info

import (
	"database/sql"
	"errors"
	"github.com/plinphon/StatsBanger/backend/models"

	_ "github.com/mattn/go-sqlite3"
)

type PlayerRepository struct {
	db *sql.DB
}

func NewPlayerRepository(dbPath string) (*PlayerRepository, error) {
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		return nil, err
	}
	if err = db.Ping(); err != nil {
		return nil, err
	}
	return &PlayerRepository{db: db}, nil
}

func (r *PlayerRepository) Create(player models.Player) error {
	query := `
	INSERT INTO player_info (
		player_id, player_name, birthday_timestamp, position, height, preferred_foot, nationality
	) VALUES (?, ?, ?, ?, ?, ?, ?)
	`

	_, err := r.db.Exec(query,
		player.ID,
		player.Name,
		player.Birthday,
		player.Position,
		player.Height,
		player.PreferredFoot,
		player.Nationality,
	)

	return err
}

func (r *PlayerRepository) GetByID(playerID int) (*models.Player, error) {
	query := `
	SELECT
		p.player_id,
		p.player_name,
		p.birthday_timestamp,
		ps.team_id,
		t.team_name,
		p.position,
		p.height,
		p.preferred_foot,
		p.nationality
	FROM player_info p
	JOIN player_stat ps ON p.player_id = ps.player_id
	JOIN team_info t ON ps.team_id = t.team_id
	WHERE p.player_id = ?
	`

	row := r.db.QueryRow(query, playerID)

	var player models.Player

	err := row.Scan(
		&player.ID,
		&player.Name,
		&player.Birthday,
		&player.TeamID,
		&player.TeamName,
		&player.Position,
		&player.Height,
		&player.PreferredFoot,
		&player.Nationality,
	)

	if err == sql.ErrNoRows {
		return nil, errors.New("player not found")
	} else if err != nil {
		return nil, err
	}

	return &player, nil
}

func (r *PlayerRepository) SearchByName(name string) ([]*models.Player, error) {
	query := `
	SELECT player_id, player_name, birthday_timestamp, position, height, preferred_foot, nationality
	FROM player_info
	WHERE player_name LIKE ? 
	LIMIT 20
	`
	//use % for partial match on both sides
	rows, err := r.db.Query(query, "%"+name+"%")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var players []*models.Player
	for rows.Next() {
		var p models.Player
		err := rows.Scan(
			&p.ID,
			&p.Name,
			&p.Birthday,
			&p.Position,
			&p.Height,
			&p.PreferredFoot,
			&p.Nationality,
		)
		if err != nil {
			return nil, err
		}
		players = append(players, &p)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return players, nil
}
