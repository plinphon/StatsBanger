package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/plinphon/StatsBanger/backend/routes"
)

func main() {
	app := fiber.New()

	routes.SetupRoutes(app)

	err := app.Listen(":3000")
	if err != nil {
		panic(err)
	}
}