package models

import "errors"

type GrammarBody struct {
	RawGrammar []NonTerminal `json:"rawGrammar"`
}

func (grammarBody GrammarBody) ValidateBody() error {

	errorMessage := ""

P:
	for _, nonTerminal := range grammarBody.RawGrammar {

		if len(nonTerminal.Productions) == 0 {
			errorMessage = "There cannot be a nonTerminal without productions"
			break
		}

		for _, production := range nonTerminal.Productions {

			if len(production) == 0 {
				errorMessage = "There cannot be a empty production"
				break P
			}

		}

	}

	if errorMessage == "" {
		return nil
	}

	return errors.New("Invalid Grammar: " + errorMessage)

}
