package match

import (
	"strconv"
	"log"
	"github.com/gofiber/fiber/v2"
	"strings"
)

type PlayerMatchStatController struct {
	service *PlayerMatchStatService
}

func NewPlayerMatchStatController(service *PlayerMatchStatService) *PlayerMatchStatController {
	return &PlayerMatchStatController{service: service}
}

func (mc *PlayerMatchStatController) GetStatsByMatchID(c *fiber.Ctx) error {

	matchIDStr := c.Query("matchID")
	matchID, err := strconv.Atoi(matchIDStr)
	if err != nil || matchID <= 0 {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid or missing matchID")
	}

	statFieldsStr := c.Query("statFields") //can none
	var statFields []string
	if statFieldsStr != "" {
		for _, field := range strings.Split(statFieldsStr, ",") {
			field = strings.TrimSpace(field)
			if field != "" {
				statFields = append(statFields, field)
			}
		}
	}

	stats, err := mc.service.GetStatsByMatchID(matchID, statFields) 
	if err != nil {
		log.Printf("❌ Error getting player stats: %v", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to get player stats")
	}

	return c.JSON(stats)
}

func (mc *PlayerMatchStatController) GetAllMatchesByPlayerID(c *fiber.Ctx) error {
	playerIDStr := c.Params("playerID")
	playerID, err := strconv.Atoi(playerIDStr)
	if err != nil || playerID <= 0 {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid or missing playerID")
	}

	stats, err := mc.service.GetAllMatchesByPlayerID(playerID)
	if err != nil {
		log.Printf("❌ Error getting player stats: %v", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to get player stats")
	}

	return c.JSON(stats)
}

func (mc *PlayerMatchStatController) GetStatByPlayerAndMatchID(c *fiber.Ctx) error {
    playerIDStr := c.Params("playerID")
    playerID, err := strconv.Atoi(playerIDStr)
    if err != nil || playerID <= 0 {
        return fiber.NewError(fiber.StatusBadRequest, "Invalid or missing playerID")
    }

    matchIDStr := c.Params("matchID")
    matchID, err := strconv.Atoi(matchIDStr)
    if err != nil || matchID <= 0 {
        return fiber.NewError(fiber.StatusBadRequest, "Invalid or missing matchID")
    }

    stat, err := mc.service.GetByPlayerAndMatchID(playerID, matchID)
    if err != nil {
        log.Printf("❌ Error getting player match stat: %v", err)
        return fiber.NewError(fiber.StatusInternalServerError, "Failed to get player match stat")
    }

    return c.JSON(stat)
}
