package models

type Team struct {
	ID      int    `json:"id"`
	Name    string `json:"name"`
	HomeStadium string `json:"homeStadium"`
}
