package teammatchstat

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type TeamMatchStatController struct {
	service *TeamMatchStatService
}

func NewTeamMatchStatController(service *TeamMatchStatService) *TeamMatchStatController {
	return &TeamMatchStatController{service: service}
}

func (mc *TeamMatchStatController) GetStatByID(c *fiber.Ctx) error {
	matchIDStr := c.Params("matchID")
	matchID, err := strconv.Atoi(matchIDStr)

	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid match ID")
	}

	teamIDStr := c.Params("teamID")
	teamID, err := strconv.Atoi(teamIDStr)

	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid team ID")
	}

	stat, err := mc.service.GetStatByID(matchID, teamID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to get a team stat")
	}

	return c.JSON(stat)
}
