import "antd/dist/reset.css";
import "./styles/global.css";

import UIProvider from "./providers/UIProvider";
import GrammarProvider from "./providers/GrammarProvider";
import Home from "./views/Home/Home";

const App = () => {
  return (
    <UIProvider>
      <GrammarProvider>
        <Home />
      </GrammarProvider>
    </UIProvider>
  );
};

export default App;
