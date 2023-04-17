import { MinusOutlined, RightOutlined } from "@ant-design/icons";
import { v4 as uuid } from "uuid";

const ProductionView = ({ production, showSeparator }) => {
  return (
    <>
      {production.map((symbol) => {
        return <span key={uuid()}>{symbol}</span>;
      })}
      {showSeparator && (
        <MinusOutlined
          style={{
            transform: "rotate(90deg)",
            color: "var(--primary)",
            margin: "0 8px",
          }}
        />
      )}
    </>
  );
};

const GrammarViewer = ({ grammar }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {grammar.map((nonTerminal) => {
        return (
          <div key={uuid()} style={{ display: "flex", gap: 8 }}>
            <span>{nonTerminal.key}</span>
            <RightOutlined
              style={{ margin: "0 16px", color: "var(--primary)" }}
            />
            {nonTerminal.productions.map((production, index) => {
              return (
                <ProductionView
                  key={uuid()}
                  production={production}
                  showSeparator={index !== nonTerminal.productions.length - 1}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default GrammarViewer;
