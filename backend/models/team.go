package models

type Team struct {
	TeamId      int    `json:"id" gorm:"primaryKey;column:team_id"`
	TeamName    string `json:"name" gorm:"column:team_name"`
	HomeStadium string `json:"homeStadium" gorm:"column:home_stadium"`
}

func (Team) TableName() string {
    return "team_info"
}