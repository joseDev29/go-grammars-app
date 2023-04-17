import { Button } from "antd";

import SymbolPopover from "./SymbolPopover";

import { useGrammarContext } from "../../../../../providers/GrammarProvider";

const Symbol = ({ symbol, nonTerminalIndex, productionIndex, symbolIndex }) => {
  const grammarContext = useGrammarContext();

  const onClickDelete = () => {
    grammarContext.onDeleteSymbol(
      nonTerminalIndex,
      productionIndex,
      symbolIndex
    );
  };

  const onEdit = (newSymbol) => {
    grammarContext.onEditSymbol(
      nonTerminalIndex,
      productionIndex,
      symbolIndex,
      newSymbol
    );
  };

  return (
    <SymbolPopover
      onFormFinish={onEdit}
      onDelete={onClickDelete}
      symbol={symbol}
      mode="edit"
    >
      <Button type="text" size="small">
        {symbol}
      </Button>
    </SymbolPopover>
  );
};

export default Symbol;
