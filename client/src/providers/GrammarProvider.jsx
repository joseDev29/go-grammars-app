import { createContext, useContext, useState } from "react";
import produce from "immer";

const GrammarContext = createContext();

export const useGrammarContext = () => useContext(GrammarContext);

const GrammarProvider = ({ children }) => {
  const [grammar, setGrammar] = useState([]);

  const onAddNonTerminal = (index, nonTerminalKey) => {
    setGrammar(
      produce((draft) => {
        draft.splice(index, 0, {
          key: nonTerminalKey,
          productions: [],
        });
      })
    );
  };

  const onEditNonTerminalKey = (index, nonTerminalKey) => {
    setGrammar(
      produce((draft) => {
        draft[index].key = nonTerminalKey;
      })
    );
  };

  const onDeleteNonTerminal = (index) => {
    setGrammar(
      produce((draft) => {
        draft.splice(index, 1);
      })
    );
  };

  const onAddProduction = (nonTerminalIndex) => {
    setGrammar(
      produce((draft) => {
        draft[nonTerminalIndex].productions.push([]);
      })
    );
  };

  const onDeleteProduction = (nonTerminalIndex, productionIndex) => {
    setGrammar(
      produce((draft) => {
        draft[nonTerminalIndex].productions.splice(productionIndex, 1);
      })
    );
  };

  const onAddSymbol = (nonTerminalIndex, productionIndex, symbol) => {
    setGrammar(
      produce((draft) => {
        draft[nonTerminalIndex].productions[productionIndex].push(symbol);
      })
    );
  };

  const onEditSymbol = (
    nonTerminalIndex,
    productionIndex,
    symbolIndex,
    symbol
  ) => {
    setGrammar(
      produce((draft) => {
        draft[nonTerminalIndex].productions[productionIndex][symbolIndex] =
          symbol;
      })
    );
  };

  const onDeleteSymbol = (nonTerminalIndex, productionIndex, symbolIndex) => {
    setGrammar(
      produce((draft) => {
        draft[nonTerminalIndex].productions[productionIndex].splice(
          symbolIndex,
          1
        );
      })
    );
  };

  const value = {
    grammar,
    setGrammar,
    onAddNonTerminal,
    onEditNonTerminalKey,
    onDeleteNonTerminal,
    onAddProduction,
    onDeleteProduction,
    onAddSymbol,
    onEditSymbol,
    onDeleteSymbol,
  };

  return (
    <GrammarContext.Provider value={value}>{children}</GrammarContext.Provider>
  );
};

export default GrammarProvider;
