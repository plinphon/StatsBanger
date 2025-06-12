package models

type Team struct {
    TeamId      int    `gorm:"primaryKey;column:team_id" json:"teamId"`
    TeamName    string `gorm:"column:team_name" json:"name"`
    HomeStadium string `gorm:"column:home_stadium" json:"homeStadium"`
}

func (Team) TableName() string {
    return "team_info"
}