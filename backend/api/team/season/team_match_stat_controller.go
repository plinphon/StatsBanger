package season

import (
	"strconv"
	"log"
	"github.com/gofiber/fiber/v2"
)

type TeamSeasonStatController struct {
	service *TeamSeasonStatService
}

func NewTeamSeasonStatController(service *TeamSeasonStatService) *TeamSeasonStatController {
	return &TeamSeasonStatController{service: service}
}

func (mc *TeamSeasonStatController) GetStatByID(c *fiber.Ctx) error {

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

	teamIDStr := c.Query("teamID")
	teamID, err := strconv.Atoi(teamIDStr)

	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid team ID")
	}

	stat, err := mc.service.GetStatByID(uniqueTournamentID, seasonID, teamID)
	if err != nil {
		log.Printf("❌ Error getting team stat: %v", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to get a team stat")
	}

	

	return c.JSON(stat)
}
