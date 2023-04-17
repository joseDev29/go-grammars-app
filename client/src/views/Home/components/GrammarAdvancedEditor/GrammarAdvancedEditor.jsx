import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { v4 as uuid } from "uuid";

import NonTerminalPopover from "./components/NonTerminalPopover";
import NonTerminal from "./components/NonTerminal";

import { useGrammarContext } from "../../../../providers/GrammarProvider";
import { isArrayEmpty } from "../../../../utils/functions/arrayUtils";

const GrammarAdvancedEditor = () => {
  const grammarContext = useGrammarContext();

  const onAddNonTerminal = (nonTerminalKey) => {
    grammarContext.onAddNonTerminal(0, nonTerminalKey);
  };

  return (
    <div
      style={{
        flexGrow: 1,
        border: "1px solid #000",
        borderRadius: 4,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        gap: 8,
      }}
    >
      {!isArrayEmpty(grammarContext.grammar) ? (
        grammarContext.grammar.map((nonTerminal, index) => {
          return (
            <NonTerminal
              key={uuid()}
              nonTerminalKey={nonTerminal.key}
              nonTerminalIndex={index}
              productions={nonTerminal.productions}
            />
          );
        })
      ) : (
        <NonTerminalPopover onFinish={onAddNonTerminal}>
          <Button icon={<PlusOutlined />}>Add non terminal</Button>
        </NonTerminalPopover>
      )}
    </div>
  );
};

export default GrammarAdvancedEditor;
