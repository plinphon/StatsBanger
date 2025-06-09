package season

import (
	"strconv"
	"log"
	"github.com/gofiber/fiber/v2"
	"strings"

	"github.com/plinphon/StatsBanger/backend/models"
)

type TeamSeasonStatController struct {
	service *TeamSeasonStatService
}

func NewTeamSeasonStatController(service *TeamSeasonStatService) *TeamSeasonStatController {
	return &TeamSeasonStatController{service: service}
}

func (tc *TeamSeasonStatController) GetTeamStatsWithMeta(c *fiber.Ctx) error {
	// Parse teamIDs (comma-separated)
	teamIDStr := c.Query("teamID")
	var teamIDs []int
	if teamIDStr != "" {
		teamIDStrings := strings.Split(teamIDStr, ",")
		for _, idStr := range teamIDStrings {
			id, err := strconv.Atoi(strings.TrimSpace(idStr))
			if err != nil {
				return fiber.NewError(fiber.StatusBadRequest, "Invalid teamID")
			}
			teamIDs = append(teamIDs, id)
		}
	} // else: if empty, fetch all teams

	// Parse uniqueTournamentID
	uniqueTournamentIDStr := c.Query("uniqueTournamentID")
	uniqueTournamentID, err := strconv.Atoi(uniqueTournamentIDStr)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid uniqueTournamentID")
	}

	// Parse seasonID
	seasonIDStr := c.Query("seasonID")
	seasonID, err := strconv.Atoi(seasonIDStr)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid seasonID")
	}

	// Parse statFields (comma-separated)
	statFieldsQuery := c.Query("statFields", "")
	var statFields []string
	if statFieldsQuery == "" {
		statFields = make([]string, 0, len(models.ValidTeamSeasonFields))
		for field := range models.ValidTeamSeasonFields {
			statFields = append(statFields, field)
		}
	} else {
		statFields = strings.Split(statFieldsQuery, ",")
	}

	// Call service with teamIDs
	teamStats, err := tc.service.GetTeamStatsWithMeta(statFields, uniqueTournamentID, seasonID, teamIDs)
	if err != nil {
		log.Printf("❌ Error getting team stats: %v", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to get team stats")
	}

	return c.JSON(teamStats)
}