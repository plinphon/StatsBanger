package match

import (
	"strconv"
	"log"
	"github.com/gofiber/fiber/v2"
	"strings"
)

type TeamMatchStatController struct {
	service *TeamMatchStatService
}

func NewTeamMatchStatController(service *TeamMatchStatService) *TeamMatchStatController {
	return &TeamMatchStatController{service: service}
}

func (mc *TeamMatchStatController) GetStatByTeamAndMatchID(c *fiber.Ctx) error {
    matchIDStr := c.Query("matchID")
    matchID, err := strconv.Atoi(matchIDStr)
    if err != nil {
        return fiber.NewError(fiber.StatusBadRequest, "Invalid match ID")
    }

    teamIDStr := c.Query("teamID")
    teamID, err := strconv.Atoi(teamIDStr)
    if err != nil {
        return fiber.NewError(fiber.StatusBadRequest, "Invalid team ID")
    }

    // Get statFields from query parameter, comma-separated
    statFieldsStr := c.Query("statFields") // e.g. "ball_possession,expected_goals"
    var statFields []string
    if statFieldsStr != "" {
        statFields = strings.Split(statFieldsStr, ",")
    }

    stat, err := mc.service.GetStatByID(matchID, teamID, statFields)
    if err != nil {
        log.Printf("❌ Error getting team stat: %v", err)
        return fiber.NewError(fiber.StatusInternalServerError, "Failed to get a team stat")
    }

    return c.JSON(stat)
}

func (mc *TeamMatchStatController) GetAllMatchesByTeamID(c *fiber.Ctx) error {
    teamIDStr := c.Params("teamID")
    teamID, err := strconv.Atoi(teamIDStr)
    if err != nil || teamID <= 0 {
        return fiber.NewError(fiber.StatusBadRequest, "Invalid or missing teamID")
    }

    stats, err := mc.service.GetAllMatchesByTeamID(teamID)
    if err != nil {
        log.Printf("❌ Error getting team match stats by teamID: %v", err)
        return fiber.NewError(fiber.StatusInternalServerError, "Failed to get team match stats")
    }

    return c.JSON(stats)
}