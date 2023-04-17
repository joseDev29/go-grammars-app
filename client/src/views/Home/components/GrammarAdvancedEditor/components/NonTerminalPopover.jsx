import { useEffect, useState } from "react";
import { Button, Input, Popover, Tooltip } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";

const NonTerminalPopover = ({
  children,
  mode,
  onFinish,
  nonTerminalKey,
  ...props
}) => {
  const [inputValue, setInputValue] = useState("");

  const onChangeInput = (e) => setInputValue(e.target.value);

  const handleFinish = () => {
    if (!inputValue) return;
    onFinish(inputValue);
  };

  const isEditMode = mode === "edit";

  useEffect(() => {
    if (nonTerminalKey && isEditMode) {
      setInputValue(nonTerminalKey);
    }
  }, [nonTerminalKey, isEditMode]);

  return (
    <Popover
      trigger="click"
      content={
        <div style={{ display: "flex", gap: 8 }}>
          <Input
            size="small"
            style={{ maxWidth: 80 }}
            value={inputValue}
            onChange={onChangeInput}
            onPressEnter={handleFinish}
          />
          <Tooltip
            title={isEditMode ? "Edit non terminal" : "Add non terminal"}
          >
            <Button
              type="primary"
              size="small"
              ghost
              icon={isEditMode ? <EditOutlined /> : <PlusOutlined />}
              onClick={handleFinish}
            />
          </Tooltip>
        </div>
      }
      {...props}
    >
      {children}
    </Popover>
  );
};

export default NonTerminalPopover;
