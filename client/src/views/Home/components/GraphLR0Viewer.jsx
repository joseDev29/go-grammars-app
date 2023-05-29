import { ArrowRightOutlined, RightOutlined } from "@ant-design/icons";
import { v4 as uuid } from "uuid";

const GraphLR0Viewer = ({ data }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {data.map((node) => {
        return (
          <div key={uuid()} style={{ display: "flex", gap: 16 }}>
            <div
              style={{
                border: "1px solid #000000",
                borderRadius: 4,
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  borderBottom: "1px solid #000000",
                }}
              >
                <span>{node.key}</span>
              </div>
              {node.hasReduction && (
                <div
                  style={{
                    textAlign: "center",
                    borderBottom: "1px solid #000000",
                  }}
                >
                  <span style={{ color: "var(--primary)" }}>
                    R-{node.reducedIndex}
                  </span>
                </div>
              )}
              <div style={{ padding: 8 }}>
                {node.state.map((singleNonTerminal) => {
                  return (
                    <div
                      key={uuid()}
                      style={{
                        backgroundColor: singleNonTerminal.isReduced
                          ? "var(--primary-opacity)"
                          : "inherit",
                        borderRadius: 4,
                        padding: "2px 4px",
                      }}
                    >
                      <span style={{ color: "var(--primary)", marginRight: 8 }}>
                        {singleNonTerminal.index}.
                      </span>
                      <span>{singleNonTerminal.key}</span>
                      <RightOutlined
                        style={{ margin: "0 16px", color: "var(--primary)" }}
                      />
                      {singleNonTerminal.production.map(
                        (symbol, productionIndex, production) => {
                          return (
                            <span key={uuid()} style={{ marginRight: 4 }}>
                              {symbol.withPoint ? "." : ""}
                              {symbol.value}
                              {singleNonTerminal.isReduced &&
                                productionIndex === production.length - 1 &&
                                "."}
                            </span>
                          );
                        }
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {node.edges.map((edge) => {
                return (
                  <div
                    key={uuid()}
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <span>{edge.symbol}</span>
                    <ArrowRightOutlined style={{ color: "var(--primary)" }} />
                    <span
                      style={{
                        border: "1px solid #000000",
                        padding: "2px 16px",
                        borderRadius: 4,
                      }}
                    >
                      {edge.to}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GraphLR0Viewer;
