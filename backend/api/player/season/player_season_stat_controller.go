package season

import (
	"strconv"
	"log"
	"github.com/gofiber/fiber/v2"
)

type PlayerSeasonStatController struct {
	service *PlayerSeasonStatService
}

func NewPlayerSeasonStatController(service *PlayerSeasonStatService) *PlayerSeasonStatController {
	return &PlayerSeasonStatController{service: service}
}

func (mc *PlayerSeasonStatController) GetStatByID(c *fiber.Ctx) error {

	uniqueTournamentIDStr := c.Query("uniqueTournamentID")
	uniqueTournamentID, err := strconv.Atoi(uniqueTournamentIDStr)

	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid uniqueTournament ID")
	}


	seasonIDStr := c.Query("seasonID")
	seasonID, err := strconv.Atoi(seasonIDStr)

	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid season ID")
	}

	playerIDStr := c.Query("playerID")
	playerID, err := strconv.Atoi(playerIDStr)

	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid player ID")
	}

	stat, err := mc.service.GetStatByID(uniqueTournamentID, seasonID, playerID)
	if err != nil {
		log.Printf("❌ Error getting player stat: %v", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to get a player stat")
	}

	return c.JSON(stat)
}
