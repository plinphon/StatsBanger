package models

type Team struct {
	ID      int    `json:"ID"`
	Name    string `json:"Name"`
	HomeStadium string `json:"homeStadium"`
}
