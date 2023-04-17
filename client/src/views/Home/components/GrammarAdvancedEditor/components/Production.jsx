import { Button, Tooltip } from "antd";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { v4 as uuid } from "uuid";

import Symbol from "./Symbol";
import SymbolPopover from "./SymbolPopover";

import { useGrammarContext } from "../../../../../providers/GrammarProvider";

const Production = ({
  symbols,
  nonTerminalIndex,
  productionIndex,
  showSeparator,
}) => {
  const grammarContext = useGrammarContext();

  const handleDeleteProduction = () => {
    grammarContext.onDeleteProduction(nonTerminalIndex, productionIndex);
  };

  const handleAddSymbol = (symbol) => {
    grammarContext.onAddSymbol(nonTerminalIndex, productionIndex, symbol);
  };

  return (
    <>
      {symbols.map((symbol, index) => {
        return (
          <Symbol
            key={uuid()}
            symbol={symbol}
            nonTerminalIndex={nonTerminalIndex}
            productionIndex={productionIndex}
            symbolIndex={index}
          />
        );
      })}
      <div style={{ display: "flex" }}>
        <SymbolPopover onFormFinish={handleAddSymbol} placement="bottom">
          <Tooltip title="Add symbol">
            <Button
              size="small"
              icon={<PlusOutlined />}
              style={{ fontSize: 6, width: 14, height: 14, margin: "0 4px" }}
            />
          </Tooltip>
        </SymbolPopover>
        <Tooltip title="Delete production">
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            style={{ fontSize: 6, width: 14, height: 14, margin: "0 4px" }}
            onClick={handleDeleteProduction}
          />
        </Tooltip>
      </div>
      {showSeparator && (
        <MinusOutlined
          style={{ transform: "rotate(90deg)", color: "var(--primary)" }}
        />
      )}
    </>
  );
};

export default Production;
