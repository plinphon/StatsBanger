package match

import (
	"strconv"
	"log"
	"github.com/gofiber/fiber/v2"
)

type PlayerMatchStatController struct {
	service *PlayerMatchStatService
}

func NewPlayerMatchStatController(service *PlayerMatchStatService) *PlayerMatchStatController {
	return &PlayerMatchStatController{service: service}
}

func (mc *PlayerMatchStatController) GetStatByID(c *fiber.Ctx) error {
	matchIDStr := c.Query("matchID")
	matchID, err := strconv.Atoi(matchIDStr)

	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid match ID")
	}

	playerIDStr := c.Query("playerID")
	playerID, err := strconv.Atoi(playerIDStr)
	
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid player ID")
	}


	stat, err := mc.service.GetStatByID(matchID, playerID)
	if err != nil {
		log.Printf("❌ Error getting player stat: %v", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to get a player stat")
	}

	return c.JSON(stat)
}
