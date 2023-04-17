import { useEffect, useState } from "react";
import { Button, Input } from "antd";

import { useGrammarContext } from "../../../../providers/GrammarProvider";

const GrammarTextEditor = ({ state }) => {
  const [inputValue, setInputValue] = state;

  const grammarContext = useGrammarContext();

  const onChangeInput = (e) => setInputValue(e.target.value);

  const onClickSave = () => grammarContext.setGrammar(JSON.parse(inputValue));

  useEffect(() => {
    setInputValue(JSON.stringify(grammarContext.grammar, null, 4));
  }, [grammarContext.grammar]);

  return (
    <div
      style={{
        flexGrow: 1,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          zIndex: 2,
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
          padding: 8,
        }}
      >
        <Button type="primary" ghost onClick={onClickSave}>
          Save
        </Button>
      </div>
      <Input.TextArea
        style={{
          flexGrow: 1,
          border: "1px solid #000",
          borderRadius: 4,
          padding: 16,
          overflow: "auto",
          gap: 8,
          height: "100%",
        }}
        value={inputValue}
        onChange={onChangeInput}
      />
    </div>
  );
};

export default GrammarTextEditor;
