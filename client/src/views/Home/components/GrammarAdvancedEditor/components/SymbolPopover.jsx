import { useEffect, useState } from "react";
import { Button, Input, Popover, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

const SymbolPopover = ({
  children,
  mode,
  onFormFinish,
  onDelete,
  symbol,
  ...props
}) => {
  const [inputValue, setInputValue] = useState("");

  const isEditMode = mode === "edit";

  const onChangeInput = (e) => setInputValue(e.target.value);

  const handleFormFinish = () => {
    if (!inputValue) return;
    onFormFinish(inputValue);
  };

  useEffect(() => {
    if (symbol && isEditMode) {
      setInputValue(symbol);
    }
  }, [symbol, isEditMode]);

  return (
    <Popover
      trigger="click"
      content={
        <div>
          <div style={{ display: "flex", gap: 8 }}>
            <Input
              size="small"
              style={{ maxWidth: 80 }}
              value={inputValue}
              onChange={onChangeInput}
              onPressEnter={handleFormFinish}
            />
            <Tooltip title={isEditMode ? "Edit symbol" : "Add symbol"}>
              <Button
                type="primary"
                ghost
                size="small"
                icon={isEditMode ? <EditOutlined /> : <PlusOutlined />}
                onClick={handleFormFinish}
              />
            </Tooltip>
            {isEditMode && (
              <Tooltip title="Delete symbol">
                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={onDelete}
                />
              </Tooltip>
            )}
          </div>
        </div>
      }
      {...props}
    >
      {children}
    </Popover>
  );
};

export default SymbolPopover;
