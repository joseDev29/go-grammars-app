package models

import (
	"strings"

	"golang.org/x/exp/slices"
)

type Grammar struct {
	RawGrammar               []NonTerminal
	CleanedGrammar           []NonTerminal
	FirstList                []FirstListItem
	NextList                 []NextListItem
	PredictionSet            []PredictionSetListItem
	IsLL1                    bool `json:"isLL1"`
	ExtendedSeparatedGrammar []SingleNonTerminal
	GraphLR0                 []GraphLR0Node
	IsSLR0                   bool `json:"isSLR0"`
}

func (grammar *Grammar) generateCleanedNonTerminal(nonTerminal NonTerminal) {

	cleanedNonTerminal := NonTerminal{Key: nonTerminal.Key, Productions: [][]string{}}
	cleanedNonTerminalSec := NonTerminal{Key: nonTerminal.Key + "'", Productions: [][]string{}}

	for _, production := range nonTerminal.Productions {

		if production[0] == nonTerminal.Key {
			productionLen := len(production)
			newProduction := slices.Clone(production[1:productionLen])
			newProduction = append(newProduction, cleanedNonTerminalSec.Key)
			cleanedNonTerminalSec.Productions = append(cleanedNonTerminalSec.Productions, newProduction)
			continue
		}

		newProduction := []string{}
		if production[0] != LAMBDA {
			newProduction = append(newProduction, production...)
		}
		newProduction = append(newProduction, cleanedNonTerminalSec.Key)
		cleanedNonTerminal.Productions = append(cleanedNonTerminal.Productions, newProduction)

	}

	cleanedNonTerminalSec.Productions = append(cleanedNonTerminalSec.Productions, []string{LAMBDA})

	grammar.CleanedGrammar = append(grammar.CleanedGrammar, cleanedNonTerminal, cleanedNonTerminalSec)

}

func (grammar *Grammar) VerifyAndCleanGrammarLeftRecursion() {

	grammar.CleanedGrammar = []NonTerminal{}

	for _, nonTerminal := range grammar.RawGrammar {
		if nonTerminal.HasLeftRecursion() {
			grammar.generateCleanedNonTerminal(nonTerminal)
			continue
		}
		grammar.CleanedGrammar = append(grammar.CleanedGrammar, nonTerminal)
	}

}

func (grammar Grammar) isNonTerminalSymbol(symbol string, nonTerminals []NonTerminal) bool {

	result := false

	for _, nonTerminal := range nonTerminals {
		if nonTerminal.Key == symbol {
			result = true
			break
		}
	}

	return result

}

func (grammar Grammar) getNonTerminalByKey(key string, nonTerminals []NonTerminal) NonTerminal {

	var result NonTerminal

	for _, nonTerminal := range nonTerminals {
		if key == nonTerminal.Key {
			result = nonTerminal
		}
	}

	return result

}

func (grammar *Grammar) addSymbolToNonTerminalFirstList(nonTerminal NonTerminal, symbol string) {

	for index, nonTerminalFirstList := range grammar.FirstList {
		if nonTerminalFirstList.Key == nonTerminal.Key && !slices.Contains(nonTerminalFirstList.List, symbol) {
			grammar.FirstList[index].List = append(grammar.FirstList[index].List, symbol)
			break
		}
	}

}

func (grammar *Grammar) generateNonTerminalFirstList(nonTerminal NonTerminal, visited *[]string) []string {

	result := []string{}

	if slices.Contains(*visited, nonTerminal.Key) {
		return result
	} else {
		*visited = append(*visited, nonTerminal.Key)
	}

	for _, production := range nonTerminal.Productions {

		symbol := production[0]

		if !grammar.isNonTerminalSymbol(symbol, grammar.CleanedGrammar) {
			grammar.addSymbolToNonTerminalFirstList(nonTerminal, symbol)
			result = append(result, symbol)
		} else {

			recursionResult := grammar.generateNonTerminalFirstList(grammar.getNonTerminalByKey(symbol, grammar.CleanedGrammar), visited)

			if len(recursionResult) > 0 {
				result = append(result, recursionResult...)
				for _, resultSymbol := range recursionResult {
					grammar.addSymbolToNonTerminalFirstList(nonTerminal, resultSymbol)
				}
			}
		}

	}

	return result

}

func (grammar Grammar) getNonTerminalFirstListByKey(key string) FirstListItem {
	var result FirstListItem

	for _, nonTerminalFirstList := range grammar.FirstList {
		if nonTerminalFirstList.Key == key {
			result = nonTerminalFirstList
		}
	}

	return result

}

func (grammar *Grammar) GenerateFirstList() {

	grammar.FirstList = []FirstListItem{}

	for _, nonTerminal := range grammar.CleanedGrammar {
		grammar.FirstList = append(grammar.FirstList, FirstListItem{Key: nonTerminal.Key, List: []string{}})
	}

	for _, nonTerminal := range grammar.CleanedGrammar {
		grammar.generateNonTerminalFirstList(nonTerminal, &[]string{})
	}

}

func (grammar *Grammar) addSymbolToNonTerminalNextList(nonTerminal NonTerminal, symbol string) {

	if symbol == LAMBDA {
		return
	}

	for index, nonTerminalNextList := range grammar.NextList {
		if nonTerminalNextList.Key == nonTerminal.Key && !slices.Contains(nonTerminalNextList.List, symbol) {
			grammar.NextList[index].List = append(grammar.NextList[index].List, symbol)
			break
		}
	}
}

func (grammar *Grammar) generateNonTerminalNextList(evaluatedNonTerminal NonTerminal, visited *[]string) []string {

	result := []string{}

	if slices.Contains(*visited, evaluatedNonTerminal.Key) {
		return result
	} else {
		*visited = append(*visited, evaluatedNonTerminal.Key)
	}

	for _, nonTerminal := range grammar.CleanedGrammar {

		for _, production := range nonTerminal.Productions {

			if !slices.Contains(production, evaluatedNonTerminal.Key) {
				continue
			}

			for index, symbol := range production {

				if symbol != evaluatedNonTerminal.Key {
					continue
				}

				if index == (len(production) - 1) {
					recursionResult := grammar.generateNonTerminalNextList(nonTerminal, visited)
					if len(recursionResult) == 0 {
						continue
					}
					result = append(result, recursionResult...)
					for _, recursionResultSymbol := range recursionResult {
						grammar.addSymbolToNonTerminalNextList(evaluatedNonTerminal, recursionResultSymbol)
					}
					continue
				}

				if !grammar.isNonTerminalSymbol(production[index+1], grammar.CleanedGrammar) {
					grammar.addSymbolToNonTerminalNextList(evaluatedNonTerminal, production[index+1])
					result = append(result, production[index+1])
					continue
				}

				nonTerminalFirstList := grammar.getNonTerminalFirstListByKey(production[index+1])

				if len(nonTerminalFirstList.List) > 0 {
					result = append(result, nonTerminalFirstList.List...)
					for _, nonTerminalFirstListSymbol := range nonTerminalFirstList.List {
						grammar.addSymbolToNonTerminalNextList(evaluatedNonTerminal, nonTerminalFirstListSymbol)
					}
				}

				if !slices.Contains(nonTerminalFirstList.List, LAMBDA) {
					continue
				}

				recursionResult := grammar.generateNonTerminalNextList(nonTerminal, visited)

				if len(recursionResult) == 0 {
					continue
				}

				result = append(result, recursionResult...)

				for _, recursionResultSymbol := range recursionResult {
					grammar.addSymbolToNonTerminalNextList(evaluatedNonTerminal, recursionResultSymbol)
				}

			}

		}
	}

	if evaluatedNonTerminal.Key == grammar.CleanedGrammar[0].Key {
		grammar.addSymbolToNonTerminalNextList(evaluatedNonTerminal, NEXT_LIST_SYMBOL_FOR_INITIAL_NON_TERMINAL)
		result = append(result, NEXT_LIST_SYMBOL_FOR_INITIAL_NON_TERMINAL)
	}

	return result

}

func (grammar *Grammar) GenerateNextList() {
	grammar.NextList = []NextListItem{}

	for _, nonTerminal := range grammar.CleanedGrammar {
		grammar.NextList = append(grammar.NextList, NextListItem{Key: nonTerminal.Key, List: []string{}})
	}

	for _, nonTerminal := range grammar.CleanedGrammar {
		grammar.generateNonTerminalNextList(nonTerminal, &[]string{})
	}
}

func (grammar Grammar) getNonTerminalNextListByKey(key string) NextListItem {

	var result NextListItem

	for _, nonTerminalNextList := range grammar.NextList {

		if nonTerminalNextList.Key == key {
			result = nonTerminalNextList
		}
	}

	return result

}

func (grammar *Grammar) addSymbolToNonTerminalProductionPredictionSet(nonTerminalKey string, productionPredictionSetKey string, symbol string) {

	if symbol == LAMBDA {
		return
	}
P:
	for nonTerminalIndex, nonTerminalPredictionSet := range grammar.PredictionSet {

		if nonTerminalPredictionSet.Key != nonTerminalKey {
			continue
		}

		for productionIndex, productionPredictionSet := range nonTerminalPredictionSet.List {
			if productionPredictionSet.Key == productionPredictionSetKey && !slices.Contains(productionPredictionSet.List, symbol) {
				grammar.PredictionSet[nonTerminalIndex].List[productionIndex].List = append(grammar.PredictionSet[nonTerminalIndex].List[productionIndex].List, symbol)
				break P
			}
		}
	}

}

func (grammar *Grammar) generateNonTerminalPredictionSet(nonTerminal NonTerminal, nonTerminalIndex int) {

	for _, production := range nonTerminal.Productions {

		productionKey := strings.Join(production, "")

		grammar.PredictionSet[nonTerminalIndex].List = append(grammar.PredictionSet[nonTerminalIndex].List, ProductionPredictionSet{Key: productionKey, List: []string{}})

		if production[0] == LAMBDA {
			nonTerminalNextList := grammar.getNonTerminalNextListByKey(nonTerminal.Key)
			for _, symbol := range nonTerminalNextList.List {
				grammar.addSymbolToNonTerminalProductionPredictionSet(nonTerminal.Key, productionKey, symbol)
			}
			continue
		}

		if !grammar.isNonTerminalSymbol(production[0], grammar.CleanedGrammar) {
			grammar.addSymbolToNonTerminalProductionPredictionSet(nonTerminal.Key, productionKey, production[0])
			continue
		}

		nonTerminalFirstList := grammar.getNonTerminalFirstListByKey(production[0])

		for _, symbol := range nonTerminalFirstList.List {
			grammar.addSymbolToNonTerminalProductionPredictionSet(nonTerminal.Key, productionKey, symbol)
		}

		if !slices.Contains(nonTerminalFirstList.List, LAMBDA) {
			continue
		}

		nonTerminalNextList := grammar.getNonTerminalNextListByKey(nonTerminal.Key)

		for _, symbol := range nonTerminalNextList.List {
			grammar.addSymbolToNonTerminalProductionPredictionSet(nonTerminal.Key, productionKey, symbol)
		}

	}

}

func (grammar *Grammar) GeneratePredictionSet() {
	grammar.PredictionSet = []PredictionSetListItem{}

	for _, nonTerminal := range grammar.CleanedGrammar {
		grammar.PredictionSet = append(grammar.PredictionSet, PredictionSetListItem{Key: nonTerminal.Key, List: []ProductionPredictionSet{}})
	}

	for index, nonTerminal := range grammar.CleanedGrammar {
		grammar.generateNonTerminalPredictionSet(nonTerminal, index)
	}
}

func (grammar *Grammar) VerifyIsLL1() {

P:
	for index, nonTerminalPredictionSet := range grammar.PredictionSet {

		terminalPredictionSetAllSymbols := []string{}

		for _, productionPredictionSet := range nonTerminalPredictionSet.List {

			for _, symbol := range productionPredictionSet.List {

				if slices.Contains(terminalPredictionSetAllSymbols, symbol) {
					break P
				}

				terminalPredictionSetAllSymbols = append(terminalPredictionSetAllSymbols, symbol)
			}

		}

		if index == (len(grammar.PredictionSet) - 1) {
			grammar.IsLL1 = true
		}

	}
}

func (grammar *Grammar) GenerateExtendedSeparatedGrammar() {

	grammar.ExtendedSeparatedGrammar = []SingleNonTerminal{}

	for index, nonTerminal := range grammar.RawGrammar {

		if index == 0 {
			grammar.ExtendedSeparatedGrammar = append(grammar.ExtendedSeparatedGrammar, SingleNonTerminal{Key: EXTENDED_GRAMMAR_FIRST_NON_TERMINAL_KEY, Production: []string{nonTerminal.Key}})
		}

		for _, production := range nonTerminal.Productions {
			singleNonTerminal := SingleNonTerminal{Key: nonTerminal.Key, Production: []string{}}
			singleNonTerminal.Production = append(singleNonTerminal.Production, production...)
			grammar.ExtendedSeparatedGrammar = append(grammar.ExtendedSeparatedGrammar, singleNonTerminal)
		}

	}

}
