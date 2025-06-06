package info

import (
	"strconv"
	"log"
	"github.com/gofiber/fiber/v2"
)

type PlayerController struct {
	service *PlayerService
}

func NewPlayerController(service *PlayerService) *PlayerController {
	return &PlayerController{service: service}
}

func (mc *PlayerController) GetPlayerByID(c *fiber.Ctx) error {
	playerIDStr := c.Params("playerID")
	playerID, err := strconv.Atoi(playerIDStr)

	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid player ID")
	}

	player, err := mc.service.GetPlayerByID(playerID)
	if err != nil {
		log.Printf("❌ Error getting player: %v", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to get a player")
	}

	return c.JSON(player)
}

func (mc *PlayerController) SearchPlayersByName(c *fiber.Ctx) error {
	playerName := c.Query("playerName")

	player, err := mc.service.SearchPlayersByName(playerName)
	if err != nil {
		log.Printf("❌ Error getting player: %v", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to get a player")
	}

	return c.JSON(player)
}
