import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import type { MenuProps } from "antd";

import SymbolChart from "./SymbolChart";
import MainPage from "./MainPage";
import ArbitragePage from "./ArbitragePage";
import "./App.less";
import "antd/dist/antd.less";

const { Header, Footer, Sider, Content } = Layout;

function App() {
  return (
    <div className="App">
      <Router>
        <Layout>
          <Header>
            <Menu mode="horizontal" theme="dark">
              <Menu.Item key="summary">
                <Link to="/">
                  <span className="nav-text">Summary board</span>
                </Link>
              </Menu.Item>

              <Menu.Item key="analytics-boar">
                <Link to="/chart">
                  <span className="nav-text">Analytics board</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="arbitrage">
                <Link to="/arbitrage">
                  <span className="nav-text">Arbitrage</span>
                </Link>
              </Menu.Item>
            </Menu>
          </Header>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/arbitrage" element={<ArbitragePage />} />
            <Route path="/chart/" element={<SymbolChart />} />
            <Route path="/chart/:symbol" element={<SymbolChart />} />
            <Route path="/chart/:symbol/:tf" element={<SymbolChart />} />
          </Routes>
          <Footer></Footer>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
