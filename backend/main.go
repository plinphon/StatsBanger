package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/plinphon/StatsBanger/backend/routes"
)

func main() {
	// Create a new Fiber app
	app := fiber.New()

	// Register all routes
	routes.SetupRoutes(app)

	// Start the server on port 3000
	err := app.Listen(":3000")
	if err != nil {
		panic(err)
	}
}