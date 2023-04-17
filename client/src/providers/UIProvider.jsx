import { ConfigProvider } from "antd";

const UIProvider = ({ children }) => {
  return <ConfigProvider>{children}</ConfigProvider>;
};

export default UIProvider;
