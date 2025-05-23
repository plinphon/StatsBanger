package routes

import (
	"github.com/gofiber/fiber/v2"

	Matches "github.com/plinphon/StatsBanger/backend/api/matches"
	teamMatchStat "github.com/plinphon/StatsBanger/backend/api/team/match"
	teamSeasonStat "github.com/plinphon/StatsBanger/backend/api/team/season"
)

func SetupRoutes(app fiber.Router) {
	api := app.Group("/api")

	RegisterMatchRoutes(api)
	RegisterTeamMatchStatRoutes(api)
}


func RegisterMatchRoutes(router fiber.Router) {

	repo, err := Matches.NewMatchRepository("laligaDB.db")
	if err != nil {
		panic(err)
	}

	service := Matches.NewMatchService(repo)
	controller := Matches.NewMatchController(service)

	match := router.Group("/matches")
	match.Get("/team/:teamID", controller.GetMatchByTeamID)
}

func RegisterTeamMatchStatRoutes(router fiber.Router) {
	repo, err := TeamMatchStat.NewTeamMatchStatRepository("laligaDB.db")
	if err != nil {
		panic(err)
	}

	service := TeamMatchStat.NewTeamMatchStatService(repo)
	controller := TeamMatchStat.NewTeamMatchStatController(service)

	stat := router.Group("/team-match-stat")
	stat.Get("/match/:matchID/team/:teamID", controller.GetStatByID)
}

func RegisterTeamSeasonStatRoutes(router fiber.Router) {
	repo, err := TeamSeasonStat.NewTeamSeasonStatRepository("laligaDB.db")
	if err != nil {
		panic(err)
	}

	service := TeamSeasonStat.NewTeamSeasonStatService(repo)
	controller := TeamSeasonStat.NewTeamSeasonStatController(service)

	stat := router.Group("/team-season-stat")
	stat.Get("tournament/:uniqueTournamentID/season/:seasonID/team/:teamID", controller.GetStatByID)
}