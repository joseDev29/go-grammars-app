package models

import "fmt"

type FirstListItem struct {
	Key  string   `json:"nonTerminalKey"`
	List []string `json:"list"`
}

type NextListItem struct {
	Key  string   `json:"nonTerminalKey"`
	List []string `json:"list"`
}

type ProductionPredictionSet struct {
	Key  string   `json:"productionKey"`
	List []string `json:"list"`
}

type PredictionSetListItem struct {
	Key  string                    `json:"nonTerminalKey"`
	List []ProductionPredictionSet `json:"list"`
}

type GraphLR0NonTerminalSymbol struct {
	Value     string `json:"value"`
	WithPoint bool   `json:"withPoint"`
}

func (item GraphLR0NonTerminalSymbol) String() string {
	return fmt.Sprintf("{ Value: %s, WithPoint: %t }", item.Value, item.WithPoint)
}

type GraphLR0NonTerminal struct {
	Index      int                         `json:"index"`
	Key        string                      `json:"key"`
	Production []GraphLR0NonTerminalSymbol `json:"production"`
	IsReduced  bool                        `json:"isReduced"`
}

func (item GraphLR0NonTerminal) String() string {

	productionsString := "[ "

	for _, symbol := range item.Production {
		productionsString = productionsString + symbol.String()
	}

	productionsString = productionsString + " ]"

	return fmt.Sprintf("{ Index: %d, Key: %s, Production: %s }", item.Index, item.Key, productionsString)
}

type GraphLR0Edge struct {
	Symbol string `json:"symbol"`
	Source string `json:"source"`
	To     string `json:"to"`
}

func (item GraphLR0Edge) String() string {
	return fmt.Sprintf("{ Symbol: %s, Source: %s, To: %s }", item.Symbol, item.Source, item.To)
}

type GraphLR0Node struct {
	Key          string                `json:"key"`
	State        []GraphLR0NonTerminal `json:"state"`
	Edges        []GraphLR0Edge        `json:"edges"`
	HasReduction bool                  `json:"hasReduction"`
	ReducedIndex int                   `json:"reducedIndex"`
}

func (item GraphLR0Node) StateString() string {

	stateString := "[ "

	for _, nonTerminal := range item.State {
		stateString += " " + nonTerminal.String()
	}

	stateString += " ]"

	return stateString
}

func (item GraphLR0Node) String() string {

	stateString := "[ "

	for _, nonTerminal := range item.State {
		stateString += " " + nonTerminal.String()
	}

	stateString += " ]"

	edgesString := "[ "

	for _, edge := range item.Edges {
		edgesString += " " + edge.String()
	}

	edgesString += " ]"

	return fmt.Sprintf("{ Key: %s, State: %s, Edges: %s }", item.Key, stateString, edgesString)
}
