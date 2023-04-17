import { v4 as uuid } from "uuid";

const FirstListOrNextListViewer = ({ data, mode }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {data.map((item) => {
        return (
          <div key={uuid()} style={{ display: "flex", gap: 8 }}>
            <span style={{ color: "var(--primary)" }}>
              {mode === "firstList" ? "First(" : "Next("}
            </span>
            <span>{item.nonTerminalKey}</span>
            <span style={{ color: "var(--primary)" }}>{")"}</span>
            <span style={{ color: "var(--primary)" }}>=</span>
            <span style={{ color: "var(--primary)" }}>{"{"}</span>
            {item.list.map((symbol) => {
              return <span key={uuid()}>{symbol}</span>;
            })}
            <span style={{ color: "var(--primary)" }}>{"}"}</span>
          </div>
        );
      })}
    </div>
  );
};

export default FirstListOrNextListViewer;
