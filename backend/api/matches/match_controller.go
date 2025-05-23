package matches

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type MatchController struct {
	service *MatchService
}

func NewMatchController(service *MatchService) *MatchController {
	return &MatchController{service: service}
}

func (mc *MatchController) GetMatchByID(c *fiber.Ctx) error {
	matchIDStr := c.Params("matchID")
	matchID, err := strconv.Atoi(matchIDStr)

	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid match ID")
	}

	matches, err := mc.service.GetMatchesByID(matchID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to get a match")
	}

	return c.JSON(matches)
}

func (mc *MatchController) GetMatchByTeamID(c *fiber.Ctx) error {
	teamIDStr := c.Params("teamID")
	teamID, err := strconv.Atoi(teamIDStr)

	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid team ID")
	}

	matches, err := mc.service.GetMatchesByTeamID(teamID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to get matches")
	}

	return c.JSON(matches)
}