import { Button, Tooltip } from "antd";
import { DeleteOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import { v4 as uuid } from "uuid";

import Production from "./Production";
import NonTerminalPopover from "./NonTerminalPopover";

import { useGrammarContext } from "../../../../../providers/GrammarProvider";

const NonTerminal = ({ nonTerminalKey, nonTerminalIndex, productions }) => {
  const grammarContext = useGrammarContext();

  const handleEditNonTerminalKey = (newNonTerminalKey) => {
    grammarContext.onEditNonTerminalKey(nonTerminalIndex, newNonTerminalKey);
  };

  const handleDeleteNonTerminal = () => {
    grammarContext.onDeleteNonTerminal(nonTerminalIndex);
  };

  const handleAddNonTerminal = (newNonTerminalKey) => {
    grammarContext.onAddNonTerminal(nonTerminalIndex + 1, newNonTerminalKey);
  };

  const handleAddProduction = () => {
    grammarContext.onAddProduction(nonTerminalIndex);
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <NonTerminalPopover
        mode="edit"
        onFinish={handleEditNonTerminalKey}
        nonTerminalKey={nonTerminalKey}
      >
        <Button type="text" size="small">
          {nonTerminalKey}
        </Button>
      </NonTerminalPopover>
      <RightOutlined style={{ margin: "0 16px", color: "var(--primary)" }} />
      {productions.map((production, index) => {
        return (
          <Production
            key={uuid()}
            symbols={production}
            nonTerminalIndex={nonTerminalIndex}
            productionIndex={index}
            showSeparator={index !== productions.length - 1}
          />
        );
      })}
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "flex-end",
          gap: 4,
          marginLeft: 16,
        }}
      >
        <Tooltip title="Add production">
          <Button
            size="small"
            icon={<PlusOutlined />}
            style={{
              fontSize: 10,
              width: 18,
              height: 18,
            }}
            onClick={handleAddProduction}
          />
        </Tooltip>
        <Tooltip title="Delete non terminal">
          <Button
            size="small"
            icon={<DeleteOutlined />}
            style={{
              fontSize: 10,
              width: 18,
              height: 18,
            }}
            danger
            onClick={handleDeleteNonTerminal}
          />
        </Tooltip>

        <NonTerminalPopover onFinish={handleAddNonTerminal} placement="bottom">
          <Tooltip title="Add non terminal">
            <Button
              size="small"
              icon={<PlusOutlined />}
              style={{
                fontSize: 10,
                width: 48,
                height: 18,
              }}
            >
              T
            </Button>
          </Tooltip>
        </NonTerminalPopover>
      </div>
    </div>
  );
};

export default NonTerminal;
