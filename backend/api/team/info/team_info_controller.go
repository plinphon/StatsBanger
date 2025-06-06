package info

import (
	"strconv"
	"log"
	"github.com/gofiber/fiber/v2"
)

type TeamController struct {
	service *TeamService
}

func NewTeamController(service *TeamService) *TeamController {
	return &TeamController{service: service}
}

func (tc *TeamController) GetTeamByID(c *fiber.Ctx) error {
	teamIDStr := c.Params("teamID")
	teamID, err := strconv.Atoi(teamIDStr)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid team ID")
	}

	team, err := tc.service.GetTeamByID(teamID)
	if err != nil {
		log.Printf("❌ Error getting team: %v", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to get the team")
	}

	return c.JSON(team)
}

func (tc *TeamController) SearchTeamsByName(c *fiber.Ctx) error {
	teamName := c.Query("name")

	teams, err := tc.service.SearchTeamsByName(teamName)
	if err != nil {
		log.Printf("❌ Error searching teams: %v", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to get teams")
	}

	return c.JSON(teams)
}
