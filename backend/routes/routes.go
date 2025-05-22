package routes

import (
	"github.com/gofiber/fiber/v2"

	"github.com/plinphon/StatsBanger/backend/matches"
)

func SetupRoutes(app fiber.Router) {
	api := app.Group("/api")

	RegisterMatchRoutes(api)
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