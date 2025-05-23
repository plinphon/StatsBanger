package routes

import (
	"github.com/gofiber/fiber/v2"

	"github.com/plinphon/StatsBanger/backend/api/matches"
	"github.com/plinphon/StatsBanger/backend/api/teammatchstat"
)

func SetupRoutes(app fiber.Router) {
	api := app.Group("/api")

	RegisterMatchRoutes(api)
	RegisterTeamMatchStatRoutes(api)
}


func RegisterMatchRoutes(router fiber.Router) {

	repo, err := matches.NewMatchRepository("laligaDB.db")
	if err != nil {
		panic(err)
	}

	service := matches.NewMatchService(repo)
	controller := matches.NewMatchController(service)

	match := router.Group("/matches")
	match.Get("/team/:teamID", controller.GetMatchByTeamID)
}

func RegisterTeamMatchStatRoutes(router fiber.Router) {
	repo, err := teammatchstat.NewTeamMatchStatRepository("laligaDB.db")
	if err != nil {
		panic(err)
	}

	service := teammatchstat.NewTeamMatchStatService(repo)
	controller := teammatchstat.NewTeamMatchStatController(service)

	stat := router.Group("/teammatchstat")
	stat.Get("/match/:matchID/team/:teamID", controller.GetStatByID)
}