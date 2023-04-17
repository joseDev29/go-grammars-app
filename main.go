package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

	"github.com/joseDev29/go-grammars-app/models"
)

func main() {

	app := fiber.New()

	app.Use(cors.New())

	app.Static("/", "./client/dist")

	app.Post("/api/process-grammar", func(c *fiber.Ctx) error {

		var body models.GrammarBody

		c.BodyParser(&body)

		validationError := body.ValidateBody()

		if validationError != nil {
			return c.Status(400).JSON(&fiber.Map{
				"ok":      false,
				"message": validationError.Error(),
			})
		}

		grammar := models.Grammar{RawGrammar: body.RawGrammar}

		grammar.VerifyAndCleanGrammarLeftRecursion()

		grammar.GenerateFirstList()

		grammar.GenerateNextList()

		grammar.GeneratePredictionSet()

		grammar.VerifyIsLL1()

		return c.JSON(&fiber.Map{
			"ok": true,
			"data": map[string]interface{}{
				"rawGrammar":     grammar.RawGrammar,
				"cleanedGrammar": grammar.CleanedGrammar,
				"firstList":      grammar.FirstList,
				"nextList":       grammar.NextList,
				"predictionSet":  grammar.PredictionSet,
				"isLL1":          grammar.IsLL1,
			},
		})
	})

	app.Listen(":3000")

}
