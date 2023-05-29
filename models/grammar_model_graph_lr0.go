package models

import (
	"strconv"

	"golang.org/x/exp/slices"
)

func (grammar *Grammar) isGraphLR0NonTerminalKey(symbol GraphLR0NonTerminalSymbol) bool {

	result := false

	for _, nonTerminal := range grammar.ExtendedSeparatedGrammar {
		if symbol.Value == nonTerminal.Key {
			result = true
			break
		}
	}

	return result

}

func (grammar *Grammar) hasNonTerminalWithPoint(nonTerminal GraphLR0NonTerminal) (bool, GraphLR0NonTerminalSymbol) {

	result := false
	var nonTerminalWithPoint GraphLR0NonTerminalSymbol

	for _, symbol := range nonTerminal.Production {

		if !symbol.WithPoint {
			continue
		}

		if grammar.isGraphLR0NonTerminalKey(symbol) {
			result = true
			nonTerminalWithPoint = symbol
			break
		}

	}

	return result, nonTerminalWithPoint
}

func (grammar *Grammar) recursiveGraphLR0NodeState(item GraphLR0NonTerminal, state *[]GraphLR0NonTerminal) {

	var existInState bool

	for _, stateItem := range *state {

		if item.String() == stateItem.String() {
			existInState = true
			break
		}

	}

	if existInState {
		return
	}

	isReduced := true

	for _, symbolItem := range item.Production {
		if symbolItem.WithPoint {
			isReduced = false
			break
		}
	}

	item.IsReduced = isReduced

	*state = append(*state, item)

	hasNonTerminalWithPoint, nonTerminalWithPointSymbol := grammar.hasNonTerminalWithPoint(item)

	if !hasNonTerminalWithPoint {
		return
	}

	for index, singleNonTerminal := range grammar.ExtendedSeparatedGrammar {

		if singleNonTerminal.Key != nonTerminalWithPointSymbol.Value {
			continue
		}

		derived := GraphLR0NonTerminal{Index: index, Key: singleNonTerminal.Key}

		for symbolIndex, symbol := range singleNonTerminal.Production {
			derived.Production = append(derived.Production, GraphLR0NonTerminalSymbol{Value: symbol, WithPoint: symbolIndex == 0})
		}

		grammar.recursiveGraphLR0NodeState(derived, state)

	}

}

func (grammar *Grammar) generateLR0GraphNodeState(initials []GraphLR0NonTerminal) []GraphLR0NonTerminal {
	state := []GraphLR0NonTerminal{}

	for _, item := range initials {
		grammar.recursiveGraphLR0NodeState(item, &state)
	}

	return state
}

func (grammar *Grammar) recursiveLR0GraphEdge(symbol string, node GraphLR0Node) GraphLR0Edge {

	edge := GraphLR0Edge{Symbol: symbol, Source: node.Key}

	newNodeInitials := []GraphLR0NonTerminal{}

	for _, stateItem := range node.State {
	S:
		for stateItemSymbolIndex, stateItemSymbol := range stateItem.Production {

			if !stateItemSymbol.WithPoint || stateItemSymbol.Value != symbol {
				continue
			}

			initialsItem := GraphLR0NonTerminal{Index: stateItem.Index, Key: stateItem.Key}

			itemProduction := []GraphLR0NonTerminalSymbol{}

			for subIndex, subItemSymbol := range stateItem.Production {
				itemProduction = append(itemProduction, GraphLR0NonTerminalSymbol{Value: subItemSymbol.Value, WithPoint: subIndex == stateItemSymbolIndex+1})
			}

			initialsItem.Production = itemProduction

			newNodeInitials = append(newNodeInitials, initialsItem)

			break S

		}
	}

	newNode := GraphLR0Node{}

	newNode.State = grammar.generateLR0GraphNodeState(newNodeInitials)

	newNodeStateString := newNode.StateString()

	existedNodeIndex := -1

	for graphLR0Index, graphLR0Item := range grammar.GraphLR0 {
		if graphLR0Item.StateString() == newNodeStateString {
			existedNodeIndex = graphLR0Index
		}
	}

	if existedNodeIndex >= 0 {
		edge.To = grammar.GraphLR0[existedNodeIndex].Key
		return edge
	}

	newSavedNode := grammar.recursiveLR0GraphNode(newNodeInitials)

	edge.To = newSavedNode.Key

	return edge

}

func (grammar *Grammar) generateGraphLR0NodeEdges(node GraphLR0Node) []GraphLR0Edge {
	edges := []GraphLR0Edge{}

	processedSymbols := []string{}
P:
	for _, stateItem := range node.State {

		symbolWithPoint := ""

	S:
		for _, stateItemSymbol := range stateItem.Production {
			if stateItemSymbol.WithPoint {
				symbolWithPoint = stateItemSymbol.Value
				break S
			}
		}

		if symbolWithPoint == "" {
			continue P
		}

		if slices.Contains(processedSymbols, symbolWithPoint) {
			continue P
		}

		processedSymbols = append(processedSymbols, symbolWithPoint)

		edge := grammar.recursiveLR0GraphEdge(symbolWithPoint, node)

		edges = append(edges, edge)

	}

	return edges
}

func (grammar *Grammar) recursiveLR0GraphNode(initials []GraphLR0NonTerminal) GraphLR0Node {

	nodeIndex := len(grammar.GraphLR0)

	node := GraphLR0Node{Key: "I-" + strconv.Itoa(nodeIndex)}

	node.State = grammar.generateLR0GraphNodeState(initials)

	for _, stateItem := range node.State {
		if stateItem.IsReduced {
			node.HasReduction = true
			node.ReducedIndex = stateItem.Index
			break
		}
	}

	grammar.GraphLR0 = append(grammar.GraphLR0, node)

	edges := grammar.generateGraphLR0NodeEdges(node)

	grammar.GraphLR0[nodeIndex].Edges = edges

	return node

}

func (grammar *Grammar) GenerateGraphLR0() {

	grammar.GraphLR0 = []GraphLR0Node{}

	extendedGrammarFirst := grammar.ExtendedSeparatedGrammar[0]

	initial := GraphLR0NonTerminal{Key: extendedGrammarFirst.Key, Index: 0}

	for index, symbol := range extendedGrammarFirst.Production {
		initial.Production = append(initial.Production, GraphLR0NonTerminalSymbol{Value: symbol, WithPoint: index == 0})
	}

	grammar.recursiveLR0GraphNode([]GraphLR0NonTerminal{initial})

}

func (grammar *Grammar) VerifyIsSLR0() {

	isSLRO := true

	for _, graphLR0Item := range grammar.GraphLR0 {
		if graphLR0Item.HasReduction && len(graphLR0Item.State) > 0 {
			isSLRO = false
			break
		}
	}

	grammar.IsSLR0 = isSLRO

}
