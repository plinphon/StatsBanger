package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/plinphon/StatsBanger/backend/routes"
)

func main() {
	app := fiber.New()

	app.Use(cors.New(cors.Config{
        AllowOrigins: "http://localhost:5173/",  //frontend URL
        AllowMethods: "GET,POST,HEAD,PUT,DELETE,OPTIONS",
        AllowHeaders: "Origin, Content-Type, Accept",
    }))

	routes.SetupRoutes(app)

	err := app.Listen(":3000")
	if err != nil {
		panic(err)
	}
}