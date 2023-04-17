import { v4 as uuid } from "uuid";

const TerminalPredictionSetView = ({ terminalPredictionSet }) => {
  return (
    <>
      {terminalPredictionSet.list.map((productionPredictionSet) => {
        return (
          <div key={uuid()} style={{ display: "flex", gap: 8 }}>
            <span style={{ color: "var(--primary)" }}>{"CP("}</span>
            <span>{terminalPredictionSet.nonTerminalKey}</span>
            <span>{"->"}</span>
            <span>{productionPredictionSet.productionKey}</span>
            <span style={{ color: "var(--primary)" }}>{")"}</span>
            <span style={{ color: "var(--primary)" }}>=</span>
            <span style={{ color: "var(--primary)" }}>{"{"}</span>
            {productionPredictionSet.list.map((symbol) => {
              return <span key={uuid()}>{symbol}</span>;
            })}
            <span style={{ color: "var(--primary)" }}>{"}"}</span>
          </div>
        );
      })}
      <div></div>
    </>
  );
};

const PredictionSetViewer = ({ data }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {data.map((terminalPredictionSet) => {
        return (
          <TerminalPredictionSetView
            key={uuid()}
            terminalPredictionSet={terminalPredictionSet}
          />
        );
      })}
    </div>
  );
};

export default PredictionSetViewer;
