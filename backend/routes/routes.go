package routes

import (
	"github.com/gofiber/fiber/v2"

	matches "github.com/plinphon/StatsBanger/backend/api/matches"

	teamMatchStat "github.com/plinphon/StatsBanger/backend/api/team/match"
	teamSeasonStat "github.com/plinphon/StatsBanger/backend/api/team/season"

	player "github.com/plinphon/StatsBanger/backend/api/player/info"
	playerMatchStat "github.com/plinphon/StatsBanger/backend/api/player/match"
	playerSeasonStat "github.com/plinphon/StatsBanger/backend/api/player/season"
)

func SetupRoutes(app fiber.Router) {
	api := app.Group("/api")

	RegisterMatchRoutes(api)

	RegisterTeamMatchStatRoutes(api)
	RegisterTeamSeasonStatRoutes(api)

	RegisterPlayerRoutes(api)
	RegisterPlayerMatchStatRoutes(api)
	RegisterPlayerSeasonStatRoutes(api)

}


func RegisterMatchRoutes(router fiber.Router) {

	repo, err := matches.NewMatchRepository("laligaDB.db")
	if err != nil {
		panic(err)
	}

	service := matches.NewMatchService(repo)
	controller := matches.NewMatchController(service)

	match := router.Group("/matches")
	match.Get("/", controller.GetMatchByTeamID)
}

func RegisterTeamMatchStatRoutes(router fiber.Router) {
	repo, err := teamMatchStat.NewTeamMatchStatRepository("laligaDB.db")
	if err != nil {
		panic(err)
	}

	service := teamMatchStat.NewTeamMatchStatService(repo)
	controller := teamMatchStat.NewTeamMatchStatController(service)

	stat := router.Group("/team-match-stat")
	stat.Get("/", controller.GetStatByID)
}

func RegisterTeamSeasonStatRoutes(router fiber.Router) {
	repo, err := teamSeasonStat.NewTeamSeasonStatRepository("laligaDB.db")
	if err != nil {
		panic(err)
	}

	service := teamSeasonStat.NewTeamSeasonStatService(repo)
	controller := teamSeasonStat.NewTeamSeasonStatController(service)

	stat := router.Group("/team-season-stat")
	stat.Get("/", controller.GetStatByID)
}

func RegisterPlayerMatchStatRoutes(router fiber.Router) {
	repo, err := playerMatchStat.NewPlayerMatchStatRepository("laligaDB.db")
	if err != nil {
		panic(err)
	}

	service := playerMatchStat.NewPlayerMatchStatService(repo)
	controller := playerMatchStat.NewPlayerMatchStatController(service)

	stat := router.Group("/player-match-stat")
	stat.Get("/", controller.GetStatByID)
}

func RegisterPlayerSeasonStatRoutes(router fiber.Router) {
	repo, err := playerSeasonStat.NewPlayerSeasonStatRepository("laligaDB.db")
	if err != nil {
		panic(err)
	}

	service := playerSeasonStat.NewPlayerSeasonStatService(repo)
	controller := playerSeasonStat.NewPlayerSeasonStatController(service)

	stat := router.Group("/player-season-stat")
	stat.Get("/", controller.GetStatByID)
}

func RegisterPlayerRoutes(router fiber.Router) {
	repo, err := player.NewPlayerRepository("laligaDB.db")
	if err != nil {
		panic(err)
	}

	service := player.NewPlayerService(repo)
	controller := player.NewPlayerController(service)

	stat := router.Group("/player")

	stat.Get("/:playerID", controller.GetPlayerByID)
	stat.Get("/", controller.SearchPlayersByName)
}