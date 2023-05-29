package models

type NonTerminal struct {
	Key         string     `json:"key"`
	Productions [][]string `json:"productions"`
}

func (nonTerminal NonTerminal) HasLeftRecursion() bool {

	result := false

	for _, production := range nonTerminal.Productions {
		if production[0] == nonTerminal.Key {
			result = true
			break
		}
	}

	return result

}

type SingleNonTerminal struct {
	Key        string   `json:"key"`
	Production []string `json:"production"`
}
