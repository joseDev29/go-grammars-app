import { useState } from "react";
import { Button, Modal, Radio, Spin } from "antd";
import { SendOutlined } from "@ant-design/icons";
import axios from "axios";

import GrammarAdvancedEditor from "./components/GrammarAdvancedEditor/GrammarAdvancedEditor";
import GrammarTextEditor from "./components/GrammarTextEditor/GrammarTextEditor";
import GrammarViewer from "./components/GrammarViewer";
import FirstListOrNextListViewer from "./components/FirstListOrNextListViewer";
import PredictionSetViewer from "./components/PredictionSetViewer";

import { useGrammarContext } from "../../providers/GrammarProvider";
import { useVisible } from "../../utils/hooks/useVisible";

import "./Home.css";
import GraphLR0Viewer from "./components/GraphLR0Viewer";

const Home = () => {
  const grammarContext = useGrammarContext();

  const [editorMode, setEditorMode] = useState("advanced");

  const [isLoading, setIsLoading] = useState(false);

  const [processResponse, setProcessResponse] = useState(null);

  const jsonEditorState = useState("");

  const modalVisible = useVisible(false);

  const onChangeEditorMode = (e) => setEditorMode(e.target.value);

  const onClickProcess = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:3431/api/process-grammar",
        { rawGrammar: grammarContext.grammar }
      );
      setProcessResponse(response.data.data);
      modalVisible.openDialog();
    } catch (error) {}

    setIsLoading(false);
  };

  return (
    <Spin spinning={isLoading}>
      <div className="home">
        <h1 className="home__title text-center">Grammars App</h1>

        <div className="home__container">
          <div className="home__editor-container">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <h2 className="home__subtitle">Introduce your grammar</h2>
              <div style={{ display: "flex", gap: 16 }}>
                <Radio.Group
                  options={[
                    { label: "Advanced", value: "advanced" },
                    { label: "JSON", value: "json" },
                  ]}
                  value={editorMode}
                  onChange={onChangeEditorMode}
                  optionType="button"
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={onClickProcess}
                >
                  Process
                </Button>
              </div>
            </div>
            {editorMode === "advanced" ? (
              <GrammarAdvancedEditor />
            ) : (
              <GrammarTextEditor state={jsonEditorState} />
            )}
          </div>
        </div>
      </div>
      <Modal
        open={modalVisible.visible}
        width="100%"
        onCancel={modalVisible.closeDialog}
        footer={null}
        title="Results"
      >
        {processResponse && (
          <div className="home__results-container">
            <div className="home__results-container-item">
              <h2>Raw grammar</h2>
              <GrammarViewer grammar={processResponse.rawGrammar} />
            </div>
            <div className="home__results-container-item">
              <h2>Cleaned grammar</h2>
              <GrammarViewer grammar={processResponse.cleanedGrammar} />
            </div>
            <div className="home__results-container-item">
              <h2>First list</h2>
              <FirstListOrNextListViewer
                data={processResponse.firstList}
                mode="firstList"
              />
            </div>
            <div className="home__results-container-item">
              <h2>Next list</h2>
              <FirstListOrNextListViewer data={processResponse.nextList} />
            </div>
            <div className="home__results-container-item">
              <h2>Production set</h2>
              <PredictionSetViewer data={processResponse.predictionSet} />
            </div>
            <div className="home__results-container-item">
              <h2>Is a LL1 Grammar?</h2>
              <span style={{ color: "var(--primary)" }}>
                {processResponse.isLL1 ? "Yes" : "No"}
              </span>
            </div>
            {processResponse.isLL1 && (
              <div className="home__results-container-item home__graph">
                <h2>Graph {processResponse.isSLR0 ? "SLR0" : "LR0"}</h2>
                <GraphLR0Viewer data={processResponse.graphLR0} />
              </div>
            )}
          </div>
        )}
      </Modal>
    </Spin>
  );
};

export default Home;
