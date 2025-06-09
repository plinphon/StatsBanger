package season

import (
	"strconv"
	"log"
	"strings"
	"github.com/gofiber/fiber/v2"
	"github.com/plinphon/StatsBanger/backend/models"
)

type PlayerSeasonStatController struct {
	service *PlayerSeasonStatService
}

func NewPlayerSeasonStatController(service *PlayerSeasonStatService) *PlayerSeasonStatController {
	return &PlayerSeasonStatController{service: service}
}

/*
func (mc *PlayerSeasonStatController) GetTopPlayersByStat(c *fiber.Ctx) error {

	statName := c.Query("statName")
	if statName == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Missing statName")
	}

	uniqueTournamentIDStr := c.Query("uniqueTournamentID")
	uniqueTournamentID, err := strconv.Atoi(uniqueTournamentIDStr)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid uniqueTournamentID")
	}

	seasonIDStr := c.Query("seasonID")
	seasonID, err := strconv.Atoi(seasonIDStr)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid seasonID")
	}

	limitStr := c.Query("limit", "") //empty string by default means no limit
	var limit int
	if limitStr == "" {
		limit = 0 //no limit
	} else {
		limit, err = strconv.Atoi(limitStr)
		if err != nil || limit < 0 {
			return fiber.NewError(fiber.StatusBadRequest, "Invalid limit")
		}
	}

	positionFilter := c.Query("position", "") //empty string by default means no limit
	if err != nil || limit < 0 {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid limit")
	}
	
	topPlayer, err := mc.service.GetTopPlayersByStat(statName, uniqueTournamentID, seasonID, limit, positionFilter)
	if err != nil {
		log.Printf("❌ Error getting top player by stat: %v", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to get top player by stat")
	}

	return c.JSON(topPlayer)
}*/

func (mc *PlayerSeasonStatController) GetPlayerStatsWithMeta(c *fiber.Ctx) error {
    // Parse playerID
    playerIDStr := c.Query("playerID")
    playerID, err := strconv.Atoi(playerIDStr)
    if err != nil {
        return fiber.NewError(fiber.StatusBadRequest, "Invalid playerID")
    }

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

    // Parse statFields (comma-separated in query)
    statFieldsQuery := c.Query("statFields", "")

    var statFields []string
    if statFieldsQuery == "" {
        // If no statFields provided, fetch all valid fields
        statFields = make([]string, 0, len(models.ValidPlayerSeasonFields))
        for field := range models.ValidPlayerSeasonFields {
            statFields = append(statFields, field)
        }
    } else {
        statFields = strings.Split(statFieldsQuery, ",")
    }

    // Call service
    playerStats, err := mc.service.GetPlayerStatsWithMeta(statFields, uniqueTournamentID, seasonID, playerID)
    if err != nil {
        log.Printf("❌ Error getting player stats: %v", err)
        return fiber.NewError(fiber.StatusInternalServerError, "Failed to get player stats")
    }

    return c.JSON(playerStats)
}
/*
func (mc *PlayerSeasonStatController) GetPlayerStatPercentile(c *fiber.Ctx) error {
	playerIDStr := c.Query("playerId")
	playerID, err := strconv.Atoi(playerIDStr)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid playerId")
	}

	tournamentIDStr := c.Query("tournamentId")
	tournamentID, err := strconv.Atoi(tournamentIDStr)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid tournamentId")
	}

	seasonIDStr := c.Query("seasonId")
	seasonID, err := strconv.Atoi(seasonIDStr)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid seasonId")
	}

	statFieldsQuery := c.Query("statField")
    var statFields []string
    if statFieldsQuery == "" {
        // If no statFields provided, fetch all valid fields
        statFields = make([]string, 0, len(models.ValidPlayerSeasonFields))
        for field := range models.ValidPlayerSeasonFields {
            statFields = append(statFields, field)
        }
    } else {
        statFields = strings.Split(statFieldsQuery, ",")
    }


	//optional position filter
	position := c.Query("position")
	var positionPtr *string
	if position != "" {
		if !models.ValidPositions[position] {
			return fiber.NewError(fiber.StatusBadRequest, "Invalid position")
		}
		positionPtr = &position
	}

	result, err := mc.service.GetPlayerStatWithPercentile(statFields, tournamentID, seasonID, playerID, positionPtr)
	if err != nil {
		log.Printf("❌ Error getting percentile stat: %v", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to get player stat percentile")
	}

	return c.JSON(result)
}*/